# curio.urbantk.org

The Curio guide: short pages with screenshots and clips that explain what Curio does and how to use it. The in-depth documentation stays with the code in [urban-toolkit/curio](https://github.com/urban-toolkit/curio) (`docs/`), and every guide page links to the parts of it that go deeper.

Built with [VitePress](https://vitepress.dev) and deployed to GitHub Pages on every push to `main`.

## Working on the site

```sh
npm ci
npm run dev      # http://localhost:5173
npm run build    # site/.vitepress/dist
npm run check    # links, forwards, media budgets, links into the curio repo
```

Node 22 (`.nvmrc`). Run `npm run build && npm run check` before pushing: `deploy.yml` runs the same steps and does not deploy a failing build.

| Where | What |
|---|---|
| `site/<slug>.md` | one guide page, served at `/<slug>/` |
| `site/index.md` | the home page (hero and topic grid) |
| `site/404.md` | the not-found page, which also forwards old app links |
| `site/public/media/<slug>/` | the page's screenshots and clips |
| `site/.vitepress/site.ts` | site settings: app addresses, sidebar groups, funding |
| `site/.vitepress/theme/` | the theme (see [Theme](#theme)) |
| `scripts/check/` | the checks behind `npm run check` |
| `scripts/media/` | tooling for brand assets, clips and stills |

## Adding or changing a page

A page is one markdown file. Its frontmatter is validated when the site builds, and unknown keys fail the build:

```yaml
---
title: Data Catalog
description: One line for the home page card, the search index and link previews
group: using            # getting-started | using | self-hosting | extending
order: 60               # position in its sidebar group
card: { poster: /media/data-catalog/card.webp, alt: "The Data Catalog page" }   # optional
deeper:                 # links into the curio repo, shown after the page
  - { doc: docs/DATA-CATALOG.md, label: Data Catalog reference }
  - { doc: docs/USAGE.md, anchor: data-catalog, label: Data Catalog in the usage guide }
app: /catalog/data      # optional: a "Try it in Curio" button to this path of the hosted app
---
```

The sidebar, the home page grid and the "Go deeper" box are all built from the frontmatter, so a new page needs no other change.

Components you can use in the body:

| Component | Use |
|---|---|
| `<GuideFigure src="/media/x/y.webp" alt="..." caption="..." :w="1280" :h="768" />` | a screenshot |
| `<LoopVideo src="/media/x/y.mp4" poster="/media/x/y.webp" caption="..." :w="1280" :h="768" />` | a short silent loop |
| `<TryIt path="/catalog/data" label="Open the Data Catalog" />` | a button to a page of the hosted app |
| `<MediaTodo kind="clip" source="tour:build" caption="..." />` | a spot for media not recorded yet |

Writing rules:
- Every screenshot and clip has a caption.
- Pages say what things do. They give no internal rationale, and no counts or versions that go stale (such as the number of built-in agents).
- No en or em dashes.
- Link to other guide pages as `/slug/`, and to the hosted app only through `TryIt` or `app:`. The app's address lives in `site.ts` alone.
- A page may not use a slug that the app used to answer at curio.urbantk.org (`appRoutes` in `site.ts`); the build refuses it.

## Media

Screenshots and clips come from Curio's own Playwright recorders, run from a checkout of the curio repo:
- the feature tour, `utk_curio/backend/tests/test_frontend/test_feature_tour_video.py`, which writes a scene's start and end times to `curio-feature-tour.marks.json`;
- the walkthroughs, `test_walkthrough_videos.py`, one video per journey.

Record with `CURIO_TOUR_CAPTIONS=0` and `CURIO_TOUR_RING=0`: the guide's clips show only the cursor and its click halo, with no captions and no box around what is clicked.

Tools (`cd scripts && npm install` once; the scripts need Node 22):
- `node media/clip-frames.mjs <recording-dir>` writes a contact sheet per scene (a frame every 1.5 s) to pick clip windows.
- `node media/clips.mjs <recording-dir>` cuts the clips listed in `media/clips.json`: H.264, 1280 px wide, no audio, short fades, plus a WebP poster.
- `node media/stills.mjs <recording-dir>` turns the PNG stills listed in `media/clips.json` into WebP.

Budgets, enforced by `scripts/check/media.mjs`: images at most 500 KB, clips at most 3 MB, no GIFs, no files that no page uses, and at most 60 MB of media in all.

## Checks

`npm run check` runs three scripts:
- `check/dist.mjs`: every internal link, image and video in the built site resolves; the `/app/` and `/app-dev/` forward pages and the 404 forwarder are present; the sitemap lists only pages. With `--release` it also fails while any `MediaTodo` is left, and with `--live <url>` it checks a deployed copy instead.
- `check/media.mjs`: the budgets above.
- `check/github.mjs`: every link into the curio repo names a file that exists on `main`, and every `#anchor` matches one of its headings. `links.yml` runs it weekly, because those docs change without this repo knowing.

## Deploy

Every push to `main` builds, checks and deploys through GitHub Actions. The site's path prefix comes from the Pages settings:
- without a custom domain it is served at `https://urban-toolkit.github.io/curio.urbantk.org/`, and those builds ask search engines not to index them;
- with the custom domain it is served at the root of https://curio.urbantk.org.

The domain is set in the repository's Pages settings; Actions deploys ignore `CNAME` files.

## Forwarding old app links

The Curio app used to answer at curio.urbantk.org itself. It now has its own host (`app` in `site.ts`), and this site forwards what visitors may still have:
- `/app/` and `/app-dev/` are small pages that open the two hosted instances;
- every other old app path (`/dashboard/<id>`, `/dataflow/<id>`, `/projects`, ..., listed in `appRoutes`) lands on the 404 page, whose inline script sends it to the same path on the app host.

GitHub Pages has no server-side redirects, so this works in browsers only.

## Theme

`site/.vitepress/theme/` extends the VitePress default theme. `styles/base.css`, `components/SiteFooter.vue`, `components/LoopVideo.vue`, `components/Icon.vue` and `node/color.ts` started as copies of the urbantk.org theme (urban-toolkit/urbantk.org at `de1b8ca`). The brand color is Curio's orange, `#e8590c`: text and buttons use `#ad3e00` on light backgrounds and `#ff8554` on dark ones, which keep 6:1 and 7:1 contrast.
