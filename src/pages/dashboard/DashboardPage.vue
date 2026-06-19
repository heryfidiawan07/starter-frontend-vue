<template>
  <MainLayout title="Dashboard">
    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">
          Welcome back, {{ user?.name }}
          <span v-if="user?.is_root" class="ml-1 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Root</span>
        </h2>
        <p class="text-sm text-gray-500 mt-0.5">Here's an overview of your application.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-start gap-4"
        >
          <div :class="['w-10 h-10 rounded-lg flex items-center justify-center shrink-0', stat.color]">
            <component :is="stat.icon" :size="18" class="text-white" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ stat.label }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ stat.hint }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-800 mb-3">Quick Links</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <RouterLink
            v-for="link in quickLinks"
            :key="link.href"
            :to="link.href"
            class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
          >
            <component :is="link.icon" :size="16" class="text-gray-400 group-hover:text-primary-600 transition-colors" />
            <span class="text-sm text-gray-700 group-hover:text-primary-700 font-medium">{{ link.label }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { Users, Shield, Lock, Activity } from '@lucide/vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const stats = [
  { label: 'Total Users',  icon: Users,    color: 'bg-blue-500',   hint: 'Manage via Users menu' },
  { label: 'Total Roles',  icon: Shield,   color: 'bg-purple-500', hint: 'Manage via Roles menu' },
  { label: 'Permissions',  icon: Lock,     color: 'bg-green-500',  hint: 'View via Permissions menu' },
  { label: 'API Status',   icon: Activity, color: 'bg-orange-500', hint: 'All systems operational' },
]

const quickLinks = [
  { href: '/users',       label: 'Manage Users',      icon: Users  },
  { href: '/roles',       label: 'Manage Roles',      icon: Shield },
  { href: '/permissions', label: 'View Permissions',  icon: Lock   },
]
</script>
