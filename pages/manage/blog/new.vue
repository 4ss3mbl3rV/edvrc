<template>
  <div>
    <div class="admin-toolbar">
      <div>
        <NuxtLink to="/manage/blog" class="btn-admin-secondary" style="margin-bottom:0.5rem">← Back</NuxtLink>
        <h1 class="admin-page-title">New Blog Post</h1>
      </div>
      <div style="display:flex;gap:0.75rem">
        <button class="btn-admin-secondary" :disabled="saving" @click="saveDraft">Save Draft</button>
        <button class="btn-admin-primary" :disabled="saving" @click="publish">Publish</button>
      </div>
    </div>

    <div v-if="saveError" class="admin-error-msg" style="margin-bottom:1rem">{{ saveError }}</div>

    <div class="admin-card">
      <div class="admin-form-group">
        <label class="admin-label">Title *</label>
        <input v-model="form.title" class="admin-input" placeholder="Post title" @input="autoSlug" />
      </div>
      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label">Slug *</label>
          <input v-model="form.slug" class="admin-input" placeholder="post-slug" />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Thumbnail URL</label>
          <input v-model="form.thumbnail" class="admin-input" placeholder="https://..." />
        </div>
      </div>
      <div class="admin-form-group">
        <label class="admin-label">Excerpt</label>
        <textarea v-model="form.excerpt" class="admin-textarea" rows="2" placeholder="Short summary shown on the blog list…" />
      </div>
      <div class="admin-form-group">
        <label class="admin-label">Tags</label>
        <AdminTagInput v-model="form.tags" />
      </div>
    </div>

    <div class="admin-card" style="padding:0">
      <label class="admin-label" style="padding:1rem 1.5rem 0.5rem;display:block">Content *</label>
      <AdminEditor v-model="form.content" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: 'New Post — Admin' })

const client = useSupabaseClient()
const saving = ref(false)
const saveError = ref('')

const form = reactive({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  thumbnail: '',
  tags: [] as string[],
})

const autoSlug = () => {
  form.slug = form.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const extractFirstImage = (markdown: string): string => {
  const match = markdown.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/)
  return match?.[1] ?? ''
}

const savePost = async (published: boolean) => {
  if (!form.title || !form.slug) { saveError.value = 'Title and slug are required.'; return }
  saving.value = true
  saveError.value = ''
  const thumbnail = form.thumbnail || extractFirstImage(form.content)
  const { data, error } = await client.from('blog_posts').insert({
    ...form,
    thumbnail,
    published,
    published_at: published ? new Date().toISOString() : null,
  }).select('id').single()
  saving.value = false
  if (error) { saveError.value = error.message; return }
  await navigateTo(`/manage/blog/${data.id}`)
}

const saveDraft = () => savePost(false)
const publish = () => savePost(true)
</script>
