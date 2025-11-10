<template>
    <AdminLayout>
        <div class="space-y-6">

            <div class="bg-white p-6 rounded-2xl shadow-lg">
                <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <h1 class="text-2xl font-bold text-gray-800">Special Leave List</h1>

                    <div class="flex flex-col md:flex-row md:justify-end md:items-center space-y-4 md:space-y-0 md:space-x-4">

                        <div class="relative w-full md:w-80 lg:w-96">
                            <input type="text" placeholder="Search by Title..."
                                v-model="searchQuery"
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm"
                                >
                            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        <button @click="openAddSpecialLeaveModal"
                                class="flex items-center justify-center px-4 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition duration-150 shadow-md whitespace-nowrap">
                            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Add Special Leave
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
                        <tr v-for="(leave, index) in filteredSpecialLeaves" :key="leave.id"
                            :class="[index % 2 !== 0 ? 'bg-blue-50' : 'bg-white', 'hover:bg-blue-100/70 transition-colors duration-150']">

                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{{ leave.title }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ leave.gender }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ leave.amount }}</td>
                            <td class="px-4 py-4 max-w-xs text-sm text-gray-900 overflow-hidden text-ellipsis">{{ leave.information }}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div class="flex space-x-2 items-center">

                                    <button @click="openEditSpecialLeaveModal(leave.id)"
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
                        <tr v-if="filteredSpecialLeaves.length === 0">
                            <td colspan="6" class="text-center py-6 text-gray-500 text-base">
                                No special leave rule found matching the current filters.
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="mt-4 flex justify-between items-center text-sm text-gray-600">
                    <p>Showing 1 to {{ filteredSpecialLeaves.length }} of {{ specialLeaves.length }} entries</p>
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

                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Add Special Leave</h2>

                    <form @submit.prevent="addSpecialLeaveRule" class="space-y-5">

                        <div>
                            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" id="title" v-model="newLeaveRule.title" required
                                class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <div class="flex space-x-6">
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="newLeaveRule.gender" value="F" class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]" required>
                                    <span class="ml-2 text-gray-700">Female (F)</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="newLeaveRule.gender" value="M" class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]">
                                    <span class="ml-2 text-gray-700">Male (M)</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="newLeaveRule.gender" value="MF" class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]">
                                    <span class="ml-2 text-gray-700">Male & Female (MF)</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
                            <div class="mt-1 flex rounded-xl shadow-sm">
                                <input type="number" id="amount" v-model.number="newLeaveRule.amountValue" min="1" required
                                    class="flex-1 block w-full border border-gray-300 rounded-l-xl p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm">
                                <select v-model="newLeaveRule.amountUnit" required
                                    class="border border-gray-300 rounded-r-xl bg-gray-50 p-3 text-sm focus:ring-[#5e77ff] focus:border-[#5e77ff]">
                                    <option value="Days">Days</option>
                                    <option value="Month">Month</option>
                                    <option value="Year">Year</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label for="information" class="block text-sm font-medium text-gray-700">Information</label>
                            <textarea id="information" v-model="newLeaveRule.information" rows="3" required
                                class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm"></textarea>
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
                        <h2 class="text-2xl font-bold text-gray-800">Edit Special Leave</h2>
                        <button @click="isEditModalOpen = false" class="text-gray-400 hover:text-gray-600 transition">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <form @submit.prevent="updateSpecialLeaveRule" class="space-y-5">

                        <div>
                            <label for="edit-title" class="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" id="edit-title" v-model="editLeaveRule.title" required
                                class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <div class="flex space-x-6">
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="editLeaveRule.gender" value="F" class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]" required>
                                    <span class="ml-2 text-gray-700">Female (F)</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="editLeaveRule.gender" value="M" class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]">
                                    <span class="ml-2 text-gray-700">Male (M)</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="editLeaveRule.gender" value="MF" class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]">
                                    <span class="ml-2 text-gray-700">Male & Female (MF)</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label for="edit-amount" class="block text-sm font-medium text-gray-700">Amount</label>
                            <div class="mt-1 flex rounded-xl shadow-sm">
                                <input type="number" id="edit-amount" v-model.number="editLeaveRule.amountValue" min="1" required
                                    class="flex-1 block w-full border border-gray-300 rounded-l-xl p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm">
                                <select v-model="editLeaveRule.amountUnit" required
                                    class="border border-gray-300 rounded-r-xl bg-gray-50 p-3 text-sm focus:ring-[#5e77ff] focus:border-[#5e77ff]">
                                    <option value="Days">Days</option>
                                    <option value="Month">Month</option>
                                    <option value="Year">Year</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label for="edit-information" class="block text-sm font-medium text-gray-700">Information</label>
                            <textarea id="edit-information" v-model="editLeaveRule.information" rows="3" required
                                class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm"></textarea>
                        </div>

                        <div class="flex justify-end pt-4 space-x-3">
                            <button type="button" @click="isEditModalOpen = false"
                                class="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition duration-150">
                                Back
                            </button>
                            <button type="submit"
                                class="px-5 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition duration-150">
                                Update
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </Transition>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '../../layouts/AdminLayout.vue';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios'; 

// ======================================================================
// === API CONFIGURATION AND DATA STATE BARU ===
// ======================================================================

// URL telah disesuaikan agar cocok dengan router backend: /api/leaves/special
const API_BASE_URL = 'http://localhost:3001/api/v1/leaves/special';

// Data state sekarang kosong, akan diisi dari API
const specialLeaves = ref([]);

const tableHeaders = ref(['No', 'Title', 'Gender', 'Amount', 'Information', 'Action']);

// ======================================================================
// === STATE & FUNGSI UNTUK FILTER, SEARCH, & AKSI ===
// ======================================================================

const searchQuery = ref('');
const genderFilter = ref('');
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);

// State untuk data rule baru yang akan ditambahkan
const newLeaveRule = ref({
    title: '',
    gender: '', // F, M, atau MF
    amountValue: 0,
    amountUnit: 'Days', // Default unit
    information: '',
});

// State untuk data rule yang akan di-edit
const editLeaveRule = ref({
    id: null,
    title: '',
    gender: '',
    amountValue: 0,
    amountUnit: 'Days',
    information: '',
    isActive: false,
});


// --- FUNGSI UTAMA: FETCH DATA (READ) ---
// SpecialLeave.vue (Fungsi fetchSpecialLeaves)

// SpecialLeave.vue (Ubah fungsi ini)

const fetchSpecialLeaves = async () => {
    try {
        const response = await axios.get(API_BASE_URL); 
        
        // =======================================================
        // === PERUBAHAN: AKSES STRUKTUR PAGINATED DARI BACKEND ===
        // =======================================================
        const backendData = response.data.serviceResult.data; // <--- UBAH DI SINI!

        // PENTING: Lakukan mapping data agar sesuai dengan tampilan frontend
        specialLeaves.value = backendData.map(leave => ({ // <--- Gunakan backendData
            id: leave.id,
            title: leave.title,
            gender: leave.gender,
            // Asumsi amount di database adalah '10 Days'
            amount: leave.amount, 
            information: leave.information,
            // Perbaiki penamaan properti dari database
            isActive: leave.is_active !== undefined ? leave.is_active : leave.isActive, 
        }));

    } catch (error) {
        // ...
    }
};

// Fungsi untuk mereset form Add
const resetNewLeaveRule = () => {
    newLeaveRule.value = {
        title: '',
        gender: '',
        amountValue: 0,
        amountUnit: 'Days',
        information: '',
    };
};

const openAddSpecialLeaveModal = () => {
    resetNewLeaveRule();
    isAddModalOpen.value = true;
};

// Fungsi untuk membuka modal Edit
const openEditSpecialLeaveModal = (id) => {
    const leaveToEdit = specialLeaves.value.find(leave => leave.id === id);

    if (leaveToEdit) {
        // Pisahkan amount menjadi value dan unit untuk form edit
        const [amountValue, amountUnit] = leaveToEdit.amount.split(' ');

        editLeaveRule.value = {
            id: leaveToEdit.id,
            title: leaveToEdit.title,
            gender: leaveToEdit.gender,
            amountValue: parseInt(amountValue) || 0,
            amountUnit: amountUnit || 'Days',
            information: leaveToEdit.information,
            isActive: leaveToEdit.isActive,
        };

        isEditModalOpen.value = true;
    } else {
        alert('Aturan cuti tidak ditemukan!');
    }
};

const editLeave = openEditSpecialLeaveModal; // Mengubah alias fungsi

// --- FUNGSI: TOGGLE STATUS (UPDATE) ---
const toggleRuleStatus = async (leave) => { // Tambahkan async
    const newStatus = !leave.isActive;
    const action = newStatus ? 'diaktifkan' : 'dinonaktifkan';

    try {
        // MENGGUNAKAN ENDPOINT: PUT /api/leaves/special/:id
        // Asumsi backend Anda menerima PUT/PATCH untuk update status di endpoint ini.
        await axios.put(`${API_BASE_URL}/${leave.id}`, { 
            // Kirim hanya kolom yang diubah (sesuai backend: updateSpecialLeave.controller.js)
            is_active: newStatus 
        });

        // Jika sukses, ubah status di state lokal
        leave.isActive = newStatus;
        alert(`Aturan "${leave.title}" berhasil ${action}.`);
    } catch (error) {
        console.error(`Error ${action} rule:`, error.response?.data || error);
        alert(`Gagal ${action} aturan. Cek log server.`);
        // Opsional: fetchSpecialLeaves(); untuk sinkronisasi ulang
    }
};

// --- FUNGSI: TAMBAH DATA (CREATE: POST) ---
const addSpecialLeaveRule = async () => { // Tambahkan async
    const ruleData = newLeaveRule.value;

    if (!ruleData.title || !ruleData.gender || !ruleData.amountValue || !ruleData.information) {
        alert('Mohon isi semua kolom yang wajib diisi.');
        return;
    }

    // Payload harus sesuai dengan yang diharapkan oleh createSpecialLeave.controller.js
    const payload = {
        title: ruleData.title,
        gender: ruleData.gender,
        amount: `${ruleData.amountValue} ${ruleData.amountUnit}`,
        information: ruleData.information,
        is_active: true, // Default aktif
    };

    try {
        // MENGGUNAKAN ENDPOINT: POST /api/leaves/special
        const response = await axios.post(API_BASE_URL, payload);
        const newRule = response.data; // Asumsi API mengembalikan objek yang baru dibuat

        // Tambahkan rule baru ke array lokal dan format untuk tampilan
        specialLeaves.value.push({
            ...newRule,
            isActive: newRule.is_active // Pastikan status sinkron
        });

        isAddModalOpen.value = false;
        resetNewLeaveRule();
        alert(`Aturan Cuti Khusus "${newRule.title}" berhasil ditambahkan!`);

    } catch (error) {
        console.error('Error adding special leave:', error.response?.data || error);
        alert('Gagal menambahkan aturan cuti. Periksa data yang dikirim dan log server.');
    }
};

// --- FUNGSI: SIMPAN PERUBAHAN (UPDATE: PUT) ---
const updateSpecialLeaveRule = async () => { // Tambahkan async
    const ruleToUpdate = editLeaveRule.value;
    if (!ruleToUpdate.title || !ruleToUpdate.gender || !ruleToUpdate.amountValue || !ruleToUpdate.information) {
        alert('Mohon lengkapi semua data.');
        return;
    }

    const payload = {
        title: ruleToUpdate.title,
        gender: ruleToUpdate.gender,
        amount: `${ruleToUpdate.amountValue} ${ruleToUpdate.amountUnit}`,
        information: ruleToUpdate.information,
        is_active: ruleToUpdate.isActive, 
    };

    try {
        // MENGGUNAKAN ENDPOINT: PUT /api/leaves/special/:id
        await axios.put(`${API_BASE_URL}/${ruleToUpdate.id}`, payload); 

        // Update data di array lokal setelah sukses
        const index = specialLeaves.value.findIndex(leave => leave.id === ruleToUpdate.id);
        if (index !== -1) {
            specialLeaves.value[index] = { 
                ...specialLeaves.value[index], 
                ...payload,
                isActive: ruleToUpdate.isActive // Pastikan properti lokal isActive terupdate
            };
        }

        isEditModalOpen.value = false;
        alert(`Aturan Cuti Khusus "${ruleToUpdate.title}" berhasil diperbarui!`);
    } catch (error) {
        console.error('Error updating special leave:', error.response?.data || error);
        alert('Gagal memperbarui aturan. Periksa log server.');
    }
};


// --- LOGIKA FILTERING GABUNGAN ---
const filteredSpecialLeaves = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    const gender = genderFilter.value; 

    // Jika searchQuery kosong, fungsi ini akan memfilter data yang sudah di-fetch secara lokal.
    // Jika data Anda sangat besar, Anda harus memanggil endpoint getSearchSpecialLeave.controller.js di sini.
    
    return specialLeaves.value.filter(leave => {
        const searchMatch = !query ||
                            leave.title.toLowerCase().includes(query) ||
                            leave.information.toLowerCase().includes(query);

        const genderMatch = !gender ||
                            leave.gender === gender ||
                            (gender === 'M' && leave.gender === 'MF') ||
                            (gender === 'F' && leave.gender === 'MF') ||
                            (gender === 'MF' && (leave.gender.includes('M') || leave.gender.includes('F')));


        return searchMatch && genderMatch;
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