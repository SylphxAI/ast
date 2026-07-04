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
- CI workflow: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)
- Release workflow: [`.github/workflows/release.yml`](./.github/workflows/release.yml)
- Vendor-neutral project manifest: [`project.manifest.json`](./project.manifest.json)

## Delivery

Pull requests and merge groups run `bun run validate`, project-control boundary checks, and GroundAtlas package dogfooding in `.github/workflows/ci.yml`. The main-branch release workflow delegates to the central SylphxAI/.github reusable release workflow. Meaningful proof is `bun run validate`, CI evidence including GroundAtlas package dogfood, successful package build/tests, successful release workflow for package changes, npm registry readback for changed packages, and documentation deployment/readback for docs changes.

## Project Control

`project.manifest.json` is the vendor-neutral control file for GroundAtlas and external agents. `.doctrine/project.json` remains the Sylphx Doctrine adapter and local governance catalog. Generated `.groundatlas*` reports are evidence and navigation only; they are not source of truth.
