<template>
  <AuthLayout title="Email Verification">
    <div class="flex flex-col items-center text-center gap-4 py-4">
      <AppSpinner v-if="status === 'loading'" />

      <template v-if="status === 'success'">
        <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle :size="30" class="text-green-600" />
        </div>
        <div>
          <p class="font-semibold text-gray-900">Email Verified!</p>
          <p class="text-sm text-gray-500 mt-1">Your email has been verified. You can now sign in.</p>
        </div>
        <RouterLink to="/login" class="w-full">
          <AppButton class="w-full" :icon="LogIn">Sign In</AppButton>
        </RouterLink>
      </template>

      <template v-if="status === 'error'">
        <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle :size="30" class="text-red-600" />
        </div>
        <div>
          <p class="font-semibold text-gray-900">Verification Failed</p>
          <p class="text-sm text-gray-500 mt-1">The link is invalid or has expired.</p>
        </div>
        <RouterLink to="/login" class="w-full">
          <AppButton variant="outline" class="w-full" :icon="LogIn">Back to Sign In</AppButton>
        </RouterLink>
      </template>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { CheckCircle, XCircle, LogIn } from '@lucide/vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import { authApi } from '@/api/auth'

const route = useRoute()
const token = (route.query.token as string) ?? ''
const status = ref<'loading' | 'success' | 'error'>('loading')

onMounted(async () => {
  if (!token) { status.value = 'error'; return }
  try {
    await authApi.verifyEmail(token)
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
})
</script>
