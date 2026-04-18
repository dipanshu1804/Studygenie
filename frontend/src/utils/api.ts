import axios from 'axios'

const isProd = typeof window !== 'undefined' &&
  !window.location.hostname.includes('localhost')

const api = axios.create({
  baseURL: isProd
    ? 'https://studygenie-n9av.onrender.com/api'
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
