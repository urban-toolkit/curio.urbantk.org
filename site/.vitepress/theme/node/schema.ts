import { z } from 'zod'
import { SITE } from '../../site'

const GROUP_IDS = SITE.groups.map((g) => g.id) as [string, ...string[]]
const mediaPath = z.string().regex(/^\/media\/[\w./-]+$/, 'media paths look like /media/<page>/<file>')

// Frontmatter of a guide page (site/<slug>.md). Unknown keys fail the build, so a typo cannot silently drop a
// field. The sidebar, the home page grid and the "Go deeper" box are all built from it.
export const pageSchema = z
  .object({
    title: z.string().min(1),
    // One line for the home page card, the search index and the Open Graph description.
    description: z.string().min(1),
    group: z.enum(GROUP_IDS),
    order: z.number().int(),
    card: z.object({ poster: mediaPath, alt: z.string().min(1) }).strict().optional(),
    // Links into the curio repo, rendered after the page. `doc` is a path in the repo; scripts/check/github.mjs
    // verifies that it exists and that `anchor` names one of its headings.
    deeper: z
      .array(
        z
          .object({
            doc: z.string().regex(/^[\w./@-]+\.md$/, 'a markdown path in the curio repo'),
            anchor: z.string().regex(/^[a-z0-9-]+$/, 'a GitHub heading anchor').optional(),
            label: z.string().min(1),
          })
          .strict(),
      )
      .default([]),
    // A path on the hosted app for the "Try it" button, such as /catalog/data.
    app: z.string().regex(/^\//).optional(),
  })
  .strict()

export type PageFrontmatter = z.infer<typeof pageSchema>
