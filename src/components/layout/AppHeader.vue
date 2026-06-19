<template>
  <header class="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
    <div class="flex items-center gap-2.5">
      <button
        @click="$emit('menuClick')"
        class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu :size="20" />
      </button>
      <h1 class="text-base font-semibold text-gray-800">{{ title }}</h1>
    </div>

    <div class="relative">
      <button
        @click="dropdownOpen = !dropdownOpen"
        class="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <AppAvatar :src="user?.photo" :name="user?.name" size="sm" />
        <div class="text-left hidden sm:block">
          <p class="text-sm font-medium text-gray-800 leading-tight">{{ user?.name }}</p>
          <p class="text-xs text-gray-400 leading-tight">{{ user?.email }}</p>
        </div>
        <ChevronDown :size="14" class="text-gray-400" />
      </button>

      <template v-if="dropdownOpen">
        <div class="fixed inset-0 z-10" @click="dropdownOpen = false" />
        <div class="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1">
          <button
            @click="navigate('/profile')"
            class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <User :size="15" />
            My Profile
          </button>
          <button
            @click="navigate('/profile/password')"
            class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Settings :size="15" />
            Change Password
          </button>
          <div class="border-t border-gray-100 my-1" />
          <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut :size="15" />
            Logout
          </button>
        </div>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { User, LogOut, Settings, ChevronDown, Menu } from '@lucide/vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import AppAvatar from '@/components/ui/AppAvatar.vue'

defineProps<{ title: string }>()
defineEmits<{ menuClick: [] }>()

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const dropdownOpen = ref(false)

function navigate(path: string) {
  dropdownOpen.value = false
  router.push(path)
}

async function handleLogout() {
  try {
    await authApi.logout()
  } finally {
    authStore.logout()
    router.push('/login')
    toast.success('Logged out successfully')
  }
}
</script>
