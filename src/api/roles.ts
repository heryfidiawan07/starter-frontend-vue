import api from './axios'
import type { ApiResponse, Role } from '@/types'

export interface RoleListParams {
  page?: number
  per_page?: number
  search?: string
}

export interface CreateRolePayload {
  name: string
  description?: string
  permission_ids?: string[]
}

export interface UpdateRolePayload {
  name?: string
  description?: string
  permission_ids?: string[]
}

export const rolesApi = {
  list: (params: RoleListParams = {}) =>
    api.get<ApiResponse<Role[]>>('/api/v1/roles', { params }),

  get: (id: string) =>
    api.get<ApiResponse<Role>>(`/api/v1/roles/${id}`),

  create: (data: CreateRolePayload) =>
    api.post<ApiResponse<Role>>('/api/v1/roles', data),

  update: (id: string, data: UpdateRolePayload) =>
    api.put<ApiResponse<Role>>(`/api/v1/roles/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse>(`/api/v1/roles/${id}`),
}
