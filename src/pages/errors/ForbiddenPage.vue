<template>
  <ErrorLayout
    code="403"
    title="Access Forbidden"
    description="You don't have permission to view this page. Contact your administrator if you believe this is a mistake."
  >
    <div class="flex flex-wrap items-center justify-center gap-3">
      <AppButton variant="outline" :icon="ArrowLeft" @click="router.go(-1)">Go Back</AppButton>
      <AppButton :icon="LayoutDashboard" @click="router.push('/dashboard')">Dashboard</AppButton>
    </div>
  </ErrorLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, LayoutDashboard } from '@lucide/vue'
import ErrorLayout from './ErrorLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
</script>
