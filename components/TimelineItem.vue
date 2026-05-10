<template>
  <div class="timeline-item" :style="{ animationDelay: `${delay}s` }">
    <div class="timeline-card">
      <span class="timeline-date">{{ dateDisplay }}</span>
      <h3 class="timeline-title">{{ exp.title }}</h3>
      <p class="timeline-position">{{ exp.position }}</p>
      <p v-if="exp.description" class="timeline-description">{{ exp.description }}</p>
      <ul v-if="exp.highlights?.length" class="timeline-highlights">
        <li v-for="(h, i) in exp.highlights" :key="i">{{ h }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  exp: {
    title: string
    position: string
    start_date: string
    end_date?: string
    description?: string
    highlights?: string[]
  }
  delay?: number
}>()

const dateDisplay = computed(() => {
  if (!props.exp.end_date || props.exp.end_date === props.exp.start_date) {
    return props.exp.start_date
  }
  return `${props.exp.start_date} - ${props.exp.end_date}`
})
</script>
