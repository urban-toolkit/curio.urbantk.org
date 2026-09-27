<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import Icon from './Icon.vue'

// A button that opens a page of the hosted app, such as <TryIt path="/catalog/data" />.
const props = withDefaults(defineProps<{ path?: string; label?: string }>(), { path: '/', label: 'Try it in Curio' })
const { theme } = useData()
const href = computed(() => `${theme.value.guide.app}${props.path}`)
</script>

<template>
  <p class="curio-tryit">
    <a class="curio-button curio-button--primary" :href="href" target="_blank" rel="noopener">
      {{ props.label }}
      <Icon name="external" />
    </a>
  </p>
</template>

<style scoped>
.curio-tryit {
  margin: 20px 0;
}
</style>
