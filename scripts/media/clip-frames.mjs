// A frame sheet per scene of a Curio recording, to choose where each clip starts and ends. From urbantk.org.
//
// node scripts/media/clip-frames.mjs <recording-dir> [scene | walkthrough:<slug> ...]
//
// Tour scenes come from curio-feature-tour.webm and its marks; walkthroughs from walkthroughs/<slug>.webm (see
// clips.mjs). Sheets go to <recording-dir>/frames/<name>.png, one frame every STEP seconds, each labeled with its
// time since the scene or video started. With no names it draws every tour scene.

import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import ffmpeg from 'ffmpeg-static'
import sharp from 'sharp'

const STEP = 1.5
const W = 400
const H = 250

const [dir, ...wanted] = process.argv.slice(2)
if (!dir) throw new Error('usage: clip-frames.mjs <recording-dir> [scene | walkthrough:<slug> ...]')
const out = path.join(dir, 'frames')
await fs.mkdir(out, { recursive: true })

// Decodes the whole file: webm from a browser recording often carries no duration in its header.
function duration(video) {
  const { stderr } = spawnSync(ffmpeg, ['-i', video, '-f', 'null', '-'], { encoding: 'utf8' })
  const [, h, m, s] = stderr.match(/time=(\d+):(\d+):([\d.]+)(?![\s\S]*time=)/) ?? []
  return h ? Number(h) * 3600 + Number(m) * 60 + Number(s) : 30
}

const items = []
const walks = wanted.filter((w) => w.startsWith('walkthrough:'))
const scenes = wanted.filter((w) => !w.startsWith('walkthrough:'))
if (!walks.length || scenes.length) {
  const tour = path.join(dir, 'curio-feature-tour.webm')
  const { marks } = JSON.parse(await fs.readFile(path.join(dir, 'curio-feature-tour.marks.json'), 'utf8'))
  for (const start of marks.filter((m) => m.event === 'start')) {
    if (scenes.length && !scenes.includes(start.name)) continue
    const end = marks.find((m) => m.name === start.name && m.event !== 'start')?.seconds ?? start.seconds + 30
    items.push({ name: start.name, video: tour, start: start.seconds, length: end - start.seconds })
  }
}
for (const walk of walks) {
  const slug = walk.slice('walkthrough:'.length)
  const video = path.join(dir, 'walkthroughs', `${slug}.webm`)
  items.push({ name: slug, video, start: 0, length: duration(video) })
}

for (const item of items) {
  const tiles = []
  const times = []
  for (let t = 0; t <= item.length; t += STEP) times.push(t)
  for (const [i, t] of times.entries()) {
    const png = execFileSync(ffmpeg, ['-v', 'error', '-ss', String(item.start + t), '-i', item.video, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], { maxBuffer: 64 * 1024 * 1024 })
    const left = (i % 5) * W
    const top = Math.floor(i / 5) * (H + 22)
    tiles.push({ input: await sharp(png).resize(W, H, { fit: 'contain', background: '#000' }).png().toBuffer(), left, top })
    tiles.push({ input: Buffer.from(`<svg width="${W}" height="22"><rect width="100%" height="100%" fill="#111"/><text x="6" y="16" font-family="Helvetica" font-size="14" fill="#fff">${item.name} +${t.toFixed(1)}s</text></svg>`), left, top: top + H })
  }
  const rows = Math.ceil(times.length / 5)
  await sharp({ create: { width: 5 * W, height: rows * (H + 22), channels: 3, background: '#333' } })
    .composite(tiles)
    .png()
    .toFile(path.join(out, `${item.name}.png`))
  console.log(`${item.name}: ${item.length.toFixed(1)} s, ${times.length} frames -> ${path.join(out, `${item.name}.png`)}`)
}
