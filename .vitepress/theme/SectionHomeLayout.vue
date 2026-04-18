<script setup lang="ts">
import { computed } from 'vue'
import { Content, useData, useRoute } from 'vitepress'
import { VPHomeFeatures, VPHomeHero } from 'vitepress/theme'
import VPDocAside from 'vitepress/dist/client/theme-default/components/VPDocAside.vue'
import VPDocFooter from 'vitepress/dist/client/theme-default/components/VPDocFooter.vue'
import { useSidebar } from 'vitepress/dist/client/theme-default/composables/sidebar.js'

const { theme, frontmatter } = useData()
const route = useRoute()
const { hasSidebar, hasAside, leftAside } = useSidebar()

const pageName = computed(() =>
  route.path.replace(/[./]+/g, '_').replace(/_html$/, '')
)

const pageClass = computed(() => [
  pageName.value,
  theme.value.externalLinkIcon && 'external-link-icon-enabled'
].filter(Boolean))

const hasSectionHero = computed(() => !!frontmatter.value.hero)
const hasSectionFeatures = computed(() => !!frontmatter.value.features)
</script>

<template>
  <div
    class="VPDoc SectionHomeLayout"
    :class="{
      'has-sidebar': hasSidebar,
      'has-aside': hasAside
    }"
  >
    <div class="container">
      <div v-if="hasAside" class="aside" :class="{ 'left-aside': leftAside }">
        <div class="aside-curtain" />
        <div class="aside-container">
          <div class="aside-content">
            <VPDocAside />
          </div>
        </div>
      </div>

      <div class="content">
        <div class="content-container">
          <section
            v-if="hasSectionHero || hasSectionFeatures"
            class="section-home-shell"
          >
            <div v-if="hasSectionHero" class="section-home-hero">
              <VPHomeHero />
            </div>
            <div v-if="hasSectionFeatures" class="section-home-features">
              <VPHomeFeatures />
            </div>
          </section>

          <main class="main">
            <Content class="vp-doc" :class="pageClass" />
          </main>

          <VPDocFooter />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.SectionHomeLayout {
  padding: 32px 24px 96px;
  width: 100%;
}

@media (min-width: 768px) {
  .SectionHomeLayout {
    padding: 48px 32px 128px;
  }
}

@media (min-width: 960px) {
  .SectionHomeLayout {
    padding: 48px 32px 0;
  }

  .SectionHomeLayout:not(.has-sidebar) .container {
    display: flex;
    justify-content: center;
    max-width: 992px;
  }

  .SectionHomeLayout:not(.has-sidebar) .content {
    max-width: 752px;
  }
}

@media (min-width: 1280px) {
  .SectionHomeLayout .container {
    display: flex;
    justify-content: center;
  }

  .SectionHomeLayout .aside {
    display: block;
  }
}

@media (min-width: 1440px) {
  .SectionHomeLayout:not(.has-sidebar) .content {
    max-width: 784px;
  }

  .SectionHomeLayout:not(.has-sidebar) .container {
    max-width: 1104px;
  }
}

.container {
  margin: 0 auto;
  width: 100%;
}

.aside {
  position: relative;
  display: none;
  order: 2;
  flex-grow: 1;
  padding-left: 32px;
  width: 100%;
  max-width: 256px;
}

.left-aside {
  order: 1;
  padding-left: unset;
  padding-right: 32px;
}

.aside-container {
  position: fixed;
  top: 0;
  padding-top: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 48px);
  width: 224px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.aside-container::-webkit-scrollbar {
  display: none;
}

.aside-curtain {
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 224px;
  height: 32px;
  background: linear-gradient(transparent, var(--vp-c-bg) 70%);
}

.aside-content {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - (var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 48px));
  padding-bottom: 32px;
}

.content {
  position: relative;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 960px) {
  .content {
    padding: 0 32px 128px;
  }
}

@media (min-width: 1280px) {
  .content {
    order: 1;
    margin: 0;
    min-width: 640px;
  }
}

.content-container {
  margin: 0 auto;
}

.SectionHomeLayout.has-aside .content-container {
  max-width: 688px;
}

.section-home-shell {
  margin-bottom: 56px;
}

.section-home-shell :deep(.VPHomeHero) {
  margin-bottom: 40px;
}

.section-home-shell :deep(.VPHero) {
  padding-top: 12px;
}

.section-home-shell :deep(.VPHomeFeatures) {
  padding: 0;
}

.section-home-shell :deep(.VPHomeFeatures .container) {
  max-width: none;
}

.section-home-shell :deep(.VPHomeFeatures .items) {
  margin: -10px;
}

.section-home-shell :deep(.VPHomeFeatures .item) {
  padding: 10px;
  width: 100%;
}

@media (min-width: 640px) {
  .section-home-shell :deep(.VPHomeFeatures .item) {
    width: 50% !important;
  }
}
</style>
