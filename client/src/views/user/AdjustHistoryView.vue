<script setup>
import AdminLayout from '../../layouts/AdminLayout.vue'; // Asumsi Anda menggunakan AdminLayout
import { ref, computed } from 'vue';

// ======================================================================
// === STATE & DATA MOCKUP (Disesuaikan untuk Adjust History) ===
// ======================================================================

const selectedHistoryDetail = ref(null);
const searchQuery = ref('');

// --- DATA MOCKUP UNTUK RIWAYAT PENYESUAIAN SALDO CUTI ---
const adjustmentHistory = ref([
    { 
        id: 1, 
        nik: '123456', 
        name: 'Rania', 
        value: 12, // Adjustment Value
        balanceYear: 2025, 
        date: '2025-01-01', 
        time: '00:00:00+7', 
        actor: 'System',
        reason: 'Penambahan otomatis jatah cuti tahunan (New Year Quota).',
        previousBalance: 0,
        currentBalance: 12
    },
    { 
        id: 2, 
        nik: '213445', 
        name: 'Rania', 
        value: 3, 
        balanceYear: 2025, 
        date: '2025-01-20', 
        time: '14:30:00+7', 
        actor: 'Admin Budi',
        reason: 'Penyesuaian manual: Bonus cuti tambahan untuk training.',
        previousBalance: 12,
        currentBalance: 15
    },
    { 
        id: 3, 
        nik: '32213', 
        name: 'Rania', 
        value: -1, // Pengurangan
        balanceYear: 2026, 
        date: '2025-06-15', 
        time: '10:05:00+7', 
        actor: 'Admin Siti',
        reason: 'Koreksi kesalahan input saat transfer saldo cuti.',
        previousBalance: 5,
        currentBalance: 4
    },
]);

// --- HEADER TABEL (Disesuaikan dengan permintaan) ---
const tableHeaders = ref(['NIK', 'Name', 'Adjustment Value', 'Balance Year', 'Date', 'Time', 'Actor', 'Detail']);


// ======================================================================
// === COMPUTED PROPERTIES ===
// ======================================================================

const filteredHistory = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();

    if (!query) {
        return adjustmentHistory.value;
    }

    // Filter berdasarkan NIK, Nama, atau Actor
    return adjustmentHistory.value.filter(item => {
        return item.nik.includes(query) || 
               item.name.toLowerCase().includes(query) ||
               item.actor.toLowerCase().includes(query);
    });
});

// ======================================================================
// === FUNGSI-FUNGSI UTILITY ===
// ======================================================================

const openDetailModal = (item) => {
    selectedHistoryDetail.value = item;
}

const closeDetailModal = () => {
    selectedHistoryDetail.value = null;
}

const getValueClass = (value) => {
    const base = 'font-semibold';
    if (value > 0) {
        return `${base} text-green-600`;
    } else if (value < 0) {
        return `${base} text-red-600`;
    }
    return `${base} text-gray-800`;
};
</script>

<template>
    <!-- Asumsi AdminLayout memberikan struktur layout utama dan sidebar -->
    <AdminLayout> 
        <div class="space-y-6">

            <!-- Header & Search -->
            <div class="bg-white p-6 rounded-2xl shadow-lg">
                <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                    <h1 class="text-2xl font-bold text-gray-800">Adjust History</h1>
                    
                    <div class="relative w-full md:w-80"> 
                        <input type="text" placeholder="Search NIK, Name, or Actor..." 
                            v-model="searchQuery" 
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm transition"
                        >
                        <!-- Search Icon -->
                        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
            </div>
            
            <!-- Tabel Riwayat Penyesuaian -->
            <div class="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="border-b-2 border-gray-200 bg-gray-50"> 
                        <tr>
                            <th v-for="header in tableHeaders" :key="header"
                                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                                :class="{ 'text-center': header === 'Adjustment Value' }"
                            >
                                {{ header }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        <tr v-for="(item, index) in filteredHistory" :key="item.id" 
                            :class="[index % 2 !== 0 ? 'bg-blue-50' : 'bg-white', 'hover:bg-blue-100/70 transition-colors duration-150']">
                            
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.nik }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.name }}</td>
                            
                            <!-- Adjustment Value -->
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-center">
                                <span :class="getValueClass(item.value)">
                                    {{ item.value > 0 ? '+' : '' }}{{ item.value }}
                                </span>
                            </td>
                            
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.balanceYear }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.date }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.time.split('+')[0] }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.actor }}</td>
                            
                            <!-- Detail Button -->
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button @click="openDetailModal(item)" class="text-gray-400 hover:text-[#5e77ff] focus:outline-none p-1 rounded-full transition duration-150">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="filteredHistory.length === 0">
                            <td :colspan="tableHeaders.length" class="text-center py-6 text-gray-500 text-base">
                                No adjustment history found.
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <!-- Pagination Mockup -->
                <div class="mt-4 flex justify-end items-center text-sm text-gray-600">
                    <div class="flex space-x-1">
                        <button class="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100" disabled>&lt;</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-xl bg-[#5e77ff] text-white">1</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100" disabled>&gt;</button>
                    </div>
                </div>
            </div>
            
        </div>
        
        <!-- Modal Detail Penyesuaian -->
        <Transition name="modal-fade">
            <div v-if="selectedHistoryDetail" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[2000]" @click.self="closeDetailModal">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
                    
                    <!-- Modal Header -->
                    <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 class="text-xl font-semibold text-gray-800">Detail Adjustment</h2>
                        <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="p-6 text-gray-700 space-y-4 overflow-y-auto">
                        
                        <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                            <p class="font-medium text-gray-900">NIK / Name</p>
                            <p class="text-gray-700 font-semibold">: {{ selectedHistoryDetail.nik }} / {{ selectedHistoryDetail.name }}</p>

                            <p class="font-medium text-gray-900">Balance Year</p>
                            <p class="text-gray-700">: {{ selectedHistoryDetail.balanceYear }}</p>

                            <p class="font-medium text-gray-900">Date/Time</p>
                            <p class="text-gray-700">: {{ selectedHistoryDetail.date }} / {{ selectedHistoryDetail.time.split('+')[0] }}</p>
                            
                            <p class="font-medium text-gray-900">Adjusted By</p>
                            <p class="text-gray-700">: {{ selectedHistoryDetail.actor }}</p>

                            <p class="font-medium text-gray-900">Adjustment Value</p>
                            <p :class="['font-semibold', getValueClass(selectedHistoryDetail.value)]">
                                : {{ selectedHistoryDetail.value > 0 ? '+' : '' }}{{ selectedHistoryDetail.value }} day(s)
                            </p>
                        </div>
                        
                        <hr class="border-gray-200">
                        
                        <div class="space-y-2">
                            <p class="font-semibold text-gray-800">Reason / Keterangan:</p>
                            <div class="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 break-words">
                                {{ selectedHistoryDetail.reason }}
                            </div>
                        </div>

                        <div class="space-y-2">
                            <p class="font-semibold text-gray-800">Balance Change:</p>
                            <div class="bg-gray-50 p-4 rounded-lg text-sm grid grid-cols-3 gap-2">
                                <p class="col-span-1 text-gray-800">Previous Balance</p>
                                <p class="col-span-2 text-gray-700 font-medium">: {{ selectedHistoryDetail.previousBalance }} day(s)</p>
                                
                                <p class="col-span-1 text-gray-800">Current Balance</p>
                                <p class="col-span-2 text-gray-700 font-medium">: {{ selectedHistoryDetail.currentBalance }} day(s)</p>
                            </div>
                        </div>

                    </div>
                    
                    <!-- Modal Footer -->
                    <div class="p-4 border-t border-gray-200 flex justify-end">
                        <button @click="closeDetailModal" class="px-4 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition">
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </Transition>
        
    </AdminLayout>
</template>

<style scoped>
/* Transisi untuk modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
