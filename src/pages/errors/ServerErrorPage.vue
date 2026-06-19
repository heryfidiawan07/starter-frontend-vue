<template>
  <ErrorLayout
    code="500"
    title="Internal Server Error"
    description="Something went wrong on our end. Please try refreshing the page. If the problem persists, contact support."
  >
    <div class="flex flex-wrap items-center justify-center gap-3">
      <AppButton variant="outline" :icon="RefreshCw" @click="() => window.location.reload()">Retry</AppButton>
      <AppButton :icon="Home" @click="router.push('/')">Go Home</AppButton>
    </div>
  </ErrorLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { RefreshCw, Home } from '@lucide/vue'
import ErrorLayout from './ErrorLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
</script>
