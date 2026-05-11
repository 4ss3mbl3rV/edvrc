<template>
  <div>
    <div class="admin-toolbar">
      <div>
        <h1 class="admin-page-title">Blog Posts</h1>
        <p class="admin-page-subtitle">{{ rows.length }} posts ({{ publishedCount }} published)</p>
      </div>
      <NuxtLink to="/manage/blog/new" class="btn-admin-primary">+ New Post</NuxtLink>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr><th>Title</th><th>Slug</th><th>Status</th><th>Published</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td><strong>{{ row.title }}</strong></td>
            <td style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-muted)">{{ row.slug }}</td>
            <td>
              <span class="admin-badge" :class="row.published ? 'admin-badge-active' : 'admin-badge-draft'">
                {{ row.published ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td style="color:var(--text-muted);font-size:0.8rem">
              {{ row.published_at ? new Date(row.published_at).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '—' }}
            </td>
            <td style="display:flex;gap:0.5rem;flex-wrap:wrap">
              <NuxtLink :to="`/manage/blog/${row.id}`" class="btn-admin-secondary">Edit</NuxtLink>
              <a :href="`/blog/${row.slug}`" target="_blank" class="btn-admin-secondary">View</a>
              <button class="btn-admin-danger" @click="deletePost(row.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!rows.length">
            <td colspan="5" style="text-align:center;color:var(--text-muted);padding:2rem">No blog posts yet. Create your first post!</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: 'Blog Posts — Admin' })

const client = useSupabaseClient()
const rows = ref<any[]>([])
const publishedCount = computed(() => rows.value.filter(r => r.published).length)

const load = async () => {
  const { data } = await client
    .from('blog_posts')
    .select('id, title, slug, published, published_at')
    .order('created_at', { ascending: false })
  rows.value = data ?? []
}

onMounted(load)

const { confirm } = useAdminConfirm()

const deletePost = async (id: string) => {
  if (!await confirm('Delete this post?', 'This action cannot be undone.')) return
  await client.from('blog_posts').delete().eq('id', id)
  await load()
}
</script>
