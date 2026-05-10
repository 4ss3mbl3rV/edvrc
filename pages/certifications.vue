<template>
  <section class="page active">
    <div class="certifications-container">
      <PageHeader
        label="Professional Credentials"
        title="Certifications"
        description="Industry-recognized certifications demonstrating expertise in cybersecurity domains."
      />

      <div v-if="pending" class="cert-loading">
        <div class="spinner" />
        <p>Loading certifications...</p>
      </div>

      <template v-else-if="certifications.length">
        <CertFilters :categories="categories" @change="handleFilterChange" />

        <div class="cert-grid" :class="{ 'cert-grid-exiting': isExiting }">
          <CertCard
            v-for="(cert, i) in filtered"
            :key="`${cert.name}-${filterSwitchKey}`"
            :cert="cert"
            :delay="i * 0.08"
          />
        </div>
      </template>

      <div v-else class="cert-error">
        <p>Unable to load certifications.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({ title: 'Certifications | Vilaysack Vorachack' })

const { data, pending } = await useAsyncData('certifications', () =>
  queryContent('data/certifications').findOne()
)

const certifications = computed(() => data.value?.certifications ?? [])
const categories = computed(() => [...new Set(certifications.value.map((c: any) => c.category || 'General'))])

const activeFilter = ref('all')
const pendingFilter = ref('all')
const isExiting = ref(false)
const filterSwitchKey = ref(0)

const filtered = computed(() =>
  activeFilter.value === 'all'
    ? certifications.value
    : certifications.value.filter((c: any) => c.category === activeFilter.value)
)

function handleFilterChange(value: string) {
  if (value === activeFilter.value) return
  pendingFilter.value = value
  isExiting.value = true
  setTimeout(() => {
    activeFilter.value = pendingFilter.value
    filterSwitchKey.value++
    isExiting.value = false
  }, 150)
}
</script>

<style scoped>
.cert-grid.cert-grid-exiting {
  opacity: 0;
  transition: opacity 0.15s ease;
}
</style>
