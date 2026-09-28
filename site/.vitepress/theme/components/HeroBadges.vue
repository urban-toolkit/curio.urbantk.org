<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

interface Badge {
  alt: string
  href: string
  src: string
}

// Under the home page hero's buttons, like the badges at the top of the curio README (theme/node/badges.ts).
const { theme } = useData()
const badges = computed(() =>
  (theme.value.guide.badges as Badge[]).map((b) => {
    const external = /^https?:/.test(b.href)
    return { ...b, href: external ? b.href : withBase(b.href), external }
  }),
)
</script>

<template>
  <ul v-if="badges.length" class="curio-badges" aria-label="Curio links">
    <li v-for="badge in badges" :key="badge.src">
      <a :href="badge.href" :target="badge.external ? '_blank' : undefined" :rel="badge.external ? 'noopener' : undefined">
        <img :src="badge.src" :alt="badge.alt" height="28" decoding="async" />
      </a>
    </li>
  </ul>
</template>

<style scoped>
.curio-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 959px) {
  .curio-badges {
    justify-content: center;
  }
}

.curio-badges a {
  display: block;
  border-radius: 4px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.curio-badges a:hover,
.curio-badges a:focus-visible {
  box-shadow: var(--curio-shadow);
  transform: translateY(-1px);
}

.curio-badges img {
  display: block;
  height: 28px;
  width: auto;
}

@media (prefers-reduced-motion: reduce) {
  .curio-badges a {
    transition: none;
  }
}
</style>
