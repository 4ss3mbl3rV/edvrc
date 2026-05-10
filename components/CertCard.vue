<template>
  <article class="cert-card" :data-category="cert.category || 'General'" :style="{ animationDelay: `${delay}s` }">
    <div class="cert-card-header">
      <span class="cert-badge" :class="statusClass">{{ statusText }}</span>
      <span class="cert-year">{{ cert.year }}</span>
    </div>
    <div class="cert-badge-image">
      <img
        :src="cert.badge"
        :alt="`${cert.name} Badge`"
        @error="imgError = true"
        :style="imgError ? 'display:none' : ''"
      />
      <div class="cert-badge-placeholder" :style="imgError ? 'display:flex' : 'display:none'">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      </div>
    </div>
    <h3 class="cert-name">{{ cert.name }}</h3>
    <p class="cert-issuer">{{ cert.issuer }}</p>
    <a v-if="cert.verify_url" :href="cert.verify_url" class="cert-verify-btn" target="_blank" rel="noopener noreferrer">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      Verify
    </a>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  cert: {
    name: string
    issuer: string
    year: number
    status: string
    category: string
    badge: string
    verify_url?: string
    expiry?: string
  }
  delay?: number
}>()

const imgError = ref(false)

const isExpired = (expiryStr?: string): boolean => {
  if (!expiryStr) return false
  const [year, month] = expiryStr.toString().split('-').map(Number)
  if (!year || !month) return false
  const now = new Date()
  return now.getFullYear() > year || (now.getFullYear() === year && now.getMonth() + 1 > month)
}

const expired = computed(() =>
  isExpired(props.cert.expiry) || props.cert.status?.toUpperCase() === 'EXPIRED'
)
const statusClass = computed(() => expired.value ? 'expired' : 'active')
const statusText = computed(() => expired.value ? 'EXPIRED' : 'ACTIVE')
</script>
