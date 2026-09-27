// Turns the stills listed in scripts/media/clips.json into the guide's WebP screenshots.
//
// node scripts/media/stills.mjs <media-src> [id ...]
//
// <media-src> holds one folder per recording session (a "take"), as for clips.mjs. A still is either
//   - a PNG screenshot, `name`: <take>/stills/<name>.png, written by ctx.tour.still(<name>) in curio's tour, or
//   - a video frame, `source` and `at` (plus `scene` for the tour): seconds after the scene's start mark, or
//     from the start of a walkthrough video. A frame is softer than a screenshot, so it is the fallback.
// Each still becomes site/public/media/<page>/<id>.webp, at most 1600 px wide. `crop` ({left, top, width, height})
// defaults to the whole frame minus the bottom 32 px, where the app shows its version; `redact` boxes
// ({x, y, w, h} in the cropped image) are blurred.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'
import sharp from 'sharp'
import { sourceOf } from './sources.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const VERSION_STRIP = 32

const [root, ...only] = process.argv.slice(2)
if (!root) throw new Error('usage: stills.mjs <media-src> [id ...]')
const { stills } = JSON.parse(await fs.readFile(path.join(ROOT, 'scripts/media/clips.json'), 'utf8'))

async function pixels(still) {
  if (still.name) return fs.readFile(path.join(root, still.take, 'stills', `${still.name}.png`))
  const { video, zero } = await sourceOf(still, root)
  return execFileSync(ffmpeg, ['-v', 'error', '-ss', (zero + still.at).toFixed(2), '-i', video, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], { maxBuffer: 64 * 1024 * 1024 })
}

for (const still of stills) {
  if (only.length && !only.includes(still.id)) continue
  const input = await pixels(still)
  const meta = await sharp(input).metadata()
  // The recorders use a 1280 px wide viewport, so a wider PNG was taken at a higher device scale.
  const scale = Math.max(1, Math.round(meta.width / 1280))
  const crop = still.crop ?? { left: 0, top: 0, width: meta.width, height: meta.height - VERSION_STRIP * scale }
  const base = await sharp(input).extract(crop).png().toBuffer()
  const blurred = await Promise.all(
    (still.redact ?? []).map(async (box) => ({
      input: await sharp(base).extract({ left: box.x, top: box.y, width: box.w, height: box.h }).blur(12).toBuffer(),
      left: box.x,
      top: box.y,
    })),
  )
  const out = path.join(ROOT, 'site/public/media', still.page)
  await fs.mkdir(out, { recursive: true })
  const info = await sharp(base).composite(blurred).resize({ width: Math.min(1600, crop.width), withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(out, `${still.id}.webp`))
  console.log(`${still.page}/${still.id}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`)
}
