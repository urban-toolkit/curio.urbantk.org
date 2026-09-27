<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import Icon from './Icon.vue'

interface Deeper {
  doc: string
  anchor?: string
  label: string
}

// After each guide page: its links into the in-depth docs on GitHub (frontmatter `deeper`) and, when the
// page names one (frontmatter `app`), a button to the matching page of the hosted app.
const { frontmatter, theme } = useData()
const links = computed(() =>
  ((frontmatter.value.deeper ?? []) as Deeper[]).map((d) => ({
    label: d.label,
    path: d.anchor ? `${d.doc}#${d.anchor}` : d.doc,
    href: `${theme.value.guide.docs}${d.doc}${d.anchor ? `#${d.anchor}` : ''}`,
  })),
)
const app = computed(() => (frontmatter.value.app ? `${theme.value.guide.app}${frontmatter.value.app}` : null))
</script>

<template>
  <aside v-if="links.length || app" class="curio-deeper" aria-label="Go deeper">
    <template v-if="links.length">
      <h2 class="curio-deeper-title">Go deeper</h2>
      <p class="curio-deeper-lead">The in-depth documentation lives with the code on GitHub.</p>
      <ul>
        <li v-for="link in links" :key="link.href">
          <a :href="link.href" target="_blank" rel="noopener">
            <Icon name="docs" />
            <span>
              <strong>{{ link.label }}</strong>
              <small>{{ link.path }}</small>
            </span>
          </a>
        </li>
      </ul>
    </template>
    <a v-if="app" class="curio-button curio-button--primary curio-deeper-app" :href="app" target="_blank" rel="noopener">
      Try it in Curio
      <Icon name="external" />
    </a>
  </aside>
</template>

<style scoped>
.curio-deeper {
  margin-top: 48px;
  padding: 20px 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--curio-radius);
  background: var(--vp-c-bg-soft);
}

.curio-deeper-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.4;
}

.curio-deeper-lead {
  margin: 4px 0 12px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.curio-deeper ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.curio-deeper li a {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--curio-radius-sm);
  background: var(--vp-c-bg);
  color: inherit;
  text-decoration: none;
}

.curio-deeper li a:hover {
  border-color: var(--vp-c-brand-1);
}

.curio-deeper li :deep(svg) {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  flex: none;
  color: var(--vp-c-brand-1);
}

.curio-deeper li span {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.curio-deeper li strong {
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.curio-deeper li small {
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  overflow-wrap: anywhere;
}

.curio-deeper-app {
  margin-top: 16px;
}
</style>
