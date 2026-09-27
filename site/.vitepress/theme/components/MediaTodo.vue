<script setup lang="ts">
// A marked spot for a clip or screenshot that has not been recorded yet. It shows on the page so a review
// can see where media goes; scripts/check/dist.mjs counts what is left.
const props = defineProps<{ kind: 'clip' | 'still'; source: string; caption: string }>()
</script>

<template>
  <figure class="curio-figure curio-todo" data-media-todo>
    <div class="curio-todo-box">
      <strong>{{ props.kind === 'clip' ? 'Clip' : 'Screenshot' }} to record</strong>
      <code>{{ props.source }}</code>
    </div>
    <figcaption>{{ props.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.curio-todo-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  aspect-ratio: 16 / 9;
  padding: 16px;
  border: 2px dashed var(--vp-c-divider);
  border-radius: var(--curio-radius-sm);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  text-align: center;
}

.curio-todo-box code {
  font-size: 0.8rem;
}
</style>
