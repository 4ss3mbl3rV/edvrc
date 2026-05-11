<template>
  <section class="page active">
    <div class="blog-container">
      <div v-if="pending" class="blog-loading">
        <div class="spinner" />
        <p>Loading post...</p>
      </div>

      <div v-else-if="!post" class="blog-error">
        <p>Post not found.</p>
        <NuxtLink to="/blog" class="btn-primary">Back to Blog</NuxtLink>
      </div>

      <article v-else class="blog-post">
        <header class="blog-post-header">
          <NuxtLink to="/blog" class="blog-back-link">&larr; Back to Blog</NuxtLink>
          <h1 class="blog-post-title">{{ post.title }}</h1>
          <div class="blog-post-meta">
            <span class="blog-post-date">{{ formattedDate }}</span>
          </div>
        </header>

        <div class="blog-post-body" v-html="renderedContent" />
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { marked } from 'marked'

const route = useRoute()
const client = useSupabaseClient()

const { data: post, pending } = await useAsyncData(`blog-post-${route.params.slug}`, async () => {
  const { data } = await client
    .from('blog_posts')
    .select('*')
    .eq('slug', route.params.slug as string)
    .eq('published', true)
    .single()
  return data ?? null
})

useHead({
  title: computed(() => post.value ? `${post.value.title} | Vilaysack Vorachack` : 'Blog | Vilaysack Vorachack'),
})

const formattedDate = computed(() =>
  post.value?.published_at
    ? new Date(post.value.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''
)

const renderedContent = computed(() =>
  post.value?.content ? marked(post.value.content) : ''
)
</script>

<style scoped>
.blog-post {
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem 0;
}

.blog-back-link {
  display: inline-block;
  color: var(--accent-primary);
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 2rem;
  transition: opacity 0.2s ease;
}

.blog-back-link:hover { opacity: 0.75; }

.blog-post-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.blog-post-meta {
  display: flex;
  gap: 1.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-subtle, rgba(255,255,255,0.06));
}

.blog-post-body { color: var(--text-secondary); line-height: 1.8; font-size: 1rem; font-family: var(--font-content); }
.blog-post-body :deep(h2),
.blog-post-body :deep(h3) { color: var(--text-primary); margin-top: 2rem; margin-bottom: 0.75rem; }
.blog-post-body :deep(pre) {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1.25rem;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.875rem;
}
.blog-post-body :deep(code) { font-family: var(--font-mono); font-size: 0.875em; color: var(--accent-primary); }
.blog-post-body :deep(a) { color: var(--accent-primary); text-decoration: underline; text-underline-offset: 3px; }
.blog-post-body :deep(img) { max-width: 100%; border-radius: 8px; margin: 1.5rem 0; }
</style>
