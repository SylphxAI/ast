---
layout: home

hero:
  name: AST
  text: Abstract Syntax Tree Tools
  tagline: Type-safe AST parsing for JavaScript with extensible architecture powered by ANTLR v4
  image:
    src: /logo.svg
    alt: AST Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/SylphxAI/ast

features:
  - icon: 🚀
    title: ANTLR-Powered
    details: Built on ANTLR v4, the industry-standard parser generator for reliable, battle-tested parsing.
  - icon: 🔒
    title: Type-Safe
    details: Full TypeScript support with strict mode enabled. Catch errors at compile-time, not runtime.
  - icon: 🔧
    title: Extensible
    details: Clean architecture separating core types from language implementations. Add new languages easily.
  - icon: 📦
    title: Monorepo
    details: Organized workspace with pnpm + Turborepo for efficient development and dependency management.
  - icon: ⚡
    title: Modern Tooling
    details: ESLint flat config, Prettier, Husky, commitlint, Vitest, and tsup for an excellent DX.
  - icon: 🌳
    title: JavaScript Parser
    details: Full JavaScript/ECMAScript parser with custom visitor transforming ANTLR parse trees to AST nodes.
---

## Quick Example

```typescript
import { parse } from '@sylphlab/ast-javascript';

const code = `
  const greeting = "Hello, World!";
  console.log(greeting);
`;

const ast = parse(code);
console.log(ast);
```

## Architecture Overview

The AST toolkit follows a layered architecture:

```
┌─────────────────────────────────────────┐
│  @sylphlab/ast-javascript               │
│  (JavaScript-specific parser)           │
└────────────────┬────────────────────────┘
                 │ depends on
                 ▼
┌─────────────────────────────────────────┐
│  @sylphlab/ast-core                     │
│  (Generic AST interfaces & types)       │
└─────────────────────────────────────────┘
```

## Parsing Flow

```
Source Code (String)
       │
       ▼
  ANTLR Lexer
  (Tokenization)
       │
       ▼
  ANTLR Parser
  (Parse Tree)
       │
       ▼
  Custom Visitor
  (Transformation)
       │
       ▼
  Custom AST
  (@sylphlab/ast-core types)
```

## Why Choose AST?

### The Problem
Traditional AST tools are often:
- Tightly coupled to single languages
- Difficult to extend or customize
- Limited type safety
- Complex integration

### The Solution
AST Toolkit provides:
- Clean, extensible architecture
- ANTLR-powered parsing
- Full TypeScript type safety
- Monorepo structure for modularity

### The Result
Production-ready AST parsing with a foundation for supporting any programming language.

## Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Language | TypeScript 5.8 | Type safety & modern JS |
| Parser | ANTLR v4 | Grammar-based parsing |
| Monorepo | pnpm workspaces | Dependency management |
| Build | Turborepo | Task orchestration |
| Bundler | tsup | Fast ESM/CJS builds |
| Testing | Vitest | Unit testing |
| Linting | ESLint 9 (flat config) | Code quality |

## Getting Started

Ready to build AST parsers? Get started with our comprehensive guide:

<div style="margin-top: 2rem;">
  <a href="/guide/" style="display: inline-block; padding: 0.75rem 1.5rem; background: var(--vp-c-brand); color: white; border-radius: 8px; text-decoration: none; font-weight: 500;">
    Read the Guide →
  </a>
</div>

## Community

- Follow us on [Twitter/X](https://x.com/SylphxAI)
- Report issues on [GitHub](https://github.com/SylphxAI/ast/issues)
- Email us at [hi@sylphx.com](mailto:hi@sylphx.com)

---

<div style="text-align: center; margin-top: 3rem; color: var(--vp-c-text-2);">
  <strong>Type-safe AST parsing for the modern web</strong><br>
  <sub>Built with TypeScript and ANTLR</sub>
</div>
