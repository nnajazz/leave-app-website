<template>
  <AdminLayout>
    <div class="list-of-leave-page p-4 sm:ml-64"> 
      <h1 class="text-3xl font-bold mb-4 text-gray-800">Leave Management</h1>
      
      <div v-show="!showSelectionModal" class="mt-8 p-6 bg-white rounded-lg shadow-md">
        <p class="text-gray-600">Halaman List of Leave aktif. Silakan klik tombol di bawah untuk membuka kembali pilihan Request/History.</p>
        <button 
          @click="showSelectionModal = true" 
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Buka Pilihan Aksi Cuti
        </button>
      </div>

      <div v-if="showSelectionModal" class="fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-xl p-8 relative"> 
          
          <button 
            @click="closeModal" 
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <h2 class="text-xl font-semibold text-center mb-10">Pilih Aksi Cuti</h2>

          <div class="flex justify-around space-x-6">
            
            <button 
              @click="handleAction('request')" 
              class="flex flex-col items-center p-8 w-1/2 hover:shadow-xl transition duration-200 rounded-xl"
              style="background-color: #e3f2fd;"
            >
              <div class="mb-4 p-5 bg-blue-200 rounded-2xl"> 
                <svg class="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <span class="font-medium text-lg text-gray-800 mt-2">Request Leave</span>
            </button>

            <button 
              @click="handleAction('history')" 
              class="flex flex-col items-center p-8 w-1/2 hover:shadow-xl transition duration-200 rounded-xl"
              style="background-color: #e3f2fd;"
            >
              <div class="mb-4 p-5 bg-blue-200 rounded-2xl">
                <svg class="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              </div>
              <span class="font-medium text-lg text-gray-800 mt-2">History Leave</span>
            </button>

          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '../../layouts/AdminLayout.vue'; 

const router = useRouter();
const showSelectionModal = ref(true); 

const closeModal = () => {
  // Arahkan ke Dashboard saat modal ditutup
  router.push({ name: 'admin-dashboard' }); 
};

const handleAction = (actionType) => {
  showSelectionModal.value = false; // Tutup modal

  if (actionType === 'request') {
    // Arahkan ke Request Leave (Pending)
    router.push({ name: 'admin-request-leaves' }); 
  } else if (actionType === 'history') {
    // Arahkan ke History Leave (Approved/Rejected)
    router.push({ name: 'admin-history-leaves' }); 
  }
};
</script>

<style scoped>
/* Tidak ada styling tambahan yang diperlukan */
</style>