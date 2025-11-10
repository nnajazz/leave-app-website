<template>
    <AdminLayout>
        <div class="space-y-6">

            <div class="bg-white p-6 rounded-2xl shadow-lg">
                <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <h1 class="text-2xl font-bold text-gray-800">Adjustment History</h1>
                    <div class="flex flex-col md:flex-row md:justify-end md:items-center space-y-4 md:space-y-0 md:space-x-4">
                        
                        <div class="relative w-full md:w-80 lg:w-96"> 
                            <input type="text" placeholder="Search by NIK, Name, or Actor..." 
                                v-model="searchQuery" 
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm"
                                >
                            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        <div class="flex space-x-2 sm:space-x-4 shrink-0">
                            <select v-model="yearFilter" class="p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm shrink-0 hidden sm:block">
                                <option value="">Year</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
                <table class="min-w-full">
                    <thead class="border-b-2 border-gray-200 bg-gray-50"> 
                        <tr>
                            <th v-for="header in tableHeaders" :key="header"
                                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {{ header }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        <tr v-for="(adjustment, index) in filteredAdjustments" :key="adjustment.id" 
                            :class="[index % 2 !== 0 ? 'bg-blue-50' : 'bg-white', 'hover:bg-blue-100/70 transition-colors duration-150']">
                            
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ adjustment.nik }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ adjustment.name }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{{ adjustment.adjustmentValue }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ adjustment.balanceYear }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ adjustment.date }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ adjustment.time }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ adjustment.actor }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button @click="openDetailModal(adjustment)" 
                                        type="button" 
                                        class="text-[#5e77ff] hover:text-blue-600 focus:outline-none p-1 rounded-full transition duration-150">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="filteredAdjustments.length === 0">
                            <td :colspan="tableHeaders.length" class="text-center py-6 text-gray-500 text-base">
                                No adjustment history found matching the current filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="mt-4 flex justify-between items-center text-sm text-gray-600">
                    <p>Showing 1 to {{ filteredAdjustments.length }} of {{ adjustments.length }} entries</p>
                    <div class="flex space-x-1">
                        <button class="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100">&lt;</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-xl bg-[#5e77ff] text-white">1</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100">&gt;</button>
                    </div>
                </div>
            </div>
            
        </div>

        <Transition name="modal-fade">
            <div v-if="selectedHistoryDetail" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[2000]" @click.self="closeDetailModal">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
                    
                    <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 class="text-xl font-semibold text-gray-800">Detail Adjustment</h2>
                        <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div class="p-6 text-gray-700 space-y-3 overflow-y-auto">
                        
                        <p class="font-semibold text-gray-800">Detail Information:</p>
                        
                        <div v-if="parsedDetail.length > 0" class="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                            <div v-for="(detailItem, index) in parsedDetail" :key="index" class="grid grid-cols-3">
                                <p class="col-span-1 font-medium text-gray-800 whitespace-nowrap">{{ detailItem.label }}</p>
                                <p class="col-span-2 text-gray-700 break-words">: {{ detailItem.value }}</p>
                            </div>
                        </div>
                        <div v-else class="bg-gray-50 p-4 rounded-lg text-sm text-gray-500">No detail information available.</div>

                    </div>
                    
                    <div class="p-4 border-t border-gray-200 flex justify-end">
                        <button @click="closeDetailModal" class="px-4 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition">
                            OK
                        </button>
                    </div>

                </div>
            </div>
        </Transition>

    </AdminLayout>
</template>

<script setup>
import AdminLayout from '../../layouts/AdminLayout.vue'; 
import { ref, computed } from 'vue';

// ======================================================================
// === DATA & FUNGSI UNTUK MODAL DETAIL ADJUSTMENT ===
// ======================================================================
const selectedHistoryDetail = ref(null);

// FUNGSI UNTUK MENGELOLA MODAL DETAIL
const openDetailModal = (item) => {
    selectedHistoryDetail.value = item;
}

const closeDetailModal = () => {
    selectedHistoryDetail.value = null;
}

// === COMPUTED PROPERTY UNTUK MEMPARSING DETAIL (DIPERBARUI) ===
const parsedDetail = computed(() => {
    if (!selectedHistoryDetail.value) {
        return [];
    }

    const detailObject = selectedHistoryDetail.value;

    // 1. Ambil data utama dari objek
    const primaryDetails = [
        { label: 'NIK', value: detailObject.nik },
        { label: 'Name', value: detailObject.name },
        { label: 'Adjustment Value', value: detailObject.adjustmentValue },
        { label: 'Balance Year', value: detailObject.balanceYear },
        { label: 'Date', value: detailObject.date },
        { label: 'Time', value: detailObject.time },
        { label: 'Actor', value: detailObject.actor },
    ];

    // 2. Parse data tambahan dari string 'detail'
    const additionalDetails = [];
    if (detailObject.detail) {
        const detailLines = detailObject.detail.split('\n')
                                                .filter(line => line.trim() !== '');

        detailLines.forEach(line => {
            const separatorIndex = line.indexOf(':');
            let label = line;
            let value = '';

            if (separatorIndex !== -1) {
                label = line.substring(0, separatorIndex).trim();
                value = line.substring(separatorIndex + 1).trim();
            }
            
            // Konversi label ke format yang rapi
            const formattedLabel = label.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            // Hanya ambil detail yang TIDAK ADA di primaryDetails (seperti Notes, Keterangan, Alasan)
            const lowerLabel = label.toLowerCase();
            const ignoredKeys = [
                'nik', 'name', 'actor', 'date', 'time', 'balance year', 'adjustment value',
            ];

            if (!ignoredKeys.some(key => lowerLabel.includes(key))) {
                if(value) { // Pastikan valuenya ada
                     additionalDetails.push({ label: formattedLabel, value: value });
                }
            }
        });
    }

    // 3. Gabungkan Primary Details dan Additional Details
    return [...primaryDetails, ...additionalDetails];
});


// ======================================================================
// === LOGIKA FILTERING DAN DATA ADJUSTMENTS (HANYA ADJUSTMENT) ===
// ======================================================================

// Data Karyawan (Untuk mendapatkan Nama dari NIK) - Dipertahankan
const employeeData = {
    '123456': { name: 'Admin WGS' },
    '232410': { name: 'User Dua' },
    '323456': { name: 'Budi Santoso' },
    '54397': { name: 'Ani Lestari' },
    '12345': { name: 'Charlie P.' },
    '98765': { name: 'Dewi Ayu' },
    '765432': { name: 'Eko Putra' },
    '765431': { name: 'Fadil' },
    '765430': { name: 'Gita' },
};


// Header tabel: Status dihapus
const tableHeaders = ref(['NIK', 'Name', 'Adjustment Value', 'Balance Year', 'Date', 'Time', 'Actor', 'Detail']);

// DATA MOCKUP HISTORY (SIMULASI - HANYA ADJUSTMENT)
const mockAdjustmentData = {
    '123456': [ // Admin WGS - Super Admin
        { id: 2, date: '2023-03-01', type: 'Adjustment', status: 'Approved', detail: 'Adjustment Value: 2\nBalance Year: 2025\nDate: 2023-03-01\nTime: 00:00:07\nActor: System\nKeterangan: Error in system initial balance calculation.' },
    ],
    '232410': [ // User Dua - Admin
        { id: 5, date: '2024-02-20', type: 'Adjustment', status: 'Pending', detail: 'Adjustment Value: -1\nBalance Year: 2025\nDate: 2024-02-20\nTime: 12:00:00\nActor: System\nNotes: Correction for previous over-calculation.' },
    ],
    '323456': [ // Budi Santoso - Karyawan Tetap
        { id: 6, date: '2023-10-05', type: 'Adjustment', status: 'Rejected', detail: 'Adjustment Value: 0\nBalance Year: 2025\nDate: 2023-10-05\nTime: 10:30:00\nActor: System\nAlasan: Not allowed by company policy.' },
        { id: 8, date: '2024-01-01', type: 'Adjustment', status: 'Approved', detail: 'Adjustment Value: 12\nBalance Year: 2025\nDate: 2024-01-01\nTime: 00:00:00\nActor: System\nNotes: Annual leave reset.' },
    ],
    '54397': [ // Ani Lestari - Karyawan Tetap (Resign)
        { id: 10, date: '2023-08-01', type: 'Adjustment', status: 'Approved', detail: 'Adjustment Value: 0\nBalance Year: 2025\nDate: 2023-08-01\nTime: 09:00:00\nActor: System\nNotes: Employee termination process (Resign).' },
    ], 
    '765432': [ // Eko Putra - Magang
        { id: 13, date: '2024-03-10', type: 'Adjustment', status: 'Approved', detail: 'Adjustment Value: 1\nBalance Year: 2025\nDate: 2024-03-10\nTime: 11:45:00\nActor: System\nKeterangan: Reward for high performance.' },
    ],
};

// DATA ADJUSTMENT HISTORY YANG SUDAH DI-FLAT
const flatAdjustmentHistory = () => {
    const adjustments = [];
    for (const nik in mockAdjustmentData) {
        mockAdjustmentData[nik].forEach(item => {
            
            // Ekstraksi data dari string 'detail'
            const detailLines = item.detail.split('\n');
            const detailMap = {};
            detailLines.forEach(line => {
                const [key, ...rest] = line.split(':');
                if (key && rest.length > 0) {
                    detailMap[key.trim()] = rest.join(':').trim();
                }
            });
            
            // Tentukan AdjustmentValue, BalanceYear, Date, Time, dan Actor
            const adjustmentValue = detailMap['Adjustment Value'] || '0'; 
            const balanceYear = detailMap['Balance Year'] || 'N/A';
            const date = detailMap['Date'] || item.date;
            const time = detailMap['Time'] || 'N/A';
            // Nilai Actor di-hardcode menjadi 'System' sesuai permintaan
            const actor = 'System'; 

            adjustments.push({
                id: item.id,
                nik: nik,
                name: employeeData[nik]?.name || 'N/A',
                adjustmentValue: adjustmentValue,
                balanceYear: balanceYear,
                date: date,
                time: time,
                actor: actor,
                detail: item.detail, // Simpan detail lengkap untuk modal
            });
        });
    }
    return adjustments;
};

// Data Adjustments utama
const adjustments = ref(flatAdjustmentHistory());

// State untuk Search dan Filters
const searchQuery = ref('');
const yearFilter = ref('');

// --- LOGIKA FILTERING GABUNGAN (COMPUTED PROPERTY) ---
const filteredAdjustments = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    const year = yearFilter.value;

    return adjustments.value.filter(adjustment => {
        const searchMatch = !query || 
                            adjustment.nik.toLowerCase().includes(query) || 
                            adjustment.name.toLowerCase().includes(query) ||
                            adjustment.actor.toLowerCase().includes(query);

        const yearMatch = !year || adjustment.balanceYear === year || adjustment.balanceYear === 'N/A'; 

        return searchMatch && yearMatch;
    });
});
</script>

<style scoped>
/* Transisi untuk modal, optional tapi bagus untuk UX */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>