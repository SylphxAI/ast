# Project-Control Gate Spec

## Goal

Validate AST's project-control and GroundAtlas adoption surfaces without
changing AST package behavior, generated parser code, documentation deployment,
or downstream code-transformation responsibilities.

## Scope

The gate validates repository control-plane facts only:

- neutral identity and truth homes live in `project.manifest.json`;
- Sylphx-specific governance facts remain in `.doctrine/project.json`;
- generated `.groundatlas*` files plus GroundAtlas JSON/Markdown reports are evidence/navigation only;
- package validation remains `bun run validate`, including generated parser
  freshness, package typecheck, tests, and build;
- package release proof remains the Release workflow plus registry/readback when
  versions change.

It does not own downstream product transformations, application-specific
refactors, language parser packages not explicitly implemented here, or shared
organization rulesets.

## CI Contract

`.github/workflows/ci.yml` must:

1. run on `push`, `pull_request`, and `merge_group`;
2. set up Bun, Node, and Java 17 for ANTLR generated-parser freshness checks;
3. install dependencies with `bun install --frozen-lockfile`;
4. run `bun run validate`;
5. run `node --test test/project-control.node-test.mjs`;
6. run `SylphxAI/groundatlas@v0.1.3` with `package-spec:
   groundatlas@0.1.3`, `require-atlas: "true"`, and `strict: "true"`;
7. assert that GroundAtlas selects `project.manifest.json` and treats
   `.doctrine/project.json` only as an adapter;
8. assert the Markdown fleet scorecard title and adopted summary;
9. upload the manifest, JSON fleet, and Markdown fleet reports as `groundatlas-package-dogfood`.

## Acceptance

- `bun run validate` passes.
- `ga audit` passes after `ga update`.
- `ga manifest --json` selects `project.manifest.json`.
- `ga fleet --require-atlas --strict --json` reports one adopted project with
  zero warnings and zero blockers.
- The release workflow caller declares `id-token: write`.
