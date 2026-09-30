<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import Icon from './Icon.vue'

// The home page's picture of how Curio's parts fit, below the use cases: the Data Lake, Data and Node catalogs
// take a dataset from a portal to computed results, the Agent Catalog's agents help at each of those stages, and
// Curio composes them into an analysis. The cards are HTML so their text wraps; the wires between them are drawn
// over the measured cards, side by side on wide screens and stacked on narrow ones.
const { theme } = useData()
const app = computed(() => theme.value.guide.app as string)

const STAGES = [
  {
    id: 'lake',
    step: 'Discover',
    title: 'Data Lake Catalog',
    icon: 'website',
    text: 'Search the open data portals your server can reach, such as city data sites, all from one box. A download lands in your Data Catalog.',
    link: { url: '/data-lakes/', label: 'Data lakes' },
  },
  {
    id: 'data',
    step: 'Load',
    title: 'Data Catalog',
    icon: 'data',
    text: 'The datasets your dataflows read: examples, files you import, portal downloads and the outputs your nodes save. Drag one onto the canvas and Curio writes the code that loads it.',
    link: { url: '/data-catalog/', label: 'Data Catalog' },
  },
  {
    id: 'nodes',
    step: 'Compute',
    title: 'Node Catalog',
    icon: 'package',
    text: 'Packages of nodes that transform, analyze and visualize data, with the Python and JavaScript libraries they need. Add one to a project and drag its nodes onto the canvas.',
    link: { url: '/node-catalog/', label: 'Nodes and packages' },
  },
]

// The agents above each stage: the Dataset Finder spans the first two, the builders sit over the third.
const FINDER = { name: 'Dataset Finder', text: 'searches the portals and your datasets' }
const BUILDERS = [
  { name: 'Node Builder', text: "writes a node's code" },
  { name: 'Package Recommendation', text: 'suggests packages to add' },
]

interface Box {
  l: number
  t: number
  r: number
  b: number
  cx: number
  cy: number
}

interface Wire {
  d: string
  kind: 'data' | 'agent'
  end?: 'arrow' | 'dot'
}

const root = ref<HTMLElement>()
const wires = ref<Wire[]>([])
let resize: ResizeObserver | undefined
let frame = 0

const px = (n: number) => Math.round(n * 10) / 10
// A vertical S curve from one point down to another.
const drop = (x0: number, y0: number, x1: number, y1: number) => {
  const m = (y0 + y1) / 2
  return `M${px(x0)} ${px(y0)} C${px(x0)} ${px(m)} ${px(x1)} ${px(m)} ${px(x1)} ${px(y1)}`
}

// Every element with a data-wire name, in the root's coordinates.
function measure(el: HTMLElement): Record<string, Box> {
  const o = el.getBoundingClientRect()
  const boxes: Record<string, Box> = {}
  for (const node of el.querySelectorAll<HTMLElement>('[data-wire]')) {
    const r = node.getBoundingClientRect()
    const l = r.left - o.left
    const t = r.top - o.top
    boxes[node.dataset.wire!] = { l, t, r: l + r.width, b: t + r.height, cx: l + r.width / 2, cy: t + r.height / 2 }
  }
  return boxes
}

function route() {
  frame = 0
  if (!root.value) return
  const { agents, finder, builders, lake, data, nodes, curio } = measure(root.value)
  const stages = [lake, data, nodes]
  const wide = Math.abs(lake.t - data.t) < 2
  const out: Wire[] = []
  for (const [a, b] of [
    [lake, data],
    [data, nodes],
  ]) {
    const d = wide ? `M${px(a.r)} ${px(a.cy)} H${px(b.l)}` : `M${px(a.cx)} ${px(a.b)} V${px(b.t)}`
    out.push({ kind: 'data', d, end: 'arrow' })
  }
  if (wide) {
    // Each stage feeds Curio; the agents drop into the stages under them.
    for (const s of stages) out.push({ kind: 'data', d: drop(s.cx, s.b, curio.cx + (s.cx - curio.cx) * 0.2, curio.t), end: 'arrow' })
    out.push({ kind: 'agent', d: drop(finder.cx, finder.b, lake.cx, lake.t), end: 'dot' })
    out.push({ kind: 'agent', d: drop(finder.cx, finder.b, data.cx, data.t), end: 'dot' })
    out.push({ kind: 'agent', d: drop(builders.cx, builders.b, nodes.cx, nodes.t), end: 'dot' })
  } else {
    // Stacked: the last stage feeds Curio, and one rail down the left side branches into every stage.
    out.push({ kind: 'data', d: `M${px(nodes.cx)} ${px(nodes.b)} V${px(curio.t)}`, end: 'arrow' })
    const x = lake.l - 14
    out.push({ kind: 'agent', d: `M${px(x)} ${px(agents.b + 8)} V${px(nodes.t + 32)}` })
    for (const s of stages) out.push({ kind: 'agent', d: `M${px(x)} ${px(s.t + 32)} H${px(s.l)}`, end: 'dot' })
  }
  wires.value = out
}

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(route)
}

// The illustration: a small dataflow whose map is hexagonal cells shaded by a made-up heat value, binned into
// five classes that the bar chart counts. Pointing at a bar or a cell lights up its class in both views, as
// linked views do in Curio; left alone, the lit class steps through the five.
const HEX = 8
const MAP = { x: 272, y: 38, w: 152, h: 122 }
const COLS = 10
const ROWS = 9
const BINS = 5
const SHADE = [0.22, 0.4, 0.58, 0.77, 0.96]

function heat(u: number, v: number) {
  const core = 0.8 * Math.exp(-((u - 0.62) ** 2 + (v - 0.4) ** 2) / 0.12)
  const second = 0.5 * Math.exp(-((u - 0.27) ** 2 + (v - 0.68) ** 2) / 0.06)
  const noise = 0.1 * Math.sin(u * 17.3 + v * 9.1) * Math.cos(v * 13.7 - u * 5.3)
  return Math.min(0.999, Math.max(0, core + second + noise + 0.1))
}

const CELLS = (() => {
  const w = Math.sqrt(3) * HEX
  const x0 = MAP.x + (MAP.w - (COLS * w + w / 2)) / 2 + w / 2
  const y0 = MAP.y + (MAP.h - ((ROWS - 1) * 1.5 * HEX + 2 * HEX)) / 2 + HEX
  const cells: { points: string; bin: number }[] = []
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cx = x0 + col * w + (row % 2) * (w / 2)
      const cy = y0 + row * 1.5 * HEX
      const u = (cx - MAP.x) / MAP.w
      const v = (cy - MAP.y) / MAP.h
      // An irregular outline, like a city's, instead of a rectangle.
      const du = u - 0.5
      const dv = v - 0.5
      if ((du / 0.54) ** 2 + (dv / 0.52) ** 2 > 1 + 0.16 * Math.sin(3 * Math.atan2(dv, du) + 0.5)) continue
      const points = Array.from({ length: 6 }, (_, k) => {
        const a = (Math.PI / 3) * k - Math.PI / 2
        return `${px(cx + (HEX - 0.8) * Math.cos(a))},${px(cy + (HEX - 0.8) * Math.sin(a))}`
      }).join(' ')
      cells.push({ points, bin: Math.min(BINS - 1, Math.floor(heat(u, v) * BINS)) })
    }
  }
  return cells
})()

const BARS = (() => {
  const counts = Array.from({ length: BINS }, (_, i) => CELLS.filter((c) => c.bin === i).length)
  const max = Math.max(...counts)
  return counts.map((n, i) => {
    const h = px(Math.max(4, (n / max) * 60))
    return { bin: i, x: 278 + i * 30, y: 280 - h, h }
  })
})()

const NODES = [
  { label: 'Load', x: 10, y: 104, w: 96, h: 84 },
  { label: 'Transform', x: 134, y: 104, w: 96, h: 84 },
  { label: 'Map', x: 266, y: 10, w: 164, h: 156 },
  { label: 'Chart', x: 266, y: 184, w: 164, h: 106 },
]
const head = (n: (typeof NODES)[number]) =>
  `M${n.x} ${n.y + 22} V${n.y + 8} a8 8 0 0 1 8 -8 H${n.x + n.w - 8} a8 8 0 0 1 8 8 V${n.y + 22} Z`

const active = ref(3)
const pointing = ref(false)
const canvas = ref<HTMLElement>()
let visible: IntersectionObserver | undefined
let timer: ReturnType<typeof setInterval> | undefined

function point(bin: number) {
  active.value = bin
  pointing.value = true
}

onMounted(() => {
  const el = root.value!
  resize = new ResizeObserver(schedule)
  resize.observe(el)
  for (const node of el.querySelectorAll('[data-wire]')) resize.observe(node)
  document.fonts?.ready.then(schedule)
  route()

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  visible = new IntersectionObserver(([entry]) => {
    clearInterval(timer)
    timer = entry.isIntersecting
      ? setInterval(() => {
          if (!pointing.value) active.value = (active.value + 1) % BINS
        }, 2200)
      : undefined
  })
  visible.observe(canvas.value!)
})

onBeforeUnmount(() => {
  resize?.disconnect()
  visible?.disconnect()
  clearInterval(timer)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <section id="how-it-works" class="curio-flow-section" aria-labelledby="how-it-works-title">
    <div class="curio-flow-container">
      <h2 id="how-it-works-title">Four catalogs, one dataflow</h2>
      <p class="curio-flow-lead">
        Find a dataset, load it and compute with it, with AI agents helping at every stage. Curio composes the pieces
        into an analysis.
      </p>

      <div ref="root" class="curio-flow">
        <div class="curio-flow-band">
          <div class="curio-flow-band-head">
            <span class="curio-flow-tile is-agent"><Icon name="bot" /></span>
            <div>
              <p class="curio-flow-kicker is-agent">Every stage</p>
              <h3>Agent Catalog</h3>
              <p class="curio-flow-text">
                AI agents you attach to a node, a connection or the whole canvas. They find datasets, write node code
                and plan whole dataflows, and nothing changes until you apply what they propose.
              </p>
              <a class="curio-flow-link is-agent" :href="withBase('/ai-agents/')">AI agents <Icon name="arrow" /></a>
            </div>
          </div>

          <ul class="curio-flow-agents" data-wire="agents" aria-label="Agents at each stage">
            <li>
              <span class="curio-flow-chip" data-wire="finder">
                <Icon name="bot" />
                <span><strong>{{ FINDER.name }}</strong> <small>{{ FINDER.text }}</small></span>
              </span>
            </li>
            <li>
              <span class="curio-flow-chips" data-wire="builders">
                <span v-for="a in BUILDERS" :key="a.name" class="curio-flow-chip">
                  <Icon name="bot" />
                  <span><strong>{{ a.name }}</strong> <small>{{ a.text }}</small></span>
                </span>
              </span>
            </li>
          </ul>

          <ol class="curio-flow-stages">
            <li v-for="(s, i) in STAGES" :key="s.id" class="curio-flow-card" :data-wire="s.id">
              <div class="curio-flow-card-top">
                <span class="curio-flow-tile"><Icon :name="s.icon" /></span>
                <p class="curio-flow-kicker"><span class="curio-flow-step">{{ i + 1 }}</span>{{ s.step }}</p>
              </div>
              <h3>{{ s.title }}</h3>
              <p class="curio-flow-text">{{ s.text }}</p>
              <a class="curio-flow-link" :href="withBase(s.link.url)">{{ s.link.label }} <Icon name="arrow" /></a>
            </li>
          </ol>
        </div>

        <div class="curio-flow-card curio-flow-curio" data-wire="curio">
          <div class="curio-flow-curio-text">
            <p class="curio-flow-kicker">
              <img class="curio-flow-logo is-light" :src="withBase('/media/brand/curio-logo.webp')" alt="" />
              <img class="curio-flow-logo is-dark" :src="withBase('/media/brand/curio-logo-dark.webp')" alt="" />
              Curio
            </p>
            <h3>Composes them into an analysis</h3>
            <p class="curio-flow-text">
              On the canvas, the datasets, nodes and agents you chose become one dataflow. Its maps and charts are
              linked, it runs again on new data, and its provenance records every change. The Dataflow Builder agent
              can plan one for you.
            </p>
            <div class="curio-flow-actions">
              <a class="curio-flow-button" :href="app" target="_blank" rel="noopener">Open Curio</a>
              <a class="curio-flow-link" :href="withBase('/dataflows/')">Dataflows <Icon name="arrow" /></a>
            </div>
          </div>

          <figure ref="canvas" class="curio-flow-canvas" @pointerleave="pointing = false">
            <svg viewBox="0 0 440 300" role="img" aria-labelledby="curio-flow-canvas-title">
              <title id="curio-flow-canvas-title">
                A small dataflow: a Load node feeds a Transform node, which has an agent attached and feeds a map and a
                bar chart that are linked to each other.
              </title>
              <path class="curio-flow-wire is-data" d="M106 146 H134" />
              <path class="curio-flow-wire is-data" d="M230 146 C248 146 248 88 266 88" />
              <path class="curio-flow-wire is-data" d="M230 146 C248 146 248 237 266 237" />
              <path class="curio-flow-wire is-agent" d="M182 188 V202" />

              <g v-for="n in NODES" :key="n.label">
                <rect class="curio-flow-node" :x="n.x" :y="n.y" :width="n.w" :height="n.h" rx="8" />
                <path class="curio-flow-node-head" :d="head(n)" />
                <rect class="curio-flow-node-edge" :x="n.x" :y="n.y" :width="n.w" :height="n.h" rx="8" />
                <text class="curio-flow-node-label" :x="n.x + 10" :y="n.y + 15">{{ n.label }}</text>
              </g>

              <g class="curio-flow-table">
                <template v-for="row in 4" :key="row">
                  <rect
                    v-for="col in 3"
                    :key="col"
                    :class="{ 'is-head': row === 1 }"
                    :x="20 + (col - 1) * 27"
                    :y="121 + row * 13"
                    width="22"
                    height="9"
                    rx="2"
                  />
                </template>
              </g>

              <g class="curio-flow-code">
                <template v-for="(w, i) in [40, 56, 30, 48]" :key="i">
                  <rect class="is-key" :x="144 + (i % 3 ? 10 : 0)" :y="134 + i * 12" width="14" height="5" rx="2.5" />
                  <rect :x="162 + (i % 3 ? 10 : 0)" :y="134 + i * 12" :width="w - 14" height="5" rx="2.5" />
                </template>
              </g>

              <g class="curio-flow-badge">
                <circle cx="182" cy="214" r="12" />
                <g transform="translate(174 206) scale(0.667)">
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
                </g>
              </g>

              <g class="curio-flow-map">
                <polygon
                  v-for="(c, i) in CELLS"
                  :key="i"
                  :points="c.points"
                  :fill-opacity="SHADE[c.bin]"
                  :class="c.bin === active ? 'is-on' : 'is-dim'"
                  @pointerenter="point(c.bin)"
                />
              </g>

              <g class="curio-flow-bars">
                <line x1="274" x2="422" y1="280.5" y2="280.5" />
                <g v-for="b in BARS" :key="b.bin" @pointerenter="point(b.bin)">
                  <rect
                    :x="b.x"
                    :y="b.y"
                    width="20"
                    :height="b.h"
                    rx="2"
                    :fill-opacity="SHADE[b.bin]"
                    :class="b.bin === active ? 'is-on' : 'is-dim'"
                  />
                  <rect class="curio-flow-bar-hit" :x="b.x - 5" y="210" width="30" height="72" />
                </g>
              </g>

              <circle v-for="(p, i) in [[106, 146], [134, 146], [230, 146], [266, 88], [266, 237]]" :key="i" class="curio-flow-port" :cx="p[0]" :cy="p[1]" r="3.5" />
            </svg>
            <figcaption>Point at a bar or a cell: the map and the chart are linked.</figcaption>
          </figure>
        </div>

        <svg class="curio-flow-wires" aria-hidden="true">
          <defs>
            <marker id="curio-flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto">
              <path class="curio-flow-arrowhead" d="M1 1.5 L9 5 L1 8.5 Z" />
            </marker>
            <marker id="curio-flow-dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse">
              <circle class="curio-flow-dothead" cx="5" cy="5" r="3.5" />
            </marker>
          </defs>
          <path
            v-for="(w, i) in wires"
            :key="i"
            class="curio-flow-wire"
            :class="`is-${w.kind}`"
            :d="w.d"
            :marker-end="w.end ? `url(#curio-flow-${w.end})` : undefined"
          />
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* The same column as the hero, the use cases and the topic grid. */
.curio-flow-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 640px) {
  .curio-flow-container {
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .curio-flow-container {
    padding: 0 64px;
  }
}

.curio-flow-section {
  margin: 8px 0 64px;
  scroll-margin-top: var(--vp-nav-height);
}

.curio-flow-section h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.curio-flow-lead {
  max-width: 62ch;
  margin: 8px 0 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.curio-flow {
  position: relative;
  margin-top: 32px;
}

/* The Agent Catalog is a band that holds the three stages, since its agents work in all of them. */
.curio-flow-band {
  padding: 20px 16px 24px;
  border: 1px solid color-mix(in srgb, var(--vp-c-purple-1) 28%, transparent);
  border-radius: 18px;
  background: var(--vp-c-purple-soft);
}

.curio-flow-band-head {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.curio-flow-band-head .curio-flow-text {
  max-width: 70ch;
}

.curio-flow-agents {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.curio-flow-chips {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
}

.curio-flow-chip {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid color-mix(in srgb, var(--vp-c-purple-1) 40%, transparent);
  border-radius: 10px;
  background: var(--vp-c-bg);
  font-size: 0.85rem;
  line-height: 1.35;
}

.curio-flow-chip :deep(svg) {
  flex: none;
  width: 16px;
  height: 16px;
  margin-top: 1px;
  color: var(--vp-c-purple-1);
}

.curio-flow-chip strong {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.curio-flow-chip small {
  font-size: inherit;
  color: var(--vp-c-text-2);
}

.curio-flow-stages {
  display: grid;
  gap: 40px;
  margin: 28px 0 0;
  padding: 0 0 0 28px;
  list-style: none;
}

.curio-flow-card {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 22px 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--curio-radius);
  background: var(--vp-c-bg);
  box-shadow: var(--curio-shadow);
}

.curio-flow-card-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.curio-flow-tile {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.curio-flow-tile.is-agent {
  background: var(--vp-c-bg);
  color: var(--vp-c-purple-1);
}

.curio-flow-tile :deep(svg) {
  width: 22px;
  height: 22px;
}

.curio-flow-kicker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.curio-flow-kicker.is-agent {
  color: var(--vp-c-purple-1);
}

.curio-flow-step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  font-size: 0.72rem;
  letter-spacing: 0;
}

.curio-flow h3 {
  margin: 4px 0 0;
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}

.curio-flow-text {
  margin: 8px 0 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

.curio-flow-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.curio-flow-card .curio-flow-link {
  align-self: flex-start;
  margin-top: auto;
  padding-top: 14px;
}

.curio-flow-link.is-agent {
  color: var(--vp-c-purple-1);
}

.curio-flow-link:hover {
  text-decoration: underline;
}

.curio-flow-link :deep(svg) {
  width: 16px;
  height: 16px;
}

/* Curio, under the band, where every stage's wire ends. */
.curio-flow-curio {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
  align-items: center;
  margin-top: 40px;
  border: 2px solid color-mix(in srgb, var(--curio-orange) 45%, transparent);
  border-radius: 18px;
}

.curio-flow-logo {
  width: auto;
  height: 22px;
}

.curio-flow-logo.is-dark,
.dark .curio-flow-logo.is-light {
  display: none;
}

.dark .curio-flow-logo.is-dark {
  display: inline;
}

.curio-flow-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 20px;
  margin-top: 18px;
}

.curio-flow-actions .curio-flow-link {
  margin-top: 0;
}

.curio-flow-button {
  display: inline-block;
  padding: 0 20px;
  border: 1px solid var(--vp-button-brand-border);
  border-radius: 20px;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 38px;
  text-decoration: none;
  transition: background-color 0.25s;
}

.curio-flow-button:hover {
  border-color: var(--vp-button-brand-hover-border);
  background: var(--vp-button-brand-hover-bg);
  color: var(--vp-button-brand-hover-text);
}

/* A dotted canvas, like Curio's own. */
.curio-flow-canvas {
  margin: 0;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--curio-radius);
  background:
    radial-gradient(circle, var(--vp-c-divider) 1px, transparent 1.5px) 0 0 / 18px 18px,
    var(--vp-c-bg-soft);
}

.curio-flow-canvas svg {
  display: block;
  width: 100%;
  max-width: 520px;
  height: auto;
  margin: 0 auto;
  font-family: inherit;
}

.curio-flow-canvas figcaption {
  margin-top: 8px;
  font-size: 0.8rem;
  line-height: 1.5;
  text-align: center;
  color: var(--vp-c-text-2);
}

.curio-flow-node {
  fill: var(--vp-c-bg);
}

.curio-flow-node-head {
  fill: var(--vp-c-default-soft);
}

.curio-flow-node-edge {
  fill: none;
  stroke: var(--vp-c-divider);
}

.curio-flow-node-label {
  font-size: 11.5px;
  font-weight: 600;
  fill: var(--vp-c-text-2);
}

.curio-flow-table rect {
  fill: var(--vp-c-default-soft);
}

.curio-flow-table rect.is-head,
.curio-flow-code rect {
  fill: var(--vp-c-text-3);
  opacity: 0.45;
}

.curio-flow-code rect.is-key {
  fill: var(--curio-orange);
  opacity: 1;
}

.curio-flow-badge circle {
  fill: var(--vp-c-bg);
  stroke: var(--vp-c-purple-1);
  stroke-width: 1.5;
}

.curio-flow-badge g {
  fill: none;
  stroke: var(--vp-c-purple-1);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.curio-flow-map polygon,
.curio-flow-bars rect {
  fill: var(--curio-orange);
  transition: opacity 0.35s;
}

.curio-flow-map polygon.is-on {
  stroke: var(--vp-c-text-1);
  stroke-width: 1.2;
}

.curio-flow-map .is-dim,
.curio-flow-bars .is-dim {
  opacity: 0.4;
}

.curio-flow-bars rect.curio-flow-bar-hit {
  fill: transparent;
}

.curio-flow-bars line {
  stroke: var(--vp-c-divider);
}

.curio-flow-port {
  fill: var(--vp-c-bg);
  stroke: var(--curio-orange);
  stroke-width: 1.5;
}

/* The wires between the cards, drawn over the band and under the cards. */
.curio-flow-wires {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.curio-flow-wire {
  fill: none;
  stroke-linecap: round;
}

.curio-flow-wire.is-data {
  stroke: var(--curio-orange);
  stroke-width: 2.5;
  stroke-dasharray: 7 6;
  animation: curio-flow-data 1.6s linear infinite;
}

.curio-flow-wire.is-agent {
  stroke: var(--vp-c-purple-1);
  stroke-width: 1.75;
  stroke-dasharray: 1 5;
  animation: curio-flow-agent 2.4s linear infinite;
}

.curio-flow-arrowhead {
  fill: var(--curio-orange);
}

.curio-flow-dothead {
  fill: var(--vp-c-purple-1);
}

@keyframes curio-flow-data {
  to {
    stroke-dashoffset: -13;
  }
}

@keyframes curio-flow-agent {
  to {
    stroke-dashoffset: -6;
  }
}

@media (min-width: 768px) {
  .curio-flow-curio {
    grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
    gap: 40px;
    padding: 28px 28px 28px 32px;
  }
}

/* Wide: the three stages side by side, each agent over the stages it helps. */
@media (min-width: 960px) {
  .curio-flow-band {
    padding: 28px 32px 32px;
  }

  .curio-flow-agents,
  .curio-flow-stages {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 56px;
  }

  .curio-flow-agents {
    margin-top: 24px;
  }

  /* Chips sit on the row's bottom edge, so every agent wire starts at the same height. */
  .curio-flow-agents > li {
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .curio-flow-agents > li:first-child {
    grid-column: 1 / 3;
  }

  .curio-flow-chips {
    justify-content: center;
  }

  .curio-flow-stages {
    margin-top: 44px;
    padding-left: 0;
  }

  .curio-flow-curio {
    margin-top: 64px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .curio-flow-wire {
    animation: none !important;
  }

  .curio-flow-map polygon,
  .curio-flow-bars rect,
  .curio-flow-button {
    transition: none;
  }
}
</style>
