<template>
  <AppModal :open="open" :title="isEdit ? 'Edit User' : 'Add New User'" size="xl" @close="$emit('close')">
    <form @submit.prevent="onSubmit" class="space-y-5">
      <!-- Personal Info -->
      <div class="space-y-3">
        <p class="text-[11px] font-semibold uppercase tracking-widest text-gray-400 pb-1 border-b border-gray-100">
          Personal Information
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppInput
            v-model="form.name"
            label="Full Name"
            required
            placeholder="John Doe"
            :left-icon="UserIcon"
            :error="errors.name"
          />
          <AppInput
            v-model="form.email"
            label="Email Address"
            type="email"
            required
            placeholder="john@example.com"
            :left-icon="Mail"
            :error="errors.email"
          />
        </div>
      </div>

      <!-- Credentials -->
      <div class="space-y-3">
        <p class="text-[11px] font-semibold uppercase tracking-widest text-gray-400 pb-1 border-b border-gray-100">
          Credentials
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppInput
            v-model="form.username"
            label="Username"
            placeholder="johndoe"
            :left-icon="AtSign"
            :error="errors.username"
          />
          <AppInput
            v-model="form.password"
            :label="isEdit ? 'New Password' : 'Password'"
            type="password"
            :required="!isEdit"
            :placeholder="isEdit ? 'Leave blank to keep current' : 'Min. 8 characters'"
            :left-icon="Lock"
            :error="errors.password"
          />
        </div>
      </div>

      <!-- Access & Status -->
      <div class="space-y-3">
        <p class="text-[11px] font-semibold uppercase tracking-widest text-gray-400 pb-1 border-b border-gray-100">
          Access & Status
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppSelect
            v-model="form.role_id"
            label="Role"
            :options="roleOptions"
            :left-icon="Shield"
            :error="errors.role_id"
          />
          <AppSelect
            v-model="form.is_active"
            label="Account Status"
            :options="[{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }]"
            :left-icon="ToggleLeft"
            :error="errors.is_active"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-1 border-t border-gray-100">
        <AppButton type="button" variant="outline" class="flex-1" @click="$emit('close')">Cancel</AppButton>
        <AppButton type="submit" class="flex-1" :loading="loading" :icon="Save">
          {{ isEdit ? 'Save Changes' : 'Create User' }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Save, User as UserIcon, Mail, AtSign, Lock, Shield, ToggleLeft } from '@lucide/vue'
import { useToast } from 'vue-toastification'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { usersApi } from '@/api/users'
import type { User, Role } from '@/types'

const props = defineProps<{
  open: boolean
  user: User | null
  roles: Role[]
}>()

const emit = defineEmits<{ close: []; success: [] }>()

const toast = useToast()
const loading = ref(false)
const isEdit = computed(() => !!props.user)

const form = reactive({ name: '', email: '', username: '', password: '', role_id: '', is_active: 'true' })
const errors = reactive({ name: '', email: '', username: '', password: '', role_id: '', is_active: '' })

const roleOptions = computed(() => [
  { value: '', label: 'No role assigned' },
  ...props.roles.map((r) => ({ value: r.id, label: r.name })),
])

watch(() => props.open, (val) => {
  if (val) {
    form.name     = props.user?.name ?? ''
    form.email    = props.user?.email ?? ''
    form.username = props.user?.username ?? ''
    form.password = ''
    form.role_id  = props.user?.role_id ?? ''
    form.is_active = props.user ? (props.user.is_active ? 'true' : 'false') : 'true'
    Object.keys(errors).forEach((k) => { (errors as Record<string, string>)[k] = '' })
  }
})

async function onSubmit() {
  Object.keys(errors).forEach((k) => { (errors as Record<string, string>)[k] = '' })

  if (!form.name) { errors.name = 'Name is required'; return }
  if (!form.email) { errors.email = 'Invalid email'; return }
  if (!isEdit.value && !form.password) { toast.error('Password is required'); return }

  loading.value = true
  try {
    const payload = {
      name:      form.name,
      email:     form.email,
      username:  form.username || undefined,
      role_id:   form.role_id || null,
      is_active: form.is_active === 'true',
      ...(form.password ? { password: form.password } : {}),
    }
    if (isEdit.value) {
      await usersApi.update(props.user!.id, payload)
      toast.success('User updated')
    } else {
      await usersApi.create({ ...payload, password: form.password })
      toast.success('User created')
    }
    emit('success')
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>
