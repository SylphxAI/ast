# Development Guide

Welcome to the AST toolkit development guide! This document covers everything you need to know to contribute to the project.

## Getting Started

### Prerequisites

- **Node.js 18+** (20+ recommended)
- **pnpm 8+** (package manager)
- **Git** (version control)
- **TypeScript 5.8+** (installed via pnpm)

### Clone the Repository

```bash
git clone https://github.com/SylphxAI/ast.git
cd ast
```

### Install Dependencies

```bash
pnpm install
```

This installs dependencies for all packages in the monorepo.

### Build All Packages

```bash
pnpm build
```

### Run Tests

```bash
pnpm test
```

## Project Structure

```
ast/
├── packages/
│   ├── core/              # @sylphlab/ast-core
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── javascript/        # @sylphlab/ast-javascript
│       ├── grammar/       # ANTLR .g4 files
│       ├── src/
│       │   ├── generated/ # ANTLR-generated files
│       │   ├── AstBuilderVisitor.ts
│       │   ├── types.ts
│       │   ├── index.ts
│       │   └── index.test.ts
│       ├── package.json
│       └── tsconfig.json
├── docs/                  # VitePress documentation
├── package.json           # Root workspace config
├── pnpm-workspace.yaml    # Workspace definition
├── turbo.json             # Turborepo config
├── tsconfig.json          # Root TypeScript config
├── eslint.config.js       # ESLint flat config
└── .prettierrc.cjs        # Prettier config
```

## Common Commands

### Development

```bash
# Watch mode for all packages
pnpm dev

# Build all packages
pnpm build

# Build specific package
cd packages/javascript
pnpm build
```

### Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Test specific package
cd packages/javascript
pnpm test
```

### Code Quality

```bash
# Lint all code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm check-format

# Type checking
pnpm typecheck

# Run all checks
pnpm validate
```

### ANTLR (JavaScript Package)

```bash
cd packages/javascript

# Generate parser from grammar
pnpm antlr
```

This generates TypeScript files from `.g4` grammar files.

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| TypeScript | 5.8 | Language |
| ANTLR | v4 | Parser generator |
| antlr4ts | 0.5.0-alpha.4 | ANTLR runtime for TS |
| pnpm | 10.8.0 | Package manager |

### Build Tools

| Tool | Purpose |
|------|---------|
| Turborepo | Monorepo task orchestration |
| tsup | Fast TypeScript bundler |
| Vitest | Testing framework |

### Code Quality

| Tool | Purpose |
|------|---------|
| ESLint 9 | Linting (flat config) |
| Prettier | Code formatting |
| Husky | Git hooks |
| lint-staged | Pre-commit linting |
| commitlint | Commit message validation |

### Versioning

| Tool | Purpose |
|------|---------|
| Changesets | Version management |

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/my-feature
```

### 2. Make Changes

Edit files in the appropriate package:

```bash
# Edit core types
vim packages/core/src/index.ts

# Edit JavaScript parser
vim packages/javascript/src/AstBuilderVisitor.ts
```

### 3. Build and Test

```bash
# Build
pnpm build

# Test
pnpm test

# Validate everything
pnpm validate
```

### 4. Commit Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat(javascript): add support for async/await"
```

**Commit Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/my-feature
```

Then create a Pull Request on GitHub.

## Working with ANTLR

### Grammar Files

Grammar files are in `packages/javascript/grammar/`:
- `ECMAScriptLexer.g4` - Token definitions
- `ECMAScriptParser.g4` - Parser rules

### Editing Grammar

1. Edit `.g4` file
2. Regenerate parser:
   ```bash
   cd packages/javascript
   pnpm antlr
   ```
3. Update visitor in `src/AstBuilderVisitor.ts`
4. Add tests
5. Build and test

### Grammar Syntax

Basic ANTLR grammar syntax:

```antlr
// Parser rule (starts with lowercase)
statement
    : variableDeclaration
    | expressionStatement
    | ifStatement
    ;

// Lexer rule (starts with uppercase)
CONST: 'const';
LET: 'let';
VAR: 'var';

// Token with regex
IDENTIFIER: [a-zA-Z_][a-zA-Z0-9_]*;
NUMBER: [0-9]+;
```

### Visitor Implementation

Implement visitor methods for each grammar rule:

```typescript
export class AstBuilderVisitor extends ECMAScriptVisitorBase {
  visitStatement(ctx: StatementContext): CstNode {
    // Handle statement
    if (ctx.variableDeclaration()) {
      return this.visit(ctx.variableDeclaration());
    }
    // ... handle other cases
  }

  visitVariableDeclaration(ctx: VariableDeclarationContext): CstNode {
    return {
      type: 'VariableDeclaration',
      text: ctx.text,
      position: this.getPosition(ctx),
      children: [
        // ... child nodes
      ]
    };
  }
}
```

## Testing

### Writing Tests

Tests use Vitest:

```typescript
import { describe, it, expect } from 'vitest';
import { parseJavaScript } from './index';

describe('JavaScript Parser', () => {
  it('should parse variable declarations', () => {
    const code = 'const x = 42;';
    const ast = parseJavaScript(code);

    expect(ast).not.toBeNull();
    expect(ast?.type).toBe('Program');
  });

  it('should handle syntax errors', () => {
    const code = 'const x = ;';
    const ast = parseJavaScript(code);

    // Parser should handle errors gracefully
    expect(ast).toBeDefined();
  });
});
```

### Running Tests

```bash
# All tests
pnpm test

# Watch mode
pnpm test:watch

# Specific package
cd packages/javascript
pnpm test

# With coverage
pnpm test -- --coverage
```

### Test Coverage

Aim for high test coverage:
- **Statements**: > 80%
- **Branches**: > 80%
- **Functions**: > 80%
- **Lines**: > 80%

## TypeScript Configuration

### Root Config

`tsconfig.json` at root:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### Package Config

Each package has its own `tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## ESLint Configuration

Using ESLint 9 flat config:

```javascript
// eslint.config.js
export default [
  {
    ignores: [
      '**/dist/**',
      '**/generated/**',
      '**/node_modules/**'
    ]
  },
  {
    files: ['**/*.{ts,tsx,js,cjs,mjs}'],
    // ... rules
  }
];
```

### Running ESLint

```bash
# Lint all files
pnpm lint

# Fix issues automatically
pnpm lint:fix

# Lint specific files
eslint packages/javascript/src/**/*.ts
```

## Prettier Configuration

`.prettierrc.cjs`:

```javascript
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  printWidth: 100
};
```

### Running Prettier

```bash
# Format all files
pnpm format

# Check formatting
pnpm check-format
```

## Git Hooks

Husky manages git hooks:

### Pre-commit Hook

Runs `lint-staged` to lint and format staged files:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,cjs,mjs}": [
      "eslint --fix --cache --max-warnings=0",
      "prettier --write --cache"
    ],
    "*.{json,md,yaml,yml}": [
      "prettier --write --cache"
    ]
  }
}
```

### Commit Message Hook

Validates commit messages with commitlint:

```javascript
// commitlint.config.cjs
module.exports = {
  extends: ['@commitlint/config-conventional']
};
```

## Changesets

### Creating a Changeset

When making changes that affect the public API:

```bash
pnpm changeset
```

Follow the prompts to describe your changes.

### Publishing

Maintainers can publish with:

```bash
pnpm changeset version
pnpm changeset publish
```

## Debugging

### VSCode Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["test"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Debug Parser

Add console logs in visitor:

```typescript
visitStatement(ctx: StatementContext): CstNode {
  console.log('Visiting statement:', ctx.text);
  // ... implementation
}
```

### Inspect Parse Tree

Log the ANTLR parse tree:

```typescript
const tree = parser.program();
console.log(tree.toStringTree(parser));
```

## Performance Optimization

### Profiling

Use Node.js profiler:

```bash
node --prof index.js
node --prof-process isolate-*.log > profile.txt
```

### Benchmarking

Create benchmarks with Vitest:

```typescript
import { bench, describe } from 'vitest';
import { parseJavaScript } from './index';

describe('Parser Performance', () => {
  bench('parse small file', () => {
    parseJavaScript('const x = 42;');
  });

  bench('parse medium file', () => {
    parseJavaScript(mediumSampleCode);
  });
});
```

## Documentation

### VitePress

Documentation is built with VitePress:

```bash
cd docs

# Install dependencies
pnpm install

# Dev server
pnpm dev

# Build
pnpm build
```

### Writing Docs

Docs are in `docs/` directory:
- `index.md` - Landing page
- `guide/` - Guides
- `packages/` - Package docs
- `api/` - API reference
- `development/` - This guide

Use Markdown with VitePress features:

```markdown
::: tip
Helpful tip here
:::

::: warning
Warning message
:::

::: code-group
\`\`\`bash [pnpm]
pnpm install
\`\`\`

\`\`\`bash [npm]
npm install
\`\`\`
:::
```

## Troubleshooting

### Build Issues

```bash
# Clean all build artifacts
pnpm clean

# Rebuild from scratch
pnpm build
```

### Dependency Issues

```bash
# Clear pnpm store
pnpm store prune

# Reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### TypeScript Issues

```bash
# Type check all packages
pnpm typecheck

# Check specific package
cd packages/javascript
pnpm typecheck
```

### ANTLR Issues

```bash
# Regenerate parser
cd packages/javascript
rm -rf src/generated
pnpm antlr
```

## Contributing Guidelines

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write JSDoc comments for public APIs
- Use meaningful variable names

### Testing

- Write tests for new features
- Update tests when changing behavior
- Maintain high test coverage
- Test edge cases and error conditions

### Documentation

- Update docs for API changes
- Add examples for new features
- Keep README up to date
- Document breaking changes

### Pull Requests

- Create small, focused PRs
- Write clear PR descriptions
- Reference related issues
- Wait for CI to pass
- Respond to review comments

## Resources

### Internal

- [Architecture Guide](/guide/architecture)
- [Adding Languages](/guide/adding-languages)
- [API Reference](/api/)

### External

- [ANTLR Documentation](https://www.antlr.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [Vitest Docs](https://vitest.dev/)

## Community

### Getting Help

- **GitHub Issues** - [Report bugs](https://github.com/SylphxAI/ast/issues)
- **Discussions** - [Ask questions](https://github.com/SylphxAI/ast/discussions)
- **Email** - [hi@sylphx.com](mailto:hi@sylphx.com)
- **Twitter** - [@SylphxAI](https://x.com/SylphxAI)

### Contributing

We welcome contributions! Please:
1. Read this guide
2. Check existing issues
3. Discuss major changes first
4. Follow code standards
5. Write tests
6. Update documentation

## License

MIT © [Sylphx](https://sylphx.com)

---

Ready to contribute? [Open an issue](https://github.com/SylphxAI/ast/issues) or start coding!
