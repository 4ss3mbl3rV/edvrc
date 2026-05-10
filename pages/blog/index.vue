<template>
  <section class="page active">
    <div class="blog-container">
      <PageHeader
        label="Writing & Thoughts"
        title="Blog"
        description="Technical articles, security research, and insights on cybersecurity."
      />

      <div v-if="pending" class="blog-loading">
        <div class="spinner" />
        <p>Loading posts...</p>
      </div>

      <div v-else-if="error || !posts.length" class="blog-error">
        <p>Unable to load blog posts. Please check your Medium username or connection.</p>
      </div>

      <div v-else class="blog-grid">
        <BlogCard
          v-for="(post, i) in posts"
          :key="post.url"
          :post="post"
          :delay="0.1 + i * 0.1"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({ title: 'Blog | Vilaysack Vorachack' })

const MEDIUM_USERNAME = 'vvilaysack'
const RSS2JSON = 'https://api.rss2json.com/v1/api.json'

const { data, pending, error } = await useAsyncData('blog-posts', async () => {
  const res = await $fetch<any>(`${RSS2JSON}?rss_url=https://medium.com/feed/@${MEDIUM_USERNAME}`)
  if (res.status !== 'ok') throw new Error('Failed to fetch')
  return res.items.slice(0, 6).map((item: any) => ({
    title: item.title,
    url: item.link,
    date: new Date(item.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    excerpt: item.description?.replace(/<[^>]+>/g, '').slice(0, 160) + '...',
    thumbnail: item.thumbnail || null,
    readTime: `${Math.ceil((item.content?.split(' ').length ?? 500) / 200)} min read`,
  }))
})

const posts = computed(() => data.value ?? [])
</script>
