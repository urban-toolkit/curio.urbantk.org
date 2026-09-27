// Cuts the guide's clips, listed in scripts/media/clips.json, out of Curio's recordings. Adapted from urbantk.org.
//
// node scripts/media/clips.mjs <media-src> [id ...]
//
// <media-src> holds one folder per recording session (a "take"), each with what curio's recorders wrote, recorded
// with CURIO_TOUR_CAPTIONS=0 and CURIO_TOUR_RING=0:
//   curio-feature-tour.webm and curio-feature-tour.marks.json   (test_feature_tour_video.py)
//   walkthroughs/<slug>.webm                                     (test_walkthrough_videos.py)
// Each clip names its take.
// A tour clip's window is given in seconds after its scene's start mark, so a new recording of the same scenes
// can reuse clips.json; a walkthrough clip's window is in seconds from the start of its video. Each clip becomes
// site/public/media/<page>/<id>.mp4 (H.264, no audio, faststart, 0.25 s fades) with a WebP poster <id>.webp, and
// the script prints their sizes for the page. A clip's `redact` boxes (x, y, w, h in the cropped frame, `from` in
// seconds into the clip) are blurred, for things like local paths shown by the app.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'
import sharp from 'sharp'
import { sourceOf } from './sources.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const FADE = 0.25

const [root, ...only] = process.argv.slice(2)
if (!root) throw new Error('usage: clips.mjs <media-src> [id ...]')
const spec = JSON.parse(await fs.readFile(path.join(ROOT, 'scripts/media/clips.json'), 'utf8'))

// ffmpeg filter graph for one clip: crop, blur each `redact` box (from its `from` second on), scale, fade.
function filters(clip, crop, duration) {
  const steps = [`[0:v]${crop ? `${crop},` : ''}fps=30[v0]`]
  let last = 'v0'
  for (const [i, box] of (clip.redact ?? []).entries()) {
    steps.push(`[${last}]split=2[k${i}][c${i}]`)
    steps.push(`[c${i}]crop=${box.w}:${box.h}:${box.x}:${box.y},boxblur=12:3[b${i}]`)
    steps.push(`[k${i}][b${i}]overlay=${box.x}:${box.y}:enable='gte(t,${box.from ?? 0})'[r${i}]`)
    last = `r${i}`
  }
  const fades = duration ? `,fade=t=in:st=0:d=${FADE},fade=t=out:st=${(duration - FADE).toFixed(2)}:d=${FADE}` : ''
  steps.push(`[${last}]scale=1280:-2${fades}[out]`)
  return steps.join(';')
}

for (const clip of spec.clips) {
  if (only.length && !only.includes(clip.id)) continue
  const { video, zero } = await sourceOf(clip, root)
  const out = path.join(ROOT, 'site/public/media', clip.page)
  await fs.mkdir(out, { recursive: true })
  const crop = clip.crop ?? spec.crop
  const duration = clip.to - clip.from
  const mp4 = path.join(out, `${clip.id}.mp4`)
  execFileSync(ffmpeg, [
    '-v', 'error', '-y',
    '-ss', (zero + clip.from).toFixed(2), '-t', duration.toFixed(2), '-i', video,
    '-an',
    '-filter_complex', filters(clip, crop, duration), '-map', '[out]',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(clip.crf ?? 23), '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    mp4,
  ])
  // The poster is taken with every redact box active, whatever its start time.
  const still = { ...clip, redact: (clip.redact ?? []).map((box) => ({ ...box, from: 0 })) }
  const frame = execFileSync(ffmpeg, ['-v', 'error', '-ss', (zero + (clip.poster ?? clip.from + 1)).toFixed(2), '-i', video, '-filter_complex', filters(still, crop, 0), '-map', '[out]', '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], { maxBuffer: 64 * 1024 * 1024 })
  const poster = await sharp(frame).resize({ width: 1280 }).webp({ quality: 80 }).toFile(path.join(out, `${clip.id}.webp`))
  const size = (await fs.stat(mp4)).size
  console.log(`${clip.page}/${clip.id}  ${duration.toFixed(1)} s  ${(size / 1024 / 1024).toFixed(2)} MB  poster ${poster.width}x${poster.height} ${Math.round(poster.size / 1024)} KB`)
}
