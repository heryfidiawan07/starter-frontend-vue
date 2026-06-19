<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />
      <div :class="['relative w-full bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]', sizes[size]]">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="text-base font-semibold text-gray-900">{{ title }}</h2>
          <button
            @click="$emit('close')"
            class="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X :size="18" />
          </button>
        </div>
        <div class="overflow-y-auto flex-1 px-6 py-5">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { X } from '@lucide/vue'

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const props = withDefaults(defineProps<{
  open: boolean
  title: string
  size?: Size
}>(), {
  size: 'md',
})

defineEmits<{ close: [] }>()

const sizes: Record<Size, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  '2xl': 'max-w-3xl',
}

watch(() => props.open, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
}, { immediate: true })
</script>
