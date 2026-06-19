<template>
  <AuthLayout title="Sign In" subtitle="Welcome back, please sign in to continue">
    <form @submit.prevent="onSubmit" class="space-y-4">
      <AppInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        :left-icon="Mail"
        :error="errors.email"
      />
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">Password</label>
        <div class="relative flex items-center">
          <span class="absolute left-3 text-gray-400 pointer-events-none">
            <Lock :size="15" />
          </span>
          <input
            v-model="form.password"
            :type="showPw ? 'text' : 'password'"
            placeholder="Enter password"
            :class="[
              'w-full rounded-lg border bg-white text-sm text-gray-900 placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'pl-10 pr-10 py-2 h-9',
              errors.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
            ]"
          />
          <span class="absolute right-3 flex items-center">
            <button type="button" @click="showPw = !showPw" class="text-gray-400 hover:text-gray-600">
              <EyeOff v-if="showPw" :size="15" />
              <Eye v-else :size="15" />
            </button>
          </span>
        </div>
        <p v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</p>
      </div>
      <div class="text-right">
        <RouterLink to="/forgot-password" class="text-xs text-primary-600 hover:underline">
          Forgot password?
        </RouterLink>
      </div>
      <AppButton type="submit" class="w-full" :loading="loading" :icon="LogIn">
        Sign In
      </AppButton>
    </form>
    <p class="mt-5 text-center text-sm text-gray-500">
      Don't have an account?
      <RouterLink to="/register" class="text-primary-600 font-medium hover:underline">Register</RouterLink>
    </p>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Eye, EyeOff, LogIn } from '@lucide/vue'
import { useToast } from 'vue-toastification'
import { z } from 'zod'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const showPw = ref(false)
const loading = ref(false)

const form = reactive({ email: 'root@example.com', password: 'password' })
const errors = reactive({ email: '', password: '' })

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

async function onSubmit() {
  errors.email = ''
  errors.password = ''

  const result = schema.safeParse(form)
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof typeof errors
      if (field in errors) errors[field] = issue.message
    })
    return
  }

  loading.value = true
  try {
    const res = await authApi.login(form.email, form.password)
    const { access_token, refresh_token, user } = res.data.data!
    authStore.setAuth(user, access_token, refresh_token)
    toast.success('Welcome back!')
    router.push('/dashboard')
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>
