<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import Icon from './Icon.vue'

// A short silent loop with its caption, adapted from urbantk.org. It never autoplays in the prerendered HTML:
// once the page has loaded it plays while at least half visible, unless the visitor prefers reduced motion.
// The pause control is always there.
const props = defineProps<{ src: string; poster?: string; caption: string; label?: string; w?: number; h?: number }>()
const label = props.label ?? props.caption

const video = ref<HTMLVideoElement>()
const playing = ref(false)
let userPaused = false
let observer: IntersectionObserver | undefined

async function play() {
  try {
    await video.value?.play()
    playing.value = true
  } catch {
    playing.value = false
  }
}

function pause() {
  video.value?.pause()
  playing.value = false
}

function toggle() {
  if (playing.value) {
    userPaused = true
    pause()
  } else {
    userPaused = false
    play()
  }
}

onMounted(() => {
  if (!video.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !userPaused) play()
      else if (!entry.isIntersecting) pause()
    },
    { threshold: 0.5 },
  )
  observer.observe(video.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <figure class="curio-figure">
    <div class="curio-loop">
      <video
        ref="video"
        :src="withBase(props.src)"
        :poster="props.poster ? withBase(props.poster) : undefined"
        :width="props.w"
        :height="props.h"
        :aria-label="label"
        muted
        loop
        playsinline
        preload="none"
      />
      <button type="button" class="curio-loop-toggle" :aria-label="playing ? `Pause: ${label}` : `Play: ${label}`" @click="toggle">
        <Icon :name="playing ? 'pause' : 'play'" />
      </button>
    </div>
    <figcaption>{{ props.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.curio-loop {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--curio-radius-sm);
  overflow: hidden;
  background: var(--vp-c-bg-alt);
}

.curio-loop-toggle {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  padding: 8px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.72);
  color: #fff;
}

.curio-loop-toggle :deep(svg) {
  width: 14px;
  height: 14px;
}
</style>
