<template>
  <div class="a-sel" :class="{ 'a-sel--open': open }" ref="root">
    <button type="button" class="a-sel__trigger" @click="toggle">
      <span class="a-sel__value">{{ selectedLabel }}</span>
      <svg class="a-sel__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <Transition name="a-sel-drop">
      <div v-if="open" class="a-sel__dropdown">
        <button
          v-for="opt in normalized"
          :key="opt.value"
          type="button"
          class="a-sel__option"
          :class="{ 'a-sel__option--active': opt.value === modelValue }"
          @click="pick(opt.value)"
        >
          <svg v-if="opt.value === modelValue" class="a-sel__check" width="11" height="11"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span v-else class="a-sel__check-placeholder" />
          {{ opt.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  options: Array<string | { value: string; label: string }>
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'change'): void
}>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const normalized = computed(() =>
  props.options.map(o => typeof o === 'string' ? { value: o, label: o } : o)
)

const selectedLabel = computed(() =>
  normalized.value.find(o => o.value === props.modelValue)?.label ?? props.modelValue
)

const toggle = () => { open.value = !open.value }

const pick = (value: string) => {
  emit('update:modelValue', value)
  emit('change')
  open.value = false
}

const onOutside = (e: MouseEvent) => {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('mousedown', onOutside))
onUnmounted(() => document.removeEventListener('mousedown', onOutside))
</script>

<style scoped>
.a-sel {
  position: relative;
  width: 100%;
}

/* ── Trigger ── */
.a-sel__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.85rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-family: var(--font-body);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.a-sel__trigger:hover,
.a-sel--open .a-sel__trigger {
  border-color: var(--accent-primary);
}

.a-sel--open .a-sel__trigger {
  box-shadow: 0 0 0 3px var(--accent-subtle);
}

.a-sel__value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.a-sel__chevron {
  flex-shrink: 0;
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

.a-sel--open .a-sel__chevron {
  transform: rotate(180deg);
  color: var(--accent-primary);
}

/* ── Dropdown ── */
.a-sel__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 200;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), 0 0 0 1px var(--border-color);
  overflow: hidden;
  padding: 0.45rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

/* ── Options ── */
.a-sel__option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.8rem;
  background: transparent;
  border: none;
  border-radius: 5px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-family: var(--font-body);
  text-align: left;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}

.a-sel__option:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.a-sel__option--active {
  background: var(--accent-subtle);
  color: var(--accent-primary);
  font-weight: 500;
}

.a-sel__option--active:hover {
  background: var(--accent-subtle);
}

.a-sel__check {
  flex-shrink: 0;
  color: var(--accent-primary);
}

.a-sel__check-placeholder {
  display: inline-block;
  width: 11px;
  flex-shrink: 0;
}

/* ── Transition ── */
.a-sel-drop-enter-active,
.a-sel-drop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.a-sel-drop-enter-from,
.a-sel-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
