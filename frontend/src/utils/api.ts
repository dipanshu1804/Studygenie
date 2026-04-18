import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? import.meta.env.VITE_API_URL || 'https://studygenie-backend.onrender.com/api'
    : '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sg_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
