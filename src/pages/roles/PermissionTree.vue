<template>
  <div v-if="roots.length === 0" class="border border-gray-200 rounded-xl">
    <p class="text-center py-8 text-sm text-gray-400">No permissions available</p>
  </div>
  <div v-else class="border border-gray-200 rounded-xl overflow-y-auto max-h-96">
    <div class="p-2 space-y-1">
      <PermNode
        v-for="p in roots"
        :key="p.id"
        :p="p"
        :by-parent="byParent"
        :selected="selected"
        :depth="0"
        @toggle="$emit('toggle', $event)"
        @check-menu="$emit('checkMenu', $event)"
        @uncheck-menu="$emit('uncheckMenu', $event[0], $event[1])"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Permission } from '@/types'
import PermNode from './PermNode.vue'

const props = defineProps<{
  permissions: Permission[]
  selected: Set<string>
}>()

defineEmits<{
  toggle: [id: string]
  checkMenu: [id: string]
  uncheckMenu: [id: string, actionIds: string[]]
}>()

const byParent = computed(() => {
  const map: Record<string, Permission[]> = {}
  props.permissions.forEach((p) => {
    if (p.parent_id) {
      if (!map[p.parent_id]) map[p.parent_id] = []
      map[p.parent_id].push(p)
    }
  })
  return map
})

const roots = computed(() =>
  [...props.permissions.filter((p) => !p.parent_id)].sort((a, b) => a.order - b.order)
)
</script>
