<template>
  <div class="admin-tag-input-wrap" @click="focusInput">
    <span v-for="tag in modelValue" :key="tag" class="admin-tag">
      {{ tag }}
      <button type="button" @click.stop="remove(tag)">×</button>
    </span>
    <input
      ref="inputRef"
      v-model="inputVal"
      class="admin-tag-input"
      :placeholder="modelValue.length ? '' : placeholder"
      @keydown.enter.prevent="add"
      @keydown.comma.prevent="add"
      @keydown.backspace="onBackspace"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string[]
  placeholder?: string
}>(), { placeholder: 'Add tag, press Enter' })

const emit = defineEmits<{ (e: 'update:modelValue', v: string[]): void }>()

const inputRef = ref<HTMLInputElement>()
const inputVal = ref('')

const focusInput = () => inputRef.value?.focus()

const add = () => {
  const val = inputVal.value.trim().replace(/,$/, '')
  if (val && !props.modelValue.includes(val)) {
    emit('update:modelValue', [...props.modelValue, val])
  }
  inputVal.value = ''
}

const remove = (tag: string) => {
  emit('update:modelValue', props.modelValue.filter(t => t !== tag))
}

const onBackspace = () => {
  if (!inputVal.value && props.modelValue.length) {
    emit('update:modelValue', props.modelValue.slice(0, -1))
  }
}
</script>
