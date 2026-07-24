<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { CheckCircle, XCircle, Loader2 } from 'lucide-vue-next'
import AuthLayout from '../../components/layout/AuthLayout.vue'
import AppButton from '../../components/ui/AppButton.vue'
import { authApi } from '../../api/auth'

const route = useRoute()
const token = route.query.token as string

const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('Verifying your email address...')

onMounted(async () => {
  if (!token) {
    status.value = 'error'
    message.value = 'Invalid or missing verification token.'
    return
  }

  try {
    await authApi.verifyEmail(token)
    status.value = 'success'
    message.value = 'Your email has been successfully verified! You can now sign in.'
  } catch (err: any) {
    status.value = 'error'
    message.value = err.response?.data?.message || 'Invalid or expired verification token.'
  }
})
</script>

<template>
  <AuthLayout title="Email Verification" subtitle="Please wait while we verify your email">
    <div class="flex flex-col items-center justify-center py-6 text-center">
      <Loader2 v-if="status === 'loading'" class="h-16 w-16 text-primary-500 animate-spin mb-4" />
      <CheckCircle v-else-if="status === 'success'" class="h-16 w-16 text-green-500 mb-4" />
      <XCircle v-else class="h-16 w-16 text-red-500 mb-4" />
      
      <p class="text-gray-600 mb-6">{{ message }}</p>
      
      <router-link v-if="status !== 'loading'" to="/login" class="w-full block">
        <AppButton type="button" class="w-full">Go to Sign In</AppButton>
      </router-link>
    </div>
  </AuthLayout>
</template>
