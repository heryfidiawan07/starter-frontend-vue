<template>
  <AppModal :open="open" :title="title" size="sm" @close="$emit('close')">
    <div class="flex flex-col items-center gap-4 text-center">
      <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
        <AlertTriangle class="text-red-600" :size="24" />
      </div>
      <p class="text-sm text-gray-600">{{ message }}</p>
      <div class="flex gap-3 w-full">
        <AppButton variant="outline" class="flex-1" @click="$emit('close')">
          Cancel
        </AppButton>
        <AppButton variant="danger" class="flex-1" :loading="loading" @click="$emit('confirm')">
          {{ confirmLabel }}
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { AlertTriangle } from '@lucide/vue'
import AppModal from './AppModal.vue'
import AppButton from './AppButton.vue'

withDefaults(defineProps<{
  open: boolean
  message: string
  title?: string
  confirmLabel?: string
  loading?: boolean
}>(), {
  title: 'Confirm Action',
  confirmLabel: 'Delete',
  loading: false,
})

defineEmits<{ close: []; confirm: [] }>()
</script>
