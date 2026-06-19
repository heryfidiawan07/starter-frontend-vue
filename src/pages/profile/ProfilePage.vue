<template>
  <MainLayout title="My Profile">
    <div class="max-w-xl space-y-5">
      <!-- Photo section -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-sm font-semibold text-gray-800 mb-4">Profile Photo</h2>
        <div class="flex items-center gap-5">
          <AppAvatar :src="user?.photo" :name="user?.name" size="lg" />
          <div>
            <p class="font-medium text-gray-800">{{ user?.name }}</p>
            <p class="text-sm text-gray-400">{{ user?.email }}</p>
            <div class="flex items-center gap-2 mt-1.5">
              <AppBadge v-if="user?.is_root" variant="info">Root</AppBadge>
              <AppBadge v-if="user?.role" variant="gray">{{ user.role.name }}</AppBadge>
            </div>
            <AppButton variant="outline" size="sm" :icon="Camera" class="mt-3" @click="photoOpen = true">
              Change Photo
            </AppButton>
          </div>
        </div>
      </div>

      <!-- Profile info -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-sm font-semibold text-gray-800 mb-4">Profile Information</h2>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <AppInput v-model="form.name" label="Full Name" required placeholder="John Doe" :error="errors.name" />
          <AppInput v-model="form.username" label="Username" placeholder="johndoe" :error="errors.username" />
          <AppInput :model-value="user?.email ?? ''" label="Email" type="email" disabled />
          <AppButton type="submit" :loading="loading" :icon="Save">Save Changes</AppButton>
        </form>
      </div>
    </div>

    <PhotoUploadModal
      :open="photoOpen"
      :user="user"
      :is-profile="true"
      @close="photoOpen = false"
      @success="handlePhotoSuccess"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Save, Camera } from '@lucide/vue'
import { useToast } from 'vue-toastification'
import { storeToRefs } from 'pinia'
import MainLayout from '@/components/layout/MainLayout.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppAvatar from '@/components/ui/AppAvatar.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import PhotoUploadModal from '@/pages/users/PhotoUploadModal.vue'

const toast = useToast()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const photoOpen = ref(false)
const loading = ref(false)
const form = reactive({ name: user.value?.name ?? '', username: user.value?.username ?? '' })
const errors = reactive({ name: '', username: '' })

watch(user, (u) => {
  if (u) {
    form.name = u.name
    form.username = u.username ?? ''
  }
})

async function onSubmit() {
  errors.name = ''
  if (!form.name) { errors.name = 'Name is required'; return }

  loading.value = true
  try {
    const res = await authApi.updateProfile({ name: form.name, username: form.username || undefined })
    if (res.data.data) authStore.setUser(res.data.data)
    toast.success('Profile updated')
  } catch {
    // handled
  } finally {
    loading.value = false
  }
}

async function handlePhotoSuccess() {
  photoOpen.value = false
  try {
    const res = await authApi.me()
    if (res.data.data) authStore.setUser(res.data.data)
  } catch {}
}
</script>
