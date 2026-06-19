<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="relative">
      <span v-if="leftIcon" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <component :is="leftIcon" :size="14" />
      </span>
      <select
        v-bind="$attrs"
        :value="modelValue"
        :class="[
          'w-full h-9 pr-8 rounded-lg border text-sm text-gray-900 bg-white',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'appearance-none disabled:bg-gray-50 disabled:cursor-not-allowed',
          leftIcon ? 'pl-8' : 'pl-3',
          error ? 'border-red-400' : 'border-gray-300',
        ]"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
      <ChevronDown size="14" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import type { Component } from 'vue'

defineOptions({ inheritAttrs: false })

interface Option {
  value: string
  label: string
}

withDefaults(defineProps<{
  modelValue?: string
  label?: string
  error?: string
  options: Option[]
  placeholder?: string
  leftIcon?: Component
  required?: boolean
}>(), {
  required: false,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
