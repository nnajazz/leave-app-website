<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#fffdfa]">
    <div class="mb-8 flex flex-col items-center">
      <img src="../../assets/logo.png" alt="WGS Logo" class="h-10 w-auto mb-1" />
    </div>

    <div class="bg-[#f8fbff] rounded-xl p-8 w-full max-w-sm border border-gray-200 shadow-md">
      <h2 class="text-center text-xl font-semibold text-gray-800 mb-1">Login to your account</h2>
      <p class="text-center text-sm text-gray-500 mb-8">Enter your email below to login</p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm"
        >
          {{ error }}
        </div>

        <div
          v-if="successMessage"
          class="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm"
        >
          {{ successMessage }}
        </div>

        <div>
          <label class="block text-left text-gray-700 text-sm font-medium mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="m@example.com"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            :disabled="isLoading"
          />
        </div>

        <div>
          <label class="block text-left text-gray-700 text-sm font-medium mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            :disabled="isLoading"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-[#91C9F4] text-white font-semibold py-2 rounded-md transition duration-150 ease-in-out mt-6"
          :class="{
            'hover:bg-blue-400': !isLoading,
            'bg-blue-300 cursor-not-allowed': isLoading,
          }"
        >
          {{ isLoading ? 'Loading...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ApiClient from '@/api/api_client'

const router = useRouter()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

const handleLogin = async () => {
  try {
    const res = await ApiClient.post('/auth/login', {
      email: email.value,
      password: password.value,
    })

    if (res.data.success) {
      const user = res.data.data
      localStorage.setItem('user', JSON.stringify(user)) // simpan user info aja

      successMessage.value = res.data.message || 'Login berhasil!'
      router.push({ name: 'user-dashboard' })
    } else {
      error.value = res.data.message || 'Login gagal. Periksa email/password.'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.response?.data?.message || 'Terjadi kesalahan.'
  }
}
</script>
