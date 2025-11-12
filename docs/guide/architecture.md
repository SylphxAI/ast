# ANTLR Architecture

This guide provides a deep dive into the architecture of the AST toolkit, focusing on how ANTLR v4 powers the parsing process.

## Overview

The AST toolkit uses ANTLR (ANother Tool for Language Recognition) as its foundation. ANTLR is a powerful parser generator that reads grammar files and generates parsers capable of building and walking parse trees.

## Design Principles

### 1. Separation of Concerns

```
┌─────────────────────────────────────────┐
│  Language Parsers                       │
│  (@sylphlab/ast-javascript, etc.)       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Core Types                             │
│  (@sylphlab/ast-core)                   │
└─────────────────────────────────────────┘
```

- **Core types** define generic AST node interfaces
- **Language parsers** implement specific parsing logic
- Each language parser is independent and self-contained

### 2. Extensibility

Adding a new language parser requires:
1. Creating a new package (e.g., `@sylphlab/ast-python`)
2. Adding ANTLR grammar files
3. Implementing a custom visitor
4. Mapping to `@sylphlab/ast-core` types

No changes to existing packages required!

### 3. Type Safety

- **Strict TypeScript** throughout the codebase
- **Full type inference** from grammar to AST
- **Compile-time safety** prevents runtime errors

## ANTLR Parsing Pipeline

### Step 1: Grammar Definition

ANTLR uses grammar files (`.g4`) to define language syntax:

```antlr
// JavaScript.g4 (simplified)
grammar JavaScript;

program
    : statement+ EOF
    ;

statement
    : variableDeclaration
    | expressionStatement
    ;

variableDeclaration
    : ('const' | 'let' | 'var') identifier '=' expression ';'
    ;

identifier
    : ID
    ;

// ... more rules
```

**Key Concepts:**
- **Rules** - Define syntax patterns (e.g., `variableDeclaration`)
- **Terminals** - Literal tokens (e.g., `'const'`, `';'`)
- **Non-terminals** - References to other rules (e.g., `identifier`)

### Step 2: Parser Generation

ANTLR reads the grammar and generates:
- **Lexer** - Tokenizes input into tokens
- **Parser** - Builds parse tree from tokens
- **Visitor** - Base class for transforming parse tree

```bash
antlr4ts -visitor -listener -o src/generated grammar/*.g4
```

This generates TypeScript files:
- `JavaScriptLexer.ts` - Tokenizer
- `JavaScriptParser.ts` - Parser
- `JavaScriptVisitor.ts` - Visitor base class
- `JavaScriptListener.ts` - Listener base class

### Step 3: Tokenization (Lexer)

The lexer converts source code into tokens:

```typescript
// Input
const greeting = "Hello";

// Tokens
CONST, IDENTIFIER("greeting"), EQUALS, STRING("Hello"), SEMICOLON
```

**Lexer responsibilities:**
- Character-by-character scanning
- Token recognition
- Whitespace handling
- Error reporting

### Step 4: Parsing

The parser consumes tokens and builds a parse tree:

```
         program
            |
       statement
            |
  variableDeclaration
   /      |      \
CONST identifier expression
        |         |
    "greeting"  "Hello"
```

**Parser responsibilities:**
- Syntax validation
- Parse tree construction
- Error recovery
- Context management

### Step 5: Parse Tree vs AST

**Parse Tree** (ANTLR output):
- Contains all syntactic details
- Includes tokens like `;`, `{`, `}`
- Closely mirrors grammar structure
- Large and verbose

**AST** (Our output):
- Abstracts away syntactic details
- Contains only semantic information
- Easier to work with
- More compact

Example comparison:

::: code-group
```typescript [Parse Tree]
// Parse tree for: const x = 42;
{
  type: 'VariableDeclarationContext',
  children: [
    { type: 'TerminalNode', text: 'const' },
    { type: 'IdentifierContext', text: 'x' },
    { type: 'TerminalNode', text: '=' },
    { type: 'ExpressionContext', value: 42 },
    { type: 'TerminalNode', text: ';' }
  ]
}
```

```typescript [AST]
// AST for: const x = 42;
{
  type: 'VariableDeclaration',
  declarations: [{
    type: 'VariableDeclarator',
    id: { type: 'Identifier', name: 'x' },
    init: { type: 'Literal', value: 42 }
  }],
  kind: 'const'
}
```
:::

### Step 6: Custom Visitor

The visitor pattern transforms parse tree to AST:

```typescript
class AstBuilderVisitor extends JavaScriptVisitorBase {
  visitVariableDeclaration(ctx: VariableDeclarationContext): AstNode {
    const kind = ctx.CONST() ? 'const' :
                 ctx.LET() ? 'let' : 'var';

    return {
      type: 'VariableDeclaration',
      declarations: ctx.variableDeclarator().map(d =>
        this.visitVariableDeclarator(d)
      ),
      kind,
      loc: this.getLocation(ctx)
    };
  }

  visitVariableDeclarator(ctx: VariableDeclaratorContext): AstNode {
    return {
      type: 'VariableDeclarator',
      id: this.visit(ctx.identifier()),
      init: ctx.expression() ? this.visit(ctx.expression()) : null,
      loc: this.getLocation(ctx)
    };
  }
}
```

**Visitor responsibilities:**
- Transform parse tree nodes to AST nodes
- Extract semantic information
- Track source locations
- Handle edge cases

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Source Code                         │
│                  const x = "Hello";                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  ANTLR Lexer                            │
│         (JavaScriptLexer.ts - Generated)                │
│                                                          │
│  Input:  Source code string                            │
│  Output: Token stream                                   │
│          [CONST, ID, EQUALS, STRING, SEMICOLON]        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  ANTLR Parser                           │
│        (JavaScriptParser.ts - Generated)                │
│                                                          │
│  Input:  Token stream                                  │
│  Output: Parse tree (Context objects)                  │
│          VariableDeclarationContext                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               Custom Visitor                            │
│        (AstBuilderVisitor.ts - Custom)                  │
│                                                          │
│  Input:  Parse tree                                    │
│  Output: AST (@sylphlab/ast-core types)                │
│          { type: 'VariableDeclaration', ... }          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Final AST                             │
│            (@sylphlab/ast-core types)                   │
└─────────────────────────────────────────────────────────┘
```

## Key Components

### @sylphlab/ast-core

**Purpose:** Generic AST node definitions

**Contents:**
```typescript
// Core AST node interface
export interface AstNode {
  type: string;
  loc?: SourceLocation;
}

// Position tracking
export interface SourceLocation {
  start: Position;
  end: Position;
  source?: string;
}

export interface Position {
  line: number;
  column: number;
  offset?: number;
}

// Specific node types
export interface Program extends AstNode {
  type: 'Program';
  body: Statement[];
}

export interface VariableDeclaration extends AstNode {
  type: 'VariableDeclaration';
  declarations: VariableDeclarator[];
  kind: 'const' | 'let' | 'var';
}

// ... more node types
```

### @sylphlab/ast-javascript

**Purpose:** JavaScript-specific parser

**Contents:**
- `grammar/` - ANTLR `.g4` grammar files
- `src/generated/` - ANTLR-generated files (lexer, parser, visitor)
- `src/AstBuilderVisitor.ts` - Custom visitor implementation
- `src/index.ts` - Public API (`parse` function)

### Grammar Files

Location: `packages/javascript/grammar/`

The JavaScript grammar is based on the official ECMAScript specification:
- **JavaScriptLexer.g4** - Token definitions
- **JavaScriptParser.g4** - Syntax rules

### Visitor Implementation

Location: `packages/javascript/src/AstBuilderVisitor.ts`

The custom visitor extends `JavaScriptVisitorBase` and implements methods for each grammar rule:

```typescript
export class AstBuilderVisitor extends JavaScriptVisitorBase {
  // Entry point
  visitProgram(ctx: ProgramContext): Program {
    return {
      type: 'Program',
      body: ctx.statement().map(stmt => this.visit(stmt)),
      loc: this.getLocation(ctx)
    };
  }

  // Statement visitors
  visitVariableDeclaration(ctx: VariableDeclarationContext): VariableDeclaration { /* ... */ }
  visitExpressionStatement(ctx: ExpressionStatementContext): ExpressionStatement { /* ... */ }

  // Expression visitors
  visitBinaryExpression(ctx: BinaryExpressionContext): BinaryExpression { /* ... */ }
  visitIdentifier(ctx: IdentifierContext): Identifier { /* ... */ }

  // Helper methods
  getLocation(ctx: ParserRuleContext): SourceLocation { /* ... */ }
}
```

## Performance Considerations

### Lexer Performance
- **Fast tokenization** - ANTLR lexers are highly optimized
- **DFA-based** - Deterministic Finite Automaton for speed
- **Minimal backtracking**

### Parser Performance
- **LL(*) parsing** - Efficient top-down parsing
- **Memoization** - Results cached for efficiency
- **Error recovery** - Continues parsing after errors

### Visitor Performance
- **Single pass** - Transform in one traversal
- **No intermediate structures** - Direct AST construction
- **Memory efficient** - Garbage collector friendly

## Error Handling

### Lexer Errors
- Invalid characters
- Unterminated strings
- Malformed numbers

### Parser Errors
- Syntax errors
- Missing tokens
- Unexpected tokens

### Error Recovery
ANTLR provides built-in error recovery:
- **Single token deletion** - Skip unexpected token
- **Single token insertion** - Assume missing token
- **Synchronization** - Skip to known good state

## Extensibility

### Adding New Grammar Rules

1. Update grammar file:
```antlr
// Add async/await support
asyncFunctionDeclaration
    : ASYNC FUNCTION identifier '(' parameters ')' block
    ;
```

2. Regenerate parser:
```bash
pnpm antlr
```

3. Implement visitor:
```typescript
visitAsyncFunctionDeclaration(ctx: AsyncFunctionDeclarationContext): FunctionDeclaration {
  return {
    type: 'FunctionDeclaration',
    async: true,
    id: this.visit(ctx.identifier()),
    params: this.visit(ctx.parameters()),
    body: this.visit(ctx.block())
  };
}
```

### Grammar Resources

Official ANTLR grammar repository:
- [ANTLR grammars-v4](https://github.com/antlr/grammars-v4)
- Contains 200+ language grammars
- Well-tested and maintained
- Great starting point for new languages

## Best Practices

### Grammar Design
1. **Start simple** - Add complexity incrementally
2. **Test thoroughly** - Use grammar tests
3. **Follow conventions** - Match ANTLR idioms
4. **Document rules** - Add comments to grammar

### Visitor Implementation
1. **One visitor method per rule** - Clear mapping
2. **Extract helpers** - Reuse common logic
3. **Handle nulls** - Grammar may have optional parts
4. **Preserve locations** - Track source positions

### Type Safety
1. **Strict types** - Use TypeScript strict mode
2. **Avoid any** - Type all visitor returns
3. **Exhaustive checks** - Handle all cases
4. **Runtime validation** - Validate AST structure

## References

### ANTLR Documentation
- [ANTLR Official Site](https://www.antlr.org/)
- [ANTLR GitHub](https://github.com/antlr/antlr4)
- [The Definitive ANTLR 4 Reference](https://pragprog.com/titles/tpantlr2/the-definitive-antlr-4-reference/)

### TypeScript Integration
- [antlr4ts](https://github.com/tunnelvisionlabs/antlr4ts) - ANTLR runtime for TypeScript
- [antlr4ts-cli](https://github.com/tunnelvisionlabs/antlr4ts) - Code generator

### AST Specifications
- [ESTree](https://github.com/estree/estree) - JavaScript AST specification
- [TypeScript AST](https://ts-ast-viewer.com/) - TypeScript AST explorer

## Next Steps

Now that you understand the architecture:
- [Add a new language parser](/guide/adding-languages)
- [Explore package APIs](/packages/)
- [Contribute to development](/development/)

---

Questions? [Open an issue](https://github.com/SylphxAI/ast/issues) or [contact us](mailto:hi@sylphx.com).
