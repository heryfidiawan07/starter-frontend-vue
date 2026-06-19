<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
    <!-- Code -->
    <div class="relative select-none mb-2">
      <span class="text-[120px] sm:text-[160px] font-black text-gray-100 leading-none tracking-tighter block">
        {{ code }}
      </span>
      <span class="absolute inset-0 flex items-center justify-center text-[120px] sm:text-[160px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary-400 to-primary-700">
        {{ code }}
      </span>
    </div>

    <!-- Content -->
    <div class="text-center max-w-sm">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ title }}</h1>
      <p class="text-sm text-gray-500 leading-relaxed mb-8">{{ description }}</p>

      <slot>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <AppButton variant="outline" :icon="ArrowLeft" @click="router.go(-1)">Go Back</AppButton>
          <AppButton :icon="Home" @click="router.push('/')">Go Home</AppButton>
        </div>
      </slot>
    </div>

    <p class="mt-12 text-xs text-gray-300">StarterApp</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, Home } from '@lucide/vue'
import AppButton from '@/components/ui/AppButton.vue'

defineProps<{
  code: string
  title: string
  description: string
}>()

const router = useRouter()
</script>
