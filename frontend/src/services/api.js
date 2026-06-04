import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const predecir         = (text, canal = 'web') => API.post('/predict', { text, canal })
export const obtenerStats     = ()                     => API.get('/stats')
export const obtenerHistorial = (limit = 20)           => API.get(`/historial?limit=${limit}`)
export const healthCheck      = ()                     => API.get('/health')

export default API