import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const userActions = ref<string[]>([])
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  function extractActions(u: User | null): string[] {
    const actions: string[] = []
    if (u?.role?.permissions) {
      const extract = (nodes: any[]) => {
        nodes.forEach(n => {
          if (n.actions) actions.push(...n.actions.map((a: any) => a.name))
          if (n.children) extract(n.children)
        })
      }
      extract(u.role.permissions)
    }
    return actions
  }

  function setAuth(u: User, at: string, rt: string) {
    localStorage.setItem('access_token', at)
    localStorage.setItem('refresh_token', rt)
    localStorage.setItem('user', JSON.stringify(u))
    user.value = u
    accessToken.value = at
    refreshToken.value = rt
    userActions.value = extractActions(u)
  }

  function setUser(u: User) {
    localStorage.setItem('user', JSON.stringify(u))
    user.value = u
    userActions.value = extractActions(u)
  }

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    userActions.value = []
  }

  function initFromStorage() {
    const token = localStorage.getItem('access_token')
    const refresh = localStorage.getItem('refresh_token')
    const raw = localStorage.getItem('user')
    if (token && raw) {
      try {
        const u = JSON.parse(raw) as User
        user.value = u
        accessToken.value = token
        refreshToken.value = refresh
        userActions.value = extractActions(u)
      } catch {
        localStorage.clear()
      }
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    setAuth,
    setUser,
    logout,
    initFromStorage,
  }
})
