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

        <div v-if="post.thumbnail" class="blog-post-thumbnail">
          <img :src="post.thumbnail" :alt="post.title" />
        </div>

        <div class="blog-post-body" v-html="renderedContent" />
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { marked } from 'marked'

marked.use({
  renderer: {
    image({ href, title, text }: { href: string; title?: string | null; text: string }): string {
      const img = `<img src="${href}" alt="${text || ''}" />`
      return title
        ? `<figure class="blog-figure">${img}<figcaption class="blog-figure-caption">${title}</figcaption></figure>`
        : img
    },
  },
})

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

.blog-post-thumbnail {
  margin-bottom: 2.5rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  max-height: 420px;
}

.blog-post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.blog-post-body {
  color: var(--text-secondary);
  line-height: 1.85;
  font-size: 1rem;
  font-family: var(--font-content);
}

.blog-post-body :deep(p) {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.blog-post-body :deep(p:last-child) { margin-bottom: 0; }

.blog-post-body :deep(h1) {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 2.5rem 0 1rem;
  line-height: 1.25;
}

.blog-post-body :deep(h2) {
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 2.25rem 0 0.85rem;
  line-height: 1.3;
}

.blog-post-body :deep(h3) {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 1.75rem 0 0.65rem;
}

.blog-post-body :deep(h4) {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  margin: 1.5rem 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.blog-post-body :deep(ul),
.blog-post-body :deep(ol) {
  padding-left: 1.75rem;
  margin-bottom: 1.5rem;
}

.blog-post-body :deep(li) { margin-bottom: 0.45rem; }
.blog-post-body :deep(li:last-child) { margin-bottom: 0; }

.blog-post-body :deep(blockquote) {
  border-left: 3px solid var(--accent-primary);
  padding: 0.6rem 1.1rem;
  margin: 1.75rem 0;
  color: var(--text-muted);
  font-style: italic;
  background: var(--accent-subtle);
  border-radius: 0 6px 6px 0;
}

.blog-post-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 2.25rem 0;
}

.blog-post-body :deep(strong) { color: var(--text-primary); font-weight: 600; }

.blog-post-body :deep(pre) {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  line-height: 1.65;
}

.blog-post-body :deep(pre code) {
  background: none;
  padding: 0;
  border: none;
  color: inherit;
  font-size: inherit;
}

.blog-post-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.875em;
  color: var(--accent-primary);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  padding: 0.15em 0.45em;
}

.blog-post-body :deep(a) {
  color: var(--accent-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 0.15s;
}

.blog-post-body :deep(a:hover) { opacity: 0.75; }

.blog-post-body :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  margin: 1.75rem 0;
  display: block;
}

.blog-post-body :deep(figure.blog-figure) {
  margin: 1.75rem 0;
  display: block;
}

.blog-post-body :deep(figure.blog-figure img) {
  margin: 0 0 0.5rem;
}

.blog-post-body :deep(figcaption.blog-figure-caption) {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-style: italic;
  text-align: center;
  line-height: 1.5;
}
</style>
