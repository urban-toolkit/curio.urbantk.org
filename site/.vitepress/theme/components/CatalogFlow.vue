<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import Icon from './Icon.vue'

// The home page's picture of how Curio's parts fit, above the use cases. The Agent Catalog is a band around
// everything, since its agents work at every stage; inside it the Discovery, Data, Model and Node catalogs take
// a dataset from a portal to computed results, and Curio composes them into an analysis, shown by a real
// screenshot. The cards are HTML so their text wraps; the wires between them are drawn over the measured cards,
// with the stages beside Curio on wide screens and above it on narrow ones.
const { theme } = useData()
const app = computed(() => theme.value.guide.app as string)

interface Agent {
  name: string
  text: string
}

const STAGES: { id: string; step: string; title: string; icon: string; text: string; url: string; agents: Agent[] }[] = [
  {
    id: 'discovery',
    step: 'Discover',
    title: 'Discovery Catalog',
    icon: 'website',
    text: 'Search open data portals, storage and services from one place, and bring datasets into your Data Catalog and models into your Model Catalog.',
    url: '/discovery/',
    agents: [
      { name: 'Dataset Finder', text: 'Finds datasets across the connected portals and proposes the download.' },
      { name: 'Node Researcher', text: 'Checks outside facts, such as dataset ids, API endpoints and schemas, on the web.' },
    ],
  },
  {
    id: 'data',
    step: 'Load',
    title: 'Data Catalog',
    icon: 'data',
    text: 'The datasets your dataflows read. Drag one onto the canvas and Curio writes the code that loads it.',
    url: '/data-catalog/',
    agents: [{ name: 'Dataset Finder', text: 'Picks a dataset from your Data Catalog for a loading node.' }],
  },
  {
    id: 'models',
    step: 'Infer',
    title: 'Model Catalog',
    icon: 'brain',
    text: 'Trained models a node runs over your data, such as image segmentation for street photos. Drag one onto the node.',
    url: '/model-catalog/',
    agents: [],
  },
  {
    id: 'nodes',
    step: 'Compute',
    title: 'Node Catalog',
    icon: 'package',
    text: 'Node packages that transform, analyze and visualize, with the libraries they need.',
    url: '/node-catalog/',
    agents: [
      { name: 'Node Builder', text: 'Creates a node, or changes one, as a proposal you review.' },
      { name: 'Node Content Builder', text: 'Writes the content of a node.' },
      { name: 'Package Recommendation', text: 'Recommends the node packages a task needs, and proposes installing them.' },
      { name: 'Package Builder', text: 'Writes a new node package, or extends one of yours.' },
    ],
  },
]

// The agents that work on the dataflow as a whole, shown with Curio.
const CANVAS_AGENTS: Agent[] = [
  { name: 'Dataflow Builder', text: 'Plans a whole dataflow from a goal, then fills in its nodes.' },
  { name: 'Connection Builder', text: 'Suggests and creates connections between nodes.' },
  { name: 'Researcher', text: 'Answers questions from the web as note nodes on the canvas.' },
  { name: 'Chat', text: 'Explains a node or the dataflow, diagnoses errors, and helps you decide what to build.' },
]

// The screenshot (scripts/media/clips.json, still "catalogs"), and the parts of it that get a highlight, in the
// image's own pixels: the tour writes where the nodes and badges were next to the still, and these are those
// boxes after the still's crop and resize. A label sits above a node, and beside an agent's badge on whichever
// side has empty canvas.
interface Mark {
  label: string
  kind: 'node' | 'agent'
  side?: 'left' | 'right'
  x: number
  y: number
  w: number
  h: number
}
const SHOT: { src: string; alt: string; w: number; h: number; marks: Mark[] } = {
  src: '/media/home/catalogs.webp',
  alt: "A dataflow in Curio: a Data Loading node and a Data Transformation node feed an Autark map and a Vega-Lite bar chart of downtown Chicago's ZIP codes, with agents attached to every node, to a connection and to the canvas.",
  w: 1600,
  h: 914,
  marks: [
    { label: 'Load', kind: 'node', x: 163, y: 368, w: 413, h: 276 },
    { label: 'Transform', kind: 'node', x: 667, y: 368, w: 413, h: 276 },
    { label: 'Map', kind: 'node', x: 1171, y: 164, w: 413, h: 276 },
    { label: 'Chart', kind: 'node', x: 1171, y: 573, w: 413, h: 276 },
    { label: 'Dataset Finder', kind: 'agent', side: 'right', x: 160, y: 646, w: 30, h: 30 },
    { label: 'Node Builder', kind: 'agent', side: 'right', x: 664, y: 646, w: 30, h: 30 },
    { label: 'Chat', kind: 'agent', side: 'right', x: 1168, y: 441, w: 30, h: 30 },
    { label: 'Connection Builder', kind: 'agent', side: 'left', x: 1110, y: 593, w: 30, h: 30 },
    { label: 'Package Recommendation', kind: 'agent', side: 'left', x: 1168, y: 851, w: 30, h: 30 },
    { label: 'Canvas agents', kind: 'agent', side: 'right', x: 831, y: 6, w: 102, h: 33 },
  ],
}
const pct = (n: number, of: number) => `${Math.round((n / of) * 10000) / 100}%`

interface Box {
  l: number
  t: number
  r: number
  b: number
  cx: number
  cy: number
}

const root = ref<HTMLElement>()
const wires = ref<string[]>([])
let resize: ResizeObserver | undefined
let frame = 0

const px = (n: number) => Math.round(n * 10) / 10

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
  const boxes = measure(root.value)
  const stages = STAGES.map((s) => boxes[s.id])
  const curio = boxes.curio
  const last = stages[stages.length - 1]
  if (!curio || stages.some((s) => !s)) return
  const out: string[] = []
  // Down the stages, one into the next.
  for (let i = 1; i < stages.length; i++) {
    const [a, b] = [stages[i - 1], stages[i]]
    out.push(`M${px(a.cx)} ${px(a.b)} V${px(b.t)}`)
  }
  if (curio.l > last.r) {
    // Wide: every stage feeds Curio, beside them, through a curve that lands spread along its left edge.
    for (const s of stages) {
      const y = curio.cy + (s.cy - curio.cy) * 0.4
      const m = (s.r + curio.l) / 2
      out.push(`M${px(s.r)} ${px(s.cy)} C${px(m)} ${px(s.cy)} ${px(m)} ${px(y)} ${px(curio.l)} ${px(y)}`)
    }
  } else {
    out.push(`M${px(last.cx)} ${px(last.b)} V${px(curio.t)}`)
  }
  wires.value = out
}

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(route)
}

onMounted(() => {
  const el = root.value!
  resize = new ResizeObserver(schedule)
  resize.observe(el)
  for (const node of el.querySelectorAll('[data-wire]')) resize.observe(node)
  document.fonts?.ready.then(schedule)
  route()
})

onBeforeUnmount(() => {
  resize?.disconnect()
  cancelAnimationFrame(frame)
})
</script>

<template>
  <section id="overview" class="curio-flow-section" aria-labelledby="overview-title">
    <div class="curio-flow-container">
      <h2 id="overview-title">Five catalogs, many dataflows</h2>
      <p class="curio-flow-lead">
        Find a dataset, load it, run models and compute with it, with AI agents at every stage. Curio composes the
        pieces into an analysis.
      </p>

      <div ref="root" class="curio-flow">
        <div class="curio-flow-band-head">
          <span class="curio-flow-tile is-agent"><Icon name="bot" /></span>
          <div>
            <h3>Agent Catalog <span class="curio-flow-count">Every stage</span></h3>
            <p class="curio-flow-text">
              Ten AI agents you attach to a node, a connection or the whole canvas. Nothing changes until you apply
              what one proposes.
              <a class="curio-flow-link is-agent" :href="withBase('/ai-agents/')">AI agents <Icon name="arrow" /></a>
            </p>
          </div>
        </div>

        <div class="curio-flow-body">
          <ol class="curio-flow-stages">
            <li v-for="(s, i) in STAGES" :key="s.id" class="curio-flow-card" :data-wire="s.id">
              <span class="curio-flow-tile"><Icon :name="s.icon" /></span>
              <div>
                <p class="curio-flow-kicker"><span class="curio-flow-step">{{ i + 1 }}</span>{{ s.step }}</p>
                <h3>
                  <a :href="withBase(s.url)">{{ s.title }} <Icon name="arrow" /></a>
                </h3>
                <p class="curio-flow-text">{{ s.text }}</p>
                <ul v-if="s.agents.length" class="curio-flow-agents" :aria-label="`Agents for ${s.title}`">
                  <li v-for="a in s.agents" :key="a.name" class="curio-flow-chip" :title="a.text">
                    <Icon name="bot" />{{ a.name }}
                  </li>
                </ul>
              </div>
            </li>
          </ol>

          <div class="curio-flow-curio" data-wire="curio">
            <div class="curio-flow-curio-head">
              <div>
                <p class="curio-flow-kicker">
                  <img class="curio-flow-logo is-light" :src="withBase('/media/brand/curio-logo.webp')" alt="" />
                  <img class="curio-flow-logo is-dark" :src="withBase('/media/brand/curio-logo-dark.webp')" alt="" />
                  Curio
                </p>
                <h3>Composes them into an analysis</h3>
              </div>
              <div class="curio-flow-actions">
                <a class="curio-flow-button" :href="app" target="_blank" rel="noopener">Open Curio</a>
                <a class="curio-flow-link" :href="withBase('/dataflows/')">Dataflows <Icon name="arrow" /></a>
              </div>
            </div>

            <!-- Clicking the screenshot opens it full size, as GuideFigure does. -->
            <figure class="curio-flow-shot">
              <a :href="withBase(SHOT.src)" target="_blank" rel="noopener">
                <img :src="withBase(SHOT.src)" :alt="SHOT.alt" :width="SHOT.w" :height="SHOT.h" loading="lazy" decoding="async" />
              </a>
              <span
                v-for="m in SHOT.marks"
                :key="m.label"
                class="curio-flow-mark"
                :class="[`is-${m.kind}`, m.side && `is-${m.side}`]"
                :style="{ left: pct(m.x, SHOT.w), top: pct(m.y, SHOT.h), width: pct(m.w, SHOT.w), height: pct(m.h, SHOT.h) }"
                aria-hidden="true"
              >
                <span>{{ m.label }}</span>
              </span>
            </figure>

            <ul class="curio-flow-agents" aria-label="Agents for the whole dataflow">
              <li v-for="a in CANVAS_AGENTS" :key="a.name" class="curio-flow-chip" :title="a.text">
                <Icon name="bot" />{{ a.name }}
              </li>
            </ul>
          </div>
        </div>

        <p class="curio-flow-helpers">
          Behind them, three helpers do part of the work and are never attached: the Dataflow Planner, the Dataflow
          Reader and the Generated Content Evaluator.
        </p>

        <svg class="curio-flow-wires" aria-hidden="true">
          <defs>
            <marker id="curio-flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto">
              <path class="curio-flow-arrowhead" d="M1 1.5 L9 5 L1 8.5 Z" />
            </marker>
          </defs>
          <path v-for="(d, i) in wires" :key="i" class="curio-flow-wire" :d="d" marker-end="url(#curio-flow-arrow)" />
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
  margin: 32px 0 8px;
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
  max-width: 70ch;
  margin: 8px 0 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

/* The Agent Catalog is the band around everything, since its agents work at every stage. */
.curio-flow {
  position: relative;
  margin-top: 24px;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--vp-c-purple-1) 28%, transparent);
  border-radius: 18px;
  background: var(--vp-c-purple-soft);
}

.curio-flow-band-head {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.curio-flow-band-head h3 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  margin: 0;
}

.curio-flow-count {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-purple-1);
}

.curio-flow-band-head .curio-flow-text {
  margin-top: 2px;
}

.curio-flow-band-head .curio-flow-link {
  margin-left: 6px;
}

.curio-flow-body {
  display: grid;
  gap: 32px;
  margin-top: 16px;
}

.curio-flow-stages {
  display: grid;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.curio-flow-card,
.curio-flow-curio {
  position: relative;
  z-index: 1;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--curio-radius);
  background: var(--vp-c-bg);
  box-shadow: var(--curio-shadow);
}

.curio-flow-card {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 14px;
  padding: 14px 16px;
}

.curio-flow-tile {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.curio-flow-tile.is-agent {
  background: var(--vp-c-bg);
  color: var(--vp-c-purple-1);
}

.curio-flow-tile :deep(svg) {
  width: 20px;
  height: 20px;
}

.curio-flow-kicker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.curio-flow-step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  font-size: 0.68rem;
  letter-spacing: 0;
}

.curio-flow h3 {
  margin: 2px 0 0;
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}

.curio-flow h3 a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: inherit;
  text-decoration: none;
}

.curio-flow h3 a:hover {
  color: var(--vp-c-brand-1);
}

.curio-flow h3 a :deep(svg) {
  width: 16px;
  height: 16px;
  color: var(--vp-c-brand-1);
}

.curio-flow-text {
  margin: 4px 0 0;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

.curio-flow-agents {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}

.curio-flow-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px 3px 8px;
  border: 1px solid color-mix(in srgb, var(--vp-c-purple-1) 35%, transparent);
  border-radius: 999px;
  background: var(--vp-c-purple-soft);
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.curio-flow-chip :deep(svg) {
  flex: none;
  width: 14px;
  height: 14px;
  color: var(--vp-c-purple-1);
}

.curio-flow-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  white-space: nowrap;
}

.curio-flow-link.is-agent {
  color: var(--vp-c-purple-1);
}

.curio-flow-link:hover {
  text-decoration: underline;
}

.curio-flow-link :deep(svg) {
  width: 15px;
  height: 15px;
}

/* Curio, where every stage's wire ends: a real dataflow, with its parts highlighted. */
.curio-flow-curio {
  padding: 16px;
  border: 2px solid color-mix(in srgb, var(--curio-orange) 45%, transparent);
}

.curio-flow-curio-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 24px;
}

.curio-flow-logo {
  width: auto;
  height: 20px;
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
  gap: 8px 18px;
}

.curio-flow-button {
  display: inline-block;
  padding: 0 18px;
  border: 1px solid var(--vp-button-brand-border);
  border-radius: 20px;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 34px;
  text-decoration: none;
  transition: background-color 0.25s;
}

.curio-flow-button:hover {
  border-color: var(--vp-button-brand-hover-border);
  background: var(--vp-button-brand-hover-bg);
  color: var(--vp-button-brand-hover-text);
}

.curio-flow-shot {
  position: relative;
  margin: 14px 0 0;
  container-type: inline-size;
}

.curio-flow-shot a {
  display: block;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--curio-radius-sm);
  overflow: hidden;
}

.curio-flow-shot a:hover {
  border-color: var(--vp-c-brand-1);
}

.curio-flow-shot img {
  display: block;
  width: 100%;
  height: auto;
}

/* A highlight is drawn a few pixels outside the box it marks, so the node's own border stays visible. */
.curio-flow-mark {
  position: absolute;
  pointer-events: none;
}

.curio-flow-mark::before {
  content: '';
  position: absolute;
  inset: -3px;
  border: 2px solid var(--curio-orange);
  border-radius: 8px;
}

.curio-flow-mark.is-agent::before {
  inset: -2px;
  border-color: #6f42c1;
  border-radius: 999px;
}

.curio-flow-mark span {
  position: absolute;
  bottom: 100%;
  left: -3px;
  margin-bottom: 5px;
  padding: 0 7px;
  border-radius: 999px;
  background: var(--curio-orange);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1.6;
  white-space: nowrap;
}

/* The screenshot is of the light interface in both themes, so the agent colour is the light one. */
.curio-flow-mark.is-agent span {
  top: 50%;
  bottom: auto;
  margin: 0;
  background: #6f42c1;
  transform: translateY(-50%);
}

.curio-flow-mark.is-right span {
  left: 100%;
  margin-left: 6px;
}

.curio-flow-mark.is-left span {
  right: 100%;
  left: auto;
  margin-right: 6px;
}

/* Too narrow for every agent's name: the rings stay, the names go, and a node's name moves inside its box so
   it cannot run into the node above. */
@container (max-width: 520px) {
  .curio-flow-mark.is-agent span {
    display: none;
  }

  .curio-flow-mark span {
    top: 3px;
    bottom: auto;
    left: 3px;
    margin: 0;
    padding: 0 5px;
    font-size: 0.6rem;
  }
}

.curio-flow-helpers {
  margin: 14px 0 0;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
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
  stroke: var(--curio-orange);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 7 6;
  animation: curio-flow-data 1.6s linear infinite;
}

.curio-flow-arrowhead {
  fill: var(--curio-orange);
}

@keyframes curio-flow-data {
  to {
    stroke-dashoffset: -13;
  }
}

@media (min-width: 640px) {
  .curio-flow {
    padding: 20px 24px 18px;
  }
}

/* Wide: the stages in a column, with Curio beside them. */
@media (min-width: 960px) {
  .curio-flow-body {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: 56px;
    align-items: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .curio-flow-wire {
    animation: none;
  }

  .curio-flow-button {
    transition: none;
  }
}
</style>
