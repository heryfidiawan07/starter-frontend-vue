<template>
  <div v-if="visibleChildren.length > 0">
    <button
      @click="open = !open"
      :class="[
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
        isAnyChildActive
          ? 'text-white bg-white/10'
          : 'text-gray-400 hover:text-white hover:bg-white/10',
      ]"
    >
      <component :is="item.icon" :size="16" class="shrink-0" />
      <span class="flex-1 text-left">{{ item.label }}</span>
      <ChevronDown v-if="open" :size="13" class="opacity-60" />
      <ChevronRight v-else :size="13" class="opacity-60" />
    </button>

    <div v-if="open" class="mt-0.5 ml-3 pl-3 border-l border-white/10 space-y-0.5">
      <RouterLink
        v-for="child in visibleChildren"
        :key="child.route"
        :to="child.route"
        :class="[
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
          $route.path === child.route
            ? 'bg-primary-600 text-white font-medium'
            : 'text-gray-400 hover:text-white hover:bg-white/10',
        ]"
      >
        <component :is="child.icon" :size="15" />
        {{ child.label }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronDown, ChevronRight } from '@lucide/vue'
import type { Component } from 'vue'

interface LeafItem {
  type: 'leaf'
  label: string
  route: string
  name: string
  icon: Component
}

interface DropdownItem {
  type: 'dropdown'
  label: string
  icon: Component
  children: LeafItem[]
}

const props = defineProps<{
  item: DropdownItem
  canSee: (name: string) => boolean
}>()

const route = useRoute()
const $route = route

const visibleChildren = computed(() => props.item.children.filter((c) => props.canSee(c.name)))
const isAnyChildActive = computed(() => visibleChildren.value.some((c) => route.path.startsWith(c.route)))
const open = ref(isAnyChildActive.value)
</script>
