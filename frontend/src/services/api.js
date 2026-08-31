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

// On 401, try a silent refresh once, then log out if that fails too
let isRefreshing = false

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry && !isRefreshing) {
      original._retry = true
      isRefreshing = true
      try {
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true })
        localStorage.setItem('accessToken', data.accessToken)
        isRefreshing = false
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch (refreshError) {
        isRefreshing = false
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default api