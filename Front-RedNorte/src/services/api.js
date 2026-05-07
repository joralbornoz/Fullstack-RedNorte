import axios from 'axios'

const api = axios.create({
  // Asegúrate de que el nombre coincida exactamente con tu archivo .env
  baseURL: process.env.REACT_APP_API_BFF_URL || 'http://localhost:8081/api/v1/bff',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Adjunta el token JWT en cada request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('rednorte_user')
  if (stored) {
    const { token } = JSON.parse(stored)
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redirige al login si el token expiró
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rednorte_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
