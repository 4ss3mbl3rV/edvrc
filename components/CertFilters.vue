<template>
  <div class="cert-filters">
    <button
      v-for="f in filters"
      :key="f.value"
      class="cert-filter-btn"
      :class="{ active: active === f.value }"
      @click="select(f.value)"
    >
      {{ f.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ categories: string[] }>()
const emit = defineEmits<{ (e: 'change', value: string): void }>()

const active = ref('all')

const filters = computed(() => [
  { label: 'All', value: 'all' },
  ...props.categories.map(c => ({ label: c, value: c })),
])

const select = (value: string) => {
  active.value = value
  emit('change', value)
}
</script>
