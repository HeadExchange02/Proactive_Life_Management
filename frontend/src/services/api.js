import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Attach the user's selected AI provider/model (set via the model selector
// in the navbar) so every AI-backed endpoint uses it, without each page
// needing to pass it explicitly.
api.interceptors.request.use((config) => {
  const provider = localStorage.getItem('aiProvider')
  const model = localStorage.getItem('aiModel')
  if (provider) config.headers['X-AI-Provider'] = provider
  if (model) config.headers['X-AI-Model'] = model
  return config
})

let refreshPromise = null

function refreshAccessToken() {
  refreshPromise ??= axios
    .post('/api/auth/refresh', {}, { withCredentials: true })
    .then(({ data }) => {
      localStorage.setItem('accessToken', data.accessToken)
      return data.accessToken
    })
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const isUnauthorized = error.response?.status === 401
    const isAuthRequest = original?.url?.startsWith('/auth/')
    if (!isUnauthorized || !original || original._retry || isAuthRequest) {
      return Promise.reject(error)
    }

    original._retry = true
    try {
      const accessToken = await refreshAccessToken()
      original.headers.Authorization = `Bearer ${accessToken}`
      return api(original)
    } catch (refreshError) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
      return Promise.reject(refreshError)
    }
  }
)

export default api