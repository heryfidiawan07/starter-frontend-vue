<template>
  <aside
    :class="[
      'w-60 shrink-0 bg-gray-900 text-white flex flex-col',
      'fixed inset-y-0 left-0 z-50 transition-transform duration-200',
      open ? 'translate-x-0' : '-translate-x-full',
      'lg:relative lg:translate-x-0 lg:z-auto lg:inset-y-auto lg:left-auto',
      'lg:min-h-screen',
    ]"
  >
    <!-- Logo + mobile close -->
    <div class="flex items-center justify-between px-5 py-5 border-b border-white/10">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <Zap :size="16" class="text-white" />
        </div>
        <span class="font-semibold text-sm tracking-wide">StarterApp</span>
      </div>
      <button
        @click="$emit('close')"
        class="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
        aria-label="Close sidebar"
      >
        <X :size="18" />
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-3 overflow-y-auto">
      <template v-for="group in menuConfig" :key="group.category">
        <div v-if="getVisibleItems(group).length > 0" class="mb-2">
          <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-500 px-3 pt-3 pb-1.5 select-none">
            {{ group.category }}
          </p>
          <div class="space-y-0.5">
            <template v-for="item in getVisibleItems(group)" :key="getItemKey(item)">
              <RouterLink
                v-if="item.type === 'leaf'"
                :to="(item as LeafItem).route"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  route.path === (item as LeafItem).route
                    ? 'bg-primary-600 text-white font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-white/10',
                ]"
              >
                <component :is="item.icon" :size="16" />
                {{ item.label }}
              </RouterLink>

              <SidebarDropdown
                v-else
                :item="(item as DropdownItem)"
                :can-see="canSee"
              />
            </template>
          </div>
        </div>
      </template>
    </nav>

    <div class="px-4 py-3 border-t border-white/10 text-xs text-gray-500">
      Starter API v1.0.0
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  LayoutDashboard, Users, Shield, Lock,
  Zap, UserCog, X,
} from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import SidebarDropdown from './SidebarDropdown.vue'
import type { Component } from 'vue'

defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()

const route = useRoute()
const authStore = useAuthStore()

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

interface CategoryGroup {
  category: string
  items: (LeafItem | DropdownItem)[]
}

const menuConfig: CategoryGroup[] = [
  {
    category: 'Main',
    items: [
      { type: 'leaf', label: 'Dashboard', route: '/dashboard', name: 'dashboard:index', icon: LayoutDashboard },
    ],
  },
  {
    category: 'Settings',
    items: [
      {
        type: 'dropdown',
        label: 'Administrator',
        icon: UserCog,
        children: [
          { type: 'leaf', label: 'User',       route: '/users',       name: 'user:index',       icon: Users  },
          { type: 'leaf', label: 'Role',       route: '/roles',       name: 'role:index',       icon: Shield },
          { type: 'leaf', label: 'Permission', route: '/permissions', name: 'permission:index', icon: Lock   },
        ],
      },
    ],
  },
]

function canSee(name: string): boolean {
  const user = authStore.user
  if (!user) return false
  if (user.is_root) return true
  return user.role?.permissions?.some((p) => p.name === name) ?? false
}

function getVisibleItems(group: CategoryGroup) {
  return group.items.filter((item) => {
    if (item.type === 'leaf') return canSee(item.name)
    return (item as DropdownItem).children.some((c) => canSee(c.name))
  })
}

function getItemKey(item: LeafItem | DropdownItem): string {
  return item.type === 'leaf' ? item.route : item.label
}
</script>
