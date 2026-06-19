<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="relative flex items-center">
      <span v-if="leftIcon" class="absolute left-3 text-gray-400 pointer-events-none">
        <component :is="leftIcon" :size="15" />
      </span>
      <input
        v-bind="$attrs"
        :value="modelValue"
        :required="required"
        :class="[
          'w-full rounded-lg border bg-white text-sm text-gray-900 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'disabled:bg-gray-50 disabled:cursor-not-allowed',
          error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
          leftIcon ? 'pl-10' : 'pl-3',
          rightElement ? 'pr-10' : 'pr-3',
          'py-2 h-9',
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @change="$emit('change', $event)"
      />
      <span v-if="rightElement" class="absolute right-3 flex items-center">
        <component :is="rightElement" />
      </span>
      <slot v-if="$slots.right" name="right" />
    </div>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-gray-400">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  modelValue?: string
  label?: string
  error?: string
  hint?: string
  leftIcon?: Component
  rightElement?: Component
  required?: boolean
}>(), {
  required: false,
})

defineEmits<{
  'update:modelValue': [value: string]
  'change': [event: Event]
}>()
</script>
