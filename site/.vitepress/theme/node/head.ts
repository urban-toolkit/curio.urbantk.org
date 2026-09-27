import type { HeadConfig, PageData } from 'vitepress'

interface HeadSite {
  title: string
  description: string
  hostname: string
  image: string
}

export function pageUrl(relativePath: string, hostname: string): string {
  const route = relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '/')
  return `${hostname}/${route}`
}

// Canonical and Open Graph tags. They go through frontmatter.head so client-side navigation updates them too.
export function socialHead(pageData: PageData, site: HeadSite): HeadConfig[] {
  const fm = pageData.frontmatter
  const url = pageUrl(pageData.relativePath, site.hostname)
  const isHome = pageData.relativePath === 'index.md'
  const title = isHome ? `${site.title} guide` : `${pageData.title || site.title} | ${site.title} guide`
  const description = fm.description ?? pageData.description ?? site.description
  const image = new URL(fm.card?.poster ?? site.image, site.hostname).href
  return [
    ['link', { rel: 'canonical', href: url }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: `${site.title} guide` }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ]
}
