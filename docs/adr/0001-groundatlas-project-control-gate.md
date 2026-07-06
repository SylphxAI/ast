# ADR 0001: Add GroundAtlas Project-Control Gate

## Status

Accepted

## Context

AST is a public foundation package monorepo. It already had a main-branch
Release workflow, but it did not expose a vendor-neutral project manifest, did
not run PR/merge-group validation, and did not dogfood the released GroundAtlas
package/action. Its release workflow also needs the caller-side `id-token: write`
permission required by the shared Sylphx release workflow for trusted npm
publishing.

The project-control surface must not make `.doctrine/project.json` a public
default and must not make generated `.groundatlas*` files or GroundAtlas JSON/Markdown reports authoritative. This
change must not alter AST package behavior, generated parser code, documentation
deployment, or downstream code-transformation responsibilities.

## Decision

Add:

- a vendor-neutral `project.manifest.json`;
- a CI workflow that runs `bun run validate`, including generated parser
  freshness, workspace typecheck, package tests, and package build;
- a CI step using `SylphxAI/groundatlas@v0.1.3` with `groundatlas@0.1.3`;
- assertions that GroundAtlas selects `project.manifest.json`, reports
  `.doctrine/project.json` only as an adapter, and has zero strict fleet
  warnings/blockers;
- a small Node project-control boundary test;
- `id-token: write` to the repo-local release workflow caller permissions;
- README/PROJECT/AGENTS updates that clarify Bun as the current repo tooling and
  GroundAtlas as evidence/navigation, not SSOT.

## Consequences

- Pull requests and merge groups now get package validation plus GroundAtlas
  package/action dogfooding.
- Generated ANTLR parser files are committed so package release builds do not
  require Java, while CI still uses Java to prove generated parser freshness.
- `.doctrine/project.json` remains the Sylphx Doctrine adapter and local
  governance catalog.
- Release proof remains a successful main Release workflow plus npm registry
  readback for changed packages.
- Generated `.groundatlas*` files plus GroundAtlas JSON/Markdown reports remain evidence/navigation only.
