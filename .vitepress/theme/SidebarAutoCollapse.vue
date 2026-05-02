<script setup lang="ts">
import { nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

function collapseInactiveSidebarGroups() {
  const sidebar = document.querySelector('.VPSidebar')
  if (!sidebar) return

  const groups = sidebar.querySelectorAll<HTMLElement>('.VPSidebarItem.collapsible')

  groups.forEach((group) => {
    const isActiveBranch =
      group.classList.contains('has-active') ||
      group.classList.contains('is-active')

    if (isActiveBranch || group.classList.contains('collapsed')) {
      return
    }

    const caret = group.querySelector<HTMLElement>(':scope > .item > .caret')
    caret?.click()
  })

  sidebar
    .querySelector<HTMLElement>('.VPSidebarItem.is-active > .item')
    ?.scrollIntoView({ block: 'nearest' })
}

async function syncSidebar() {
  await nextTick()
  requestAnimationFrame(() => {
    collapseInactiveSidebarGroups()
  })
}

onMounted(syncSidebar)
watch(() => route.path, syncSidebar)
</script>

<template />
