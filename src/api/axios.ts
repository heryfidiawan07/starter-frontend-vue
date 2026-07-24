import axios from 'axios'
import { useToast } from 'vue-toastification'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      if (original.url?.includes('/auth/login')) {
        toast.error(error.response?.data?.message || 'Invalid credentials')
        return Promise.reject(error)
      }
      original._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/refresh`,
            { refresh_token: refreshToken }
          )
          const { access_token, refresh_token } = data.data
          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', refresh_token)
          original.headers.Authorization = `Bearer ${access_token}`
          return api(original)
        } catch {
          localStorage.clear()
          router.push('/login')
        }
      } else {
        localStorage.clear()
        router.push('/login')
      }
    }
    const message = error.response?.data?.message || 'Something went wrong'
    if (error.response?.status !== 401) {
      try {
        const toast = useToast()
        toast.error(message)
      } catch {
        // toast not available outside component context
      }
    }
    return Promise.reject(error)
  }
)

export default api
