<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import FundingLine from './FundingLine.vue'

interface Badge {
  alt: string
  href: string
  src: string
}

interface Sponsor {
  name: string
  url: string
  logo: { light: string; dark?: string }
}

// Under the home page hero's buttons, like the badges at the top of the curio README (theme/node/badges.ts),
// then the funding line and the sponsors' logos.
const { theme } = useData()
const badges = computed(() =>
  (theme.value.guide.badges as Badge[]).map((b) => {
    const external = /^https?:/.test(b.href)
    return { ...b, href: external ? b.href : withBase(b.href), external }
  }),
)
const sponsors = computed(() => theme.value.guide.funding.sponsors as Sponsor[])
</script>

<template>
  <ul v-if="badges.length" class="curio-badges" aria-label="Curio links">
    <li v-for="badge in badges" :key="badge.src">
      <a :href="badge.href" :target="badge.external ? '_blank' : undefined" :rel="badge.external ? 'noopener' : undefined">
        <img :src="badge.src" :alt="badge.alt" height="28" decoding="async" />
      </a>
    </li>
  </ul>
  <FundingLine class="curio-hero-funding" />
  <ul class="curio-sponsors" aria-label="Sponsors">
    <li v-for="sponsor in sponsors" :key="sponsor.name">
      <a :href="sponsor.url" target="_blank" rel="noopener" :title="sponsor.name">
        <img :class="{ light: sponsor.logo.dark }" :src="withBase(sponsor.logo.light)" :alt="sponsor.name" height="32" decoding="async" />
        <img v-if="sponsor.logo.dark" class="dark" :src="withBase(sponsor.logo.dark)" :alt="sponsor.name" height="32" decoding="async" />
      </a>
    </li>
  </ul>
</template>

<style scoped>
.curio-badges,
.curio-sponsors {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.curio-hero-funding {
  margin: 16px 0 0;
}

.curio-sponsors {
  align-items: center;
  gap: 24px;
  margin-top: 12px;
}

.curio-sponsors a {
  display: block;
}

.curio-sponsors img {
  display: block;
  height: 32px;
  width: auto;
}

.dark .curio-sponsors img.light,
html:not(.dark) .curio-sponsors img.dark {
  display: none;
}

@media (max-width: 959px) {
  .curio-badges,
  .curio-sponsors {
    justify-content: center;
  }

  .curio-hero-funding {
    text-align: center;
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
