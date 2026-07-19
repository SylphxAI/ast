# MCP Family AST Foundation Roadmap

Status: adoption plan
Owner: SylphxAI AST
Scope: repo-local future plan and its role in the SylphxAI MCP family
Decision record: `docs/adr/ADR-9-mcp-family-ast-foundation.md`

## Family Role

AST is the ANTLR-backed typed parser foundation for the SylphxAI MCP family. It
turns grammar-backed parse trees into stable typed nodes, source spans, and
fixtures that code-intelligence products can validate against.

It is not an MCP server. It does not own architecture graphs, code search,
filesystem writes, document/media extraction, model consultation, package
runtime telemetry, or customer-facing MCP tool schemas.

## Family Fit

| Project | Relationship |
| --- | --- |
| Architecture Reader MCP | May validate symbol, import, route, and source-span extraction against AST fixtures while owning graph semantics and impact queries. |
| CodeRAG | May use AST fixtures to validate chunking and symbol-neighborhood retrieval while owning indexing, ranking, persistence, and `codebase_search`. |
| Synth | Complements AST as the `@sylphx/synth*` universal AST package family. AST owns `@sylphlab/ast-*` ANTLR-backed parser contracts. |
| Filesystem MCP | May use AST span contracts to make safe transformations explainable, but AST does not own file mutation policy. |
| Reader MCPs | May consume structured code blocks or grammar fixtures as evidence inputs, but AST does not own media/document extraction. |

## SOTA End State

AST should become the cleanest typed parser-contract layer for agents that need
source-accurate syntax evidence:

- deterministic parser output;
- stable byte offsets and line/column spans;
- grammar freshness checks;
- language-package isolation;
- generated package capability metadata;
- golden fixtures for imports, exports, symbols, declarations, JSX/TS syntax,
  comments, and error recovery;
- benchmarked parse latency, memory ceiling, and package size;
- release artifacts that downstream Rust-native MCP products can consume
  without private workspace imports.

## Runtime Direction

AST can remain TypeScript because it is a package foundation, not an MCP runtime.
Rust-native MCP products should not embed a TypeScript MCP adapter around AST.
They should consume AST only through public packages, generated fixtures,
contract files, or offline release artifacts.

If AST adds Rust or WASM surfaces, they must be package-level parser surfaces
with benchmarks and deterministic fixture proof. They are not a reason to move
MCP server runtime out of Rust product repositories.

## Roadmap

### Phase 0: Boundary And Roadmap

- Record AST's MCP family role.
- Link the roadmap from README, PROJECT, and manifests.
- Clarify AST versus Synth ownership so implementation agents do not duplicate
  parser work or create hidden cross-repo imports.

Exit gate: ADR, roadmap links, JSON validation, and package validation pass.

### Phase 1: Package Capability Catalog

- Generate a catalog from `packages/*/package.json`.
- Include package name, parser technology, grammar source, supported syntax,
  exports, runtime requirements, generated-code freshness command, and benchmark
  status.
- Use the catalog as the current-state source for package docs.

Exit gate: catalog generation/check runs in CI and fails drift.

### Phase 2: Contract Fixtures

- Add golden fixtures for imports, exports, declarations, functions, classes,
  JSX, TypeScript-adjacent syntax, comments, whitespace, malformed input, and
  source-span invariants.
- Include expected typed node shape and offset/line/column ranges.
- Keep fixtures product-neutral; product-specific graph or ranking labels stay
  in consuming repos.

Exit gate: package tests prove deterministic parse output and stable spans.

### Phase 3: Substrate Evaluation With Synth

- Define a shared evaluation fixture that compares AST and Synth outputs for
  Architecture Reader MCP and CodeRAG needs.
- Evaluate parse fidelity, span stability, incremental behavior, memory,
  package size, cold start, and install reliability.
- Prefer the substrate that best satisfies each product's evidence contract
  without creating private coupling.

Exit gate: Architecture Reader MCP and CodeRAG each record their selected parser
substrate per language with fixture evidence and fallback rules.

### Phase 4: Downstream Consumption Contracts

- Publish generated fixture artifacts or contract files that Rust-native MCP
  products can consume in tests.
- Add package release/readback proof before downstream products rely on a new
  parser contract.
- Add diagnostics for unsupported syntax and lossy/error-recovered parse paths.

Exit gate: downstream products validate against released AST artifacts, not
local workspace internals.

## Performance Bar

- Parser output is deterministic for unchanged input.
- Source spans are stable across patch releases unless a migration is recorded.
- Generated parser freshness is checked in CI.
- Parser benchmarks cover cold parse, repeated parse, large file behavior,
  malformed input, memory ceiling, and package size.
- Any Rust/WASM surface proves it improves a measured path or enables a
  specific portable/sandboxed use case.

## Non-Goals

- Build an MCP server in AST.
- Add a TypeScript MCP adapter for product repositories.
- Replace Synth's `@sylphx/synth*` universal AST package family.
- Encode Architecture Reader graph semantics or CodeRAG ranking rules here.
- Let product repos import AST workspace internals.
