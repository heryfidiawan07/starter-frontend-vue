<template>
  <AppModal :open="open" title="Upload Photo" size="sm" @close="handleClose">
    <div class="flex flex-col items-center gap-5">
      <div class="relative w-24 h-24 cursor-pointer group" @click="fileInput?.click()">
        <AppAvatar :src="preview ?? user?.photo" :name="user?.name" size="lg" />
        <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ImagePlus :size="20" class="text-white" />
        </div>
      </div>

      <div
        class="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
        @click="fileInput?.click()"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <Upload :size="20" class="text-gray-400 mx-auto mb-2" />
        <p class="text-sm text-gray-600 font-medium">Click or drag to upload</p>
        <p class="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — max 2MB</p>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="hidden"
        @change="handleFileChange"
      />

      <div class="flex gap-3 w-full">
        <AppButton variant="outline" class="flex-1" @click="handleClose">Cancel</AppButton>
        <AppButton class="flex-1" :disabled="!file" :loading="uploading" :icon="Upload" @click="handleUpload">
          Upload
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload, ImagePlus } from '@lucide/vue'
import { useToast } from 'vue-toastification'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppAvatar from '@/components/ui/AppAvatar.vue'
import { usersApi } from '@/api/users'
import { authApi } from '@/api/auth'
import type { User } from '@/types'

const props = defineProps<{
  open: boolean
  user: User | null
  isProfile?: boolean
}>()

const emit = defineEmits<{ close: []; success: [] }>()

const toast = useToast()
const fileInput = ref<HTMLInputElement | null>(null)
const preview = ref<string | null>(null)
const file = ref<File | null>(null)
const uploading = ref(false)

function handleFile(f: File) {
  file.value = f
  preview.value = URL.createObjectURL(f)
}

function handleFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) handleFile(f)
}

function handleDrop(e: DragEvent) {
  const f = e.dataTransfer?.files[0]
  if (f) handleFile(f)
}

async function handleUpload() {
  if (!file.value || !props.user) return
  uploading.value = true
  try {
    if (props.isProfile) {
      await authApi.uploadPhoto(file.value)
    } else {
      await usersApi.uploadPhoto(props.user.id, file.value)
    }
    toast.success('Photo updated')
    preview.value = null
    file.value = null
    emit('success')
  } finally {
    uploading.value = false
  }
}

function handleClose() {
  preview.value = null
  file.value = null
  emit('close')
}
</script>
