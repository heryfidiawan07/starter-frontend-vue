<template>
  <MainLayout title="Users">
    <div class="space-y-4">
      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        <div class="flex items-center gap-2">
          <!-- Per-page -->
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
              placeholder="Search by name or email..."
              class="w-full sm:w-64 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pl-10 pr-3 py-2 h-9"
            />
          </div>
        </div>
        <div class="flex gap-2 shrink-0">
          <AppButton variant="outline" size="sm" :icon="RefreshCw" @click="fetchUsers">Refresh</AppButton>
          <AppButton v-if="can('user:create')" size="sm" :icon="Plus" @click="openCreate">Add User</AppButton>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <AppSpinner v-if="loading" class-name="py-16" />
        <table v-else class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              <th class="px-4 py-3 w-10 text-center">#</th>
              <th class="px-4 py-3">User</th>
              <th class="px-4 py-3 hidden md:table-cell">Role</th>
              <th class="px-4 py-3 hidden sm:table-cell">Status</th>
              <th v-if="hasAnyRowAction" class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="users.length === 0">
              <td :colspan="hasAnyRowAction ? 5 : 4" class="text-center py-12 text-gray-400">No users found</td>
            </tr>
            <tr v-for="(u, idx) in users" :key="u.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-4 py-3 text-center text-xs text-gray-400 font-mono tabular-nums">{{ rowNum(idx) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <AppAvatar :src="u.photo" :name="u.name" size="sm" />
                  <div>
                    <div class="flex items-center gap-1.5">
                      <span class="font-medium text-gray-900">{{ u.name }}</span>
                      <AppBadge v-if="u.is_root" variant="info">Root</AppBadge>
                    </div>
                    <p class="text-xs text-gray-400">{{ u.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 hidden md:table-cell">
                <span class="text-gray-600">{{ u.role?.name ?? '—' }}</span>
              </td>
              <td class="px-4 py-3 hidden sm:table-cell">
                <AppBadge v-if="u.is_active" variant="success">
                  <span class="flex items-center gap-1"><ShieldCheck :size="10" />Active</span>
                </AppBadge>
                <AppBadge v-else variant="danger">
                  <span class="flex items-center gap-1"><ShieldOff :size="10" />Inactive</span>
                </AppBadge>
              </td>
              <td v-if="hasAnyRowAction" class="px-4 py-3">
                <div class="flex items-center justify-end gap-1">
                  <AppButton v-if="can('user:edit') && !u.is_root" variant="ghost" size="sm" :icon="Image" @click="openPhoto(u)" title="Upload photo" />
                  <AppButton v-if="can('user:edit') && !u.is_root" variant="ghost" size="sm" :icon="Pencil" @click="openEdit(u)" title="Edit" />
                  <AppButton
                    v-if="can('user:delete') && !u.is_root"
                    variant="ghost" size="sm" :icon="Trash2"
                    class="text-red-500 hover:bg-red-50"
                    @click="deleteTarget = u"
                    title="Delete"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!loading && meta.total > 0 && perPage !== ALL_LABEL" class="border-t border-gray-100 px-4">
          <AppPagination :meta="meta" @change="page = $event; fetchUsers()" />
        </div>
        <div v-if="!loading && meta.total > 0 && perPage === ALL_LABEL" class="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
          Showing all {{ meta.total }} results
        </div>
      </div>
    </div>

    <UserFormModal
      v-if="can('user:create') || can('user:edit')"
      :open="formOpen"
      :user="editUser"
      :roles="roles"
      @close="formOpen = false"
      @success="formOpen = false; fetchUsers()"
    />
    <PhotoUploadModal
      v-if="can('user:edit')"
      :open="photoOpen"
      :user="photoUser"
      @close="photoOpen = false"
      @success="photoOpen = false; fetchUsers()"
    />
    <AppConfirmDialog
      v-if="can('user:delete')"
      :open="!!deleteTarget"
      :message="`Delete user &quot;${deleteTarget?.name}&quot;? This action cannot be undone.`"
      :loading="deleting"
      @close="deleteTarget = null"
      @confirm="handleDelete"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Search, Pencil, Trash2, Image, RefreshCw, ShieldCheck, ShieldOff, ChevronDown } from '@lucide/vue'
import { useToast } from 'vue-toastification'
import MainLayout from '@/components/layout/MainLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppAvatar from '@/components/ui/AppAvatar.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import AppConfirmDialog from '@/components/ui/AppConfirmDialog.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import UserFormModal from './UserFormModal.vue'
import PhotoUploadModal from './PhotoUploadModal.vue'
import { usersApi } from '@/api/users'
import { lookupApi } from '@/api/lookup'
import { usePermission } from '@/composables/usePermission'
import type { User, Role, PageMeta } from '@/types'

const PER_PAGE_OPTIONS = [10, 25, 50, 100, 9999] as const
const ALL_LABEL = 9999

const toast = useToast()
const { can } = usePermission()

const users = ref<User[]>([])
const roles = ref<Role[]>([])
const meta = ref<PageMeta>({ page: 1, per_page: 10, total: 0, total_page: 1 })
const search = ref('')
const page = ref(1)
const perPage = ref(10)
const loading = ref(false)
const formOpen = ref(false)
const photoOpen = ref(false)
const editUser = ref<User | null>(null)
const photoUser = ref<User | null>(null)
const deleteTarget = ref<User | null>(null)
const deleting = ref(false)

const hasAnyRowAction = computed(() => can('user:edit') || can('user:delete'))

async function fetchUsers() {
  loading.value = true
  try {
    const res = await usersApi.list({ page: page.value, per_page: perPage.value, search: search.value })
    users.value = res.data.data ?? []
    if (res.data.meta) meta.value = res.data.meta
  } finally {
    loading.value = false
  }
}

function handlePerPage() { page.value = 1; fetchUsers() }
function handleSearch() { page.value = 1; fetchUsers() }
function openCreate() { editUser.value = null; formOpen.value = true }
function openEdit(u: User) { editUser.value = u; formOpen.value = true }
function openPhoto(u: User) { photoUser.value = u; photoOpen.value = true }
function rowNum(idx: number) { return (page.value - 1) * perPage.value + idx + 1 }

async function handleDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await usersApi.delete(deleteTarget.value.id)
    toast.success('User deleted')
    deleteTarget.value = null
    fetchUsers()
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchUsers()
  lookupApi.roles().then((r) => { roles.value = (r.data.data ?? []) as Role[] })
})
</script>
