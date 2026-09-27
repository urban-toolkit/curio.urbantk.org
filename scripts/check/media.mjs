// Size budgets for site/public and the built site, as on urbantk.org. GitHub rejects files over 100 MB and caps
// a Pages site at 1 GB, and every byte committed stays in the repository's history, so media is kept small.
//
// node scripts/check/media.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const PUBLIC = path.join(ROOT, 'site/public')
const DIST = path.join(ROOT, 'site/.vitepress/dist')
const KB = 1024
const MB = 1024 * KB

const LIMITS = {
  image: { ext: ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.avif'], max: 500 * KB },
  clip: { ext: ['.mp4', '.webm'], max: 3 * MB },
}
const FORBIDDEN = ['.gif', '.tif', '.tiff', '.mov', '.avi', '.psd']
const MAX_FILE = 50 * MB
const MAX_MEDIA = 60 * MB
const MAX_DIST = 150 * MB

function files(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? files(full) : [full]
  })
}

const problems = []
for (const file of files(PUBLIC)) {
  const ext = path.extname(file).toLowerCase()
  const size = fs.statSync(file).size
  const rel = path.relative(ROOT, file)
  if (FORBIDDEN.includes(ext)) problems.push(`${rel}: ${ext} files are not allowed (use WebP for images, MP4 for clips)`)
  for (const [kind, { ext: exts, max }] of Object.entries(LIMITS)) {
    if (exts.includes(ext) && size > max) problems.push(`${rel}: ${Math.round(size / KB)} KB is over the ${kind} budget of ${Math.round(max / KB)} KB`)
  }
  if (size > MAX_FILE) problems.push(`${rel}: ${Math.round(size / MB)} MB is over the ${MAX_FILE / MB} MB file limit`)
}

// Every file under media/ must be used somewhere, or it only adds weight to the repository.
const sources = files(path.join(ROOT, 'site'))
  .filter((file) => !file.includes(`${path.sep}public${path.sep}`) && !file.includes(`${path.sep}dist${path.sep}`) && !file.includes(`${path.sep}cache${path.sep}`))
  .filter((file) => /\.(md|ts|vue|yaml|css)$/.test(file))
  .map((file) => fs.readFileSync(file, 'utf8'))
  .join('\n')
const media = files(path.join(PUBLIC, 'media'))
for (const file of media) {
  const url = `/${path.relative(PUBLIC, file).split(path.sep).join('/')}`
  if (!sources.includes(url)) problems.push(`${path.relative(ROOT, file)}: not referenced by any page or data file`)
}

const mediaSize = media.reduce((sum, file) => sum + fs.statSync(file).size, 0)
if (mediaSize > MAX_MEDIA) problems.push(`site/public/media is ${Math.round(mediaSize / MB)} MB, over the ${MAX_MEDIA / MB} MB budget`)
const distSize = files(DIST).reduce((sum, file) => sum + fs.statSync(file).size, 0)
if (distSize > MAX_DIST) problems.push(`the built site is ${Math.round(distSize / MB)} MB, over the ${MAX_DIST / MB} MB budget`)
console.log(`media: ${media.length} files, ${(mediaSize / MB).toFixed(1)} MB; built site ${(distSize / MB).toFixed(1)} MB`)

for (const problem of problems) console.error(`  ${problem}`)
if (problems.length) {
  console.error(`${problems.length} problem(s)`)
  process.exit(1)
}
