<script setup>
import UserLayout from '../../layouts/UserLayout.vue'; 
import { ref, computed } from 'vue';

// ======================================================================
// === STATE & DATA MOCKUP ===
// ======================================================================

// Data Mockup untuk Cuti Wajib (Mandatory Leave)
const mandatoryLeaves = ref([
    {
        id: 1,
        title: 'Libur Lebaran',
        description: 'Libur untuk merayakan hari raya Idul Fitri.',
        startDate: '30 Maret 2025',
        endDate: '31 Maret 2025',
        confirmationDeadline: '24 Maret 2025',
        status: 'Approved', 
        isConfirmed: true, // Awalnya ON
        confirmDate: '2025-03-01'
    },
    {
        id: 2,
        title: 'Libur Natal',
        description: 'Libur untuk merayakan hari raya Natal.',
        startDate: '25 Des 2025',
        endDate: '26 Des 2025',
        confirmationDeadline: '15 Des 2025',
        status: 'Approved', 
        isConfirmed: false, // Awalnya OFF
        confirmDate: null
    },
    {
        id: 3,
        title: 'Libur Waisak',
        description: 'Libur untuk merayakan hari Waisak.',
        startDate: '12 Mei 2025',
        endDate: '12 Mei 2025',
        confirmationDeadline: '05 Mei 2025',
        status: 'Approved', 
        isConfirmed: false, // Awalnya OFF
        confirmDate: null
    },
    {
        id: 4,
        title: 'Libur Idul Adha',
        description: 'Libur untuk merayakan hari raya Idul Adha.',
        startDate: '05 Juni 2025',
        endDate: '08 Juni 2025',
        confirmationDeadline: '30 Mei 2025',
        status: 'Approved', 
        isConfirmed: false, // Awalnya OFF
        confirmDate: null
    },
    // Data baru untuk demonstrasi
    {
        id: 5,
        title: 'Libur Tahun Baru',
        description: 'Libur untuk merayakan Tahun Baru Masehi.',
        startDate: '01 Jan 2026',
        endDate: '01 Jan 2026',
        confirmationDeadline: '20 Des 2025',
        status: 'Approved', 
        isConfirmed: false, // Awalnya OFF
        confirmDate: null
    },
]);

// ======================================================================
// === FUNGSI-FUNGSI UTILITY ===
// ======================================================================

// Fungsi untuk menangani perubahan Toggle (Konfirmasi Cuti)
const toggleConfirmation = (leaveItem) => {
    // Balikkan status konfirmasi
    leaveItem.isConfirmed = !leaveItem.isConfirmed;

    if (leaveItem.isConfirmed) {
        // Logika saat dikonfirmasi
        leaveItem.confirmDate = new Date().toISOString().split('T')[0];
        console.log(`Cuti ${leaveItem.title} berhasil dikonfirmasi.`);
        
    } else {
        // Logika saat dibatalkan
        leaveItem.confirmDate = null;
        console.log(`Konfirmasi cuti ${leaveItem.title} dibatalkan.`);
    }
};

// Fungsi getStatusClass sekarang tidak akan digunakan di template, tapi tetap ada di script.
const getStatusClass = (status) => {
    const base = 'text-xs font-semibold';
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus === 'approved') {
        return `${base} text-green-600 bg-green-50 p-1 rounded`;
    } 
    return `${base} text-gray-600`;
};
</script>

<template>
    <UserLayout>
        <div class="space-y-6">

            <div class="bg-white p-6 rounded-2xl shadow-lg">
                <h1 class="text-2xl font-bold text-gray-800">Mandatory Leave</h1>
                <p class="text-gray-500 mt-1">Daftar cuti wajib (bersama) yang harus Anda konfirmasi.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                <div v-for="item in mandatoryLeaves" :key="item.id" 
                    :class="['bg-blue-50 rounded-2xl shadow-lg p-5 transition-all duration-300', 
                            item.isConfirmed ? 'border-2 border-[#5e77ff]' : 'border border-gray-100 hover:shadow-xl']">
                    
                    <div class="flex justify-between items-start mb-4">
                        <div class="space-y-1">
                            <h2 class="text-lg font-bold text-gray-900">{{ item.title }}</h2>
                            <p class="text-sm text-gray-500">{{ item.description }}</p>
                        </div>
                        
                        </div>

                    <div class="mb-4 space-y-2">
                        <div class="text-sm text-gray-700">
                            <span class="font-semibold block">Start Date:</span>
                            {{ item.startDate }}
                        </div>
                        <div class="text-sm text-gray-700">
                            <span class="font-semibold block">End Date:</span>
                            {{ item.endDate }}
                        </div>
                    </div>

                    <hr class="border-gray-100 mb-4">

                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-xs font-semibold text-gray-800 mb-1">Konfirmasi Cuti:</p>
                            
                            <p v-if="!item.isConfirmed" class="text-xs text-red-500">
                                Batas Konfirmasi: {{ item.confirmationDeadline }}
                            </p>
                            <p v-else class="text-xs text-green-500 font-medium">
                                Confirmed on {{ item.confirmDate }}
                            </p>
                            
                        </div>

                        <button 
                            @click="toggleConfirmation(item)"
                            :class="[
                                item.isConfirmed ? 'bg-[#5e77ff]' : 'bg-gray-200',
                                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#5e77ff] focus:ring-offset-2'
                            ]"
                            role="switch"
                            :aria-checked="item.isConfirmed"
                        >
                            <span class="sr-only">Toggle Konfirmasi</span>
                            <span 
                                :class="[
                                    item.isConfirmed ? 'translate-x-5' : 'translate-x-0',
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                ]"
                            ></span>
                        </button>
                    </div>
                </div>

            </div>
            
            <div v-if="mandatoryLeaves.length === 0" class="text-center py-10 bg-blue-50 rounded-2xl shadow-lg text-gray-500">
                No mandatory leave entries found.
            </div>

        </div>
    </UserLayout>
</template>

<style scoped>
/* Tambahan styling jika diperlukan */
</style>