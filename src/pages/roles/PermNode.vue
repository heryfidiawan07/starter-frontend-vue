<template>
  <!-- Category -->
  <div v-if="p.type === 'category'" class="mb-2">
    <div class="px-3 py-1.5 bg-gray-50 rounded-lg">
      <span class="text-[10px] font-bold uppercase tracking-widest text-gray-500">{{ p.label }}</span>
    </div>
    <div class="mt-0.5 space-y-0.5">
      <PermNode
        v-for="child in sortedChildren"
        :key="child.id"
        :p="child"
        :by-parent="byParent"
        :selected="selected"
        :depth="1"
        @toggle="$emit('toggle', $event)"
        @check-menu="$emit('checkMenu', $event)"
        @uncheck-menu="$emit('uncheckMenu', $event)"
      />
    </div>
  </div>

  <!-- Dropdown menu with sub-menus -->
  <div v-else-if="p.type === 'menu' && subMenus.length > 0" :style="{ paddingLeft: `${depth * 12}px` }">
    <button
      type="button"
      @click="dropdownOpen = !dropdownOpen"
      class="flex items-center gap-2 py-1.5 px-3 w-full rounded-lg hover:bg-gray-50 text-left transition-colors"
    >
      <ChevronDown v-if="dropdownOpen" :size="13" class="text-gray-400 shrink-0" />
      <ChevronRight v-else :size="13" class="text-gray-400 shrink-0" />
      <span class="text-sm font-semibold text-gray-600">{{ p.label }}</span>
    </button>
    <div v-if="dropdownOpen" class="mt-0.5 space-y-0.5">
      <PermNode
        v-for="sub in subMenus"
        :key="sub.id"
        :p="sub"
        :by-parent="byParent"
        :selected="selected"
        :depth="depth + 1"
        @toggle="$emit('toggle', $event)"
        @check-menu="$emit('checkMenu', $event)"
        @uncheck-menu="$emit('uncheckMenu', $event)"
      />
    </div>
  </div>

  <!-- Leaf menu row -->
  <div v-else-if="p.type === 'menu'" :style="{ paddingLeft: `${depth * 12}px` }">
    <div class="px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors">
      <label :for="`perm-menu-${p.id}`" class="flex items-center gap-2.5 cursor-pointer py-0.5">
        <input
          :id="`perm-menu-${p.id}`"
          type="checkbox"
          :checked="selected.has(p.id)"
          @change="handleMenuChange"
          class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer shrink-0"
        />
        <span class="text-sm font-medium text-gray-700 select-none">{{ p.label }}</span>
      </label>
      <div v-if="actions.length > 0" class="ml-6 mt-0.5 pb-1 flex flex-wrap gap-x-5 gap-y-0.5">
        <label
          v-for="a in actions"
          :key="a.id"
          :for="`perm-action-${a.id}`"
          :class="[
            'flex items-center gap-1.5 py-0.5 select-none transition-opacity text-[13px]',
            selected.has(p.id) ? 'cursor-pointer text-gray-600' : 'cursor-not-allowed opacity-35 text-gray-400',
          ]"
        >
          <input
            :id="`perm-action-${a.id}`"
            type="checkbox"
            :checked="selected.has(a.id)"
            :disabled="!selected.has(p.id)"
            @change="$emit('toggle', a.id)"
            class="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          {{ a.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, ChevronRight } from '@lucide/vue'
import type { Permission } from '@/types'

const props = defineProps<{
  p: Permission
  byParent: Record<string, Permission[]>
  selected: Set<string>
  depth: number
}>()

const emit = defineEmits<{
  toggle: [id: string]
  checkMenu: [id: string]
  uncheckMenu: [payload: [string, string[]]]
}>()

const dropdownOpen = ref(true)

const sortedChildren = computed(() =>
  [...(props.byParent[props.p.id] ?? [])].sort((a, b) => a.order - b.order)
)

const actions = computed(() => sortedChildren.value.filter((c) => c.type === 'action'))
const subMenus = computed(() => sortedChildren.value.filter((c) => c.type === 'menu'))

function handleMenuChange() {
  if (props.selected.has(props.p.id)) {
    emit('uncheckMenu', [props.p.id, actions.value.map((a) => a.id)])
  } else {
    emit('checkMenu', props.p.id)
  }
}
</script>
