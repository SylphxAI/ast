# Agent Instructions

This repository consumes the Sylphx engineering doctrine from [SylphxAI/doctrine](https://github.com/SylphxAI/doctrine).

Before changing files here:

- Read [PROJECT.md](./PROJECT.md) and [`.doctrine/project.json`](./.doctrine/project.json) for this repository's goal, lifecycle, boundary, public surfaces, and adoption gaps.
- Read `SylphxAI/doctrine` `AGENTS.md`, `PRINCIPLES.md`, and `ADR.md`, then load any triggered standards.
- Keep AST package behavior generic and language-package scoped; downstream product transformations belong in consuming repositories unless promoted through an explicit shared package contract.

Do not add product-specific transformation behavior here. This repository owns AST packages and documentation only.

## Local Validation

```bash
bun install --frozen-lockfile
bun run validate
node --test test/project-control.node-test.mjs
npm exec --yes --package groundatlas@0.1.2 -- ga update --out .groundatlas-pilot
npm exec --yes --package groundatlas@0.1.2 -- ga audit --out .groundatlas-pilot
npm exec --yes --package groundatlas@0.1.2 -- ga manifest --out .groundatlas-pilot --json
npm exec --yes --package groundatlas@0.1.2 -- ga fleet . --out .groundatlas-pilot --require-atlas --strict --json
```

## GroundAtlas Boundary

`project.manifest.json` is the vendor-neutral GroundAtlas control file; `.doctrine/project.json` is the Sylphx-specific adapter and generated `.groundatlas*` reports are not SSOT. Release behavior runs through `.github/workflows/release.yml`, whose caller must grant `id-token: write` for trusted publish identity.
