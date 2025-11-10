<script setup>
import UserLayout from '../../layouts/UserLayout.vue'; 
import { ref, computed } from 'vue';

// ======================================================================
// === STATE & DATA MOCKUP (Disesuaikan) ===
// ======================================================================

const selectedHistoryDetail = ref(null);
const searchQuery = ref('');

// --- DATA MOCKUP UNTUK RIWAYAT CUTI (Contoh data yang diperkaya) ---
const userLeaveHistory = ref([
    { 
      id: 1, dateSubmitted: '2024-05-20', type: 'Personal Leave', status: 'Approved',
      startDate: '2024-06-10', endDate: '2024-06-15', leaveUsed: '4 days', title: 'Family Vacation', 
      reason: 'Short vacation to Bali.',
      // Data Rejected tidak perlu di Approved
      balance: { 2025: 3, 2026: 3 } 
    },
    { 
      id: 2, dateSubmitted: '2024-04-10', type: 'Special Leave', status: 'Approved',
      startDate: '2024-04-10', endDate: '2024-04-11', leaveUsed: '2 days', title: 'High Fever',
      reason: 'High fever. Attachment: Medical Certificate.jpg',
      balance: { 2025: 5, 2026: 5 } 
    },
    { 
      id: 3, dateSubmitted: '2024-03-01', type: 'Personal Leave', status: 'Rejected',
      startDate: '2024-03-15', endDate: '2024-03-15', leaveUsed: '1 day', title: 'Seminar Attendance',
      reason: 'Attending a seminar.',
      // === FIELD BARU UNTUK STATUS REJECTED ===
      rejectedBy: 'Supervisor A',
      rejectionReason: 'Project deadline in the same week. Cannot approve any leave.',
      // =======================================
      balance: { 2025: 2, 2026: 2 } 
    },
    { 
      id: 4, dateSubmitted: '2023-12-05', type: 'Mandatory Leave', status: 'Pending',
      startDate: '2023-12-24', endDate: '2023-12-26', leaveUsed: '2 days', title: 'Christmas Request',
      reason: 'Christmas Holiday request.',
      balance: { 2025: 7, 2026: 7 } 
    },
]);

// --- HEADER TABEL (Tidak berubah) ---
const tableHeaders = ref(['Status', 'Type', 'Start Leave', 'End Leave', 'Leave Used', 'Title', 'Note']);


// ======================================================================
// === COMPUTED PROPERTIES (Tidak Berubah) ===
// ======================================================================

const filteredHistory = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();

    if (!query) {
        return userLeaveHistory.value;
    }

    // Filter berdasarkan type atau tanggal
    return userLeaveHistory.value.filter(item => {
        return item.type.toLowerCase().includes(query) || 
             item.startDate.includes(query) ||
             item.endDate.includes(query);
    });
});

const parsedBalance = computed(() => {
    if (!selectedHistoryDetail.value || !selectedHistoryDetail.value.balance) {
        return [];
    }
    
    // Mengubah objek balance menjadi array of {label: year, value: days}
    return Object.entries(selectedHistoryDetail.value.balance).map(([year, days]) => ({
        label: year,
        value: `${days} day(s)` // Format sesuai tampilan
    }));
});


// ======================================================================
// === FUNGSI-FUNGSI UTILITY (Tidak Berubah) ===
// ======================================================================

const openDetailModal = (item) => {
    selectedHistoryDetail.value = item;
}

const closeDetailModal = () => {
    selectedHistoryDetail.value = null;
}

const getStatusClass = (status) => {
    const base = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus === 'approved') {
        return `${base} bg-green-100 text-green-800`;
    } else if (lowerStatus === 'rejected') {
        return `${base} bg-red-100 text-red-800`;
    } else if (lowerStatus === 'pending') {
        return `${base} bg-yellow-100 text-yellow-800`;
    }
    return `${base} bg-gray-100 text-gray-800`;
};
</script>

<template>
    <UserLayout>
        <div class="space-y-6">

            <div class="bg-white p-6 rounded-2xl shadow-lg">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold text-gray-800">Leave History</h1>
                    <div class="relative w-full md:w-60"> 
                        <input type="text" placeholder="Search by type or date..." 
                            v-model="searchQuery" 
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm"
                        >
                        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="border-b-2 border-gray-200 bg-gray-50"> 
                        <tr>
                            <th v-for="header in tableHeaders" :key="header"
                                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {{ header }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        <tr v-for="(item, index) in filteredHistory" :key="item.id" 
                            :class="[index % 2 !== 0 ? 'bg-blue-50' : 'bg-white', 'hover:bg-blue-100/70 transition-colors duration-150']">
                            
                            <td class="px-4 py-4 whitespace-nowrap text-sm">
                                <span :class="getStatusClass(item.status)">
                                    {{ item.status }}
                                </span>
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.type }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.startDate }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.endDate }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.leaveUsed }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.title }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button @click="openDetailModal(item)" class="text-gray-400 hover:text-[#5e77ff] focus:outline-none p-1 rounded-full transition duration-150">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="filteredHistory.length === 0">
                            <td :colspan="tableHeaders.length" class="text-center py-6 text-gray-500 text-base">
                                No leave history found.
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="mt-4 flex justify-between items-center text-sm text-gray-600">
                    <p>Showing 1 to {{ filteredHistory.length }} of {{ userLeaveHistory.length }} entries</p>
                    <div class="flex space-x-1">
                        <button class="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100" disabled>&lt;</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-xl bg-[#5e77ff] text-white">1</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100" disabled>&gt;</button>
                    </div>
                </div>
            </div>
            
        </div>
        
        <Transition name="modal-fade">
            <div v-if="selectedHistoryDetail" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[2000]" @click.self="closeDetailModal">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
                    
                    <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 class="text-xl font-semibold text-gray-800">Detail {{ selectedHistoryDetail.type }}</h2>
                        <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div class="p-6 text-gray-700 space-y-4 overflow-y-auto">
                        
                        <div class="grid grid-cols-3 gap-2 text-sm">
                            <p class="col-span-1 font-medium text-gray-900">Type</p>
                            <p class="col-span-2 text-gray-700">: {{ selectedHistoryDetail.type }}</p>

                            <p class="col-span-1 font-medium text-gray-900">Start Leave</p>
                            <p class="col-span-2 text-gray-700">: {{ selectedHistoryDetail.startDate }}</p>

                            <p class="col-span-1 font-medium text-gray-900">End Leave</p>
                            <p class="col-span-2 text-gray-700">: {{ selectedHistoryDetail.endDate }}</p>
                            
                            <p class="col-span-1 font-medium text-gray-900">Leave Used</p>
                            <p class="col-span-2 text-gray-700">: {{ selectedHistoryDetail.leaveUsed }}</p>

                            <p class="col-span-1 font-medium text-gray-900">Reason</p>
                            <p class="col-span-2 text-gray-700 break-words">: {{ selectedHistoryDetail.reason }}</p>

                            <p class="col-span-1 font-medium text-gray-900">Status</p>
                            <p class="col-span-2">: 
                                <span :class="getStatusClass(selectedHistoryDetail.status)">{{ selectedHistoryDetail.status }}</span>
                            </p>
                        </div>
                        
                        <div v-if="selectedHistoryDetail.status.toLowerCase() === 'rejected'" class="space-y-4 border-t border-gray-200 pt-4 mt-4">
                            <p class="font-semibold text-gray-800">Rejection Details:</p>
                            <div class="grid grid-cols-3 gap-2 text-sm">
                                <p class="col-span-1 font-medium text-gray-900">Rejected By</p>
                                <p class="col-span-2 text-gray-700 break-words">: **{{ selectedHistoryDetail.rejectedBy || 'N/A' }}**</p>
                                
                                <p class="col-span-1 font-medium text-gray-900">Rejection Reason</p>
                                <p class="col-span-2 text-gray-700 break-words">: {{ selectedHistoryDetail.rejectionReason || 'No reason provided.' }}</p>
                            </div>
                        </div>
                        
                        <hr class="border-gray-200">
                        
                        <p class="font-semibold text-gray-800">Balance Use:</p>
                        
                        <div v-if="parsedBalance.length > 0" class="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                            <div v-for="(balanceItem, index) in parsedBalance" :key="index" class="grid grid-cols-3">
                                <p class="col-span-1 font-medium text-gray-800 whitespace-nowrap">{{ balanceItem.label }}</p>
                                <p class="col-span-2 text-gray-700 break-words">: {{ balanceItem.value }}</p>
                            </div>
                        </div>
                        <div v-else class="bg-gray-50 p-4 rounded-lg text-sm text-gray-500">No balance information available.</div>

                    </div>
                    
                    <div class="p-4 border-t border-gray-200 flex justify-end">
                        <button @click="closeDetailModal" class="px-4 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition">
                            OK
                        </button>
                    </div>

                </div>
            </div>
        </Transition>
        
    </UserLayout>
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
