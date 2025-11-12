# Installation

This guide covers how to install and set up the AST toolkit in your project.

## Package Manager

The AST toolkit is available on npm and can be installed using any modern package manager.

### Using pnpm (Recommended)

```bash
pnpm add @sylphlab/ast-javascript @sylphlab/ast-core
```

### Using npm

```bash
npm install @sylphlab/ast-javascript @sylphlab/ast-core
```

### Using yarn

```bash
yarn add @sylphlab/ast-javascript @sylphlab/ast-core
```

## Packages

### Core Package

**@sylphlab/ast-core** - Required for all language parsers

```bash
pnpm add @sylphlab/ast-core
```

This package contains:
- Generic AST node interfaces
- Base types for all parsers
- Zero dependencies
- Fully typed with TypeScript

### Language Parsers

**@sylphlab/ast-javascript** - JavaScript/ECMAScript parser

```bash
pnpm add @sylphlab/ast-javascript
```

This package contains:
- ANTLR-based JavaScript parser
- ECMAScript grammar support
- Custom AST visitor
- Dependencies: `@sylphlab/ast-core`, `antlr4ts`

## Development Installation

If you want to contribute to the project or run it locally:

### Clone the Repository

```bash
git clone https://github.com/SylphxAI/ast.git
cd ast
```

### Install Dependencies

```bash
pnpm install
```

This project uses pnpm workspaces, so a single `pnpm install` will install dependencies for all packages.

### Build All Packages

```bash
pnpm build
```

This builds all packages in the monorepo using Turborepo for optimal caching and parallelization.

### Run Tests

```bash
pnpm test
```

## Requirements

### Node.js Version

- **Node.js 18+** recommended
- **Node.js 16+** minimum supported

### TypeScript Version

- **TypeScript 5.0+** recommended
- The packages are built with TypeScript 5.8

## Verification

After installation, verify everything is working:

```typescript
// test.ts
import { parse } from '@sylphlab/ast-javascript';

const code = 'const x = 42;';
const ast = parse(code);

console.log('AST:', ast);
```

Run the test file:

```bash
npx tsx test.ts
# or
node --loader ts-node/esm test.ts
```

You should see the AST output in the console.

## Module Systems

The packages support both ESM and CommonJS:

### ESM (ECMAScript Modules)

```typescript
import { parse } from '@sylphlab/ast-javascript';
import type { AstNode } from '@sylphlab/ast-core';
```

### CommonJS

```javascript
const { parse } = require('@sylphlab/ast-javascript');
```

## TypeScript Configuration

For optimal TypeScript support, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"]
  }
}
```

## IDE Setup

### VS Code

For the best development experience in VS Code:

1. Install the **TypeScript and JavaScript Language Features** extension (built-in)
2. Install the **ESLint** extension
3. Install the **Prettier** extension

### WebStorm/IntelliJ

TypeScript support is built-in. Ensure you have:
- TypeScript language service enabled
- ESLint integration enabled

## Troubleshooting

### Cannot find module '@sylphlab/ast-javascript'

Make sure you've installed the package:

```bash
pnpm add @sylphlab/ast-javascript
```

### Type errors with antlr4ts

The `antlr4ts` package is a dependency of `@sylphlab/ast-javascript`. If you encounter type errors:

```bash
pnpm add -D @types/antlr4
```

### Module resolution issues

If you're using TypeScript and encountering module resolution issues:

1. Check your `tsconfig.json` has `"moduleResolution": "node"`
2. Ensure `@sylphlab/ast-core` is installed alongside language parsers
3. Clear your TypeScript cache: `rm -rf node_modules/.cache`

### Build errors in monorepo

If you're working on the monorepo itself:

```bash
# Clean all build artifacts
pnpm clean

# Rebuild everything
pnpm build
```

## Next Steps

Now that you have the packages installed, learn about:

- [Architecture](/guide/architecture) - Understand the ANTLR-based architecture
- [Adding Languages](/guide/adding-languages) - Create parsers for new languages
- [API Reference](/api/) - Explore the available APIs

---

Need help? [Open an issue](https://github.com/SylphxAI/ast/issues) or [contact us](mailto:hi@sylphx.com).
