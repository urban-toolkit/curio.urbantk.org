<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import Icon from './Icon.vue'

interface UseCase {
  title: string
  text: string
  image?: { src: string; alt: string }
  icon?: string
  inDevelopment: boolean
  doc?: { path: string; label: string }
}

// The home page's use cases (site/index.md, frontmatter `useCases`), one full-width band each, with the image
// on alternating sides. A case with no image yet shows a placeholder with its icon.
const { theme } = useData()
const cases = computed(() => theme.value.guide.useCases as UseCase[])
const docs = computed(() => theme.value.guide.docs as string)
</script>

<template>
  <section v-if="cases.length" id="use-cases" class="curio-cases" aria-labelledby="use-cases-title">
    <div class="curio-cases-container curio-cases-head">
      <h2 id="use-cases-title">Example use cases</h2>
      <p>Dataflows that bring a city's data, models and views together in one place.</p>
    </div>
    <article v-for="(c, i) in cases" :key="c.title" class="curio-case" :class="{ 'is-flipped': i % 2 === 1 }">
      <div class="curio-cases-container curio-case-inner">
        <div class="curio-case-media">
          <img v-if="c.image" :src="withBase(c.image.src)" :alt="c.image.alt" loading="lazy" decoding="async" />
          <div v-else-if="c.icon" class="curio-case-placeholder" role="img" :aria-label="`${c.title}: image coming soon`">
            <span class="curio-case-icon"><Icon :name="c.icon" /></span>
            <span class="curio-case-soon">Image coming soon</span>
          </div>
        </div>
        <div class="curio-case-text">
          <p class="curio-case-kicker">
            <span>Use case {{ i + 1 }}</span>
            <span v-if="c.inDevelopment" class="curio-case-status">In development</span>
          </p>
          <h3>{{ c.title }}</h3>
          <p class="curio-case-body">{{ c.text }}</p>
          <a v-if="c.doc" class="curio-case-link" :href="`${docs}${c.doc.path}`" target="_blank" rel="noopener">
            {{ c.doc.label }}
            <Icon name="arrow" />
          </a>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
/* The same column as the hero and the topic grid (VitePress's VPHomeHero and VPHomeContent). */
.curio-cases-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 640px) {
  .curio-cases-container {
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .curio-cases-container {
    padding: 0 64px;
  }
}

.curio-cases {
  margin: 32px 0 56px;
  scroll-margin-top: var(--vp-nav-height);
}

.curio-cases-head {
  padding-bottom: 8px;
}

.curio-cases-head h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.curio-cases-head p {
  margin: 8px 0 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

/* Each case spans the page; every other one sits on a tinted band. */
.curio-case {
  padding: 48px 0;
}

.curio-case.is-flipped {
  background: var(--vp-c-bg-soft);
}

.curio-case-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 28px;
  align-items: center;
}

@media (min-width: 768px) {
  .curio-case {
    padding: 72px 0;
  }

  .curio-case-inner {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 56px;
  }

  .curio-case.is-flipped .curio-case-inner {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  }

  .curio-case.is-flipped .curio-case-media {
    order: 2;
  }
}

.curio-case-media img,
.curio-case-placeholder {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--curio-radius);
  box-shadow: var(--curio-shadow);
}

.curio-case-media img {
  height: auto;
  object-fit: cover;
  background: var(--vp-c-bg-soft);
}

/* A dotted canvas, like Curio's own, with the case's icon in the middle. */
.curio-case-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background:
    radial-gradient(circle, var(--vp-c-divider) 1px, transparent 1.5px) 0 0 / 20px 20px,
    linear-gradient(135deg, var(--vp-c-brand-soft), transparent 70%),
    var(--vp-c-bg);
}

.curio-case-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.curio-case-icon :deep(svg) {
  width: 44px;
  height: 44px;
}

.curio-case-soon {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.curio-case-kicker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 0 0 10px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.curio-case-status {
  padding: 2px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
}

.curio-case-text h3 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}

.curio-case-body {
  margin: 14px 0 0;
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.curio-case-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 18px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.curio-case-link:hover {
  text-decoration: underline;
}

.curio-case-link :deep(svg) {
  width: 16px;
  height: 16px;
}
</style>
