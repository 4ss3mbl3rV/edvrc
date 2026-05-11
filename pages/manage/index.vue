<template>
  <div>
    <h1 class="admin-page-title">Dashboard</h1>
    <p class="admin-page-subtitle">Welcome back. Here's an overview of your portfolio content.</p>

    <div class="admin-stats">
      <NuxtLink to="/manage/certifications" class="admin-stat-card">
        <div class="admin-stat-label">Certifications</div>
        <div class="admin-stat-number">{{ counts.certifications ?? '—' }}</div>
      </NuxtLink>
      <NuxtLink to="/manage/experiences" class="admin-stat-card">
        <div class="admin-stat-label">Experiences</div>
        <div class="admin-stat-number">{{ counts.experiences ?? '—' }}</div>
      </NuxtLink>
      <NuxtLink to="/manage/contributions" class="admin-stat-card">
        <div class="admin-stat-label">Contributions</div>
        <div class="admin-stat-number">{{ counts.contributions ?? '—' }}</div>
      </NuxtLink>
      <NuxtLink to="/manage/blog" class="admin-stat-card">
        <div class="admin-stat-label">Blog Posts</div>
        <div class="admin-stat-number">{{ counts.blog ?? '—' }}</div>
      </NuxtLink>
    </div>

    <div class="admin-card">
      <p style="font-size:0.875rem; color:var(--text-muted); margin:0">
        Use the sidebar to manage your portfolio content. Changes are saved to Supabase and reflected on the public site immediately.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: 'Dashboard — Admin' })

const client = useSupabaseClient()

const counts = reactive<Record<string, number>>({})

onMounted(async () => {
  const tables = ['certifications', 'experiences', 'contributions'] as const
  for (const t of tables) {
    const { count } = await client.from(t).select('*', { count: 'exact', head: true })
    counts[t] = count ?? 0
  }
  const { count: blogCount } = await client.from('blog_posts').select('*', { count: 'exact', head: true })
  counts.blog = blogCount ?? 0
})
</script>
