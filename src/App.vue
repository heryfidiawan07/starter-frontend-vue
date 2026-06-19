<template>
  <RouterView />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'

const auth = useAuthStore()

// Refresh user + permissions from server when authenticated.
// Ensures sidebar and action buttons reflect the latest role permissions
// even if an admin changed them after the last login.
watch(
  () => auth.isAuthenticated,
  (authenticated) => {
    if (!authenticated) return
    authApi.me().then((res) => {
      if (res.data.data) auth.setUser(res.data.data)
    }).catch(() => {})
  },
  { immediate: true }
)
</script>
