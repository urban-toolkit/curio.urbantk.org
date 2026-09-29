// Checks the built site (site/.vitepress/dist) the way GitHub Pages will serve it. Adapted from urbantk.org.
//
//   node scripts/check/dist.mjs                 checks the build on disk
//   node scripts/check/dist.mjs --release       also fails while any <MediaTodo> placeholder is left
//   node scripts/check/dist.mjs --live URL      checks every sitemap page on a live site
//
// On disk it verifies that every internal href, src, srcset and poster resolves, and that the sitemap lists only
// real pages. VitePress itself only checks links written in Markdown, not the ones in the menu or in components.
// BASE is the site's path prefix, as in the build (deploy.yml sets both).

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const DIST = path.join(ROOT, 'site/.vitepress/dist')
const BASE = process.env.BASE || '/'

// GitHub Pages: /x/ serves x/index.html, /x serves x.html or redirects to /x/ when x/ is a folder.
function resolveOnDisk(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0])
  const target = path.join(DIST, clean)
  if (!target.startsWith(DIST)) return null
  if (clean.endsWith('/')) return fs.existsSync(path.join(target, 'index.html')) ? path.join(target, 'index.html') : null
  if (fs.existsSync(target) && fs.statSync(target).isFile()) return target
  if (fs.existsSync(`${target}.html`)) return `${target}.html`
  if (fs.existsSync(path.join(target, 'index.html'))) return path.join(target, 'index.html')
  return null
}

function htmlFiles(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...htmlFiles(full))
    else if (entry.name.endsWith('.html')) out.push(full)
  }
  return out
}

function pageUrl(file) {
  const rel = path.relative(DIST, file).split(path.sep).join('/')
  return `${BASE}${rel.replace(/(^|\/)index\.html$/, '$1')}`
}

function checkDisk(release) {
  const problems = []
  const files = htmlFiles(DIST)
  let links = 0
  let todos = 0
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8')
    const from = pageUrl(file)
    todos += (html.match(/data-media-todo/g) ?? []).length
    const refs = []
    for (const [, attr, value] of html.matchAll(/\s(href|src|poster|srcset)="([^"]*)"/g)) {
      if (attr === 'srcset') refs.push(...value.split(',').map((part) => part.trim().split(/\s+/)[0]))
      else refs.push(value)
    }
    for (const ref of refs) {
      if (!ref || /^(https?:|mailto:|tel:|javascript:|data:|#)/.test(ref) || ref.startsWith('//')) continue
      const absolute = new URL(ref.replace(/&amp;/g, '&'), `https://site.invalid${from}`).pathname
      links++
      if (!absolute.startsWith(BASE)) problems.push(`${from}: ${ref} is outside the site's base ${BASE}`)
      else if (!resolveOnDisk(`/${absolute.slice(BASE.length)}`)) problems.push(`${from}: broken link ${ref}`)
    }
  }
  const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8')
  for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (!resolveOnDisk(new URL(loc).pathname)) problems.push(`sitemap lists a missing page: ${loc}`)
  }
  if (release && todos) problems.push(`${todos} media placeholder(s) left; record them before the release`)
  console.log(`dist: ${files.length} HTML files, ${links} internal links, ${todos} media placeholder(s) left`)
  return problems
}

async function checkLive(base) {
  const problems = []
  const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8')
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => new URL(loc).pathname)
  for (const url of urls) {
    try {
      const res = await fetch(new URL(url.slice(1), base))
      if (!res.ok) problems.push(`${res.status} ${url}`)
    } catch (error) {
      problems.push(`${url}: ${error.message}`)
    }
  }
  console.log(`live: ${urls.length} URLs checked against ${base}`)
  return problems
}

const liveIndex = process.argv.indexOf('--live')
const problems = liveIndex > 0 ? await checkLive(process.argv[liveIndex + 1].replace(/\/?$/, '/')) : checkDisk(process.argv.includes('--release'))
for (const problem of problems) console.error(`  ${problem}`)
if (problems.length) {
  console.error(`${problems.length} problem(s)`)
  process.exit(1)
}
