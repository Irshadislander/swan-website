<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="resolvedId" class="text-sm font-medium text-grayx-800">
      {{ label }}
    </label>

    <input
      v-bind="$attrs"
      :id="resolvedId"
      :type="type"
      :value="modelValue"
      :aria-describedby="descriptionId"
      :aria-invalid="Boolean(error) || undefined"
      class="w-full rounded-xl border border-grayx-200 bg-white px-3 py-2 text-base text-grayx-800 placeholder:text-grayx-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      @input="onInput"
    />

    <p v-if="helpText && !error" :id="descriptionId" class="text-xs text-grayx-500">
      {{ helpText }}
    </p>
    <p v-else-if="error" :id="descriptionId" class="text-xs text-brand-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
// Base input element with accessible label, help, and error messaging.
import { computed, ref } from 'vue'

defineOptions({ inheritAttrs: false })

interface Props {
  modelValue: string
  label?: string
  helpText?: string
  error?: string
  id?: string
  type?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const generatedId = ref(`base-input-${Math.random().toString(36).slice(2, 8)}`)
const resolvedId = computed(() => props.id ?? generatedId.value)
const descriptionId = computed(() => (props.helpText || props.error ? `${resolvedId.value}-desc` : undefined))

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
