<template>
  <section class="page active">
    <div class="contributions-container">
      <PageHeader
        label="Industry Influence"
        title="Contributions"
        description="A showcase of security tools, research projects, speaking engagements, lab environments, and collaborative projects I've developed and contributed to."
      />

      <div v-if="pending" class="contributions-loading">
        <div class="spinner" />
        <p>Loading contributions...</p>
      </div>

      <div v-else-if="error" class="contributions-error">
        <p>Unable to load contributions.</p>
      </div>

      <div v-else class="contributions-grid">
        <ContributionCard
          v-for="(item, i) in contributions"
          :key="item.id"
          :item="toContributionItem(item)"
          :delay="0.1 + i * 0.1"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({ title: 'Contributions | Vilaysack Vorachack' })

const client = useSupabaseClient()

const { data, pending, error } = await useAsyncData('contributions', async () => {
  const { data } = await client
    .from('contributions')
    .select('*')
    .order('sort_order', { ascending: true })
  return data ?? []
})

const contributions = computed(() => data.value ?? [])

// Map Supabase flat columns → ContributionCard's expected shape
const toContributionItem = (row: any) => ({
  ...row,
  links: {
    github: row.github_url ?? undefined,
    demo: row.demo_url ?? undefined,
  },
})
</script>
