<template>
  <AuthLayout title="Create Account" subtitle="Fill in the form to get started">
    <form @submit.prevent="onSubmit" class="space-y-4">
      <AppInput
        v-model="form.name"
        label="Full Name"
        required
        placeholder="John Doe"
        :left-icon="User"
        :error="errors.name"
      />
      <AppInput
        v-model="form.email"
        label="Email"
        type="email"
        required
        placeholder="you@example.com"
        :left-icon="Mail"
        :error="errors.email"
      />
      <AppInput
        v-model="form.username"
        label="Username"
        placeholder="johndoe"
        :left-icon="AtSign"
        :error="errors.username"
      />
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">
          Password <span class="text-red-500 ml-0.5">*</span>
        </label>
        <div class="relative flex items-center">
          <span class="absolute left-3 text-gray-400 pointer-events-none">
            <Lock :size="15" />
          </span>
          <input
            v-model="form.password"
            :type="showPw ? 'text' : 'password'"
            placeholder="Min. 8 characters"
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
      <AppButton type="submit" class="w-full" :loading="loading" :icon="UserPlus">
        Create Account
      </AppButton>
    </form>
    <p class="mt-5 text-center text-sm text-gray-500">
      Already have an account?
      <RouterLink to="/login" class="text-primary-600 font-medium hover:underline">Sign in</RouterLink>
    </p>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Eye, EyeOff, User, AtSign, UserPlus } from '@lucide/vue'
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

const form = reactive({ name: '', email: '', username: '', password: '' })
const errors = reactive({ name: '', email: '', username: '', password: '' })

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email'),
  username: z.string().min(3, 'Username must be at least 3 characters').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

async function onSubmit() {
  errors.name = ''; errors.email = ''; errors.username = ''; errors.password = ''

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
    const res = await authApi.register({
      name: form.name,
      email: form.email,
      username: form.username || undefined,
      password: form.password,
    })
    if (res.data.data?.access_token) {
      const { access_token, refresh_token, user } = res.data.data
      authStore.setAuth(user, access_token, refresh_token)
      toast.success('Account created successfully!')
      router.push('/dashboard')
    } else {
      toast.success(res.data.message)
      router.push('/login')
    }
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>
