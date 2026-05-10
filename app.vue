<template>
  <div>
    <div class="grid-overlay" />
    <div class="ambient-glow glow-1" />
    <div class="ambient-glow glow-2" />
    <div class="ambient-glow glow-3" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { theme, init } = useTheme()

useHead({
  htmlAttrs: { 'data-theme': theme },
})

onMounted(() => init())
</script>
