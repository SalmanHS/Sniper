<template>
  <div :class="{ 'dark': isDark }" class="min-h-screen bg-bg-primary text-text-primary flex flex-col">
    <AppHeader />
    <main class="container mx-auto px-4 py-6 flex-1">
      <slot />
    </main>
    <AppFooter />
    <AppNotifications />
  </div>
</template>

<script setup lang="ts">
const { isDark } = useDarkMode()

useHead({
  htmlAttrs: {
    class: () => isDark.value ? 'dark' : ''
  }
})
</script>
