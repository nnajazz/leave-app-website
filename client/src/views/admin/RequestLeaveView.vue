<template>
    <AdminLayout>
        <div class="space-y-6">

            <div class="bg-white p-6 rounded-2xl shadow-lg">
                <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <h1 class="text-2xl font-bold text-gray-800">Request Leave</h1>
                    
                    <div class="flex flex-col md:flex-row md:justify-end md:items-center space-y-4 md:space-y-0 md:space-x-4">
                        
                        <div class="relative w-full md:w-64"> 
                            <input type="text" placeholder="Search..." 
                                v-model="searchQuery" 
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm"
                            >
                            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        <select v-model="typeFilter" class="p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm shrink-0 w-full md:w-auto">
                            <option value="">Type</option>
                            <option value="Personal">Personal</option>
                            <option value="Special">Special</option>
                            <option value="Optional">Optional</option>
                            <option value="Mandatory">Mandatory</option>
                        </select>
                        
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
                <table class="min-w-full">
                    <thead class="border-b-2 border-gray-200 bg-gray-50"> 
                        <tr>
                            <th v-for="header in tableHeaders" :key="header"
                                :class="['px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider', 
                                                header === 'Action' ? 'text-center w-1' : 'text-left']"> 
                                {{ header }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        <tr v-for="(request, index) in filteredRequests" :key="request.id" 
                            :class="[index % 2 !== 0 ? 'bg-blue-50' : 'bg-white', 'hover:bg-blue-100/70 transition-colors duration-150']">
                            
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ request.name }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ request.type }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ request.startLeave }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ request.endLeave }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ request.used }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm">
                                <span :class="getStatusClass(request.status)">
                                    {{ request.status }}
                                </span>
                            </td>

                            <td class="px-4 py-4 text-sm text-center whitespace-nowrap">
                                <div class="flex items-center justify-center space-x-2">
                                    <button @click="showAcceptModal(request.id)" title="Approve"
                                            class="text-green-500 hover:text-green-700 p-1 rounded-full transition duration-150">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </button>
                                    <button @click="showRejectModal(request.id)" title="Reject"
                                            class="text-red-500 hover:text-red-700 p-1 rounded-full transition duration-150">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </button>
                                    <button @click="openDetailModal(request)" title="Detail"
                                            class="text-blue-500 hover:text-blue-700 p-1 rounded-full transition duration-150">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filteredRequests.length === 0">
                            <td colspan="7" class="text-center py-6 text-gray-500 text-base">
                                No leave requests found matching the current filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="mt-4 flex justify-between items-center text-sm text-gray-600">
                    <p>Showing 1 to {{ filteredRequests.length }} of {{ requests.length }} entries</p>
                    <div class="flex space-x-1">
                        <button class="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100">&lt;</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-xl bg-[#5e77ff] text-white">1</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100">&gt;</button>
                    </div>
                </div>
            </div>

            <Transition name="modal-fade">
                <div v-if="selectedRequestDetail" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[2000]" @click.self="closeDetailModal">
                    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
                        
                        <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 class="text-xl font-semibold text-gray-800">Detail Leave Request</h2>
                            <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div class="p-6 text-gray-700 space-y-4 overflow-y-auto">
                            
                            <div class="grid grid-cols-3 gap-2 text-sm">
                                <p class="col-span-1 font-medium text-gray-900">Date</p>
                                <p class="col-span-2 text-gray-700">: {{ selectedRequestDetail.requestDate }}</p>

                                <p class="col-span-1 font-medium text-gray-900">Type</p>
                                <p class="col-span-2 text-gray-700">: Leave Request</p>

                                <p class="col-span-1 font-medium text-gray-900">Status</p>
                                <p class="col-span-2">: <span :class="getStatusClass(selectedRequestDetail.status)">{{ selectedRequestDetail.status }}</span></p>
                            </div>
                            
                            <hr class="border-gray-100">
                            
                            <p class="font-semibold text-gray-800">Detail Information:</p>
                            
                            <div class="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                                <div class="grid grid-cols-3">
                                    <p class="col-span-1 font-medium text-gray-800">Type</p>
                                    <p class="col-span-2 text-gray-700">: {{ selectedRequestDetail.type }} Leave</p>
                                </div>
                                <div class="grid grid-cols-3">
                                    <p class="col-span-1 font-medium text-gray-800">Duration</p>
                                    <p class="col-span-2 text-gray-700">: {{ selectedRequestDetail.used }} days ({{ selectedRequestDetail.startLeave }} to {{ selectedRequestDetail.endLeave }})</p>
                                </div>
                                <div class="grid grid-cols-3">
                                    <p class="col-span-1 font-medium text-gray-800">Reason</p>
                                    <p class="col-span-2 text-gray-700">: {{ selectedRequestDetail.reason }}</p>
                                </div>
                            </div>

                        </div>
                        
                        <div class="p-4 border-t border-gray-200 flex justify-end">
                            <button @click="closeDetailModal" class="px-4 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition">
                                OK
                            </button>
                        </div>

                    </div>
                </div>
            </Transition>
            
            <Transition name="modal-fade">
                <div v-if="showAcceptConfirmationModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[3000]" @click.self="closeAcceptModal">
                    <div class="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden transform transition-all duration-300 scale-100 p-8 text-center">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Accept Request</h3>
                        <p class="text-gray-700 mb-6">Are you sure you want to accept this request leave?</p>
                        <div class="flex justify-center space-x-4">
                            <button @click="closeAcceptModal" 
                                    class="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition">
                                Back
                            </button>
                            <button @click="confirmAccept" 
                                    class="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition">
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>

            <Transition name="modal-fade">
                <div v-if="showRejectConfirmationModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[3000]" @click.self="closeRejectModal">
                    <div class="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100 p-8">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 text-center">Reject Request</h3>
                        <p class="text-gray-700 mb-4 text-center">Are you sure you want to reject this request leave?</p>
                        
                        <div class="mb-6">
                            <label for="reject-reason" class="block text-sm font-medium text-gray-700 mb-2">Reason:</label>
                            <input type="text" id="reject-reason" v-model="rejectReason" placeholder="Reason..."
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            >
                        </div>

                        <div class="flex justify-center space-x-4">
                            <button @click="closeRejectModal" 
                                    class="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition">
                                Back
                            </button>
                            <button @click="confirmReject" 
                                    :disabled="!rejectReason.trim()"
                                    :class="{'px-4 py-2 font-medium rounded-lg transition': true,
                                             'bg-red-500 text-white hover:bg-red-600': rejectReason.trim(),
                                             'bg-red-300 text-white cursor-not-allowed': !rejectReason.trim()}">
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
            
            <Transition name="notification-slide">
                <div v-if="showSuccessNotification" class="fixed top-0 left-1/2 transform -translate-x-1/2 mt-6 p-4 rounded-lg shadow-xl bg-white border z-[4000]"
                     :class="notificationMessage.includes('accepted') ? 'border-green-400' : 'border-red-400'">
                    <div class="flex items-center space-x-2">
                        <svg v-if="notificationMessage.includes('accepted')" class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <svg v-else class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        
                        <span class="text-gray-800 font-medium">{{ notificationMessage }}</span>
                        <button @click="showSuccessNotification = false" class="text-gray-400 hover:text-gray-600 ml-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
            </Transition>

        </div>

    </AdminLayout>
</template>

<script setup>
import AdminLayout from '../../layouts/AdminLayout.vue'; 
import { ref, computed } from 'vue';

// ======================================================================
// === DATA PENDING LEAVE REQUESTS (MOCKUP) ===
// ======================================================================
const requests = ref([
    { id: 1, nik: '123456', name: 'Admin WGS', type: 'Special', startLeave: '2 July 2025', endLeave: '3 July 2025', used: 2, status: 'Pending', requestDate: '28 June 2025', reason: 'Official Business Trip' },
    { id: 2, nik: '323456', name: 'Budi Santoso', type: 'Optional', startLeave: '5 July 2025', endLeave: '4 July 2025', used: 2, status: 'Pending', requestDate: '29 June 2025', reason: 'Attend a wedding' },
    { id: 3, nik: '765431', name: 'Caca Marlina', type: 'Personal', startLeave: '1 July 2025', endLeave: '3 July 2025', used: 2, status: 'Pending', requestDate: '27 June 2025', reason: 'Family gathering' },
    { id: 4, nik: '232410', name: 'Dini Adinda', type: 'Special', startLeave: '2 July 2025', endLeave: '3 July 2025', used: 2, status: 'Pending', requestDate: '28 June 2025', reason: 'Unforeseen Circumstances' },
    { id: 5, nik: '98765', name: 'Eko Purnomo', type: 'Personal', startLeave: '4 July 2025', endLeave: '5 July 2025', used: 2, status: 'Pending', requestDate: '30 June 2025', reason: 'Personal necessity' },
]);

// ======================================================================
// === STATE & LOGIC UNTUK SEARCH & FILTER (Tidak Berubah) ===
// ======================================================================
const tableHeaders = ref(['Name', 'Type', 'Start Leave', 'End Leave', 'Used', 'Status', 'Action']);

const searchQuery = ref('');
const typeFilter = ref('');

const filteredRequests = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    const type = typeFilter.value.toLowerCase();

    return requests.value.filter(request => {
        const searchMatch = !query || 
                            request.name.toLowerCase().includes(query) ||
                            request.nik.toLowerCase().includes(query); 

        const typeMatch = !type || request.type.toLowerCase() === type;

        return searchMatch && typeMatch;
    });
});


// ======================================================================
// === STATE & FUNGSI UNTUK DETAIL MODAL (Tidak Berubah) ===
// ======================================================================
const selectedRequestDetail = ref(null);

const openDetailModal = (request) => {
    selectedRequestDetail.value = request;
}

const closeDetailModal = () => {
    selectedRequestDetail.value = null;
}

// ======================================================================
// === UPDATED: STATE & FUNGSI UNTUK ACCEPT/REJECT MODAL DAN NOTIFIKASI ===
// ======================================================================
const showAcceptConfirmationModal = ref(false);
const requestIdToAccept = ref(null);

// NEW STATES FOR REJECT
const showRejectConfirmationModal = ref(false);
const requestIdToReject = ref(null);
const rejectReason = ref('');

// UPDATED STATE FOR NOTIFICATION
const showSuccessNotification = ref(false);
const notificationMessage = ref('');

const showAcceptModal = (id) => {
    requestIdToAccept.value = id;
    showAcceptConfirmationModal.value = true;
}

const closeAcceptModal = () => {
    showAcceptConfirmationModal.value = false;
    requestIdToAccept.value = null;
}

// NEW FUNCTION TO SHOW REJECT MODAL
const showRejectModal = (id) => {
    requestIdToReject.value = id;
    rejectReason.value = ''; // Reset reason
    showRejectConfirmationModal.value = true;
}

// NEW FUNCTION TO CLOSE REJECT MODAL
const closeRejectModal = () => {
    showRejectConfirmationModal.value = false;
    requestIdToReject.value = null;
    rejectReason.value = '';
}

const confirmAccept = () => {
    if (requestIdToAccept.value !== null) {
        // Panggil logika untuk Accept
        handleAction(requestIdToAccept.value, 'Approve'); 
        
        // Tutup modal konfirmasi
        closeAcceptModal();
        
        // Tampilkan notifikasi sukses
        notificationMessage.value = 'Leave successfully accepted';
        showSuccessNotification.value = true;
        
        // Sembunyikan notifikasi setelah 3 detik
        setTimeout(() => {
            showSuccessNotification.value = false;
        }, 3000); 
    }
}

// NEW FUNCTION TO CONFIRM REJECT
const confirmReject = () => {
    if (requestIdToReject.value !== null && rejectReason.value.trim()) {
        // Panggil logika untuk Reject, sertakan reason
        handleAction(requestIdToReject.value, 'Reject', rejectReason.value.trim()); 
        
        // Tutup modal konfirmasi
        closeRejectModal();
        
        // Tampilkan notifikasi sukses REJECT
        notificationMessage.value = 'Leave successfully rejected';
        showSuccessNotification.value = true;
        
        // Sembunyikan notifikasi setelah 3 detik
        setTimeout(() => {
            showSuccessNotification.value = false;
        }, 3000); 
    }
}


// ======================================================================
// === FUNGSI UTILITY & ACTION (Diperbarui) ===
// ======================================================================

const getStatusClass = (status) => {
    const base = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
    if (status.toLowerCase() === 'pending') {
        return `${base} bg-yellow-100 text-yellow-800`;
    }
    // Added for future-proofing
    if (status.toLowerCase() === 'approved') {
        return `${base} bg-green-100 text-green-800`;
    } else if (status.toLowerCase() === 'rejected') {
        return `${base} bg-red-100 text-red-800`;
    }
    return `${base} bg-gray-100 text-gray-800`;
};

// UPDATED handleAction to remove the request item on success
const handleAction = (id, action, reason = '') => {
    const request = requests.value.find(req => req.id === id);
    if (request) {
        if (action === 'Approve') {
            // Pada kasus simulasi: Hapus item dari daftar pending
            requests.value = requests.value.filter(req => req.id !== id);
            // Optionally, you could change status to 'Approved' for a history list
        } else if (action === 'Reject') {
            // Hapus item dari daftar pending setelah reject
            console.log(`Rejecting request ID ${id} (${request.name}) with reason: ${reason}`);
            requests.value = requests.value.filter(req => req.id !== id);
            // Optionally, you could change status to 'Rejected' for a history list
        }
    }
}
</script>

<style scoped>
/* Transisi untuk Detail Modal (Tidak Berubah) */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

/* NEW: Transisi untuk Success Notification */
.notification-slide-enter-active {
  transition: all 0.3s ease-out;
}

.notification-slide-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.notification-slide-enter-from,
.notification-slide-leave-to {
  transform: translateY(-50px) translateX(-50%);
  opacity: 0;
}
</style>