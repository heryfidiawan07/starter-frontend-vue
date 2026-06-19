<template>
  <div class="flex items-center justify-between px-1 py-3 text-sm text-gray-600">
    <span>Showing {{ from }}–{{ to }} of {{ meta.total }} results</span>
    <div class="flex items-center gap-1">
      <button
        @click="$emit('change', meta.page - 1)"
        :disabled="meta.page <= 1"
        class="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft :size="16" />
      </button>

      <template v-for="(p, i) in pages" :key="i">
        <span v-if="p === '...'" class="px-2">…</span>
        <button
          v-else
          @click="$emit('change', p as number)"
          :class="[
            'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
            p === meta.page ? 'bg-primary-600 text-white' : 'hover:bg-gray-100',
          ]"
        >
          {{ p }}
        </button>
      </template>

      <button
        @click="$emit('change', meta.page + 1)"
        :disabled="meta.page >= meta.total_page"
        class="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import type { PageMeta } from '@/types'

const props = defineProps<{
  meta: PageMeta
}>()

defineEmits<{ change: [page: number] }>()

const from = computed(() => (props.meta.page - 1) * props.meta.per_page + 1)
const to = computed(() => Math.min(props.meta.page * props.meta.per_page, props.meta.total))

const pages = computed(() => {
  const { page, total_page } = props.meta
  const nums = Array.from({ length: total_page }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === total_page || Math.abs(p - page) <= 1)

  const result: (number | '...')[] = []
  nums.forEach((p, idx) => {
    if (idx > 0 && p - (nums[idx - 1]) > 1) result.push('...')
    result.push(p)
  })
  return result
})
</script>
