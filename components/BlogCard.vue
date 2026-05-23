<template>
  <NuxtLink :to="post.url" class="blog-card" :style="{ animationDelay: `${delay}s` }">
    <div v-if="post.thumbnail" class="blog-card-image">
      <img :src="post.thumbnail" :alt="post.title" loading="lazy" />
    </div>
    <div class="blog-card-content">
      <div class="blog-meta">
        <span class="blog-date">{{ post.date }}</span>
        <span v-if="post.readTime" class="blog-read-time">{{ post.readTime }}</span>
      </div>
      <h3 class="blog-title">{{ post.title }}</h3>
      <p class="blog-excerpt">{{ post.excerpt }}</p>
      <span class="blog-link">
        Read more
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  post: {
    title: string
    excerpt?: string
    date: string
    readTime?: string
    thumbnail?: string
    url: string
  }
  delay?: number
}>()
</script>
