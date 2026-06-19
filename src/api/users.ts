import api from './axios'
import type { ApiResponse, User } from '@/types'

export interface UserListParams {
  page?: number
  per_page?: number
  search?: string
}

export interface CreateUserPayload {
  name: string
  email: string
  username?: string
  password: string
  role_id?: string | null
  is_active?: boolean
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  username?: string
  password?: string
  role_id?: string | null
  is_active?: boolean
}

export const usersApi = {
  list: (params: UserListParams = {}) =>
    api.get<ApiResponse<User[]>>('/api/v1/users', { params }),

  get: (id: string) =>
    api.get<ApiResponse<User>>(`/api/v1/users/${id}`),

  create: (data: CreateUserPayload) =>
    api.post<ApiResponse<User>>('/api/v1/users', data),

  update: (id: string, data: UpdateUserPayload) =>
    api.put<ApiResponse<User>>(`/api/v1/users/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse>(`/api/v1/users/${id}`),

  uploadPhoto: (id: string, file: File) => {
    const form = new FormData()
    form.append('photo', file)
    return api.post<ApiResponse<User>>(`/api/v1/users/${id}/photo`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
