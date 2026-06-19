<template>
  <AuthLayout title="Forgot Password" subtitle="Enter your email and we'll send you a reset link">
    <!-- Success state -->
    <div v-if="submitted" class="text-center space-y-4">
      <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Mail :size="22" class="text-green-600" />
      </div>
      <p class="text-sm text-gray-600">
        If the email exists in our system, you'll receive a password reset link shortly.
      </p>
      <RouterLink to="/login">
        <AppButton variant="outline" class="w-full" :icon="ArrowLeft">Back to Sign In</AppButton>
      </RouterLink>
    </div>

    <!-- Form state -->
    <form v-else @submit.prevent="onSubmit" class="space-y-4">
      <AppInput
        v-model="email"
        label="Email"
        type="email"
        required
        placeholder="you@example.com"
        :left-icon="Mail"
        :error="emailError"
      />
      <AppButton type="submit" class="w-full" :loading="loading" :icon="Send">
        Send Reset Link
      </AppButton>
      <RouterLink to="/login">
        <AppButton variant="ghost" class="w-full" :icon="ArrowLeft">Back to Sign In</AppButton>
      </RouterLink>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Send, ArrowLeft } from '@lucide/vue'
import { useToast } from 'vue-toastification'
import { z } from 'zod'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { authApi } from '@/api/auth'

const toast = useToast()
const email = ref('')
const emailError = ref('')
const loading = ref(false)
const submitted = ref(false)

const schema = z.object({ email: z.string().email('Invalid email') })

async function onSubmit() {
  emailError.value = ''
  const result = schema.safeParse({ email: email.value })
  if (!result.success) {
    emailError.value = result.error.issues[0]?.message ?? ''
    return
  }

  loading.value = true
  try {
    await authApi.forgotPassword(email.value)
    toast.success('Check your email for a reset link')
    submitted.value = true
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>
