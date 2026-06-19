<template>
  <MainLayout title="Roles">
    <div class="space-y-4">
      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1.5 text-sm text-gray-600 shrink-0">
            <span>Show</span>
            <div class="relative">
              <select
                v-model="perPage"
                @change="handlePerPage"
                class="h-9 pl-3 pr-7 rounded-lg border border-gray-300 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
              >
                <option v-for="n in PER_PAGE_OPTIONS" :key="n" :value="n">{{ n === ALL_LABEL ? 'All' : n }}</option>
              </select>
              <ChevronDown :size="13" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <span>entries</span>
          </div>
          <div class="relative flex items-center">
            <span class="absolute left-3 text-gray-400 pointer-events-none"><Search :size="15" /></span>
            <input
              v-model="search"
              @input="handleSearch"
              placeholder="Search roles..."
              class="w-full sm:w-64 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pl-10 pr-3 py-2 h-9"
            />
          </div>
        </div>
        <div class="flex gap-2 shrink-0">
          <AppButton variant="outline" size="sm" :icon="RefreshCw" @click="fetchRoles">Refresh</AppButton>
          <AppButton v-if="can('role:create')" size="sm" :icon="Plus" @click="openCreate">Add Role</AppButton>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <AppSpinner v-if="loading" class-name="py-16" />
        <table v-else class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              <th class="px-4 py-3 w-10 text-center">#</th>
              <th class="px-4 py-3">Role</th>
              <th class="px-4 py-3 hidden md:table-cell">Permissions</th>
              <th class="px-4 py-3 hidden sm:table-cell">Created</th>
              <th v-if="hasAnyRowAction" class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="roles.length === 0">
              <td :colspan="hasAnyRowAction ? 5 : 4" class="text-center py-12 text-gray-400">No roles found</td>
            </tr>
            <tr v-for="(r, idx) in roles" :key="r.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-4 py-3 text-center text-xs text-gray-400 font-mono tabular-nums">{{ rowNum(idx) }}</td>
              <td class="px-4 py-3">
                <p class="font-medium text-gray-900">{{ r.name }}</p>
                <p v-if="r.description" class="text-xs text-gray-400 mt-0.5">{{ r.description }}</p>
              </td>
              <td class="px-4 py-3 hidden md:table-cell">
                <AppBadge variant="info">{{ r.permissions?.length ?? 0 }} permissions</AppBadge>
              </td>
              <td class="px-4 py-3 hidden sm:table-cell text-gray-400 text-xs">
                {{ new Date(r.created_at).toLocaleDateString() }}
              </td>
              <td v-if="hasAnyRowAction" class="px-4 py-3">
                <div class="flex items-center justify-end gap-1">
                  <AppButton v-if="can('role:edit')" variant="ghost" size="sm" :icon="Pencil" @click="openEdit(r)" title="Edit" />
                  <AppButton
                    v-if="can('role:delete')"
                    variant="ghost" size="sm" :icon="Trash2"
                    class="text-red-500 hover:bg-red-50"
                    @click="deleteTarget = r"
                    title="Delete"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!loading && meta.total > 0 && perPage !== ALL_LABEL" class="border-t border-gray-100 px-4">
          <AppPagination :meta="meta" @change="page = $event; fetchRoles()" />
        </div>
        <div v-if="!loading && meta.total > 0 && perPage === ALL_LABEL" class="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
          Showing all {{ meta.total }} results
        </div>
      </div>
    </div>

    <RoleFormModal
      v-if="can('role:create') || can('role:edit')"
      :open="formOpen"
      :role="editRole"
      :permissions="permissions"
      @close="formOpen = false"
      @success="formOpen = false; fetchRoles()"
    />
    <AppConfirmDialog
      v-if="can('role:delete')"
      :open="!!deleteTarget"
      :message="`Delete role &quot;${deleteTarget?.name}&quot;? Users assigned to this role will lose access.`"
      :loading="deleting"
      @close="deleteTarget = null"
      @confirm="handleDelete"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Search, Pencil, Trash2, RefreshCw, ChevronDown } from '@lucide/vue'
import { useToast } from 'vue-toastification'
import MainLayout from '@/components/layout/MainLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import AppConfirmDialog from '@/components/ui/AppConfirmDialog.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import RoleFormModal from './RoleFormModal.vue'
import { rolesApi } from '@/api/roles'
import { lookupApi } from '@/api/lookup'
import { usePermission } from '@/composables/usePermission'
import type { Role, Permission, PageMeta } from '@/types'

const PER_PAGE_OPTIONS = [10, 25, 50, 100, 9999] as const
const ALL_LABEL = 9999

const toast = useToast()
const { can } = usePermission()

const roles = ref<Role[]>([])
const permissions = ref<Permission[]>([])
const meta = ref<PageMeta>({ page: 1, per_page: 10, total: 0, total_page: 1 })
const search = ref('')
const page = ref(1)
const perPage = ref(10)
const loading = ref(false)
const formOpen = ref(false)
const editRole = ref<Role | null>(null)
const deleteTarget = ref<Role | null>(null)
const deleting = ref(false)

const hasAnyRowAction = computed(() => can('role:edit') || can('role:delete'))

async function fetchRoles() {
  loading.value = true
  try {
    const res = await rolesApi.list({ page: page.value, per_page: perPage.value, search: search.value })
    roles.value = res.data.data ?? []
    if (res.data.meta) meta.value = res.data.meta
  } finally {
    loading.value = false
  }
}

function handlePerPage() { page.value = 1; fetchRoles() }
function handleSearch() { page.value = 1; fetchRoles() }
function openCreate() { editRole.value = null; formOpen.value = true }
function openEdit(r: Role) { editRole.value = r; formOpen.value = true }
function rowNum(idx: number) { return (page.value - 1) * perPage.value + idx + 1 }

async function handleDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await rolesApi.delete(deleteTarget.value.id)
    toast.success('Role deleted')
    deleteTarget.value = null
    fetchRoles()
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchRoles()
  lookupApi.permissions().then((r) => { permissions.value = r.data.data ?? [] })
})
</script>
