<template>
    <AdminLayout>
        <div class="space-y-6">

            <div class="bg-white p-6 rounded-2xl shadow-lg">
                <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <h1 class="text-2xl font-bold text-gray-800">History Leave</h1>
                    
                    <div class="flex flex-col md:flex-row md:justify-end md:items-center space-y-4 md:space-y-0 md:space-x-4">
                        
                        <div class="relative w-full md:w-80 lg:w-96 order-1 md:order-1"> 
                            <input type="text" placeholder="Search by Name..." 
                                v-model="searchQuery" 
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm"
                                >
                            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        <div class="flex space-x-2 sm:space-x-4 shrink-0 order-2 md:order-2">
                            <select v-model="statusFilter" class="p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm shrink-0">
                                <option value="">Status</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                        
                        <div class="flex space-x-2 sm:space-x-4 shrink-0 order-3 md:order-3">
                            <select v-model="typeFilter" class="p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm shrink-0">
                                <option value="">Type</option>
                                <option value="Special">Special</option>
                                <option value="Optional">Optional</option>
                                <option value="Personal">Personal</option>
                                <option value="Mandatory">Mandatory</option>
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
                        <tr v-for="(request, index) in filteredRequests" :key="request.id" 
                            :class="[index % 2 !== 0 ? 'bg-blue-50' : 'bg-white', 'hover:bg-blue-100/70 transition-colors duration-150']">
                            
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ request.name }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ request.type }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ request.startDate }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ request.endDate }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ request.used }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm">
                                <span :class="getStatusClass(request.status)">
                                    {{ request.status }}
                                </span>
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div class="flex items-center space-x-2">
                                    
                                    <button @click="handleApproveOrReject(request)"
                                        class="text-green-500 hover:text-green-700 p-1 rounded-full transition duration-150 focus:outline-none"
                                        :title="request.status === 'Approved' ? 'Reject Approved Leave' : (request.status === 'Rejected' ? 'Approve Rejected Leave' : 'View Document')">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.854 7.519a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                                        </svg>
                                    </button>

                                    <button @click="openDetailModal(request)" 
                                        class="text-blue-500 hover:text-blue-700 p-1 rounded-full transition duration-150 focus:outline-none"
                                        title="View Details">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filteredRequests.length === 0">
                            <td colspan="7" class="text-center py-6 text-gray-500 text-base">
                                No leave request found matching the current filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="mt-4 flex justify-between items-center text-sm text-gray-600">
                    <p>Showing 1 to {{ filteredRequests.length }} of {{ leaveRequests.length }} entries</p>
                    <div class="flex space-x-1">
                        <button class="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100 disabled:opacity-50" disabled>&lt;</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-xl bg-[#5e77ff] text-white">1</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100 disabled:opacity-50" disabled>&gt;</button>
                    </div>
                </div>
            </div>
            </div>

        <Transition name="modal-fade">
            <div v-if="selectedDetail" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[1000]" @click.self="closeDetailModal">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
                    
                    <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 class="text-xl font-semibold text-gray-800">Leave Request Detail</h2>
                        <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div class="p-6 text-gray-700 space-y-3 overflow-y-auto">
                        
                        <div class="p-4 rounded-lg" :class="selectedDetail.status === 'Approved' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
                            <p class="text-sm font-semibold mb-2" :class="selectedDetail.status === 'Approved' ? 'text-green-800' : 'text-red-800'">
                                Balance Use:
                            </p>

                            <div class="grid grid-cols-3 gap-y-1 text-sm mb-3">
                                <p class="col-span-1 font-medium text-gray-700">Balance Use (2025)</p>
                                <p class="col-span-2 text-gray-700 font-bold">: {{ selectedDetail.balanceUse2025 ?? '-' }}</p>
                                <p class="col-span-1 font-medium text-gray-700">Balance Use (2026)</p>
                                <p class="col-span-2 text-gray-700 font-bold">: {{ selectedDetail.balanceUse2026 ?? '-' }}</p>
                            </div>

                            <div v-if="selectedDetail.status === 'Approved'">
                                <div class="grid grid-cols-3 gap-y-1 text-sm">
                                    <p class="col-span-1 font-medium text-gray-700">Approved by</p>
                                    <p class="col-span-2 text-gray-700 font-bold">: {{ selectedDetail.approvedBy ?? '-' }}</p>
                                </div>
                            </div>

                            <div v-else-if="selectedDetail.status === 'Rejected'">
                                <div class="grid grid-cols-3 gap-y-1 text-sm mb-3">
                                    <p class="col-span-1 font-medium text-gray-700">Rejected by</p>
                                    <p class="col-span-2 text-gray-700 font-bold">: {{ selectedDetail.rejectedBy ?? '-' }}</p>
                                </div>
                                <div v-if="selectedDetail.rejectionReason" class="mt-4">
                                    <p class="font-semibold text-red-800 text-sm">Rejection Reason:</p>
                                    <div class="bg-red-100 p-3 rounded-lg text-sm italic text-red-700 border border-red-300">
                                        {{ selectedDetail.rejectionReason }}
                                    </div>
                                </div>
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
            <div v-if="selectedRejectRequest" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[1000]" @click.self="closeRejectModal">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100">
                    
                    <div class="p-6 border-b border-red-200 flex justify-between items-center">
                        <h2 class="text-xl font-semibold text-gray-800">Reject Leave Request</h2>
                        <button @click="closeRejectModal" class="text-gray-400 hover:text-gray-600 transition">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div class="p-6 text-gray-700 space-y-4">
                        <p class="text-sm font-medium text-gray-800">Employee Name: <span class="font-bold">{{ selectedRejectRequest.name }}</span></p>

                        <div class="flex items-start p-3 bg-red-100 border border-red-200 rounded-lg">
                            <svg class="w-5 h-5 text-red-500 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
                            <p class="text-sm text-red-700">You are about to reject a leave request that has already been approved.</p>
                        </div>

                        <div>
                            <label for="rejection-reason" class="block text-sm font-medium text-gray-700">Reason:</label>
                            <textarea id="rejection-reason" v-model="rejectionReasonInput" rows="3" 
                                class="mt-1 block w-full p-2 border-2 border-red-400 rounded-xl shadow-sm focus:ring-red-500 focus:border-red-500 text-sm" 
                                placeholder="Reason...">
                            </textarea>
                        </div>
                    </div>
                    
                    <div class="p-4 border-t border-gray-200 flex justify-end space-x-3">
                        <button @click="closeRejectModal" class="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition">
                            Back
                        </button>
                        <button @click="rejectRequest" :disabled="!rejectionReasonInput.trim()" 
                            class="px-4 py-2 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 disabled:opacity-50 transition">
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <Transition name="modal-fade">
            <div v-if="selectedApproveRequest" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[1000]" @click.self="closeApproveModal">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100">
                    
                    <div class="p-6 border-b border-green-300 flex justify-between items-center"> 
                        <h2 class="text-xl font-semibold text-gray-800">Approve Leave Request</h2>
                        <button @click="closeApproveModal" class="text-gray-400 hover:text-gray-600 transition">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div class="p-6 text-gray-700 space-y-4">
                        <p class="text-sm font-medium text-gray-800">Employee Name: <span class="font-bold">{{ selectedApproveRequest.name }}</span></p>

                        <div class="flex items-start p-3 bg-green-100 border border-green-200 rounded-lg"> 
                            <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg> 
                            <p class="text-sm text-green-700">This leave request was previously rejected. You are about to approve it.</p> 
                        </div>

                        <div>
                            <label for="approval-reason" class="block text-sm font-medium text-gray-700">Reason:</label>
                            <textarea id="approval-reason" v-model="approvalReasonInput" rows="3" 
                                class="mt-1 block w-full p-2 border border-gray-300 rounded-xl shadow-sm focus:ring-[#5e77ff] focus:border-[#5e77ff] text-sm" 
                                placeholder="Reason (Optional)...">
                            </textarea>
                        </div>
                    </div>
                    
                    <div class="p-4 border-t border-gray-200 flex justify-end space-x-3">
                        <button @click="closeApproveModal" class="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition">
                            Back
                        </button>
                        <button @click="approveRequest" 
                            class="px-4 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition">
                            Approve
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
// === DATA MOCKUP (UPDATED) ===
// ======================================================================

const tableHeaders = ref(['Name', 'Type', 'Start Leave', 'End Leave', 'Leave Used', 'Status', 'Action']);

const leaveRequests = ref([
    { 
        id: 1, name: 'Admin WGS', type: 'Optional', startDate: '2 July 2025', endDate: '3 July 2025', used: 2, status: 'Approved', 
        reason: 'Annual leave for a family trip.', 
        balanceUse2025: 3, balanceUse2026: 3, approvedBy: 'Admin WGS', approvalReason: 'Confirmed team coverage is sufficient.' // Tambahkan Approval Reason untuk contoh
    },
    { 
        id: 2, name: 'Admin WGS', type: 'Optional', startDate: '3 July 2025', endDate: '4 July 2025', used: 2, status: 'Approved', 
        reason: 'Continuation of annual leave.',
        balanceUse2025: 3, balanceUse2026: 3, approvedBy: 'Admin WGS'
    },
    { 
        id: 3, name: 'Admin WGS', type: 'Personal', startDate: '1 July 2025', endDate: '2 July 2025', used: 2, status: 'Rejected', 
        reason: 'Personal errands.', rejectionReason: 'Insufficient balance in personal leave type.', 
        balanceUse2025: 3, balanceUse2026: 3, rejectedBy: 'Admin WGS' 
    },
    { 
        id: 4, name: 'Admin WGS', type: 'Special', startDate: '2 July 2025', endDate: '3 July 2025', used: 2, status: 'Rejected', 
        reason: 'Required to accompany a family member for a medical appointment.', rejectionReason: 'The accompanying document is not valid.',
        balanceUse2025: 3, balanceUse2026: 3, rejectedBy: 'Admin WGS' 
    },
    { 
        id: 5, name: 'Admin WGS', type: 'Personal', startDate: '4 July 2025', endDate: '5 July 2025', used: 2, status: 'Rejected', 
        reason: 'Vacation to an international destination.', rejectionReason: 'Team capacity is low during the requested period.',
        balanceUse2025: 3, balanceUse2026: 3, rejectedBy: 'Admin WGS' 
    },
    { 
        id: 6, name: 'Budi Santoso', type: 'Mandatory', startDate: '10 June 2025', endDate: '10 June 2025', used: 1, status: 'Approved', 
        reason: 'Mandatory religious holiday observance.',
        balanceUse2025: 3, balanceUse2026: 3, approvedBy: 'Admin WGS'
    },
]);

// ======================================================================
// === FILTERING LOGIC ===
// ======================================================================

const searchQuery = ref('');
const typeFilter = ref('');
const statusFilter = ref(''); 

const filteredRequests = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    const type = typeFilter.value;
    const status = statusFilter.value;

    return leaveRequests.value.filter(request => {
        const searchMatch = !query || request.name.toLowerCase().includes(query);
        const typeMatch = !type || request.type === type;
        const statusMatch = !status || request.status === status; 

        return searchMatch && typeMatch && statusMatch;
    });
});

// ======================================================================
// === MODAL & ACTION FUNCTIONALITY ===
// ======================================================================

// Data untuk Detail Modal
const selectedDetail = ref(null);

// Data untuk Reject Modal
const selectedRejectRequest = ref(null);
const rejectionReasonInput = ref('');

// Data untuk Approve Modal
const selectedApproveRequest = ref(null);
const approvalReasonInput = ref('');

/**
 * Open the detail modal.
 * @param {object} request - The leave request object.
 */
const openDetailModal = (request) => {
    selectedDetail.value = request;
};

const closeDetailModal = () => {
    selectedDetail.value = null;
};

/**
 * Open the reject modal.
 * @param {object} request - The leave request object.
 */
const openRejectModal = (request) => {
    selectedRejectRequest.value = request;
    rejectionReasonInput.value = ''; // Reset input
};

/**
 * Close the reject modal.
 */
const closeRejectModal = () => {
    selectedRejectRequest.value = null;
    rejectionReasonInput.value = '';
};

/**
 * Open the approve modal. 
 * @param {object} request - The leave request object.
 */
const openApproveModal = (request) => {
    selectedApproveRequest.value = request;
    approvalReasonInput.value = ''; // Reset input
};

/**
 * Close the approve modal. 
 */
const closeApproveModal = () => {
    selectedApproveRequest.value = null;
    approvalReasonInput.value = '';
};

/**
 * Handle the action for the Checkmark Document icon: Reject (if Approved) or Approve (if Rejected).
 * @param {object} request - The leave request object.
 */
const handleApproveOrReject = (request) => {
    if (request.status === 'Approved') {
        // Buka Reject Modal untuk status Approved
        openRejectModal(request);
    } else if (request.status === 'Rejected') {
        // Buka Approve Modal untuk status Rejected
        openApproveModal(request);
    } else {
        // Placeholder/Default action for other statuses
        alert(`Viewing document for leave request: ${request.name} (${request.type} - ${request.startDate}). Status: ${request.status}`);
    }
};

/**
 * Function to handle the rejection process for an Approved status.
 */
const rejectRequest = () => {
    if (selectedRejectRequest.value && rejectionReasonInput.value.trim()) {
        const requestId = selectedRejectRequest.value.id;
        const index = leaveRequests.value.findIndex(req => req.id === requestId);

        if (index !== -1) {
            // Ubah status dan simpan alasan penolakan
            leaveRequests.value[index].status = 'Rejected';
            leaveRequests.value[index].rejectionReason = rejectionReasonInput.value.trim();
            leaveRequests.value[index].approvalReason = undefined; // Clear old approval reason
            leaveRequests.value[index].rejectedBy = 'Admin WGS'; // Set who rejected
            leaveRequests.value[index].approvedBy = undefined; // Clear old approver
            
            // Opsional: berikan notifikasi
            alert(`Leave for ${leaveRequests.value[index].name} successfully cancelled/rejected with reason: "${rejectionReasonInput.value.trim()}"`);
        }

        closeRejectModal();
    } else {
        alert('Rejection reason must be filled!');
    }
};

/**
 * Function to handle the approval process for a Rejected status.
 */
const approveRequest = () => {
    if (selectedApproveRequest.value) {
        const requestId = selectedApproveRequest.value.id;
        const index = leaveRequests.value.findIndex(req => req.id === requestId);

        if (index !== -1) {
            // Ubah status menjadi Approved
            leaveRequests.value[index].status = 'Approved';
            
            // Hapus alasan penolakan
            leaveRequests.value[index].rejectionReason = undefined; 
            leaveRequests.value[index].rejectedBy = undefined; // Clear old rejecter
            
            // Simpan alasan persetujuan baru (jika ada) dan set approver
            leaveRequests.value[index].approvalReason = approvalReasonInput.value.trim() || undefined;
            leaveRequests.value[index].approvedBy = 'Admin WGS';

            // Opsional: berikan notifikasi
            alert(`Leave for ${leaveRequests.value[index].name} successfully approved/re-approved!`);
        }

        closeApproveModal();
    }
    // Tidak perlu else karena tombol approve selalu aktif.
};


// ======================================================================
// === UTILITY FUNCTIONS ===
// ======================================================================

/**
 * Get Tailwind CSS classes for the status badge.
 * @param {string} status 
 * @returns {string}
 */
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

<style scoped>
/* Transition for modal, optional but good for UX */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>