# ADR-9: MCP Family AST Foundation

Date: 2026-07-09
Status: Accepted
Slug: mcp-family-ast-foundation

## Context

The SylphxAI MCP family needs parser and source-structure foundations for code
retrieval, architecture graphs, evidence spans, safe transformations, and agent
context packs.

`SylphxAI/ast` was missed in the first MCP family planning pass. That created an
ownership ambiguity because `SylphxAI/synth` also publishes universal AST and
language tooling packages.

The distinction must be explicit:

- AST owns the `@sylphlab/ast-*` package line, ANTLR-backed parser contracts,
  JavaScript-first parsing, typed node interfaces, source-span invariants, and
  grammar fixtures.
- Synth owns the `@sylphx/synth*` package line, universal AST traversal/query
  primitives, multi-language parser packages, WASM bridges, and AST tooling.
- Product MCP repositories own MCP servers, tool schemas, install packaging,
  runtime security policy, telemetry, and customer-facing roadmaps.

## Decision

Adopt `docs/roadmap/mcp-family-ast-foundation.md` as AST's MCP family roadmap.

AST will serve the family as an ANTLR-backed typed parser foundation. It will
not become an MCP server and will not provide a TypeScript MCP adapter for
Rust-native products.

Downstream Rust-native MCP products may consume AST through public package
exports, generated fixtures, generated contract files, or release artifacts.
They must not import private workspace internals or rely on unreleased parser
behavior.

## Consequences

- The MCP family has an explicit place for ANTLR-backed parser contracts that
  complements Synth instead of silently replacing it.
- Architecture Reader MCP and CodeRAG can evaluate AST and Synth through a
  parser-substrate selection layer with fixtures, benchmarks, and source-span
  conformance.
- AST implementation work remains generic and package-scoped.
- MCP server runtime decisions stay in Rust-native product repositories.
- Future parser claims must be backed by generated parser freshness checks,
  package tests, golden fixtures, and package release/readback proof.

## Migration

1. Link this roadmap from README, PROJECT, and the project manifests.
2. Add generated parser contract fixtures for JavaScript and TypeScript-relevant
   syntax before downstream products depend on AST for architecture evidence.
3. Add a package capability catalog for `@sylphlab/ast-*` packages.
4. Define an explicit AST-vs-Synth substrate evaluation fixture shared with
   Architecture Reader MCP and CodeRAG.
5. Keep Rust MCP products on `modelcontextprotocol/rust-sdk` / `rmcp`; AST only
   exports parser contracts and fixtures.

## Verification

- Roadmap added at `docs/roadmap/mcp-family-ast-foundation.md`.
- README and PROJECT link to the roadmap.
- JSON manifests parse.
- Project-control test remains green.
- `bun run validate` remains the package behavior gate.
