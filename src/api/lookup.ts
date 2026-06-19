import api from './axios'
import type { ApiResponse, Role, Permission } from '@/types'

// Lookup endpoints — auth only, no specific permission required.
// Use these for form dropdowns, never for management pages.
export const lookupApi = {
  roles: () =>
    api.get<ApiResponse<Pick<Role, 'id' | 'name'>[]>>('/api/v1/lookup/roles'),

  permissions: () =>
    api.get<ApiResponse<Permission[]>>('/api/v1/lookup/permissions'),
}
