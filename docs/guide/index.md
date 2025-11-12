# Getting Started

Welcome to the AST (Abstract Syntax Tree) toolkit documentation! This guide will help you get started with parsing JavaScript code using our ANTLR-powered parser.

## What is AST?

An Abstract Syntax Tree (AST) is a tree representation of the abstract syntactic structure of source code. Each node in the tree denotes a construct occurring in the source code.

The AST toolkit is a production-grade parsing solution that:
- Parses JavaScript/ECMAScript code into structured AST nodes
- Uses ANTLR v4 for reliable, grammar-based parsing
- Provides full TypeScript type safety
- Offers an extensible architecture for adding new language parsers

## Quick Start

### Installation

::: code-group
```bash [pnpm]
pnpm add @sylphlab/ast-javascript @sylphlab/ast-core
```

```bash [npm]
npm install @sylphlab/ast-javascript @sylphlab/ast-core
```

```bash [yarn]
yarn add @sylphlab/ast-javascript @sylphlab/ast-core
```
:::

### Basic Usage

```typescript
import { parse } from '@sylphlab/ast-javascript';

// Parse JavaScript code
const code = `
  const greeting = "Hello, World!";
  console.log(greeting);
`;

const ast = parse(code);
console.log(ast);
```

### Output Structure

The parser returns an AST structure based on `@sylphlab/ast-core` types:

```typescript
{
  type: 'Program',
  body: [
    {
      type: 'VariableDeclaration',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: { type: 'Identifier', name: 'greeting' },
          init: { type: 'Literal', value: 'Hello, World!' }
        }
      ],
      kind: 'const'
    },
    // ... more nodes
  ]
}
```

## Key Concepts

### ANTLR Parser Generator

ANTLR (ANother Tool for Language Recognition) is a powerful parser generator that reads grammar files and generates parsers that can build and walk parse trees.

**Benefits:**
- Industry-standard tool used by major projects
- Grammar-based approach ensures correctness
- Supports visitor pattern for AST transformation
- Battle-tested and reliable

### Core Architecture

The toolkit follows a layered architecture:

1. **@sylphlab/ast-core** - Generic AST node interfaces and types
2. **@sylphlab/ast-javascript** - JavaScript-specific parser implementation
3. **Future parsers** - TypeScript, Python, Go, etc.

This separation allows for:
- Code reuse across language parsers
- Consistent AST structure
- Easy addition of new languages

### Parsing Pipeline

```
Source Code
    ↓
ANTLR Lexer (Tokenization)
    ↓
ANTLR Parser (Parse Tree)
    ↓
Custom Visitor (Transformation)
    ↓
AST Nodes (@sylphlab/ast-core)
```

## Use Cases

The AST toolkit is perfect for:

- **Code Analysis** - Analyze code structure, complexity, and patterns
- **Linting Tools** - Build custom linters and code quality tools
- **Code Transformation** - Refactor, migrate, or transform code
- **Documentation** - Generate documentation from code
- **Static Analysis** - Type checking, dead code detection
- **IDE Features** - Syntax highlighting, autocomplete, code navigation
- **Transpilers** - Build compilers and transpilers

## Next Steps

<div class="tip custom-block" style="padding-top: 8px">

Ready to dive deeper? Here's what to explore next:

- [Installation Guide](/guide/installation) - Detailed installation instructions
- [Architecture](/guide/architecture) - Deep dive into ANTLR architecture
- [Adding Languages](/guide/adding-languages) - Learn how to add new parsers
- [Packages Overview](/packages/) - Explore available packages

</div>

## Community & Support

Need help? Here's how to get support:

- **GitHub Issues** - [Report bugs or request features](https://github.com/SylphxAI/ast/issues)
- **Email** - [hi@sylphx.com](mailto:hi@sylphx.com)
- **Twitter/X** - [@SylphxAI](https://x.com/SylphxAI)

## Contributing

We welcome contributions! Check out our [development guide](/development/) to learn how to contribute to the project.

---

Ready to install? Continue to the [Installation Guide](/guide/installation) →
