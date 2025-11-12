# Deployment Guide

This guide covers how to deploy the AST documentation site.

## Vercel Deployment (Recommended)

The site is configured to deploy automatically to Vercel.

### Prerequisites

- Vercel account
- Repository connected to Vercel
- Domain: `ast.sylphx.com`

### Automatic Deployment

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Vercel Auto-deploys**
   - Production: `main` branch → `ast.sylphx.com`
   - Preview: Pull requests → unique URLs

### Manual Deployment

```bash
# Install Vercel CLI
pnpm add -g vercel

# From repository root
vercel

# Production deployment
vercel --prod
```

### Configuration

The `vercel.json` in the repository root configures:

```json
{
  "buildCommand": "cd docs && pnpm install && pnpm build",
  "outputDirectory": "docs/.vitepress/dist",
  "framework": "vitepress"
}
```

### Environment Setup

1. **Connect Repository**
   - Go to Vercel dashboard
   - Import Git repository
   - Select `SylphxAI/ast`

2. **Configure Project**
   - Framework Preset: VitePress
   - Root Directory: `/`
   - Build Command: (auto-detected from vercel.json)
   - Output Directory: (auto-detected from vercel.json)

3. **Domain Configuration**
   - Add custom domain: `ast.sylphx.com`
   - Configure DNS:
     ```
     Type: CNAME
     Name: ast
     Value: cname.vercel-dns.com
     ```

### Build Settings

| Setting | Value |
|---------|-------|
| Framework | VitePress |
| Build Command | `cd docs && pnpm install && pnpm build` |
| Output Directory | `docs/.vitepress/dist` |
| Install Command | `pnpm install` |
| Node Version | 20.x |

## Alternative: Netlify

### Deploy to Netlify

1. **netlify.toml** (create in root):
   ```toml
   [build]
     command = "cd docs && pnpm install && pnpm build"
     publish = "docs/.vitepress/dist"

   [build.environment]
     NODE_VERSION = "20"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy**
   ```bash
   # Install Netlify CLI
   pnpm add -g netlify-cli

   # Deploy
   netlify deploy

   # Production
   netlify deploy --prod
   ```

## Alternative: GitHub Pages

### Deploy to GitHub Pages

1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4

         - uses: pnpm/action-setup@v2
           with:
             version: 8

         - uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: pnpm

         - name: Install dependencies
           run: cd docs && pnpm install

         - name: Build
           run: cd docs && pnpm build

         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: docs/.vitepress/dist
   ```

2. **Repository Settings**
   - Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` / `root`

3. **Base URL**
   Update `docs/.vitepress/config.mts`:
   ```typescript
   export default defineConfig({
     base: '/ast/',  // For GitHub Pages
     // ...
   })
   ```

## Alternative: Self-Hosted

### Build and Deploy

```bash
# Build
cd docs
pnpm install
pnpm build

# Output is in docs/.vitepress/dist
# Deploy to your web server
rsync -avz docs/.vitepress/dist/ user@server:/var/www/ast/
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name ast.sylphx.com;

    root /var/www/ast;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName ast.sylphx.com
    DocumentRoot /var/www/ast

    <Directory /var/www/ast>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # Rewrite for SPA
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## Build Optimization

### Environment Variables

```bash
# .env.production
NODE_ENV=production
VITE_ENABLE_ANALYTICS=true
```

### Build Flags

```bash
# Optimize build
pnpm build --mode production

# Analyze bundle
pnpm build --mode analyze
```

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard:
- Analytics
- Speed Insights
- Web Vitals

### Google Analytics

Add to `docs/.vitepress/config.mts`:

```typescript
export default defineConfig({
  head: [
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-XXXXXXXXXX');`
    ]
  ]
})
```

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf docs/.vitepress/cache docs/.vitepress/dist docs/node_modules

# Reinstall
cd docs
pnpm install
pnpm build
```

### 404 Errors

Check:
- Output directory is correct
- Clean URLs are enabled
- Base URL is set correctly

### Slow Build

- Optimize images
- Reduce bundle size
- Use CDN for assets

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy Documentation

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: cd docs && pnpm install --frozen-lockfile

      - name: Build
        run: cd docs && pnpm build

      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        run: |
          pnpm add -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Performance Tips

1. **Optimize Images**
   - Use WebP format
   - Compress images
   - Lazy load images

2. **Minimize Bundle**
   - Tree-shake unused code
   - Code splitting
   - Lazy load components

3. **CDN**
   - Use Vercel CDN
   - Or configure CloudFlare

4. **Caching**
   - Set proper cache headers
   - Use service workers

## Security

### Headers

Configured in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### SSL/TLS

- Vercel provides automatic SSL
- Or use Let's Encrypt for self-hosted

## Rollback

### Vercel Rollback

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url]
```

### Git Rollback

```bash
# Revert commit
git revert HEAD

# Or reset to previous commit
git reset --hard HEAD^
git push -f origin main
```

## Maintenance

### Update Dependencies

```bash
cd docs
pnpm update
pnpm build
```

### Check for Broken Links

```bash
# Install link checker
pnpm add -g broken-link-checker

# Check links
blc https://ast.sylphx.com -ro
```

---

Need help? [Open an issue](https://github.com/SylphxAI/ast/issues) or [contact us](mailto:hi@sylphx.com).
