<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

interface Page {
  title: string
  description: string
  group: string
  url: string
  card?: { poster: string; alt: string }
}

// The home page's map of the guide: one section per sidebar group, one card per page, from the same
// frontmatter that builds the sidebar.
const { theme } = useData()
const groups = computed(() => {
  const { groups, pages } = theme.value.guide as { groups: { id: string; title: string }[]; pages: Page[] }
  return groups.map((g) => ({ ...g, pages: pages.filter((p) => p.group === g.id) })).filter((g) => g.pages.length)
})
</script>

<template>
  <div class="curio-topics vp-raw">
    <section v-for="group in groups" :key="group.id" class="curio-topics-group">
      <h2 class="curio-topics-title">{{ group.title }}</h2>
      <ul class="curio-topics-grid">
        <li v-for="page in group.pages" :key="page.url">
          <a class="curio-topic" :href="withBase(page.url)">
            <img v-if="page.card" :src="withBase(page.card.poster)" :alt="page.card.alt" loading="lazy" decoding="async" />
            <span v-else class="curio-topic-blank" aria-hidden="true">{{ page.title.charAt(0) }}</span>
            <span class="curio-topic-text">
              <strong>{{ page.title }}</strong>
              <small>{{ page.description }}</small>
            </span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.curio-topics {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 16px 0 24px;
}

.curio-topics-title {
  margin: 0 0 16px;
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}

.curio-topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.curio-topic {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--curio-radius);
  overflow: hidden;
  background: var(--vp-c-bg);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.curio-topic:hover,
.curio-topic:focus-visible {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--curio-shadow);
  transform: translateY(-2px);
}

.curio-topic img,
.curio-topic-blank {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.curio-topic-blank {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.curio-topic-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px 16px;
}

.curio-topic-text strong {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--vp-c-text-1);
}

.curio-topic-text small {
  font-size: 0.86rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

@media (prefers-reduced-motion: reduce) {
  .curio-topic {
    transition: none;
  }
}
</style>
