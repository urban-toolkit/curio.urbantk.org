import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import type { DefaultTheme } from 'vitepress'
import { z } from 'zod'
import { SITE } from '../../site'
import { pageSchema, useCaseSchema, type PageFrontmatter, type UseCase } from './schema'

export const SITE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

// Files in site/ that are not guide pages.
const SPECIAL = new Set(['index.md', '404.md'])

export interface GuidePage extends PageFrontmatter {
  slug: string
  url: string
}

// Every guide page, validated, in sidebar order.
export function loadPages(): GuidePage[] {
  const files = fs.readdirSync(SITE_DIR).filter((file) => file.endsWith('.md') && !SPECIAL.has(file))
  const pages = files.map((file) => {
    const slug = file.slice(0, -3)
    const parsed = pageSchema.safeParse(matter(fs.readFileSync(path.join(SITE_DIR, file), 'utf8')).data)
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`).join('; ')
      throw new Error(`site/${file}: ${issues}`)
    }
    const url = `/${slug}/`
    const clash = [...SITE.appRoutes, '/app', '/app-dev'].find((route) => url === `${route}/` || url.startsWith(`${route}/`))
    if (clash) throw new Error(`site/${file}: ${url} would hide the old app route ${clash}, which forwards to the app`)
    return { ...parsed.data, slug, url }
  })
  const groupIndex = (id: string) => SITE.groups.findIndex((g) => g.id === id)
  pages.sort((a, b) => groupIndex(a.group) - groupIndex(b.group) || a.order - b.order || a.title.localeCompare(b.title))
  for (const [i, page] of pages.entries()) {
    const twin = pages.find((other, j) => j !== i && other.group === page.group && other.order === page.order)
    if (twin) throw new Error(`site/${page.slug}.md and site/${twin.slug}.md have the same order in ${page.group}`)
  }
  return pages
}

// The home page's use cases, validated.
export function loadUseCases(): UseCase[] {
  const data = matter(fs.readFileSync(path.join(SITE_DIR, 'index.md'), 'utf8')).data.useCases ?? []
  const parsed = z.array(useCaseSchema).safeParse(data)
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `useCases.${i.path.join('.')}: ${i.message}`).join('; ')
    throw new Error(`site/index.md: ${issues}`)
  }
  return parsed.data
}

export function buildSidebar(pages: GuidePage[]): DefaultTheme.SidebarItem[] {
  return SITE.groups
    .map((group) => ({
      text: group.title,
      items: pages.filter((p) => p.group === group.id).map((p) => ({ text: p.title, link: p.url })),
    }))
    .filter((group) => group.items.length > 0)
}
