import { defineConfig } from 'vitepress'
import { SITE } from './site'
import { homeBadges } from './theme/node/badges'
import { socialHead } from './theme/node/head'
import { buildSidebar, buildTopics, loadPages, loadUseCases } from './theme/node/pages'

const pages = loadPages()
const useCases = loadUseCases()

// GitHub Pages serves the site under /curio.urbantk.org/ until it has its own domain; deploy.yml passes the
// prefix from the Pages settings. A build under a prefix is a review copy, so it asks not to be indexed.
const BASE = process.env.BASE || '/'
const review = BASE !== '/'

export default defineConfig({
  lang: 'en-US',
  base: BASE,
  title: SITE.title,
  titleTemplate: ':title | Curio guide',
  description: SITE.description,
  srcExclude: ['README.md'],

  // Pages are flat files (site/data-catalog.md) served with a trailing slash (/data-catalog/).
  rewrites: (id) => (id === 'index.md' || id === '404.md' ? id : id.replace(/^([^/]+)\.md$/, '$1/index.md')),

  // VitePress does not prefix head URLs with the base, so these do it themselves.
  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${BASE}favicon-32x32.png` }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: `${BASE}android-chrome-192x192.png` }],
    ['link', { rel: 'apple-touch-icon', href: `${BASE}apple-touch-icon.png` }],
    ...(review ? [['meta', { name: 'robots', content: 'noindex' }] as ['meta', Record<string, string>]] : []),
  ],

  sitemap: { hostname: SITE.hostname },

  themeConfig: {
    logo: { light: '/media/brand/curio-logo.webp', dark: '/media/brand/curio-logo-dark.webp', alt: '' },
    siteTitle: 'Curio guide',
    nav: [
      ...buildTopics(pages),
      { text: 'urbantk.org', link: SITE.urbantk },
      { text: 'Open Curio', link: SITE.app },
    ],
    sidebar: buildSidebar(pages),
    socialLinks: [{ icon: 'github', link: SITE.repo, ariaLabel: 'Curio on GitHub' }],
    outline: false,
    editLink: { pattern: `${SITE.siteRepo}/edit/main/site/:path`, text: 'Edit this page on GitHub' },
    docFooter: { prev: 'Previous', next: 'Next' },
    // Read by the theme's components.
    guide: {
      app: SITE.app,
      docs: SITE.docs,
      repo: SITE.repo,
      urbantk: SITE.urbantk,
      groups: SITE.groups,
      pages,
      useCases,
      badges: homeBadges(SITE),
      funding: SITE.funding,
      institutions: SITE.institutions,
    },
  },

  transformPageData(pageData) {
    // The not-found page gets no canonical URL or link preview.
    if (pageData.relativePath === '404.md') return
    const fm = pageData.frontmatter
    fm.head ??= []
    fm.head.push(...socialHead(pageData, SITE))
  },
})
