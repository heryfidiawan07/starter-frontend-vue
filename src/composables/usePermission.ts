import { useAuthStore } from '@/stores/auth'

export function usePermission() {
  const authStore = useAuthStore()

  const can = (name: string): boolean => {
    const user = authStore.user
    if (!user) return false
    if (user.is_root) return true
    return authStore.userActions.includes(name)
  }

  return { can }
}
