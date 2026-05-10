<template>
  <div class="page-header">
    <span class="section-label">{{ label }}</span>
    <h2 class="section-title">{{ title }}</h2>
    <p v-if="description" class="section-description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  title: string
  description?: string
}>()
</script>
