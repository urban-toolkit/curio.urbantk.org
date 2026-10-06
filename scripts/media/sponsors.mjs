// The sponsor logos under the home page's funding line, made once from the sponsors' own files.
//
// node scripts/media/sponsors.mjs <dir with nsf.svg, dpi.png and idot.png>
//
// nsf.svg is "National Science Foundation (2009-).svg" and dpi.png is "Dpi-under-black-green.png", both from
// Wikimedia Commons; idot.png is idotlogo.png from idot.illinois.gov. Writes each logo 96 px tall to
// site/public/media/sponsors/, and a dark version of DPI's and IDOT's, whose black turns white.

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'site/public/media/sponsors')
const src = process.argv[2]
if (!src) throw new Error('usage: sponsors.mjs <sources-dir>')

const HEIGHT = 96

// Runs fn on every RGBA pixel of the image and returns the result as a PNG.
async function pixels(input, fn) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) fn(data, i)
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer()
}

async function write(input, name) {
  await sharp(input).trim().resize({ height: HEIGHT }).webp({ quality: 90 }).toFile(path.join(OUT, name))
}

// Black ink turns white, other colors stay.
function lighten(data, i) {
  if (data[i] < 100 && data[i + 1] < 100 && data[i + 2] < 100) {
    data[i] = 255 - data[i]
    data[i + 1] = 255 - data[i + 1]
    data[i + 2] = 255 - data[i + 2]
  }
}

await write(await sharp(path.join(src, 'nsf.svg'), { density: 144 }).png().toBuffer(), 'nsf.webp')

// DPI: the mark only, above the institute's name.
const dpiFile = path.join(src, 'dpi.png')
const { width, height } = await sharp(dpiFile).metadata()
const dpi = await sharp(dpiFile).extract({ left: 0, top: 0, width, height: Math.round(height * 0.6) }).png().toBuffer()
await write(dpi, 'dpi.webp')
await write(await pixels(dpi, lighten), 'dpi-dark.webp')

// IDOT: black on white, so the white becomes transparent.
function ink(value) {
  return (data, i) => {
    data[i + 3] = 255 - Math.round((data[i] + data[i + 1] + data[i + 2]) / 3)
    data[i] = data[i + 1] = data[i + 2] = value
  }
}
await write(await pixels(path.join(src, 'idot.png'), ink(0)), 'idot.webp')
await write(await pixels(path.join(src, 'idot.png'), ink(255)), 'idot-dark.webp')
