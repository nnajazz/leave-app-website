import axios from 'axios'

// helper untuk ambil/simpan token & device ID
const StorageHelper = {
  getAuthToken: () => localStorage.getItem('auth_token'),
  getDeviceId: () => localStorage.getItem('device_id') || 'anonymous',
  setAuthToken: (token) => localStorage.setItem('auth_token', token),
  clearAuth: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  withCredentials: true, // penting supaya cookie Authorization dikirim & diterima
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// interceptor untuk log request
api.interceptors.request.use((config) => {
  console.log('➡️ Request:', config.method?.toUpperCase(), config.url)
  return config
})

// interceptor response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized - Token mungkin expired')
    }
    return Promise.reject(error)
  },
)

const ApiClient = {
  get: (path, params) => api.get(path, { params }),
  post: (path, data) => api.post(path, data),
  put: (path, data) => api.put(path, data),
  patch: (path, data, params) => api.patch(path, data, { params }),
  delete: (path, data) => api.delete(path, { data }),
  StorageHelper,
}

export default ApiClient
