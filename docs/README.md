# AST Documentation

This directory contains the VitePress documentation site for the AST toolkit.

## Development

### Install Dependencies

```bash
cd docs
pnpm install
```

### Start Dev Server

```bash
pnpm dev
```

The site will be available at `http://localhost:5173`

### Build for Production

```bash
pnpm build
```

Output will be in `.vitepress/dist/`

### Preview Production Build

```bash
pnpm preview
```

## Structure

```
docs/
├── .vitepress/
│   └── config.mts          # VitePress configuration
├── index.md                # Landing page
├── guide/                  # User guides
│   ├── index.md           # Getting started
│   ├── installation.md    # Installation guide
│   ├── architecture.md    # ANTLR architecture
│   └── adding-languages.md # Adding new languages
├── packages/              # Package documentation
│   ├── index.md          # Packages overview
│   ├── core.md           # @sylphlab/ast-core
│   └── javascript.md     # @sylphlab/ast-javascript
├── api/                  # API reference
│   └── index.md
├── development/          # Development guide
│   └── index.md
└── package.json          # Docs dependencies
```

## Deployment

The documentation is automatically deployed to Vercel at:
- **Production**: https://ast.sylphx.com

### Vercel Configuration

The `vercel.json` file in the repository root configures:
- Build command: `cd docs && pnpm install && pnpm build`
- Output directory: `docs/.vitepress/dist`
- Framework: VitePress
- Clean URLs and security headers

### Manual Deployment

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
cd ..  # Go to repository root
vercel
```

## Writing Documentation

### Markdown Features

VitePress supports enhanced Markdown:

#### Custom Containers

```markdown
::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a danger message
:::
```

#### Code Groups

```markdown
::: code-group
\`\`\`bash [pnpm]
pnpm install
\`\`\`

\`\`\`bash [npm]
npm install
\`\`\`
:::
```

#### Syntax Highlighting

Code blocks support syntax highlighting:

\`\`\`typescript
const x: number = 42;
\`\`\`

#### Line Highlighting

Highlight specific lines:

\`\`\`typescript{2,4-6}
const x = 1;
const y = 2;  // highlighted
const z = 3;
const a = 4;  // highlighted
const b = 5;  // highlighted
const c = 6;  // highlighted
\`\`\`

### Internal Links

Use relative paths:

```markdown
[Installation Guide](/guide/installation)
[API Reference](/api/)
```

### Images

Place images in `public/` directory:

```markdown
![Logo](/logo.svg)
```

## Configuration

### Theme Configuration

Edit `.vitepress/config.mts`:

```typescript
export default defineConfig({
  title: 'AST - Abstract Syntax Tree Tools',
  description: 'Type-safe AST parsing...',
  themeConfig: {
    // Navigation, sidebar, etc.
  }
})
```

### Navigation

Configured in `config.mts`:

```typescript
nav: [
  { text: 'Home', link: '/' },
  { text: 'Guide', link: '/guide/' },
  // ...
]
```

### Sidebar

Configured per section:

```typescript
sidebar: {
  '/guide/': [
    {
      text: 'Introduction',
      items: [
        { text: 'Getting Started', link: '/guide/' }
      ]
    }
  ]
}
```

## Contributing to Docs

1. Make changes to Markdown files
2. Test locally with `pnpm dev`
3. Build to verify: `pnpm build`
4. Commit and push
5. Create Pull Request

## Resources

- [VitePress Documentation](https://vitepress.dev/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Vue.js](https://vuejs.org/) (used by VitePress)

---

Questions? [Open an issue](https://github.com/SylphxAI/ast/issues) or [contact us](mailto:hi@sylphx.com).
