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
        <p>No blog posts yet. Check back soon.</p>
      </div>

      <div v-else class="blog-grid">
        <BlogCard
          v-for="(post, i) in posts"
          :key="post.id"
          :post="toBlogCardPost(post)"
          :delay="0.1 + i * 0.1"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({ title: 'Blog | Vilaysack Vorachack' })

const client = useSupabaseClient()

const { data, pending, error } = await useAsyncData('blog-posts', async () => {
  const { data } = await client
    .from('blog_posts')
    .select('id, title, slug, excerpt, thumbnail, tags, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })
  return data ?? []
})

const posts = computed(() => data.value ?? [])

const toBlogCardPost = (row: any) => ({
  title: row.title,
  url: `/blog/${row.slug}`,
  date: row.published_at
    ? new Date(row.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '',
  excerpt: row.excerpt ?? '',
  thumbnail: row.thumbnail ?? null,
})
</script>
