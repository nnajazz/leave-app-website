import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './assets/style.css'

// ✅ konfigurasi global axios
axios.defaults.baseURL = 'http://localhost:3001/api/v1'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'

// ✅ interceptor buat ngecek error 401 (misalnya token expired)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized')
      localStorage.removeItem('user')
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.config.globalProperties.$axios = axios // biar bisa diakses via this.$axios di komponen

app.mount('#app')
