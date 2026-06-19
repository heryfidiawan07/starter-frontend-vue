<template>
  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', styles[variant]]">
    <slot />
  </span>
</template>

<script setup lang="ts">
type Variant = 'success' | 'danger' | 'warning' | 'info' | 'gray'

withDefaults(defineProps<{
  variant?: Variant
}>(), {
  variant: 'gray',
})

const styles: Record<Variant, string> = {
  success: 'bg-green-100 text-green-700',
  danger:  'bg-red-100 text-red-700',
  warning: 'bg-yellow-100 text-yellow-700',
  info:    'bg-blue-100 text-blue-700',
  gray:    'bg-gray-100 text-gray-600',
}
</script>
