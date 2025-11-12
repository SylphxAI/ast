# Adding Languages

This guide walks you through adding a new language parser to the AST toolkit. We'll use a hypothetical Python parser as an example.

## Overview

Adding a new language involves:
1. Creating a new package in the monorepo
2. Finding or writing ANTLR grammar files
3. Generating the parser from grammar
4. Implementing a custom visitor
5. Exporting the public API

## Step-by-Step Guide

### Step 1: Create Package Directory

Create a new package in the `packages/` directory:

```bash
cd packages
mkdir python
cd python
```

### Step 2: Create package.json

Create `packages/python/package.json`:

```json
{
  "name": "@sylphlab/ast-python",
  "version": "0.0.0",
  "description": "Python parser for SylphLab AST",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "antlr": "antlr4ts -visitor -listener -o src/generated grammar/*.g4",
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "lint": "eslint . --cache --max-warnings=0",
    "test": "vitest run",
    "test:watch": "vitest",
    "clean": "rimraf dist .turbo"
  },
  "dependencies": {
    "@sylphlab/ast-core": "workspace:*",
    "antlr4ts": "^0.5.0-alpha.4"
  },
  "devDependencies": {
    "@sylphlab/eslint-config-sylph": "^3.4.0",
    "eslint": "^9.25.0",
    "tsup": "^8.4.0",
    "typescript": "^5.8.3",
    "vitest": "^3.1.1"
  },
  "publishConfig": {
    "access": "public"
  },
  "license": "MIT"
}
```

### Step 3: Find ANTLR Grammar

Find an existing ANTLR v4 grammar for your target language:

**Option 1: ANTLR Grammar Repository**

Visit [grammars-v4](https://github.com/antlr/grammars-v4) and search for your language:

```bash
# Clone the grammars repository
git clone https://github.com/antlr/grammars-v4.git

# Find Python grammar
cd grammars-v4/python/python3
```

**Option 2: Write Your Own**

For simpler languages or custom needs, write your own grammar.

### Step 4: Add Grammar Files

Create `packages/python/grammar/` directory and add grammar files:

```bash
mkdir grammar
# Copy grammar files from grammars-v4 or write your own
cp /path/to/PythonLexer.g4 grammar/
cp /path/to/PythonParser.g4 grammar/
```

Example grammar structure:

```antlr
// PythonParser.g4 (simplified)
grammar Python;

// Import lexer
import PythonLexer;

// Entry point
file_input
    : (NEWLINE | statement)* EOF
    ;

statement
    : simple_stmt
    | compound_stmt
    ;

simple_stmt
    : small_stmt (';' small_stmt)* ';'? NEWLINE
    ;

small_stmt
    : expr_stmt
    | del_stmt
    | pass_stmt
    | flow_stmt
    | import_stmt
    | global_stmt
    | nonlocal_stmt
    | assert_stmt
    ;

// ... more rules
```

### Step 5: Create TypeScript Configuration

Create `packages/python/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Step 6: Generate Parser

Run ANTLR to generate TypeScript parser files:

```bash
pnpm antlr
```

This creates:
- `src/generated/PythonLexer.ts`
- `src/generated/PythonParser.ts`
- `src/generated/PythonVisitor.ts`
- `src/generated/PythonListener.ts`

**Note:** Add `src/generated/` to `.gitignore` if these are generated files.

### Step 7: Implement Custom Visitor

Create `packages/python/src/AstBuilderVisitor.ts`:

```typescript
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import type { AstNode, Program, Statement } from '@sylphlab/ast-core';
import { PythonVisitor } from './generated/PythonVisitor';
import type {
  File_inputContext,
  StatementContext,
  Simple_stmtContext,
  // ... more context types
} from './generated/PythonParser';

export class AstBuilderVisitor
  extends AbstractParseTreeVisitor<AstNode>
  implements PythonVisitor<AstNode>
{
  defaultResult(): AstNode {
    return { type: 'Unknown' };
  }

  // Entry point
  visitFile_input(ctx: File_inputContext): Program {
    const statements = ctx
      .statement()
      .map(stmt => this.visit(stmt) as Statement)
      .filter(Boolean);

    return {
      type: 'Program',
      body: statements,
      loc: this.getLocation(ctx)
    };
  }

  // Statement visitors
  visitStatement(ctx: StatementContext): Statement | null {
    if (ctx.simple_stmt()) {
      return this.visit(ctx.simple_stmt()) as Statement;
    }
    if (ctx.compound_stmt()) {
      return this.visit(ctx.compound_stmt()) as Statement;
    }
    return null;
  }

  visitSimple_stmt(ctx: Simple_stmtContext): Statement {
    // Handle simple statements
    const small_stmts = ctx.small_stmt();
    if (small_stmts.length === 1) {
      return this.visit(small_stmts[0]) as Statement;
    }

    // Multiple statements - return block
    return {
      type: 'BlockStatement',
      body: small_stmts.map(stmt => this.visit(stmt) as Statement),
      loc: this.getLocation(ctx)
    };
  }

  // Expression visitors
  visitExpr_stmt(ctx: Expr_stmtContext): Statement {
    // Handle expression statements
    return {
      type: 'ExpressionStatement',
      expression: this.visit(ctx.testlist_star_expr()),
      loc: this.getLocation(ctx)
    };
  }

  // Helper method for location tracking
  private getLocation(ctx: ParserRuleContext): SourceLocation {
    const start = ctx.start;
    const stop = ctx.stop || start;

    return {
      start: {
        line: start.line,
        column: start.charPositionInLine,
        offset: start.startIndex
      },
      end: {
        line: stop.line,
        column: stop.charPositionInLine + (stop.text?.length || 0),
        offset: stop.stopIndex + 1
      }
    };
  }
}
```

### Step 8: Create Main Entry Point

Create `packages/python/src/index.ts`:

```typescript
import { CharStreams, CommonTokenStream } from 'antlr4ts';
import type { AstNode } from '@sylphlab/ast-core';
import { PythonLexer } from './generated/PythonLexer';
import { PythonParser } from './generated/PythonParser';
import { AstBuilderVisitor } from './AstBuilderVisitor';

/**
 * Parse Python source code into an AST
 *
 * @param code - Python source code as a string
 * @returns AST representation of the code
 *
 * @example
 * ```typescript
 * import { parse } from '@sylphlab/ast-python';
 *
 * const code = `
 *   def greet(name):
 *       print(f"Hello, {name}!")
 * `;
 *
 * const ast = parse(code);
 * console.log(ast);
 * ```
 */
export function parse(code: string): AstNode {
  // Create input stream from source code
  const inputStream = CharStreams.fromString(code);

  // Create lexer
  const lexer = new PythonLexer(inputStream);

  // Create token stream
  const tokenStream = new CommonTokenStream(lexer);

  // Create parser
  const parser = new PythonParser(tokenStream);

  // Parse and get parse tree
  const tree = parser.file_input();

  // Transform parse tree to AST
  const visitor = new AstBuilderVisitor();
  const ast = visitor.visit(tree);

  return ast;
}

// Re-export types from core
export type { AstNode, Program, Statement, Expression } from '@sylphlab/ast-core';
```

### Step 9: Add Tests

Create `packages/python/src/index.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { parse } from './index';

describe('Python Parser', () => {
  it('should parse variable assignment', () => {
    const code = 'x = 42';
    const ast = parse(code);

    expect(ast.type).toBe('Program');
    expect(ast.body).toBeDefined();
    expect(ast.body.length).toBeGreaterThan(0);
  });

  it('should parse function definition', () => {
    const code = `
def greet(name):
    print(f"Hello, {name}!")
`;
    const ast = parse(code);

    expect(ast.type).toBe('Program');
    expect(ast.body).toBeDefined();
  });

  it('should parse class definition', () => {
    const code = `
class Person:
    def __init__(self, name):
        self.name = name
`;
    const ast = parse(code);

    expect(ast.type).toBe('Program');
    expect(ast.body).toBeDefined();
  });

  it('should handle errors gracefully', () => {
    const code = 'invalid syntax here @#$';

    expect(() => parse(code)).not.toThrow();
  });
});
```

### Step 10: Update Workspace

Add the new package to the root workspace configuration:

**pnpm-workspace.yaml** (already includes `packages/*`)

**turbo.json** (no changes needed - already includes all packages)

### Step 11: Build and Test

```bash
# From package directory
pnpm install
pnpm build
pnpm test

# From root directory
pnpm build
pnpm test
```

### Step 12: Update Documentation

Add your new package to the documentation:

1. Create `docs/packages/python.md`
2. Update `docs/packages/index.md` to list the new package
3. Update VitePress config sidebar

## Best Practices

### Grammar Selection

1. **Start with existing grammars** - Use grammars-v4 repository
2. **Test thoroughly** - Ensure grammar works for your use cases
3. **Consider performance** - Some grammars are more efficient
4. **Check license** - Ensure grammar license is compatible

### Visitor Implementation

1. **Map to core types** - Use `@sylphlab/ast-core` types when possible
2. **Extend when needed** - Create language-specific types if necessary
3. **Preserve locations** - Always track source locations
4. **Handle errors** - Gracefully handle malformed input

### Code Organization

```
packages/python/
├── grammar/             # ANTLR grammar files
│   ├── PythonLexer.g4
│   └── PythonParser.g4
├── src/
│   ├── generated/       # ANTLR-generated (gitignored)
│   │   ├── PythonLexer.ts
│   │   ├── PythonParser.ts
│   │   └── PythonVisitor.ts
│   ├── AstBuilderVisitor.ts  # Custom visitor
│   ├── types.ts         # Language-specific types
│   ├── index.ts         # Public API
│   └── index.test.ts    # Tests
├── package.json
├── tsconfig.json
└── README.md
```

### Type Definitions

Create language-specific types when needed:

```typescript
// packages/python/src/types.ts
import type { AstNode, Statement } from '@sylphlab/ast-core';

// Python-specific nodes
export interface FunctionDef extends Statement {
  type: 'FunctionDef';
  name: string;
  args: FunctionArgs;
  body: Statement[];
  decorators: Decorator[];
  returns?: Expression;
}

export interface ClassDef extends Statement {
  type: 'ClassDef';
  name: string;
  bases: Expression[];
  keywords: Keyword[];
  body: Statement[];
  decorators: Decorator[];
}

// ... more Python-specific types
```

### Testing Strategy

1. **Unit tests** - Test individual visitor methods
2. **Integration tests** - Test end-to-end parsing
3. **Snapshot tests** - Compare AST output
4. **Error handling** - Test malformed input
5. **Edge cases** - Test boundary conditions

### Documentation

Create comprehensive documentation:

1. **README.md** - Package overview and quick start
2. **API docs** - Document public API
3. **Examples** - Provide usage examples
4. **Limitations** - Document known limitations

## Common Pitfalls

### 1. Grammar Ambiguity

**Problem:** ANTLR reports ambiguous grammar

**Solution:**
- Reorder grammar rules (more specific first)
- Use semantic predicates
- Simplify grammar structure

### 2. Performance Issues

**Problem:** Slow parsing of large files

**Solution:**
- Optimize visitor implementation
- Avoid unnecessary object creation
- Use memoization for repeated work

### 3. Type Safety

**Problem:** Type errors with generated code

**Solution:**
- Use TypeScript strict mode
- Add proper type guards
- Validate parse tree structure

### 4. Error Recovery

**Problem:** Parser fails on errors

**Solution:**
- Use ANTLR error recovery mechanisms
- Implement custom error handling
- Provide meaningful error messages

## Example: Minimal Language

Here's a complete example for a minimal language:

### Grammar

```antlr
// Minimal.g4
grammar Minimal;

program
    : statement* EOF
    ;

statement
    : assignment
    | printStatement
    ;

assignment
    : ID '=' expression ';'
    ;

printStatement
    : 'print' '(' expression ')' ';'
    ;

expression
    : NUMBER
    | STRING
    | ID
    ;

ID: [a-zA-Z_][a-zA-Z0-9_]*;
NUMBER: [0-9]+;
STRING: '"' (~["\r\n])* '"';
WS: [ \t\r\n]+ -> skip;
```

### Visitor

```typescript
export class MinimalVisitor extends AbstractParseTreeVisitor<AstNode> {
  visitProgram(ctx: ProgramContext): Program {
    return {
      type: 'Program',
      body: ctx.statement().map(stmt => this.visit(stmt))
    };
  }

  visitAssignment(ctx: AssignmentContext): Statement {
    return {
      type: 'Assignment',
      left: { type: 'Identifier', name: ctx.ID().text },
      right: this.visit(ctx.expression())
    };
  }

  visitPrintStatement(ctx: PrintStatementContext): Statement {
    return {
      type: 'PrintStatement',
      argument: this.visit(ctx.expression())
    };
  }
}
```

## Resources

### ANTLR Resources
- [ANTLR Documentation](https://www.antlr.org/)
- [Grammar Repository](https://github.com/antlr/grammars-v4)
- [ANTLR Book](https://pragprog.com/titles/tpantlr2/)

### TypeScript Integration
- [antlr4ts](https://github.com/tunnelvisionlabs/antlr4ts)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

### AST Specifications
- [ESTree](https://github.com/estree/estree) - JavaScript
- [Python AST](https://docs.python.org/3/library/ast.html)
- [Go AST](https://pkg.go.dev/go/ast)

## Next Steps

- [Explore existing packages](/packages/)
- [Read API documentation](/api/)
- [Contribute to development](/development/)

---

Need help? [Open an issue](https://github.com/SylphxAI/ast/issues) or join our community!
