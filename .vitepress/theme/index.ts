// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import SectionHomeLayout from './SectionHomeLayout.vue'
import SidebarAutoCollapse from './SidebarAutoCollapse.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'layout-bottom': () => h(SidebarAutoCollapse)
    })
  },
  enhanceApp({ app }) {
    app.component('section-home', SectionHomeLayout)
  }
} satisfies Theme
