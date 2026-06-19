import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '@/api/axios'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

interface PublicConfig {
  google_client_id: string
  facebook_app_id: string
}

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.getElementById(id)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src; s.id = id; s.async = true
    s.onload = () => resolve()
    document.head.appendChild(s)
  })
}

export function useSocialAuth() {
  const router    = useRouter()
  const toast     = useToast()
  const authStore = useAuthStore()
  const config    = ref<PublicConfig | null>(null)

  onMounted(() => {
    api.get<{ data: PublicConfig }>('/api/v1/config').then(({ data }) => {
      config.value = data.data
      if (data.data.google_client_id) loadScript('https://accounts.google.com/gsi/client', 'google-gsi')
      if (data.data.facebook_app_id) {
        loadScript('https://connect.facebook.net/en_US/sdk.js', 'facebook-sdk').then(() => {
          ;(window as any).FB?.init({ appId: data.data.facebook_app_id, version: 'v18.0', xfbml: false, cookie: false })
        })
      }
    }).catch(() => {})
  })

  async function loginWithGoogle() {
    const clientId = config.value?.google_client_id
    if (!clientId) { toast.error('Google login is not configured on the server'); return }
    const google = (window as any).google
    if (!google) { toast.error('Google SDK not loaded, please refresh the page'); return }

    google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'email profile',
      callback: async (res: any) => {
        if (!res.access_token) return
        try {
          const { data } = await authApi.oauthGoogle(res.access_token)
          if (data.data) {
            const { access_token, refresh_token, user } = data.data
            authStore.setAuth(user, access_token, refresh_token)
            toast.success('Welcome!')
            router.push('/dashboard')
          }
        } catch {
          // error handled by interceptor
        }
      },
    }).requestAccessToken()
  }

  function loginWithFacebook() {
    const appId = config.value?.facebook_app_id
    if (!appId) { toast.error('Facebook login is not configured on the server'); return }
    const FB = (window as any).FB
    if (!FB) { toast.error('Facebook SDK not loaded, please refresh the page'); return }

    FB.login((res: any) => {
      if (!res.authResponse?.accessToken) return
      authApi.oauthFacebook(res.authResponse.accessToken)
        .then(({ data }) => {
          if (data.data) {
            const { access_token, refresh_token, user } = data.data
            authStore.setAuth(user, access_token, refresh_token)
            toast.success('Welcome!')
            router.push('/dashboard')
          }
        })
        .catch(() => {})
    }, { scope: 'email,public_profile' })
  }

  return { loginWithGoogle, loginWithFacebook }
}
