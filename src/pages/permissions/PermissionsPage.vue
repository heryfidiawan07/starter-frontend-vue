<template>
  <MainLayout title="Permissions">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <p class="text-sm text-gray-500">Permission hierarchy used across all roles.</p>
        <AppButton variant="outline" size="sm" :icon="RefreshCw" @click="fetchTree">Refresh</AppButton>
      </div>

      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <!-- Legend -->
        <div class="flex items-center gap-4 px-4 py-3 border-b border-gray-100 bg-gray-50 flex-wrap">
          <span v-for="(cfg, key) in typeConfig" :key="key" class="flex items-center gap-1.5 text-xs text-gray-600">
            <span :class="['w-5 h-5 rounded flex items-center justify-center', cfg.color]">
              <component :is="cfg.icon" :size="11" />
            </span>
            {{ cfg.label }}
          </span>
        </div>

        <AppSpinner v-if="loading" class-name="py-16" />
        <p v-else-if="tree.length === 0" class="text-center py-12 text-gray-400">No permissions found</p>
        <div v-else class="p-3 space-y-0.5">
          <PermNode
            v-for="p in tree"
            :key="p.id"
            :p="p"
            :depth="0"
          />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RefreshCw, Layers, Navigation, Zap } from '@lucide/vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import PermNode from './PermNode.vue'
import { permissionsApi } from '@/api/permissions'
import type { Permission } from '@/types'

const typeConfig = {
  category: { label: 'Category', icon: Layers,     color: 'text-purple-600 bg-purple-50' },
  menu:     { label: 'Menu',     icon: Navigation, color: 'text-blue-600 bg-blue-50' },
  action:   { label: 'Action',   icon: Zap,        color: 'text-green-600 bg-green-50' },
}

const tree = ref<Permission[]>([])
const loading = ref(false)

async function fetchTree() {
  loading.value = true
  try {
    const res = await permissionsApi.tree()
    tree.value = res.data.data ?? []
  } finally {
    loading.value = false
  }
}

onMounted(fetchTree)
</script>
