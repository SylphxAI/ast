import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'AST - Abstract Syntax Tree Tools',
  description: 'Type-safe AST parsing for JavaScript with extensible architecture powered by ANTLR v4',
  base: '/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'AST - Abstract Syntax Tree Tools' }],
    ['meta', { property: 'og:description', content: 'Type-safe AST parsing for JavaScript with extensible architecture powered by ANTLR v4' }],
    ['meta', { property: 'og:url', content: 'https://ast.sylphx.com' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@SylphxAI' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Packages', link: '/packages/' },
      { text: 'API', link: '/api/' },
      { text: 'Development', link: '/development/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
          ]
        },
        {
          text: 'Architecture',
          items: [
            { text: 'ANTLR Architecture', link: '/guide/architecture' },
            { text: 'Adding Languages', link: '/guide/adding-languages' },
          ]
        }
      ],
      '/packages/': [
        {
          text: 'Packages',
          items: [
            { text: 'Overview', link: '/packages/' },
            { text: '@sylphlab/ast-core', link: '/packages/core' },
            { text: '@sylphlab/ast-javascript', link: '/packages/javascript' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
          ]
        }
      ],
      '/development/': [
        {
          text: 'Development',
          items: [
            { text: 'Development Guide', link: '/development/' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/SylphxAI/ast' },
      { icon: 'twitter', link: 'https://x.com/SylphxAI' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Sylphx'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/SylphxAI/ast/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  }
})
