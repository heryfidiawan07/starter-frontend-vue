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
    <!-- Social login divider -->
    <div class="relative my-5">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-200" />
      </div>
      <div class="relative flex justify-center text-xs">
        <span class="bg-white px-3 text-gray-400">Or continue with</span>
      </div>
    </div>

    <!-- Social login buttons -->
    <div class="grid grid-cols-2 gap-3">
      <button
        type="button"
        @click="loginWithGoogle"
        class="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </button>
      <button
        type="button"
        @click="loginWithFacebook"
        class="flex items-center justify-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2 text-sm font-medium text-white hover:bg-[#166fe5] transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white">
          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z"/>
        </svg>
        Facebook
      </button>
    </div>

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
import { useSocialAuth } from '@/composables/useSocialAuth'

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

const { loginWithGoogle, loginWithFacebook } = useSocialAuth()

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
    router.push('/admin/dashboard')
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>
