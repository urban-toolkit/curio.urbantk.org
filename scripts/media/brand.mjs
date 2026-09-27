// Brand assets of the site, made once from the logos in the curio repo.
//
// node scripts/media/brand.mjs <dir with curio.png and curio_logo_white.png>
//
// Both come from utk_curio/frontend/urban-workflows/src/assets/ in urban-toolkit/curio. Writes the nav logos
// (96 px tall) and the home page hero logos (400 px tall), each light and dark, and a placeholder social card
// to site/public/media/brand/.

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'site/public/media/brand')
const src = process.argv[2]
if (!src) throw new Error('usage: brand.mjs <assets-dir>')

await sharp(path.join(src, 'curio.png')).trim().resize({ height: 96 }).webp({ quality: 90 }).toFile(path.join(OUT, 'curio-logo.webp'))
await sharp(path.join(src, 'curio_logo_white.png')).trim().resize({ height: 96 }).webp({ quality: 90 }).toFile(path.join(OUT, 'curio-logo-dark.webp'))
// Home page hero: the same two logos, larger.
await sharp(path.join(src, 'curio.png')).trim().resize({ height: 400 }).webp({ quality: 88 }).toFile(path.join(OUT, 'curio-hero.webp'))
await sharp(path.join(src, 'curio_logo_white.png')).trim().resize({ height: 400 }).webp({ quality: 88 }).toFile(path.join(OUT, 'curio-hero-dark.webp'))

const logo = await sharp(path.join(src, 'curio.png')).trim().resize({ height: 440 }).png().toBuffer()
const { width } = await sharp(logo).metadata()
const text = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <text x="600" y="330" font-family="Helvetica, Arial, sans-serif" font-size="64" font-weight="700" fill="#1e293b">Curio guide</text>
  <text x="600" y="392" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#475569">Dataflows for urban visual analytics</text>
</svg>`)
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ffffff' } })
  .composite([{ input: logo, left: Math.round(300 - width / 2), top: 95 }, { input: text, left: 0, top: 0 }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT, 'curio-social.png'))
