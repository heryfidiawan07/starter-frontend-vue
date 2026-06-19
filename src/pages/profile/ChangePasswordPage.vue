<template>
  <MainLayout title="Change Password">
    <div class="max-w-md">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-sm font-semibold text-gray-800 mb-4">Update Password</h2>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Current Password <span class="text-red-500 ml-0.5">*</span></label>
            <div class="relative flex items-center">
              <span class="absolute left-3 text-gray-400 pointer-events-none"><Lock :size="15" /></span>
              <input
                v-model="form.current_password"
                :type="showCurrent ? 'text' : 'password'"
                placeholder="Enter current password"
                :class="[
                  'w-full rounded-lg border bg-white text-sm text-gray-900 placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  'pl-10 pr-10 py-2 h-9',
                  errors.current_password ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
                ]"
              />
              <span class="absolute right-3 flex items-center">
                <button type="button" @click="showCurrent = !showCurrent" class="text-gray-400 hover:text-gray-600">
                  <EyeOff v-if="showCurrent" :size="15" /><Eye v-else :size="15" />
                </button>
              </span>
            </div>
            <p v-if="errors.current_password" class="text-xs text-red-500">{{ errors.current_password }}</p>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">New Password <span class="text-red-500 ml-0.5">*</span></label>
            <div class="relative flex items-center">
              <span class="absolute left-3 text-gray-400 pointer-events-none"><Lock :size="15" /></span>
              <input
                v-model="form.new_password"
                :type="showNew ? 'text' : 'password'"
                placeholder="Min. 8 characters"
                :class="[
                  'w-full rounded-lg border bg-white text-sm text-gray-900 placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  'pl-10 pr-10 py-2 h-9',
                  errors.new_password ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
                ]"
              />
              <span class="absolute right-3 flex items-center">
                <button type="button" @click="showNew = !showNew" class="text-gray-400 hover:text-gray-600">
                  <EyeOff v-if="showNew" :size="15" /><Eye v-else :size="15" />
                </button>
              </span>
            </div>
            <p v-if="errors.new_password" class="text-xs text-red-500">{{ errors.new_password }}</p>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Confirm New Password <span class="text-red-500 ml-0.5">*</span></label>
            <div class="relative flex items-center">
              <span class="absolute left-3 text-gray-400 pointer-events-none"><Lock :size="15" /></span>
              <input
                v-model="form.confirm_password"
                :type="showNew ? 'text' : 'password'"
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

          <AppButton type="submit" :loading="loading" :icon="ShieldCheck">Change Password</AppButton>
        </form>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Lock, Eye, EyeOff, ShieldCheck } from '@lucide/vue'
import { useToast } from 'vue-toastification'
import { z } from 'zod'
import MainLayout from '@/components/layout/MainLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { authApi } from '@/api/auth'

const toast = useToast()
const showCurrent = ref(false)
const showNew = ref(false)
const loading = ref(false)

const form = reactive({ current_password: '', new_password: '', confirm_password: '' })
const errors = reactive({ current_password: '', new_password: '', confirm_password: '' })

const schema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

async function onSubmit() {
  errors.current_password = ''; errors.new_password = ''; errors.confirm_password = ''

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
    await authApi.changePassword(form.current_password, form.new_password)
    toast.success('Password changed successfully')
    form.current_password = ''; form.new_password = ''; form.confirm_password = ''
  } catch {
    // handled
  } finally {
    loading.value = false
  }
}
</script>
