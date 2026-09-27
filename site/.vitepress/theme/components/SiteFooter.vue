<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

// The funding line and institution logos, as on urbantk.org (theme/components/SiteFooter.vue there).
const { theme } = useData()
const guide = computed(() => theme.value.guide)
const year = new Date().getFullYear()
</script>

<template>
  <footer class="curio-footer">
    <div class="curio-container curio-footer-inner">
      <p class="curio-footer-funding">
        {{ guide.funding.lead }}
        <template v-for="(sponsor, i) in guide.funding.sponsors" :key="sponsor.name">
          <strong>{{ sponsor.name }}</strong
          ><template v-if="sponsor.awards">
            (Awards
            <template v-for="(award, j) in sponsor.awards" :key="award.id">
              <a :href="award.url" target="_blank" rel="noopener">#{{ award.id }}</a
              ><template v-if="j < sponsor.awards.length - 2">, </template
              ><template v-else-if="j === sponsor.awards.length - 2">, and </template>
            </template>)</template
          ><template v-if="i < guide.funding.sponsors.length - 2">, </template
          ><template v-else-if="i === guide.funding.sponsors.length - 2">, and </template>
        </template>.
      </p>
      <div class="curio-footer-logos">
        <a v-for="inst in guide.institutions" :key="inst.name" :href="inst.url" target="_blank" rel="noopener" :aria-label="inst.name">
          <img :src="withBase(inst.logo)" :alt="inst.name" />
        </a>
      </div>
      <p class="curio-footer-meta">
        &copy; {{ year }} The Urban Toolkit &middot;
        <a :href="guide.urbantk" target="_blank" rel="noopener">urbantk.org</a> &middot;
        <a :href="guide.repo" target="_blank" rel="noopener">Curio on GitHub</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.curio-footer {
  margin-top: 32px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.curio-footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-top: 32px;
  padding-bottom: 32px;
  text-align: center;
}

.curio-footer-funding {
  max-width: 760px;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.curio-footer-funding strong {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.curio-footer a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.curio-footer a:hover {
  text-decoration-thickness: 2px;
}

.curio-footer-logos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 28px;
}

.curio-footer-logos a {
  display: inline-flex;
  align-items: center;
  height: 48px;
  text-decoration: none;
}

.curio-footer-logos img {
  max-height: 44px;
  max-width: 180px;
  object-fit: contain;
}

.dark .curio-footer-logos img {
  filter: invert(1);
}

.curio-footer-meta {
  margin: 0;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
}
</style>
