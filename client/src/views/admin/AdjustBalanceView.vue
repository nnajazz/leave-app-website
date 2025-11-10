<template>
  <AdminLayout>
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Adjust Balance</h1>
      <p>Halaman ini menampilkan modal penyesuaian saldo cuti, dan akan diarahkan ke Dashboard setelah selesai.</p>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      
      <div class="bg-white rounded-lg shadow-xl w-full max-w-xl p-8 relative"> 
        <h2 class="text-xl font-semibold mb-6 text-center">Add Adjust Balance</h2>

        <button @click="showDiscardConfirmation" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <form @submit.prevent="showConfirmation">
          
          <div class="mb-4">
            <label for="nik" class="block text-sm font-medium text-gray-700">Search NIK</label>
            <input 
              type="text" 
              id="nik" 
              v-model="form.nik" 
              placeholder="NIK" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
            <div class="flex space-x-4">
              <button 
                type="button" 
                @click="form.year = 2022" 
                :class="{'bg-indigo-600 text-white': form.year === 2022, 'bg-gray-100 text-gray-700 hover:bg-gray-200': form.year !== 2022}" 
                class="px-4 py-2 border rounded-md transition duration-150"
              >
                2022
              </button>
              <button 
                type="button" 
                @click="form.year = 2024" 
                :class="{'bg-indigo-600 text-white': form.year === 2024, 'bg-gray-100 text-gray-700 hover:bg-gray-200': form.year !== 2024}" 
                class="px-4 py-2 border rounded-md transition duration-150"
              >
                2024
              </button>
              <button 
                type="button" 
                @click="form.year = 2025" 
                :class="{'bg-indigo-600 text-white': form.year === 2025, 'bg-gray-100 text-gray-700 hover:bg-gray-200': form.year !== 2025}" 
                class="px-4 py-2 border rounded-md transition duration-150"
              >
                2025
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Select Leave</label>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-6">
                <label class="inline-flex items-center">
                  <input type="radio" v-model="form.type" value="Add" class="form-radio text-indigo-600">
                  <span class="ml-2">Add Leave</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="form.type" value="Reduce" class="form-radio text-indigo-600">
                  <span class="ml-2">Reduce Leave</span>
                </label>
              </div>
              <span class="text-sm text-gray-500">Current Balance</span>
            </div>
          </div>

          <div class="mb-4">
            <div class="flex items-center space-x-4">
              <div class="w-1/2">
                <label for="amount" class="block text-sm font-medium text-gray-700">Add How Much</label>
                <input 
                  type="number" 
                  id="amount" 
                  v-model="form.amount" 
                  placeholder="0" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  min="0"
                  @input="calculateTotal"
                >
              </div>
              <div class="w-1/2">
                <label class="block text-sm font-medium text-gray-700 opacity-0 select-none">Balance Placeholder</label>
                <input 
                  type="text" 
                  :value="form.currentBalance" 
                  readonly
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 text-gray-600 cursor-not-allowed"
                >
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label for="total" class="block text-sm font-medium text-gray-700">Total</label>
            <input 
              type="text" 
              id="total" 
              :value="form.total" 
              readonly
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 text-gray-600 cursor-not-allowed"
            >
          </div>

          <div class="mb-6">
            <label for="information" class="block text-sm font-medium text-gray-700">Information</label>
            <textarea 
              id="information" 
              v-model="form.information" 
              rows="3" 
              placeholder="Informasi . . ." 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          <div class="flex justify-between items-center pt-2">
            <button 
              type="button" 
              @click="showDiscardConfirmation" 
              class="px-4 py-2 text-gray-700 bg-transparent rounded-md hover:text-indigo-600 transition duration-150"
            >
              Back
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-150"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="isConfirmationOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900 bg-opacity-70">
      <div class="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 text-center">
        <p class="text-lg mb-6">
          Are you sure you want to {{ form.type.toLowerCase() }} **{{ form.amount }}** leaves for **{{ form.nik || '[NIK Kosong]' }}**?
        </p>
        <div class="flex justify-center space-x-4">
          <button 
            type="button" 
            @click="isConfirmationOpen = false" 
            class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
          >
            Cancel
          </button>
          <button 
            type="button" 
            @click="submitAdjustment" 
            class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-150"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
    <div v-if="isDiscardOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900 bg-opacity-70">
      <div class="bg-white rounded-lg shadow-2xl w-full max-w-xs p-6 text-center">
        <p class="text-lg mb-6">
          Do you want to discard the changes?
        </p>
        <div class="flex justify-center space-x-4">
          <button 
            type="button" 
            @click="isDiscardOpen = false" 
            class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
          >
            Cancel
          </button>
          <button 
            type="button" 
            @click="closeModalAndNavigate" 
            class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-150"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
    <div v-if="isSuccessOpen" class="fixed top-4 left-1/2 -translate-x-1/2 z-[70]">
      <div class="bg-white border-2 border-green-500 rounded-lg shadow-2xl p-4 flex items-center space-x-3">
        <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <p class="text-gray-800">Leave data has been successfully added</p>
        <button 
          @click="closeSuccessAndNavigate" 
          class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-150"
        >
          OK
        </button>
      </div>
    </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isModalOpen = ref(false)
const isConfirmationOpen = ref(false) // Untuk konfirmasi Submit
const isDiscardOpen = ref(false)      // Untuk konfirmasi Discard/Back
const isSuccessOpen = ref(false)      // State baru untuk notifikasi Sukses

const form = ref({
  nik: '',
  year: 2025,
  type: 'Add',
  amount: 0,
  currentBalance: 12, 
  information: '',
  total: 12, 
})

// Fungsi untuk menghitung Total
const calculateTotal = () => {
  let amount = Number(form.value.amount) || 0;
  let balance = Number(form.value.currentBalance) || 0;

  if (form.value.type === 'Add') {
    form.value.total = balance + amount;
  } else if (form.value.type === 'Reduce') {
    form.value.total = balance - amount;
  }
}

watch([() => form.value.type, () => form.value.amount], calculateTotal, { immediate: true });


const openModal = () => {
  isModalOpen.value = true
}

// Fungsi yang sebenarnya melakukan penutupan modal dan navigasi ke Dashboard
const closeModalAndNavigate = () => {
  isModalOpen.value = false
  isDiscardOpen.value = false // Pastikan discard popup tertutup
  router.push('/admin/dashboard') 
}

// Fungsi yang dipanggil saat tombol "Back" atau "X" diklik
const showDiscardConfirmation = () => {
  isDiscardOpen.value = true
}

// Fungsi yang dipanggil saat tombol "Confirm" di main form ditekan
const showConfirmation = () => {
  // Melakukan validasi dasar sebelum menampilkan notifikasi
  if (!form.value.nik || form.value.amount <= 0) {
    alert('Please enter NIK and an amount greater than 0.')
    return
  }
  isConfirmationOpen.value = true
}

// Fungsi yang dipanggil saat tombol "Yes" di notifikasi SUBMIT ditekan
const submitAdjustment = () => {
  isConfirmationOpen.value = false // Tutup notifikasi konfirmasi submit

  console.log('Adjust Balance Submitted:', form.value)
  // TODO: Implementasi logika pengiriman data ke API di sini

  // Tampilkan notifikasi sukses
  isSuccessOpen.value = true
}

// Fungsi baru untuk menutup notifikasi sukses dan navigasi ke dashboard
const closeSuccessAndNavigate = () => {
  isSuccessOpen.value = false;
  closeModalAndNavigate(); // Ini akan menutup modal utama (jika masih terbuka) dan menavigasi.
}

// Buka modal secara otomatis saat komponen dimuat
onMounted(() => {
  calculateTotal();
  openModal();
})
</script>

<style scoped>
/* Z-index 60 memastikan pop-up konfirmasi di atas modal utama (z-50) */
.z-\[60\] {
z-index: 60;
}
/* Z-index 70 memastikan pop-up sukses di atas pop-up lain */
.z-\[70\] {
z-index: 70;
}
</style>