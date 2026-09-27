import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import './styles/vars.css'
import './styles/base.css'
import GoDeeper from './components/GoDeeper.vue'
import GuideFigure from './components/GuideFigure.vue'
import LoopVideo from './components/LoopVideo.vue'
import MediaTodo from './components/MediaTodo.vue'
import SiteFooter from './components/SiteFooter.vue'
import TopicGrid from './components/TopicGrid.vue'
import TryIt from './components/TryIt.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(GoDeeper),
      'layout-bottom': () => h(SiteFooter),
    })
  },
  enhanceApp({ app }) {
    // Components used from Markdown pages.
    app.component('GuideFigure', GuideFigure)
    app.component('LoopVideo', LoopVideo)
    app.component('MediaTodo', MediaTodo)
    app.component('TopicGrid', TopicGrid)
    app.component('TryIt', TryIt)
  },
} satisfies Theme
