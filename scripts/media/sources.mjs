// Where a clip or a frame still comes from, shared by clips.mjs and stills.mjs.

import fs from 'node:fs/promises'
import path from 'node:path'

// The video a clip (or a frame still) comes from, and where its window's zero is in that video.
export async function sourceOf(item, mediaRoot) {
  const dir = path.join(mediaRoot, item.take)
  if (item.source === 'tour') {
    const { marks } = JSON.parse(await fs.readFile(path.join(dir, 'curio-feature-tour.marks.json'), 'utf8'))
    const start = marks.find((m) => m.name === item.scene && m.event === 'start')
    if (!start) throw new Error(`${item.id}: scene ${item.scene} is not in ${item.take}`)
    return { video: path.join(dir, 'curio-feature-tour.webm'), zero: start.seconds }
  }
  const walk = item.source.match(/^walkthrough:([a-z0-9-]+)$/)
  if (walk) return { video: path.join(dir, 'walkthroughs', `${walk[1]}.webm`), zero: 0 }
  throw new Error(`${item.id}: unknown source ${item.source}`)
}
