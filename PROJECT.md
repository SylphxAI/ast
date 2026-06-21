# SylphxAI AST

SylphxAI/ast is a TypeScript monorepo for AST parsing tools, starting with JavaScript parsing through ANTLR and shared core AST interfaces.

## Lifecycle

- State: `active`
- Layer: `library`
- Machine manifest: [`.doctrine/project.json`](./.doctrine/project.json)

## Goals

- Provide shared AST core interfaces through `@sylphlab/ast-core`.
- Provide JavaScript parsing through `@sylphlab/ast-javascript` using ANTLR-generated parser code.
- Maintain package documentation and a VitePress documentation site for the AST toolkit.

## Non-Goals

- This repository does not own downstream code transformation products or application-specific refactors.
- This repository does not own parser implementations for every language until those packages are explicitly added here.
- This repository does not own enterprise engineering doctrine.

## Boundary

This repository owns the AST package monorepo, JavaScript grammar/parser package, shared AST core package, package release workflow, and documentation site. Downstream consumers, product-specific code transformations, generated app behavior, and enterprise doctrine remain outside this repository.

## Public Surfaces

- Repository README: [`README.md`](./README.md)
- Root package scripts: [`package.json`](./package.json)
- Core package: [`packages/core/`](./packages/core/)
- JavaScript parser package: [`packages/javascript/`](./packages/javascript/)
- Documentation site: [`docs/`](./docs/)
- Release workflow: [`.github/workflows/release.yml`](./.github/workflows/release.yml)

## Delivery

The repository has a main-branch release workflow that delegates to the central SylphxAI/.github reusable release workflow. Meaningful proof is `bun run validate`, successful package build/tests, successful release workflow for package changes, and documentation deployment/readback for docs changes. This manifest slice is documentation-only and does not change package code, release behavior, or deployment configuration.
