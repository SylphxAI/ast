# SylphxAI AST

SylphxAI/ast is a TypeScript monorepo for AST parsing tools, starting with JavaScript parsing through ANTLR and shared core AST interfaces.

## Lifecycle

- State: `active`
- Layer: `foundation`
- Vendor-neutral project manifest: [`project.manifest.json`](./project.manifest.json)
- Doctrine adapter manifest: [`.doctrine/project.json`](./.doctrine/project.json)

## Goals

- Provide shared AST core interfaces through `@sylphlab/ast-core`.
- Provide JavaScript parsing through `@sylphlab/ast-javascript` using ANTLR-generated parser code.
- Maintain package documentation and a VitePress documentation site for the AST toolkit.
- Serve the SylphxAI MCP family as an ANTLR-backed typed parser-contract foundation through public packages, generated fixtures, and stable source-span invariants.

## Non-Goals

- This repository does not own downstream code transformation products or application-specific refactors.
- This repository does not own parser implementations for every language until those packages are explicitly added here.
- This repository does not own MCP server runtime, transport, tool schemas, or TypeScript MCP adapters for downstream Rust-native products.
- This repository does not replace Synth's `@sylphx/synth*` universal AST package family.
- This repository does not own enterprise engineering doctrine.

## Boundary

This repository owns the AST package monorepo, JavaScript grammar/parser package, shared AST core package, package release workflow, and documentation site. Downstream consumers, product-specific code transformations, generated app behavior, and enterprise doctrine remain outside this repository.

## Public Surfaces

- Repository README: [`README.md`](./README.md)
- Root package scripts: [`package.json`](./package.json)
- Core package: [`packages/core/`](./packages/core/)
- JavaScript parser package: [`packages/javascript/`](./packages/javascript/)
- Documentation site: [`docs/`](./docs/)
- MCP family AST foundation roadmap: [`docs/roadmap/mcp-family-ast-foundation.md`](./docs/roadmap/mcp-family-ast-foundation.md)
- CI workflow: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)
- Release workflow: [`.github/workflows/release.yml`](./.github/workflows/release.yml)
- Vendor-neutral project manifest: [`project.manifest.json`](./project.manifest.json)

## Delivery

Pull requests and merge groups run `bun run validate` in `.github/workflows/ci.yml`. The main-branch release workflow delegates to the shared release workflow. Meaningful proof is package build/tests, successful release workflow for package changes, npm registry readback for changed packages, and documentation deployment/readback for docs changes.

## Project Control

`project.manifest.json` records repository metadata for tools and agents.
