<template>
  <section class="page active">
    <div class="experiences-container">
      <PageHeader
        label="Career Journey"
        title="Experiences"
        description="My professional journey and milestones."
      />

      <div v-if="pending" class="timeline-loading">
        <div class="spinner" />
        <p>Loading experiences...</p>
      </div>

      <div v-else-if="error" class="timeline-error">
        <p>Unable to load experiences.</p>
      </div>

      <div v-else class="timeline">
        <TimelineItem
          v-for="(exp, i) in experiences"
          :key="exp.id"
          :exp="exp"
          :delay="0.1 + i * 0.15"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({ title: 'Experiences | Vilaysack Vorachack' })

const client = useSupabaseClient()

const { data, pending, error } = await useAsyncData('experiences', async () => {
  const { data } = await client
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true })
  return data ?? []
})

const experiences = computed(() => data.value ?? [])
</script>
