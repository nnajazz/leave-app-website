<template>
    <UserLayout>
        <div class="space-y-6 bg-blue-50 p-6 min-h-screen">

            <div class="flex flex-col md:flex-row md:items-center justify-between">
                <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>

                <div class="flex items-center space-x-4 mt-2 md:mt-0">
                    <p class="text-gray-500 hidden md:block">Manage your leave requests and track your remaining days</p>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div class="bg-blue-100 p-6 rounded-2xl shadow-lg flex justify-between items-start">
                    <div class="flex flex-col justify-start space-y-2">
                        <div class="flex items-center space-x-2">
                            <div class="bg-blue-700 p-2 rounded-xl">
                                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                                    <path d="M4.5 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <p class="text-base font-medium text-blue-800">Remaining Leave</p>
                            <p class="text-base text-blue-600">This Year</p>
                        </div>
                    </div>
                    <div class="text-right flex items-end justify-center">
                        <div class="flex flex-col items-center">
                            <p class="text-7xl font-extrabold text-blue-700 leading-none">2</p>
                            <div class="w-8 h-1 bg-blue-700 -mt-1 mx-auto"></div>
                        </div>
                    </div>
                </div>

                <div class="bg-blue-100 p-6 rounded-2xl shadow-lg flex justify-between items-start">
                    <div class="flex flex-col justify-start space-y-2">
                        <div class="flex items-center space-x-2">
                            <div class="bg-blue-700 p-2 rounded-xl">
                                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                                    <path d="M4.5 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <p class="text-base font-medium text-blue-800">Remaining Leave</p>
                            <p class="text-base text-blue-600">Last Year</p>
                        </div>
                    </div>
                    <div class="text-right flex items-end justify-center">
                        <div class="flex flex-col items-center">
                            <p class="text-7xl font-extrabold text-blue-700 leading-none">12</p>
                            <div class="w-8 h-1 bg-blue-700 -mt-1 mx-auto"></div>
                        </div>
                    </div>
                </div>

                <div class="bg-blue-100 p-6 rounded-2xl shadow-lg flex justify-between items-start">
                    <div class="flex flex-col justify-start space-y-2">
                        <div class="flex items-center space-x-2">
                            <div class="bg-blue-700 p-2 rounded-xl">
                                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                                    <path d="M4.5 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <p class="text-base font-medium text-blue-800">Remaining Leave</p>
                            <p class="text-base text-blue-600">2 Years Ago</p>
                        </div>
                    </div>
                    <div class="text-right flex items-end justify-center">
                        <div class="flex flex-col items-center">
                            <p class="text-7xl font-extrabold text-blue-700 leading-none">3</p>
                            <div class="w-8 h-1 bg-blue-700 -mt-1 mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-blue-100 p-12 rounded-2xl shadow-md text-center">
                <p class="text-2xl font-semibold text-blue-800 mb-2">
                    Ready to take a break ?
                </p>
                <p class="text-md text-blue-600 mb-6">
                    Submit your leave and we'll process it for you
                </p>
                <button @click="isLeaveModalOpen = true" class="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg shadow-xl hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center mx-auto">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                    Apply For Leave
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div class="bg-blue-100 p-6 rounded-2xl shadow-lg flex items-center justify-start space-x-4">
                    <div class="bg-blue-700 p-3 rounded-xl flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4 11V8h1v3H4zm2-2h1v2H6V9zm3 0h1v2H9V9zm2-1v3h1V8h-1z"/>
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                        </svg>
                    </div>
                    <div class="flex flex-col items-start">
                        <p class="text-4xl font-extrabold text-blue-900 leading-none">14</p> <p class="text-sm font-medium text-blue-700 mt-1">Total Available</p>
                    </div>
                </div>

                <div class="bg-blue-100 p-6 rounded-2xl shadow-lg flex items-center justify-start space-x-4">
                    <div class="bg-blue-700 p-3 rounded-xl flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .585.037l.004.001.012.005H9V1z"/>
                            <path d="M12.966 3.918c-.23-.23-.497-.435-.785-.612l.808-.578zm-.785-.612c-.288-.177-.555-.382-.785-.612l.686-.736.687.737z"/>
                            <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm.035 1A8 8 0 1 0 8 0a8 8 0 0 0 .035 16z"/>
                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3.5A.5.5 0 0 1 8 8V4.5a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                    </div>
                    <div class="flex flex-col items-start">
                        <p class="text-4xl font-extrabold text-blue-900 leading-none">3</p>
                        <p class="text-sm font-medium text-blue-700 mt-1">Pending Requests</p>
                    </div>
                </div>

                <div class="bg-blue-100 p-6 rounded-2xl shadow-lg flex items-center justify-start space-x-4">
                    <div class="bg-blue-700 p-3 rounded-xl flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                    </div>
                    <div class="flex flex-col items-start">
                        <p class="text-4xl font-extrabold text-blue-900 leading-none">0</p>
                        <p class="text-sm font-medium text-blue-700 mt-1">Days Used</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isSuccessNotificationVisible" class="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 z-50">
            <div class="bg-green-500 text-white p-4 rounded-lg shadow-xl flex items-center space-x-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="font-semibold">Pengajuan cuti berhasil ditambahkan!</p>
            </div>
        </div>

        <div v-if="isSettingsModalOpen" class="fixed inset-0 bg-gray-900/50 z-50 flex justify-center items-center" @click.self="isSettingsModalOpen = false">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4" @click.stop>
                <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-xl font-bold text-gray-800">Setting</h2>
                    <button @click="isSettingsModalOpen = false" class="text-gray-400 hover:text-gray-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div class="px-6 pt-4 border-b border-gray-200">
                    <nav class="flex space-x-4">
                        <button class="py-2 px-4 text-sm font-semibold text-[#5e77ff] border-b-2 border-[#5e77ff] transition duration-150">
                            Appearance
                        </button>
                    </nav>
                </div>
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Themes</h3>
                    <p class="text-sm text-gray-500 mb-6">Choose your style or customize your theme</p>
                    <div class="flex space-x-4 justify-between">
                        <div class="flex-1 border-2 border-[#5e77ff] rounded-xl p-3 cursor-pointer transition duration-150 relative">
                            <div class="h-28 bg-white rounded-lg shadow-inner overflow-hidden flex flex-col items-center justify-center">
                                <div class="h-full w-full bg-white border border-gray-100 p-2">
                                    <div class="bg-gray-200 h-2 w-1/3 mb-1 rounded"></div>
                                    <div class="bg-gray-100 h-10 rounded"></div>
                                </div>
                            </div>
                            <p class="text-center mt-3 text-sm font-medium text-gray-800 flex items-center justify-center">
                                <span class="w-2 h-2 rounded-full bg-[#5e77ff] mr-2"></span> Light Mode
                            </p>
                        </div>
                        <div class="flex-1 border-2 border-gray-300 hover:border-gray-400 rounded-xl p-3 cursor-pointer transition duration-150">
                            <div class="h-28 bg-gray-900 rounded-lg shadow-inner overflow-hidden flex flex-col items-center justify-center">
                                <div class="h-full w-full bg-gray-900 border border-gray-800 p-2">
                                    <div class="bg-gray-700 h-2 w-1/3 mb-1 rounded"></div>
                                    <div class="bg-gray-800 h-10 rounded"></div>
                                </div>
                            </div>
                            <p class="text-center mt-3 text-sm font-medium text-gray-600">Dark Mode</p>
                        </div>
                        <div class="flex-1 border-2 border-gray-300 hover:border-gray-400 rounded-xl p-3 cursor-pointer transition duration-150">
                            <div class="h-28 rounded-lg shadow-inner overflow-hidden flex">
                                <div class="h-full w-1/2 bg-white border border-gray-100 p-2">
                                    <div class="bg-gray-200 h-2 w-1/3 mb-1 rounded"></div>
                                    <div class="bg-gray-100 h-10 rounded"></div>
                                </div>
                                <div class="h-full w-1/2 bg-gray-900 border border-gray-800 p-2">
                                    <div class="bg-gray-700 h-2 w-1/3 mb-1 rounded"></div>
                                    <div class="bg-gray-800 h-10 rounded"></div>
                                </div>
                            </div>
                            <p class="text-center mt-3 text-sm font-medium text-gray-600">System Mode</p>
                        </div>
                    </div>
                </div>
                <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button @click="isSettingsModalOpen = false" class="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100 transition duration-150">
                        Cancel
                    </button>
                    <button class="px-4 py-2 text-sm font-semibold rounded-xl text-white bg-green-500 hover:bg-green-600 transition duration-150">
                        Save Change
                    </button>
                </div>
            </div>
        </div>

        <div v-if="isLeaveModalOpen" class="fixed inset-0 bg-gray-900/50 z-50 flex justify-center items-center p-4" @click.self="isLeaveModalOpen = false">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto" @click.stop>
                
                <div class="p-6 text-center border-b border-gray-200">
                    <div class="flex justify-center mb-4">
                        <svg class="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                            <path d="M4.5 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </div>
                    <h2 class="text-xl font-bold text-gray-800">Leave Application</h2>
                    <p class="text-sm text-gray-500 mt-1">Fill in the details for the leave request</p>
                </div>

                <div class="p-6 space-y-4">
                    <div>
                        <label for="leave-type" class="block text-sm font-medium text-gray-700 mb-1">Type Leave</label>
                        <select id="leave-type" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" v-model="leaveType">
                            <option>Annual Leave</option>
                            <option>Personal</option>
                            <option>Special</option>
                        </select>
                    </div>

                    <div v-if="leaveType === 'Special'">
                        <label for="special-leave-list" class="block text-sm font-medium text-gray-700 mb-1">Special Leave List</label>
                        <select id="special-leave-list" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" v-model="specialLeaveType">
                            <option disabled value="">Type Leave</option>
                            <option>Marriage Leave</option>
                            <option>Circumcision Leave</option>
                            <option>Wife Miscarriage Leave</option>
                            <option>Maternity Leave</option>
                            <option>Family Bereavement Leave</option>
                        </select>
                    </div>

                    <div v-if="leaveType !== 'Special'">
                        <label for="leave-title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" id="leave-title" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Family Vacation" v-model="leaveTitle">
                    </div>

                    <div v-if="leaveType !== 'Special'">
                        <label for="leave-reason" class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <textarea id="leave-reason" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" rows="3" placeholder="Detailed reason for leave" v-model="leaveReason"></textarea>
                    </div>

                    <div class="flex space-x-4">
                        <div :class="{'w-1/2': leaveType !== 'Special', 'w-full': leaveType === 'Special'}">
                            <label for="start-leave" class="block text-sm font-medium text-gray-700 mb-1">Start Leave</label>
                            <input type="date" id="start-leave" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" v-model="startLeaveDate">
                        </div>
                        
                        <div v-if="leaveType !== 'Special'" class="w-1/2">
                            <label for="end-leave" class="block text-sm font-medium text-gray-700 mb-1">End Leave</label>
                            <input type="date" id="end-leave" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" v-model="endLeaveDate">
                        </div>
                    </div>
                </div>

                <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button @click="isLeaveModalOpen = false" class="px-4 py-2 text-sm font-semibold rounded-lg text-gray-600 hover:bg-gray-100 transition duration-150 flex items-center">
                        <svg class="w-4 h-4 mr-1 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        Back
                    </button>
                    <button @click="submitLeave" class="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-150">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </UserLayout>
</template>

<script setup>
import { ref } from 'vue';
import UserLayout from '../../layouts/UserLayout.vue';

// State untuk Modal 'Apply For Leave'
const isLeaveModalOpen = ref(false);

// State untuk Modal Setting
const isSettingsModalOpen = ref(false);

// START: State untuk Form Cuti
const leaveType = ref('Annual Leave'); // Default value
const specialLeaveType = ref('');
const leaveTitle = ref('');
const leaveReason = ref('');
const startLeaveDate = ref('');
const endLeaveDate = ref('');
// END: State untuk Form Cuti

// **STATE BARU** untuk Notifikasi Sukses
const isSuccessNotificationVisible = ref(false);

// Fungsi dummy untuk memproses cuti (bisa diganti dengan logika API call)
const submitLeave = () => {
    // Logika pengiriman data cuti (simulasi sukses)
    console.log('Leave Request Submitted:');
    console.log('Type:', leaveType.value);

    if (leaveType.value === 'Special') {
        console.log('Special Leave Type:', specialLeaveType.value);
    } else {
        console.log('Title:', leaveTitle.value);
        console.log('Reason:', leaveReason.value);
    }

    console.log('Start Date:', startLeaveDate.value);
    
    if (leaveType.value !== 'Special') {
        console.log('End Date:', endLeaveDate.value);
    }
    
    // 1. Tutup modal setelah submit
    isLeaveModalOpen.value = false;
    
    // 2. Tampilkan notifikasi sukses
    isSuccessNotificationVisible.value = true;

    // 3. Sembunyikan notifikasi setelah 3 detik
    setTimeout(() => {
        isSuccessNotificationVisible.value = false;
    }, 3000);
    
    // 4. Reset form
    leaveType.value = 'Annual Leave';
    specialLeaveType.value = '';
    leaveTitle.value = '';
    leaveReason.value = '';
    startLeaveDate.value = '';
    endLeaveDate.value = '';
};
</script>