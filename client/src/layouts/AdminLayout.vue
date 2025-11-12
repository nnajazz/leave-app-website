<template>
  <div class="flex h-screen bg-[#f8fbff]">

    <aside class="w-64 bg-white p-6 shadow-xl border-r border-gray-200 flex flex-col">
      <div class="mb-8 flex flex-col items-center">
        <div class="flex items-center space-x-1">
          <img 
            src="../assets/logo.png" 
            alt="Walden Global Services Logo" 
            class="h-10 w-auto"
          />
        </div>
        <p class="text-sm font-medium text-gray-600 mt-2">
          Selamat datang, Andi!
        </p>
      </div>

      <nav class="space-y-2 flex-grow">
                <RouterLink to="/admin/dashboard" active-class="bg-[#5e77ff] text-white" 
          class="flex items-center p-3 rounded-xl font-semibold transition duration-150 text-gray-600 hover:bg-gray-100">
          <img :src="IconDashboard" class="w-5 h-5 mr-3" 
            :class="{'invert': $route.path === '/admin/dashboard'}" 
            alt="Dashboard Icon" />
          Dashboard
        </RouterLink>
        
        <RouterLink to="/admin/employees" active-class="bg-[#5e77ff] text-white" 
          class="flex items-center p-3 rounded-xl font-semibold transition duration-150 text-gray-600 hover:bg-gray-100">
          <img :src="IconEmployeeList" class="w-5 h-5 mr-3" 
            :class="{'invert': $route.path === '/admin/employees'}" 
            alt="Employee List Icon" />
          Employee List
        </RouterLink>

        <RouterLink to="/admin/leaves" active-class="bg-[#5e77ff] text-white" 
          class="flex items-center p-3 rounded-xl font-semibold transition duration-150 text-gray-600 hover:bg-gray-100">
          <img :src="IconList" class="w-5 h-5 mr-3" :class="{'invert': $route.path === '/admin/leaves'}" alt="List Of Leave Icon" />
          List Of Leave
        </RouterLink>
        
        <RouterLink to="/admin/special-leave" active-class="bg-[#5e77ff] text-white" 
          class="flex items-center p-3 rounded-xl font-semibold transition duration-150 text-gray-600 hover:bg-gray-100">
          <img :src="IconSpecialLeave" class="w-5 h-5 mr-3" :class="{'invert': $route.path === '/admin/special-leave'}" alt="Special Leave Icon" />
          Special Leave
        </RouterLink>

        <RouterLink to="/admin/mandatory" active-class="bg-[#5e77ff] text-white" 
          class="flex items-center p-3 rounded-xl font-semibold transition duration-150 text-gray-600 hover:bg-gray-100">
          <img :src="IconMandatory" class="w-5 h-5 mr-3" :class="{'invert': $route.path === '/admin/mandatory'}" alt="Mandatory Icon" />
          Mandatory
        </RouterLink>

        <RouterLink to="/admin/adjust-balance" active-class="bg-[#5e77ff] text-white" 
          class="flex items-center p-3 rounded-xl font-semibold transition duration-150 text-gray-600 hover:bg-gray-100">
          <img :src="IconAdjustBalance" class="w-5 h-5 mr-3" :class="{'invert': $route.path === '/admin/adjust-balance'}" alt="Adjust Balance Icon" />
          Adjust Balance
        </RouterLink>

        <RouterLink to="/admin/adjust-history" active-class="bg-[#5e77ff] text-white" 
          class="flex items-center p-3 rounded-xl font-semibold transition duration-150 text-gray-600 hover:bg-gray-100">
          <img :src="IconAdjustHistory" class="w-5 h-5 mr-3" :class="{'invert': $route.path === '/admin/adjust-history'}" alt="Adjust History Icon" />
          Adjust History
        </RouterLink>
      
                <RouterLink to="/admin/information" active-class="bg-[#5e77ff] text-white" 
          class="flex items-center p-3 rounded-xl font-semibold transition duration-150 text-gray-600 hover:bg-gray-100">
          <img :src="IconInformation" class="w-5 h-5 mr-3" :class="{'invert': $route.path === '/admin/information'}" alt="Information Icon" />
          Information
        </RouterLink>
        
      </nav>
      
                </aside>

    <main class="flex-1 flex flex-col overflow-hidden">
              <header class="flex justify-between items-center p-8 pb-4">
        <div>
        </div>
        
        <div class="flex items-center space-x-4">
          
          <RouterLink to="/user/dashboard" 
            class="flex items-center space-x-2 text-sm font-semibold p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition duration-150">
            <img :src="IconUser" class="w-5 h-5" alt="Employee Side Icon" />
            <span>Employee Side</span>
          </RouterLink>

          <button 
            @click="isSettingsModalOpen = true"
            class="flex items-center space-x-2 text-sm font-semibold p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition duration-150">
            <img :src="IconSettings" class="w-6 h-6" alt="Settings Icon" />
            <span class="text-xs font-medium">Setting</span>
          </button>
          
          <button @click="handleLogout" class="flex items-center space-x-2 text-sm font-semibold p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition duration-150">
            <img :src="IconLogout" class="w-6 h-6" alt="Logout Icon" :class="{'invert': isHoveringLogout}" @mouseover="isHoveringLogout = true" @mouseout="isHoveringLogout = false"/>
            <span>Logout</span>
          </button>
        </div>
      </header>
      
      <div class="flex-1 overflow-y-auto px-8 pb-8">
        <slot /> 
      </div>
      
    </main>

    <div 
        v-if="isSettingsModalOpen" 
        class="fixed inset-0 bg-gray-900/50 z-50 flex justify-center items-center" 
        @click.self="isSettingsModalOpen = false">
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
  </div>
</template>

<script setup>
import { ref } from 'vue'; 
import { RouterLink, useRouter, useRoute } from 'vue-router'; // Tambahkan useRoute
import axios from 'axios'


// Import Ikon
import IconDashboard from 'bootstrap-icons/icons/speedometer2.svg';         
import IconEmployeeList from 'bootstrap-icons/icons/people.svg';            
import IconList from 'bootstrap-icons/icons/list-task.svg';              
import IconSpecialLeave from 'bootstrap-icons/icons/ui-checks-grid.svg';    
import IconMandatory from 'bootstrap-icons/icons/card-list.svg';            
import IconRoleAdmin from 'bootstrap-icons/icons/person-rolodex.svg';    
import IconAdjustBalance from 'bootstrap-icons/icons/database-add.svg';     
import IconAdjustHistory from 'bootstrap-icons/icons/journal-bookmark.svg'; 
import IconInformation from 'bootstrap-icons/icons/exclamation-circle.svg'; 

import IconSettings from 'bootstrap-icons/icons/gear.svg';              
import IconUser from 'bootstrap-icons/icons/person-circle.svg';          
import IconLogout from 'bootstrap-icons/icons/box-arrow-right.svg';      

// State dan Router
const isHoveringLogout = ref(false)
const isSettingsModalOpen = ref(false)
const router = useRouter()
const $route = useRoute()

const API_URL = "http://localhost:3001/api/v1"

// ✅ Fungsi Logout
const handleLogout = async () => {
  try {
    console.log('Logging out...');

    const response = await axios.get(`${API_URL}/auth/logout`, {
      withCredentials: true, // biar cookies Authorization dan device-id ikut dikirim
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(response.data);

    localStorage.removeItem('user');
    router.push('/login');
  } catch (error) {
    console.error('Logout gagal:', error.response?.data || error.message);
    alert('Logout gagal. Cek koneksi atau backend.');
  }
};


</script>

<style scoped>
/* Tambahkan style jika perlu */
</style>
