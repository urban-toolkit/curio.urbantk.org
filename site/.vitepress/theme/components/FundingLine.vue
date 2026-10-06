<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

// The funding sentence from SITE.funding, under the home page's badges and in the footer of the other pages.
const { theme } = useData()
const funding = computed(() => theme.value.guide.funding)
</script>

<template>
  <p class="curio-funding">
    {{ funding.lead }}
    <template v-for="(sponsor, i) in funding.sponsors" :key="sponsor.name">
      <strong>{{ sponsor.name }}</strong
      ><template v-if="sponsor.awards">
        (Awards
        <template v-for="(award, j) in sponsor.awards" :key="award.id">
          <a :href="award.url" target="_blank" rel="noopener">#{{ award.id }}</a
          ><template v-if="j < sponsor.awards.length - 2">, </template
          ><template v-else-if="j === sponsor.awards.length - 2">, and </template>
        </template>)</template
      ><template v-if="i < funding.sponsors.length - 2">, </template
      ><template v-else-if="i === funding.sponsors.length - 2">, and </template>
    </template>.
  </p>
</template>

<style scoped>
/* Each place that shows it sets its margins. */
.curio-funding {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.curio-funding strong {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.curio-funding a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.curio-funding a:hover {
  text-decoration-thickness: 2px;
}
</style>
