<template>
  <article class="contribution-card" :style="{ animationDelay: `${delay}s` }">
    <div class="contribution-card-header">
      <span class="contribution-category">{{ item.category || 'Project' }}</span>
      <span class="contribution-status" :class="statusClass">{{ item.status || 'Active' }}</span>
    </div>
    <h3 class="contribution-name">{{ item.name }}</h3>
    <p class="contribution-description">{{ item.description }}</p>
    <div class="contribution-tags">
      <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
    <div v-if="item.links" class="contribution-links">
      <a v-if="item.links.github" :href="item.links.github" class="contribution-link" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
        GitHub
      </a>
      <a v-if="item.links.demo" :href="item.links.demo" class="contribution-link" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        Live Demo
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: {
    name: string
    category?: string
    status?: string
    description?: string
    tags?: string[]
    links?: { github?: string; demo?: string }
  }
  delay?: number
}>()

const statusClass = computed(() =>
  props.item.status?.toLowerCase() === 'completed' ? 'completed' : 'active'
)
</script>
