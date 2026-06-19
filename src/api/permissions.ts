import api from './axios'
import type { ApiResponse, Permission } from '@/types'

export const permissionsApi = {
  list: () =>
    api.get<ApiResponse<Permission[]>>('/api/v1/permissions'),

  tree: () =>
    api.get<ApiResponse<Permission[]>>('/api/v1/permissions/tree'),

  byRole: (roleId: string) =>
    api.get<ApiResponse<Permission[]>>(`/api/v1/permissions/by-role/${roleId}`),
}
