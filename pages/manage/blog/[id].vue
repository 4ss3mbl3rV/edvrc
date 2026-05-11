<template>
  <div>
    <div class="admin-toolbar">
      <div>
        <NuxtLink to="/manage/blog" class="btn-admin-secondary" style="margin-bottom:0.5rem">← Back</NuxtLink>
        <h1 class="admin-page-title">Edit Post</h1>
      </div>
      <div style="display:flex;gap:0.75rem;align-items:center">
        <span class="admin-badge" :class="form.published ? 'admin-badge-active' : 'admin-badge-draft'">
          {{ form.published ? 'Published' : 'Draft' }}
        </span>
        <button v-if="form.published" class="btn-admin-secondary" :disabled="saving" @click="unpublish">Unpublish</button>
        <button v-else class="btn-admin-primary" :disabled="saving" @click="publish">Publish</button>
        <button class="btn-admin-primary" :disabled="saving" @click="save">
          {{ saving ? 'Saving…' : 'Save' }}
        </button>
      </div>
    </div>

    <div v-if="pending" style="color:var(--text-muted);padding:2rem 0">Loading post…</div>

    <template v-else-if="form.title !== undefined">
      <div v-if="saveError" class="admin-error-msg" style="margin-bottom:1rem">{{ saveError }}</div>
      <div v-if="saveSuccess" style="background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);color:var(--accent-primary);padding:0.6rem 0.85rem;border-radius:6px;font-size:0.825rem;margin-bottom:1rem">Saved successfully.</div>

      <div class="admin-card">
        <div class="admin-form-group">
          <label class="admin-label">Title *</label>
          <input v-model="form.title" class="admin-input" />
        </div>
        <div class="admin-form-row">
          <div class="admin-form-group">
            <label class="admin-label">Slug *</label>
            <input v-model="form.slug" class="admin-input" />
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Thumbnail URL</label>
            <input v-model="form.thumbnail" class="admin-input" />
          </div>
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Excerpt</label>
          <textarea v-model="form.excerpt" class="admin-textarea" rows="2" />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Tags</label>
          <AdminTagInput v-model="form.tags" />
        </div>
      </div>

      <div class="admin-card" style="padding:0">
        <label class="admin-label" style="padding:1rem 1.5rem 0.5rem;display:block">Content</label>
        <AdminEditor v-model="form.content" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: 'Edit Post — Admin' })

const route = useRoute()
const client = useSupabaseClient()

const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)

const form = reactive({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  thumbnail: '',
  tags: [] as string[],
  published: false,
  published_at: null as string | null,
})

const { pending } = await useAsyncData(`edit-post-${route.params.id}`, async () => {
  const { data } = await client.from('blog_posts').select('*').eq('id', route.params.id as string).single()
  if (data) Object.assign(form, { ...data, tags: data.tags ?? [] })
  return data
})

const extractFirstImage = (markdown: string): string => {
  const match = markdown.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/)
  return match?.[1] ?? ''
}

const save = async () => {
  saving.value = true
  saveError.value = ''
  saveSuccess.value = false
  const thumbnail = form.thumbnail || extractFirstImage(form.content)
  const { error } = await client.from('blog_posts').update({
    title: form.title,
    slug: form.slug,
    content: form.content,
    excerpt: form.excerpt,
    thumbnail,
    tags: form.tags,
  }).eq('id', route.params.id as string)
  if (!error) form.thumbnail = thumbnail
  saving.value = false
  if (error) { saveError.value = error.message; return }
  saveSuccess.value = true
  setTimeout(() => { saveSuccess.value = false }, 3000)
}

const publish = async () => {
  saving.value = true
  const thumbnail = form.thumbnail || extractFirstImage(form.content)
  const { error } = await client.from('blog_posts').update({
    published: true,
    published_at: form.published_at ?? new Date().toISOString(),
    thumbnail,
  }).eq('id', route.params.id as string)
  if (!error) { form.published = true; form.thumbnail = thumbnail }
  saving.value = false
}

const unpublish = async () => {
  saving.value = true
  const { error } = await client.from('blog_posts').update({ published: false }).eq('id', route.params.id as string)
  saving.value = false
  if (!error) form.published = false
}
</script>
