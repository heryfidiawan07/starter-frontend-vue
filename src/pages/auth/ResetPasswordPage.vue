<template>
  <AuthLayout title="Reset Password" subtitle="Enter your new password below">
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">
          New Password <span class="text-red-500 ml-0.5">*</span>
        </label>
        <div class="relative flex items-center">
          <span class="absolute left-3 text-gray-400 pointer-events-none"><Lock :size="15" /></span>
          <input
            v-model="form.new_password"
            :type="showPw ? 'text' : 'password'"
            placeholder="Min. 8 characters"
            :class="[
              'w-full rounded-lg border bg-white text-sm text-gray-900 placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'pl-10 pr-10 py-2 h-9',
              errors.new_password ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
            ]"
          />
          <span class="absolute right-3 flex items-center">
            <button type="button" @click="showPw = !showPw" class="text-gray-400 hover:text-gray-600">
              <EyeOff v-if="showPw" :size="15" /><Eye v-else :size="15" />
            </button>
          </span>
        </div>
        <p v-if="errors.new_password" class="text-xs text-red-500">{{ errors.new_password }}</p>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">
          Confirm Password <span class="text-red-500 ml-0.5">*</span>
        </label>
        <div class="relative flex items-center">
          <span class="absolute left-3 text-gray-400 pointer-events-none"><Lock :size="15" /></span>
          <input
            v-model="form.confirm_password"
            :type="showPw ? 'text' : 'password'"
            placeholder="Repeat new password"
            :class="[
              'w-full rounded-lg border bg-white text-sm text-gray-900 placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'pl-10 pr-3 py-2 h-9',
              errors.confirm_password ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
            ]"
          />
        </div>
        <p v-if="errors.confirm_password" class="text-xs text-red-500">{{ errors.confirm_password }}</p>
      </div>

      <AppButton type="submit" class="w-full" :loading="loading" :icon="KeyRound">
        Reset Password
      </AppButton>
      <RouterLink to="/login">
        <AppButton variant="ghost" class="w-full" :icon="ArrowLeft">Back to Sign In</AppButton>
      </RouterLink>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Lock, Eye, EyeOff, KeyRound, ArrowLeft } from '@lucide/vue'
import { useToast } from 'vue-toastification'
import { z } from 'zod'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { authApi } from '@/api/auth'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const showPw = ref(false)
const loading = ref(false)

const token = (route.query.token as string) ?? ''
const form = reactive({ new_password: '', confirm_password: '' })
const errors = reactive({ new_password: '', confirm_password: '' })

const schema = z.object({
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

async function onSubmit() {
  errors.new_password = ''; errors.confirm_password = ''
  const result = schema.safeParse(form)
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof typeof errors
      if (field in errors) errors[field] = issue.message
    })
    return
  }
  if (!token) { toast.error('Invalid reset token'); return }

  loading.value = true
  try {
    await authApi.resetPassword(token, form.new_password)
    toast.success('Password reset successfully')
    router.push('/login')
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>
