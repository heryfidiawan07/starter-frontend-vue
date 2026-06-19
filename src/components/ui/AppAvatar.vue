<template>
  <img
    v-if="src"
    :src="src"
    :alt="name"
    :class="[sizes[size], 'rounded-full object-cover ring-2 ring-white']"
  />
  <div
    v-else
    :class="[sizes[size], 'rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold ring-2 ring-white']"
  >
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  src?: string | null
  name?: string
  size?: Size
}>(), {
  size: 'md',
})

const sizes: Record<Size, string> = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-16 h-16 text-xl',
}

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
})
</script>
