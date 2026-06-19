<template>
  <div>
    <div
      class="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
      :style="{ paddingLeft: `${depth * 20 + 12}px` }"
    >
      <button v-if="hasChildren" @click="open = !open" class="text-gray-400 shrink-0">
        <ChevronDown v-if="open" :size="14" />
        <ChevronRight v-else :size="14" />
      </button>
      <span v-else class="w-4 shrink-0" />

      <span :class="['w-6 h-6 rounded-md flex items-center justify-center shrink-0', cfg.color]">
        <component :is="cfg.icon" :size="12" />
      </span>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-sm font-medium text-gray-800">{{ p.label }}</span>
          <code class="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">{{ p.name }}</code>
          <span v-if="p.route" class="text-xs text-gray-400 hidden sm:inline">{{ p.route }}</span>
        </div>
      </div>

      <span :class="['text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0', cfg.color]">
        {{ cfg.label }}
      </span>
    </div>

    <template v-if="open && hasChildren">
      <PermNode
        v-for="child in p.children"
        :key="child.id"
        :p="child"
        :depth="depth + 1"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, ChevronRight, Layers, Navigation, Zap } from '@lucide/vue'
import type { Permission } from '@/types'

const props = defineProps<{
  p: Permission
  depth: number
}>()

const open = ref(true)
const hasChildren = computed(() => !!props.p.children && props.p.children.length > 0)

const typeConfig = {
  category: { label: 'Category', icon: Layers,     color: 'text-purple-600 bg-purple-50' },
  menu:     { label: 'Menu',     icon: Navigation, color: 'text-blue-600 bg-blue-50' },
  action:   { label: 'Action',   icon: Zap,        color: 'text-green-600 bg-green-50' },
}

const cfg = computed(() => typeConfig[props.p.type])
</script>
