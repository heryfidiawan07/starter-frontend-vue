<template>
  <div :class="['flex items-center justify-center', className]">
    <Loader2 class="animate-spin text-primary-600" :size="28" />
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from '@lucide/vue'

withDefaults(defineProps<{
  className?: string
}>(), {
  className: '',
})
</script>
