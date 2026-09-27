// Checks every link from the built site into the curio repo on GitHub: the file or folder must exist on main,
// and a #anchor must match a heading of that markdown file. The in-depth docs live there and get renamed and
// rewritten without this repo knowing, so .github/workflows/links.yml also runs this every week.
//
// node scripts/check/github.mjs        (GITHUB_TOKEN, when set, raises the API rate limit)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const DIST = path.join(ROOT, 'site/.vitepress/dist')
const REPO = 'urban-toolkit/curio'
const BRANCH = 'main'
// Only real links: href attributes. (The page's serialized site data also contains the docs base URL.)
const LINK = new RegExp(`href="(https://github\\.com/${REPO.replace('/', '\\/')}/(blob|tree)/${BRANCH}/([^"#?]+)(?:#([^"]+))?)"`, 'g')

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? htmlFiles(full) : entry.name.endsWith('.html') ? [full] : []
  })
}

async function get(url, json) {
  const headers = process.env.GITHUB_TOKEN && url.startsWith('https://api.github.com') ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${res.status} from ${url}`)
  return json ? res.json() : res.text()
}

// GitHub's heading anchors: the heading's text, lowercased, without punctuation, spaces turned into hyphens,
// and -1, -2, ... on repeats.
function anchors(markdown) {
  const seen = new Map()
  const out = new Set()
  let fenced = false
  for (const line of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced
    if (fenced) continue
    for (const [, id] of line.matchAll(/<a\s+(?:name|id)="([^"]+)"/g)) out.add(id)
    const heading = line.match(/^#{1,6}\s+(.*?)\s*#*\s*$/)
    if (!heading) continue
    const text = heading[1]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/[`*]/g, '')
    const base = text.toLowerCase().replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '').replace(/\s/g, '-')
    const n = seen.get(base) ?? 0
    seen.set(base, n + 1)
    out.add(n ? `${base}-${n}` : base)
  }
  return out
}

const links = new Map()
for (const file of htmlFiles(DIST)) {
  const html = fs.readFileSync(file, 'utf8')
  for (const [, url, kind, target, anchor] of html.matchAll(LINK)) {
    const key = url.replace(/&amp;/g, '&')
    if (!links.has(key)) links.set(key, { kind, target: decodeURIComponent(target).replace(/\/$/, ''), anchor, pages: new Set() })
    links.get(key).pages.add(`/${path.relative(DIST, file).split(path.sep).join('/').replace(/index\.html$/, '')}`)
  }
}

const problems = []
const { tree, truncated } = await get(`https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`, true)
if (truncated) throw new Error('the repository tree came back truncated; check the links another way')
const entries = new Map(tree.map((entry) => [entry.path, entry.type]))
const headings = new Map()
for (const [url, { kind, target, anchor, pages }] of links) {
  const where = [...pages].join(', ')
  const type = entries.get(target)
  if (type !== (kind === 'blob' ? 'blob' : 'tree')) {
    problems.push(`${where}: ${url} names a ${kind === 'blob' ? 'file' : 'folder'} that is not on ${BRANCH}`)
    continue
  }
  if (!anchor) continue
  if (!target.endsWith('.md')) {
    problems.push(`${where}: ${url} has an anchor into a file that is not markdown`)
    continue
  }
  if (!headings.has(target)) headings.set(target, anchors(await get(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${target}`)))
  if (!headings.get(target).has(decodeURIComponent(anchor))) problems.push(`${where}: ${target} has no heading for #${anchor}`)
}

console.log(`github: ${links.size} links into ${REPO} checked`)
for (const problem of problems) console.error(`  ${problem}`)
if (problems.length) {
  console.error(`${problems.length} problem(s)`)
  process.exit(1)
}
