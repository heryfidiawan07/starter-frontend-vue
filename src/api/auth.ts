import api from './axios'
import type { ApiResponse, AuthTokens, User } from '@/types'

export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<AuthTokens>>('/api/v1/auth/login', { email, password }),

  register: (data: { name: string; email: string; username?: string; password: string }) =>
    api.post<ApiResponse<AuthTokens>>('/api/v1/auth/register', data),

  logout: () => api.post<ApiResponse>('/api/v1/auth/logout'),

  refresh: (refresh_token: string) =>
    api.post<ApiResponse<AuthTokens>>('/api/v1/auth/refresh', { refresh_token }),

  forgotPassword: (email: string) =>
    api.post<ApiResponse>('/api/v1/auth/forgot-password', { email }),

  resetPassword: (token: string, new_password: string) =>
    api.post<ApiResponse>('/api/v1/auth/reset-password', { token, new_password }),

  verifyEmail: (token: string) =>
    api.get<ApiResponse>(`/api/v1/auth/verify-email?token=${token}`),

  changePassword: (current_password: string, new_password: string) =>
    api.post<ApiResponse>('/api/v1/auth/change-password', { current_password, new_password }),

  me: () => api.get<ApiResponse<User>>('/api/v1/auth/me'),

  updateProfile: (data: { name?: string; username?: string }) =>
    api.put<ApiResponse<User>>('/api/v1/profile', data),

  uploadPhoto: (file: File) => {
    const form = new FormData()
    form.append('photo', file)
    return api.post<ApiResponse<User>>('/api/v1/profile/photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  oauthGoogle: (token: string) =>
    api.post<ApiResponse<AuthTokens>>('/api/v1/auth/oauth/google', { token }),

  oauthFacebook: (token: string) =>
    api.post<ApiResponse<AuthTokens>>('/api/v1/auth/oauth/facebook', { token }),
}
