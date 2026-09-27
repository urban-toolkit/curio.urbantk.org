<script setup lang="ts">
import { withBase } from 'vitepress'

// A screenshot with its caption. Clicking it opens the full-size image.
const props = defineProps<{ src: string; alt: string; caption: string; w?: number; h?: number }>()
</script>

<template>
  <figure class="curio-figure">
    <a class="curio-figure-link" :href="withBase(props.src)" target="_blank" rel="noopener">
      <img :src="withBase(props.src)" :alt="props.alt" :width="props.w" :height="props.h" loading="lazy" decoding="async" />
    </a>
    <figcaption>{{ props.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.curio-figure-link {
  display: block;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--curio-radius-sm);
  overflow: hidden;
  background: var(--vp-c-bg-alt);
}

.curio-figure-link:hover {
  border-color: var(--vp-c-brand-1);
}
</style>
