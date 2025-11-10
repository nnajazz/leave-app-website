<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#fffdfa]">
    <div class="mb-8 flex flex-col items-center">
      <img 
        src="../../assets/logo.png" 
        alt="Walden Global Services Logo" 
        class="h-10 w-auto mb-1"
      />
    </div>

    <div
      class="bg-[#f8fbff] rounded-xl p-8 w-full max-w-sm border border-gray-200"
      style="box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);"
    >
      <h2 class="text-center text-xl font-semibold text-gray-800 mb-1">
        Login to your account
      </h2>
      <p class="text-center text-sm text-gray-500 mb-8">
        Enter your email below to login to your account
      </p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm text-left"
        >
          {{ error }}
        </div>

        <div
          v-if="successMessage"
          class="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm text-left"
        >
          {{ successMessage }}
        </div>

        <div>
          <label
            for="email"
            class="block text-left text-gray-700 text-sm font-medium mb-1"
            >Email</label
          >
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="m@example.com"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            :disabled="isLoading"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-left text-gray-700 text-sm font-medium mb-1"
            >Password</label
          >
          <input
            id="password"
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
            'bg-blue-300 cursor-not-allowed': isLoading
          }"
        >
          {{ isLoading ? "Loading..." : "Login" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const error = ref("");
const successMessage = ref("");

const router = useRouter();
const API_URL = "http://localhost:3001/api/v1";

const handleLogin = async () => {
  error.value = "";
  successMessage.value = "";
  isLoading.value = true;

  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      { email: email.value, password: password.value },
      { withCredentials: true }
    );

    console.log("Response backend:", response.data);

    if (response.data.success) {
      const user = response.data.data;
      successMessage.value = response.data.message || "Login berhasil!";
      error.value = "";

      // simpan user ke localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // beri jeda agar pesan tampil dulu
      setTimeout(() => {
        const roleSlug = user.role?.slug?.toLowerCase();
        const roleId = user.role?.id;

        if (roleSlug === "admin" || roleId === 1) {
          router.push({ name: "AdminDashboard" });
        } else {
          router.push({ name: "UserDashboard" });
        }
      }, 800);
    } else {
      error.value = "Login gagal. Respons server tidak valid.";
    }
  } catch (err) {
    console.error("Login error:", err);

    if (axios.isAxiosError(err) && err.response) {
      if (err.response.status === 401) {
        error.value = "Email atau password salah.";
      } else {
        error.value = err.response.data.message || "Terjadi kesalahan server.";
      }
    } else {
      error.value =
        "Gagal terhubung ke server. Pastikan backend berjalan di http://localhost:3001.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
