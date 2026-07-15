<template>
  <AppModal :open="open" :title="isEdit ? 'Edit Role' : 'Add New Role'" size="2xl" @close="$emit('close')">
    <form @submit.prevent="onSubmit" class="space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppInput v-model="form.name" label="Role Name" required placeholder="e.g. Editor" :error="errors.name" />
        <AppInput v-model="form.description" label="Description" placeholder="What this role can do..." />
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700">Permissions</label>
          <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{{ selected.size }} selected</span>
        </div>
        <PermissionTree
          :permissions="permissions"
          :selected="selected"
          @toggle="toggle"
          @check-menu="checkMenu"
          @uncheck-menu="uncheckMenu"
        />
        <p class="text-xs text-gray-400">
          Centang nama menu untuk akses buka page. Actions hanya aktif jika menu-nya dicentang.
        </p>
      </div>

      <div class="flex gap-3 pt-1 border-t border-gray-100">
        <AppButton type="button" variant="outline" class="flex-1" @click="$emit('close')">Cancel</AppButton>
        <AppButton type="submit" class="flex-1" :loading="loading" :icon="Save">
          {{ isEdit ? 'Save Changes' : 'Create Role' }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Save } from '@lucide/vue'
import { useToast } from 'vue-toastification'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import PermissionTree from './PermissionTree.vue'
import { rolesApi } from '@/api/roles'
import type { Role, Permission } from '@/types'

const props = defineProps<{
  open: boolean
  role: Role | null
  permissions: Permission[]
}>()

const emit = defineEmits<{ close: []; success: [] }>()

const toast = useToast()
const loading = ref(false)
const isEdit = computed(() => !!props.role)

const form = reactive({ name: '', description: '' })
const errors = reactive({ name: '' })
const selected = ref<Set<string>>(new Set())

watch(() => props.open, (val) => {
  if (val) {
    form.name = props.role?.name ?? ''
    form.description = props.role?.description ?? ''
    selected.value = new Set(props.role?.permissions?.map((p) => p.id) ?? [])
    errors.name = ''
  }
})

function toggle(id: string) {
  const next = new Set(selected.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selected.value = next
}

function checkMenu(id: string) {
  const next = new Set(selected.value)
  next.add(id)
  selected.value = next
}

function uncheckMenu(id: string, actionIds: string[]) {
  const next = new Set(selected.value)
  next.delete(id)
  actionIds.forEach((aid) => next.delete(aid))
  selected.value = next
}

async function onSubmit() {
  errors.name = ''
  if (!form.name) { errors.name = 'Name is required'; return }

  loading.value = true
  try {
    const allSelectedIds = new Set(selected.value)
    selected.value.forEach(id => {
      let curr = id
      while (true) {
        const p = props.permissions.find(x => x.id === curr)
        if (!p || !p.parent_id) break
        allSelectedIds.add(p.parent_id)
        curr = p.parent_id
      }
    })
    const payload = { name: form.name, description: form.description, permission_ids: Array.from(allSelectedIds) }
    if (isEdit.value) {
      await rolesApi.update(props.role!.id, payload)
      toast.success('Role updated')
    } else {
      await rolesApi.create(payload)
      toast.success('Role created')
    }
    emit('success')
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>
