# Packages Overview

The AST toolkit is organized as a monorepo with multiple packages. This modular architecture allows you to install only what you need.

## Package Structure

```
@sylphlab/ast-*
├── @sylphlab/ast-core         # Core AST types (required)
└── @sylphlab/ast-javascript   # JavaScript parser
```

## Core Package

### @sylphlab/ast-core

**The foundation for all language parsers**

```bash
pnpm add @sylphlab/ast-core
```

This package provides:
- Generic AST node interfaces
- Base types for all parsers
- Position and location tracking
- Zero external dependencies
- Full TypeScript type definitions

**Key Types:**
- `AstNode` - Base interface for all AST nodes
- `Program` - Root node of an AST
- `Statement` - Base for all statements
- `Expression` - Base for all expressions
- `SourceLocation` - Position tracking

[View documentation →](/packages/core)

## Language Parsers

### @sylphlab/ast-javascript

**JavaScript/ECMAScript parser powered by ANTLR**

```bash
pnpm add @sylphlab/ast-javascript
```

Features:
- Full ECMAScript support
- ANTLR-based parsing
- Custom visitor for AST transformation
- Source location tracking
- Error recovery

**Dependencies:**
- `@sylphlab/ast-core` (required)
- `antlr4ts` (ANTLR runtime)

[View documentation →](/packages/javascript)

## Installation

### Install Core + JavaScript Parser

::: code-group
```bash [pnpm]
pnpm add @sylphlab/ast-core @sylphlab/ast-javascript
```

```bash [npm]
npm install @sylphlab/ast-core @sylphlab/ast-javascript
```

```bash [yarn]
yarn add @sylphlab/ast-core @sylphlab/ast-javascript
```
:::

### Install Core Only

If you're building your own parser:

::: code-group
```bash [pnpm]
pnpm add @sylphlab/ast-core
```

```bash [npm]
npm install @sylphlab/ast-core
```

```bash [yarn]
yarn add @sylphlab/ast-core
```
:::

## Package Comparison

| Feature | @sylphlab/ast-core | @sylphlab/ast-javascript |
|---------|-------------------|-------------------------|
| **Purpose** | Core types | JavaScript parser |
| **Dependencies** | None | ast-core, antlr4ts |
| **Size** | ~10KB | ~500KB (includes grammar) |
| **When to use** | Building custom parsers | Parsing JavaScript |
| **Exports** | Types only | Parser + types |

## Version Compatibility

All packages follow semantic versioning:

- **Major version** - Breaking API changes
- **Minor version** - New features (backward compatible)
- **Patch version** - Bug fixes

### Current Versions

| Package | Version | Status |
|---------|---------|--------|
| @sylphlab/ast-core | 0.0.0 | Alpha |
| @sylphlab/ast-javascript | 0.0.0 | Alpha |

::: warning
These packages are currently in alpha. APIs may change before 1.0.0 release.
:::

## Package Details

### Dependencies

```
@sylphlab/ast-javascript
├── @sylphlab/ast-core@workspace:*
└── antlr4ts@0.5.0-alpha.4

@sylphlab/ast-core
└── (no dependencies)
```

### Bundle Sizes

| Package | Minified | Minified + Gzipped |
|---------|----------|-------------------|
| @sylphlab/ast-core | ~10 KB | ~3 KB |
| @sylphlab/ast-javascript | ~500 KB | ~120 KB |

::: tip
The JavaScript parser includes ANTLR runtime and generated grammar, which accounts for most of the bundle size.
:::

## Module Formats

All packages support multiple module formats:

### ESM (ECMAScript Modules)

```typescript
import { parse } from '@sylphlab/ast-javascript';
import type { AstNode } from '@sylphlab/ast-core';
```

### CommonJS

```javascript
const { parse } = require('@sylphlab/ast-javascript');
```

### TypeScript

Full TypeScript support with `.d.ts` type declarations:

```typescript
import type { Program, Statement, Expression } from '@sylphlab/ast-core';
```

## Tree Shaking

All packages are tree-shakeable when using ESM:

```typescript
// Only imports what you use
import { parse } from '@sylphlab/ast-javascript';

// Bundle will only include parse function and dependencies
```

## Peer Dependencies

Some packages may have peer dependencies:

```json
{
  "peerDependencies": {
    "typescript": ">=5.0.0"
  },
  "peerDependenciesMeta": {
    "typescript": {
      "optional": true
    }
  }
}
```

## Package Registry

All packages are published to npm:
- Registry: [npmjs.com](https://www.npmjs.com/org/sylphlab)
- Scope: `@sylphlab`
- Access: Public

## Future Packages

Planned language parsers:

- `@sylphlab/ast-typescript` - TypeScript parser
- `@sylphlab/ast-python` - Python parser
- `@sylphlab/ast-go` - Go parser
- `@sylphlab/ast-rust` - Rust parser

Utility packages:

- `@sylphlab/ast-utils` - AST manipulation utilities
- `@sylphlab/ast-traverse` - AST traversal helpers
- `@sylphlab/ast-codegen` - Code generation from AST

## Package Development

Interested in contributing a new language parser?

1. Read the [Adding Languages Guide](/guide/adding-languages)
2. Check out the [Development Guide](/development/)
3. Open a discussion on [GitHub](https://github.com/SylphxAI/ast/discussions)

## Support Matrix

### Node.js Versions

| Node.js Version | Supported |
|----------------|-----------|
| 20.x | ✅ Yes |
| 18.x | ✅ Yes |
| 16.x | ⚠️ Best effort |
| 14.x | ❌ No |

### TypeScript Versions

| TypeScript Version | Supported |
|-------------------|-----------|
| 5.8.x | ✅ Yes (recommended) |
| 5.0.x - 5.7.x | ✅ Yes |
| 4.x | ⚠️ May work |
| 3.x | ❌ No |

## Package Links

Explore the documentation for each package:

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 2rem;">
  <a href="/packages/core" style="display: block; padding: 1.5rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; text-decoration: none;">
    <h3 style="margin-top: 0;">@sylphlab/ast-core</h3>
    <p style="color: var(--vp-c-text-2); margin-bottom: 0;">Core AST types and interfaces</p>
  </a>
  <a href="/packages/javascript" style="display: block; padding: 1.5rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; text-decoration: none;">
    <h3 style="margin-top: 0;">@sylphlab/ast-javascript</h3>
    <p style="color: var(--vp-c-text-2); margin-bottom: 0;">JavaScript parser with ANTLR</p>
  </a>
</div>

## Next Steps

- [View @sylphlab/ast-core docs](/packages/core)
- [View @sylphlab/ast-javascript docs](/packages/javascript)
- [Read the API reference](/api/)
- [Learn about the architecture](/guide/architecture)

---

Questions? [Open an issue](https://github.com/SylphxAI/ast/issues) or [contact us](mailto:hi@sylphx.com).
