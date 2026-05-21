<template>
  <section class="page active">
    <div class="achievements-container">
      <PageHeader
        label="Recognition & Results"
        title="Achievements"
        description="Competition placements, awards, and recognitions earned through security research, CTF competitions, and industry participation."
      />

      <div v-if="pending" class="achievements-loading">
        <div class="spinner" />
        <p>Loading achievements...</p>
      </div>

      <div v-else-if="error" class="achievements-error">
        <p>Unable to load achievements.</p>
      </div>

      <div v-else-if="!achievements.length" class="achievements-empty">
        <p>No achievements yet.</p>
      </div>

      <div v-else class="achievements-grid">
        <div
          v-for="(item, i) in achievements"
          :key="item.id"
          class="achievement-card"
          :style="{ animationDelay: `${0.05 + i * 0.07}s` }"
        >
          <div class="achievement-card-top">
            <span v-if="item.placement" class="achievement-placement" :class="placementClass(item.placement)">{{ item.placement }}</span>
            <span class="achievement-category">{{ item.category }}</span>
          </div>

          <h3 class="achievement-title">{{ item.title }}</h3>

          <p v-if="item.event" class="achievement-event">{{ item.event }}</p>
          <p v-if="item.description" class="achievement-description">{{ item.description }}</p>

          <div class="achievement-footer">
            <span v-if="item.date" class="achievement-date">{{ item.date }}</span>
            <span v-if="item.team" class="achievement-team">{{ item.team }}</span>
            <a v-if="item.url" :href="item.url" target="_blank" rel="noopener" class="achievement-link">
              View →
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({ title: 'Achievements | Vilaysack Vorachack' })

const client = useSupabaseClient()

const { data, pending, error } = await useAsyncData('achievements', async () => {
  const { data } = await client
    .from('achievements')
    .select('*')
    .order('sort_order', { ascending: true })
  return data ?? []
})

const achievements = computed(() => data.value ?? [])

const placementClass = (placement: string) => {
  switch (placement) {
    case 'The Winner':  return 'placement-winner'
    case '1st Place':   return 'placement-1st'
    case '2nd Place':   return 'placement-2nd'
    case '3rd Place':   return 'placement-3rd'
    default:            return 'placement-other'
  }
}
</script>

<style scoped>
.achievements-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

.achievements-loading,
.achievements-error,
.achievements-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}

/* Card */
.achievement-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 1.4rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: fadeSlideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.achievement-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-glow);
  border-color: var(--accent-primary);
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Top row */
.achievement-card-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.15rem;
}

.achievement-placement {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  letter-spacing: 0.05em;
  border: 1px solid;
}

/* Winner — gold */
.placement-winner {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.35);
  text-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
}

/* 1st — blue (theme accent) */
.placement-1st {
  color: var(--accent-primary);
  background: var(--accent-subtle);
  border-color: var(--border-hover);
  text-shadow: 0 0 10px var(--accent-glow);
}

/* 2nd — silver */
.placement-2nd {
  color: #cbd5e1;
  background: rgba(203, 213, 225, 0.1);
  border-color: rgba(203, 213, 225, 0.25);
}

/* 3rd — bronze */
.placement-3rd {
  color: #fb923c;
  background: rgba(251, 146, 60, 0.1);
  border-color: rgba(251, 146, 60, 0.3);
}

/* Other */
.placement-other {
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-color: var(--border-color);
}

.achievement-category {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.15rem 0.55rem;
}

/* Body */
.achievement-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.35;
  margin: 0;
}

.achievement-event {
  font-size: 0.825rem;
  color: var(--accent-primary);
  margin: 0;
}

.achievement-description {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.55;
  margin: 0;
}

/* Footer */
.achievement-footer {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.achievement-date,
.achievement-team {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
}

.achievement-link {
  margin-left: auto;
  font-size: 0.78rem;
  color: var(--accent-primary);
  transition: opacity 0.15s;
}

.achievement-link:hover { opacity: 0.75; }

@media (max-width: 640px) {
  .achievements-grid {
    grid-template-columns: 1fr;
  }
}
</style>
