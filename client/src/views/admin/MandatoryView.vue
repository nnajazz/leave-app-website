<template>
    <AdminLayout>
        <div class="space-y-6 p-6 bg-gray-100 min-h-screen"> 

            <div class="bg-white p-6 rounded-2xl shadow-lg">
                <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <h1 class="text-2xl font-bold text-gray-800">Daftar Cuti Wajib</h1>

                    <div class="flex flex-col md:flex-row md:justify-end md:items-center space-y-4 md:space-y-0 md:space-x-4">
                        
                        <div class="relative w-full md:w-80 lg:w-96">
                            <input type="text" placeholder="Search by Title..."
                                v-model="searchQuery"
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm"
                                >
                            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        <button @click="openUpdateYearModal"
                            class="flex items-center justify-center px-4 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition duration-150 shadow-md whitespace-nowrap">
                            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Update Year
                        </button>
                        
                        <button @click="openAddMandatoryLeaveModal"
                                class="flex items-center justify-center px-4 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition duration-150 shadow-md whitespace-nowrap">
                            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Add Mandatory Leave
                        </button>
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
                        <tr v-for="(leave, index) in filteredMandatoryLeaves" :key="leave.id"
                            :class="[index % 2 !== 0 ? 'bg-blue-50' : 'bg-white', 'hover:bg-blue-100/70 transition-colors duration-150']">

                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{{ leave.title }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ leave.gender }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ leave.duration }}</td>
                            <td class="px-4 py-4 max-w-xs text-sm text-gray-900 overflow-hidden text-ellipsis">{{ leave.information }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div class="flex space-x-2 items-center">

                                    <button @click="openEditMandatoryLeaveModal(leave.id)"
                                        class="text-gray-400 hover:text-green-500 focus:outline-none p-1 rounded-full transition duration-150"
                                        title="Edit">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </button>

                                    <button
                                        @click="toggleRuleStatus(leave)"
                                        :class="[
                                            leave.isActive ? 'bg-[#5e77ff]' : 'bg-gray-300',
                                            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5e77ff]'
                                        ]"
                                        role="switch"
                                        :aria-checked="leave.isActive.toString()"
                                        title="Toggle Status"
                                    >
                                        <span class="sr-only">Toggle rule status</span>
                                        <span
                                            aria-hidden="true"
                                            :class="[
                                                leave.isActive ? 'translate-x-5' : 'translate-x-0',
                                                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                            ]"
                                        ></span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filteredMandatoryLeaves.length === 0">
                            <td colspan="6" class="text-center py-6 text-gray-500 text-base">
                                Tidak ada aturan cuti wajib yang cocok dengan filter saat ini.
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="mt-4 flex justify-between items-center text-sm text-gray-600">
                    <p>Menampilkan 1 sampai {{ filteredMandatoryLeaves.length }} dari {{ mandatoryLeaves.length }} entri</p>
                    <div class="flex space-x-1">
                        <button class="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100">&lt;</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-xl bg-[#5e77ff] text-white">1</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100">&gt;</button>
                    </div>
                </div>
            </div>
        </div>

        <Transition name="modal-fade">
            <div v-if="isAddModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[1000]" @click.self="isAddModalOpen = false">
                <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg" @click.stop>

                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Add Mandatory Leave</h2>

                    <form @submit.prevent="addMandatoryLeaveRule" class="space-y-5">

                        <div>
                            <label for="title" class="block text-sm font-medium text-gray-700">Tittle</label>
                            <input type="text" id="title" v-model="newLeaveRule.title" required
                                class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm"
                                placeholder="Tittle">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                            <div class="flex space-x-6">
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="newLeaveRule.gender" value="F" class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]" required>
                                    <span class="ml-2 text-gray-700">Perempuan (F)</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="newLeaveRule.gender" value="M" class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]">
                                    <span class="ml-2 text-gray-700">Laki-laki (M)</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="newLeaveRule.gender" value="MF" class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]">
                                    <span class="ml-2 text-gray-700">Laki-laki & Perempuan (MF)</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label for="duration" class="block text-sm font-medium text-gray-700">Duration Leave</label>
                            <div class="mt-1 flex items-center rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                                <input type="date" id="start-date" v-model="newLeaveRule.durationLeave.startDate" required
                                    class="flex-1 block w-full p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] border-r border-gray-300 sm:text-sm"
                                    title="Start Date">
                                
                                <span class="p-3 text-gray-500">-</span>
                                
                                <input type="date" id="end-date" v-model="newLeaveRule.durationLeave.endDate" required
                                    class="flex-1 block w-full p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm"
                                    title="End Date">
                            </div>
                        </div>

                        <div>
                            <label for="information" class="block text-sm font-medium text-gray-700">Information</label>
                            <textarea id="information" v-model="newLeaveRule.information" rows="3" required
                                class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm"
                                placeholder="Information"></textarea>
                        </div>

                        <div class="flex justify-end pt-4 space-x-3">
                            <button type="button" @click="isAddModalOpen = false"
                                class="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition duration-150">
                                Back
                            </button>
                            <button type="submit"
                                class="px-5 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition duration-150">
                                Confirm
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </Transition>

        <Transition name="modal-fade">
            <div v-if="isEditModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[1000]" @click.self="isEditModalOpen = false">
                <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg" @click.stop>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-800">Edit Cuti Wajib</h2>
                        <button @click="isEditModalOpen = false" class="text-gray-400 hover:text-gray-600 transition">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <form @submit.prevent="updateMandatoryLeaveRule" class="space-y-5">

                        <div>
                            <label for="edit-title" class="block text-sm font-medium text-gray-700">Judul</label>
                            <input type="text" id="edit-title" v-model="editLeaveRule.title" required
                                class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                            <div class="flex space-x-6">
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="editLeaveRule.gender" value="F" class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]" required>
                                    <span class="ml-2 text-gray-700">Perempuan (F)</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="editLeaveRule.gender" value="M" class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]">
                                    <span class="ml-2 text-gray-700">Laki-laki (M)</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="editLeaveRule.gender" value="MF" class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]">
                                    <span class="ml-2 text-gray-700">Laki-laki & Perempuan (MF)</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label for="edit-duration" class="block text-sm font-medium text-gray-700">Durasi Cuti</label>
                            <div class="mt-1 flex items-center rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                                <input type="date" id="edit-start-date" v-model="editLeaveRule.durationLeave.startDate" required
                                    class="flex-1 block w-full p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] border-r border-gray-300 sm:text-sm"
                                    title="Start Date">
                                
                                <span class="p-3 text-gray-500">-</span>
                                
                                <input type="date" id="edit-end-date" v-model="editLeaveRule.durationLeave.endDate" required
                                    class="flex-1 block w-full p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm"
                                    title="End Date">
                            </div>
                        </div>
                        <div>
                            <label for="edit-information" class="block text-sm font-medium text-gray-700">Keterangan</label>
                            <textarea id="edit-information" v-model="editLeaveRule.information" rows="3" required
                                class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm"></textarea>
                        </div>

                        <div class="flex justify-end pt-4 space-x-3">
                            <button type="button" @click="isEditModalOpen = false"
                                class="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition duration-150">
                                Kembali
                            </button>
                            <button type="submit"
                                class="px-5 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition duration-150">
                                Perbarui
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </Transition>
        
        <Transition name="modal-fade">
            <div v-if="isUpdateYearModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[1000]" @click.self="isUpdateYearModalOpen = false">
                <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm" @click.stop>
                    
                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-xl font-bold text-gray-800">Update Year</h2>
                        <button @click="isUpdateYearModalOpen = false" class="text-gray-400 hover:text-gray-600 transition">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <p class="text-sm text-gray-600 mb-8">Update mandatory leave year</p>
                    
                    <div class="flex items-center justify-center space-x-4 mb-10">
                        <button @click="decrementYear"
                                class="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 transition">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        
                        <div class="flex items-center space-x-3 text-2xl font-semibold text-gray-800">
                            <span>{{ yearToUpdate }}</span>
                            <span class="text-gray-400">|</span>
                            <span>{{ yearToUpdate + 1 }}</span>
                        </div>

                        <button @click="incrementYear"
                                class="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 transition">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>

                    <div class="flex justify-end space-x-3 mt-8">
                        <button type="button" @click="isUpdateYearModalOpen = false"
                            class="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition duration-150">
                            Cancel
                        </button>
                        <button type="button" @click="handleUpdateYear"
                            class="px-5 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition duration-150">
                            Submit
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
// === DATA MOCKUP CUTI WAJIB (Format Tanggal Diubah ke YYYY-MM-DD) ===
// ======================================================================

const mandatoryLeaves = ref([
    // Mengubah format duration menjadi YYYY-MM-DD - YYYY-MM-DD untuk kompatibilitas input type="date"
    { id: 1, title: 'Cuti Tahunan', gender: 'MF', duration: '2025-01-19 - 2025-01-19', information: 'Bentuk cuti untuk seluruh karyawan laki-laki dan perempuan dalam lingkup cuti tahunan.', isActive: true },
    { id: 2, title: 'Cuti Melahirkan/Keguguran', gender: 'F', duration: '2025-12-22 - 2026-03-22', information: 'Cuti diberikan kepada staf perempuan untuk persalinan atau keguguran.', isActive: true },
    { id: 3, title: 'Cuti Bersama', gender: 'MF', duration: '2026-01-01 - 2026-01-02', information: 'Cuti kolektif sesuai keputusan nasional (Tanggal Merah Bergabung).', isActive: true },
    { id: 4, title: 'Cuti Karyawan Baru', gender: 'MF', duration: '2025-07-14 - 2025-07-17', information: 'Cuti diberikan kepada karyawan setelah 1 tahun masa kerja.', isActive: true },
    { id: 5, title: 'Cuti Pemeriksaan Kesehatan', gender: 'MF', duration: '2025-02-03 - 2025-02-04', information: 'Cuti untuk pemeriksaan kesehatan rutin setiap 6 bulan.', isActive: false },
]);

// Updated table headers: 'Amount' diubah menjadi 'Duration'
const tableHeaders = ref(['No', 'Title', 'Gender', 'Duration', 'Information', 'Action']); 

// ======================================================================
// === STATE & FUNGSI UNTUK FILTER, SEARCH, & AKSI ===
// ======================================================================

const searchQuery = ref('');
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isUpdateYearModalOpen = ref(false); 
const yearToUpdate = ref(new Date().getFullYear()); // Menetapkan tahun saat ini sebagai nilai awal

// State untuk data rule baru yang akan ditambahkan (menggunakan YYYY-MM-DD)
const newLeaveRule = ref({
    title: '',
    gender: 'MF', 
    durationLeave: {
        startDate: '', // YYYY-MM-DD
        endDate: '',   // YYYY-MM-DD
    },
    information: '',
});

// State untuk data rule yang akan di-edit (menggunakan YYYY-MM-DD)
const editLeaveRule = ref({
    id: null,
    title: '',
    gender: '',
    durationLeave: {
        startDate: '', // YYYY-MM-DD
        endDate: '',   // YYYY-MM-DD
    },
    information: '',
    isActive: false,
});


// --- Helper Functions ---

const resetNewLeaveRule = () => {
    newLeaveRule.value = {
        title: '',
        gender: 'MF',
        durationLeave: {
            startDate: '',
            endDate: '',
        },
        information: '',
    };
};

// Fungsi untuk parsing duration dari format data (YYYY-MM-DD - YYYY-MM-DD) ke state modal edit
const parseDuration = (duration) => {
    const parts = duration.split(' - ');
    if (parts.length === 2 && parts[0].match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Mengembalikan format YYYY-MM-DD yang dibutuhkan oleh input type="date"
        return {
            startDate: parts[0], 
            endDate: parts[1],   
        };
    }
    return { startDate: '', endDate: '' };
};

// Fungsi untuk format durasi di TAMPILAN tabel (dari YYYY-MM-DD ke DD/MM/YYYY)
const formatDurationForTable = (duration) => {
    const parts = duration.split(' - ');
    if (parts.length === 2) {
        const formatPart = (date) => {
            if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) return date; // Return as is if format is unexpected
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}`; // DD/MM/YYYY
        };
        return `${formatPart(parts[0])} - ${formatPart(parts[1])}`;
    }
    return duration;
}

// --- Modal & Action Handlers ---

const openUpdateYearModal = () => {
    // Set tahun awal ke tahun sekarang saat modal dibuka
    yearToUpdate.value = new Date().getFullYear(); 
    isUpdateYearModalOpen.value = true;
};

// Fungsi untuk mengurangi tahun yang ditampilkan
const decrementYear = () => {
    yearToUpdate.value--;
};

// Fungsi untuk menambah tahun yang ditampilkan
const incrementYear = () => {
    yearToUpdate.value++;
};

const handleUpdateYear = () => {
    alert(`Fungsi Update Year untuk tahun ${yearToUpdate.value} - ${yearToUpdate.value + 1} telah dipanggil. Implementasi backend diperlukan untuk memperbarui data cuti tahunan.`);
    isUpdateYearModalOpen.value = false;
};

const openAddMandatoryLeaveModal = () => {
    resetNewLeaveRule();
    isAddModalOpen.value = true;
};

const openEditMandatoryLeaveModal = (id) => {
    const leaveToEdit = mandatoryLeaves.value.find(leave => leave.id === id);

    if (leaveToEdit) {
        const { startDate, endDate } = parseDuration(leaveToEdit.duration);

        // Isi state editLeaveRule dengan data yang akan di-edit (dalam YYYY-MM-DD)
        editLeaveRule.value = {
            id: leaveToEdit.id,
            title: leaveToEdit.title,
            gender: leaveToEdit.gender,
            durationLeave: {
                startDate: startDate,
                endDate: endDate,
            },
            information: leaveToEdit.information,
            isActive: leaveToEdit.isActive,
        };

        isEditModalOpen.value = true;
    } else {
        alert('Aturan Cuti Wajib tidak ditemukan!');
    }
};


const toggleRuleStatus = (leave) => {
    // Cari item asli di mandatoryLeaves berdasarkan ID
    const leaveIndex = mandatoryLeaves.value.findIndex(l => l.id === leave.id);
    if (leaveIndex !== -1) {
        mandatoryLeaves.value[leaveIndex].isActive = !mandatoryLeaves.value[leaveIndex].isActive;
        const action = mandatoryLeaves.value[leaveIndex].isActive ? 'diaktifkan' : 'dinonaktifkan';
        alert(`Aturan "${mandatoryLeaves.value[leaveIndex].title}" telah berhasil ${action}.`);
    }
};

const addMandatoryLeaveRule = () => {
    const rule = newLeaveRule.value;
    
    if (!rule.title || !rule.durationLeave.startDate || !rule.durationLeave.endDate || !rule.information) {
        alert('Mohon isi semua kolom yang wajib (Judul, Durasi Cuti, Keterangan).');
        return;
    }

    const newId = Math.max(...mandatoryLeaves.value.map(l => l.id), 0) + 1;
    // Simpan durasi dalam format YYYY-MM-DD - YYYY-MM-DD
    const newDuration = `${rule.durationLeave.startDate} - ${rule.durationLeave.endDate}`;

    const newRule = {
        id: newId,
        title: rule.title,
        gender: rule.gender,
        duration: newDuration,
        information: rule.information,
        isActive: true, 
    };

    mandatoryLeaves.value.push(newRule);

    isAddModalOpen.value = false;
    resetNewLeaveRule();
    alert(`Aturan Cuti Wajib "${newRule.title}" berhasil ditambahkan!`);
};

const updateMandatoryLeaveRule = () => {
    const ruleToUpdate = editLeaveRule.value;
    if (!ruleToUpdate.title || !ruleToUpdate.gender || !ruleToUpdate.durationLeave.startDate || !ruleToUpdate.durationLeave.endDate || !ruleToUpdate.information) {
        alert('Mohon isi semua kolom yang wajib untuk diperbarui.');
        return;
    }

    const index = mandatoryLeaves.value.findIndex(leave => leave.id === ruleToUpdate.id);

    if (index !== -1) {
        mandatoryLeaves.value[index].title = ruleToUpdate.title;
        mandatoryLeaves.value[index].gender = ruleToUpdate.gender;
        // Gabungkan tanggal kembali menjadi string durasi (YYYY-MM-DD)
        mandatoryLeaves.value[index].duration = `${ruleToUpdate.durationLeave.startDate} - ${ruleToUpdate.durationLeave.endDate}`; 
        mandatoryLeaves.value[index].information = ruleToUpdate.information;
        mandatoryLeaves.value[index].isActive = ruleToUpdate.isActive;

        isEditModalOpen.value = false;
        alert(`Aturan Cuti Wajib "${ruleToUpdate.title}" berhasil diperbarui!`);
    } else {
        alert('Error: Aturan tidak ditemukan untuk diperbarui.');
    }
};


// --- LOGIKA FILTERING GABUNGAN (COMPUTED PROPERTY) ---
const filteredMandatoryLeaves = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();

    return mandatoryLeaves.value
        .filter(leave => {
            // Filter hanya berdasarkan Judul dan Keterangan dari data asli
            return !query ||
                leave.title.toLowerCase().includes(query) ||
                leave.information.toLowerCase().includes(query);
        })
        .map(leave => ({
            ...leave,
            // Perbarui properti 'duration' untuk tampilan di tabel menjadi DD/MM/YYYY
            duration: formatDurationForTable(leave.duration)
        }));
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

/* Style tambahan untuk input type="date" agar ikon kalender bawaan tidak berbenturan dengan layout */
input[type="date"]::-webkit-calendar-picker-indicator {
    padding-right: 12px; /* Menambahkan padding agar ikon bawaan tidak terlalu mepet */
    cursor: pointer;
}
</style>