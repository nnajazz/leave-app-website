<template>
  <AdminLayout>
    
    <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
    <p class="text-gray-500 mb-6">Ringkasan Informasi dan Statistik Karyawan</p>
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      
      <div class="bg-white p-6 rounded-2xl shadow-md flex flex-col items-start justify-center h-32 lg:col-span-2">
        <div class="flex items-center justify-between w-full mb-2">
          <div class="p-3 rounded-xl bg-blue-100 flex-shrink-0">
            <img :src="IconEmployeeStat" class="w-6 h-6 text-blue-500" alt="Employee Icon" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-800">3</h2>
          </div>
        </div>
        <div>
          <p class="text-gray-500 text-sm font-semibold">Total Employee</p>
          <p class="text-xs text-gray-400">6 active, 4 resign</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-md flex flex-col items-start justify-center h-32 lg:col-span-2">
        <div class="flex items-center justify-between w-full mb-2">
          <div class="p-3 rounded-xl bg-green-100 flex-shrink-0">
            <img :src="IconCalendar" class="w-6 h-6 text-green-500" alt="Calendar Icon" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-800">10</h2>
          </div>
        </div>
        <div>
          <p class="text-gray-500 text-sm font-semibold">Total Leave This Year</p>
          <p class="text-xs text-gray-400">Approved in 2025</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-md flex flex-col items-start justify-center h-32 lg:col-span-2">
        <div class="flex items-center justify-between w-full mb-2">
          <div class="p-3 rounded-xl bg-red-100 flex-shrink-0">
            <img :src="IconLeave" class="w-6 h-6 text-red-500" alt="Leave Icon" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-800">2</h2>
          </div>
        </div>
        <div>
          <p class="text-gray-500 text-sm font-semibold">Employees on Weekly Leave</p>
          <p class="text-xs text-gray-400">Leave in the last 7 days</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-md flex flex-col items-start justify-center h-32 lg:col-span-2">
        <div class="flex items-center justify-between w-full mb-2">
          <div class="p-3 rounded-xl bg-orange-100 flex-shrink-0">
            <img :src="IconPending" class="w-6 h-6 text-orange-500" alt="Pending Icon" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-800">3</h2>
          </div>
        </div>
        <div>
          <p class="text-gray-500 text-sm font-semibold">Pending Leave Request</p>
          <p class="text-xs text-gray-400">Waiting for approval</p>
        </div>
      </div>
      </section>

    <section class="mb-10">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Employees on Pending Leave (2 Request)</h3>
      <div class="flex overflow-x-auto space-x-4 pb-4">
        
        <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100 min-w-[20rem] sm:min-w-[30%]">
          <div class="flex justify-between items-start mb-2">
            <span class="text-sm font-semibold text-gray-800">Andi Admin</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">Pending</span>
          </div>
          <p class="text-xs text-gray-500">Personal</p>
          <div class="mt-3 text-xs text-gray-600">
            <p>20 Des 2023 - 22 Des 2023</p>
            <p>3 days</p>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100 min-w-[20rem] sm:min-w-[30%]">
          <div class="flex justify-between items-start mb-2">
            <span class="text-sm font-semibold text-gray-800">Budi Santoso</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">Pending</span>
            </div>
            <p class="text-xs text-gray-500">Sickness</p>
            <div class="mt-3 text-xs text-gray-600">
              <p>25 Des 2023 - 25 Des 2023</p>
              <p>1 day</p>
            </div>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100 min-w-[20rem] sm:min-w-[30%]">
          <div class="flex justify-between items-start mb-2">
            <span class="text-sm font-semibold text-gray-800">Caca Marlina</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">Pending</span>
          </div>
          <p class="text-xs text-gray-500">Sickness</p>
          <div class="mt-3 text-xs text-gray-600">
            <p>25 Des 2023 - 25 Des 2023</p>
            <p>1 day</p>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100 min-w-[20rem] sm:min-w-[30%]">
          <div class="flex justify-between items-start mb-2">
            <span class="text-sm font-semibold text-gray-800">Dini Dev</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">Pending</span>
            </div>
            <p class="text-xs text-gray-500">Annual Leave</p>
            <div class="mt-3 text-xs text-gray-600">
              <p>10 Jan 2024 - 15 Jan 2024</p>
              <p>5 days</p>
            </div>
        </div>

      </div>
    </section>

    <section class="bg-white p-6 rounded-2xl shadow-md mb-6">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-[#5e77ff] stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-800">Monthly Leave Trends</h3>
        </div>

        <div class="relative inline-block text-gray-700">
          <select v-model="selectedYear" @change="fetchLeaveData(selectedYear)"
            class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-xl shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-[#5e77ff] focus:border-transparent cursor-pointer transition duration-150">
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        </div>

      <div class="mx-auto max-w-4xl lg:max-w-xl">
        <div class="relative h-72">
          <canvas ref="monthlyLeaveChartCanvas"></canvas>
        </div>
        
        <div class="flex justify-center space-x-8 text-sm mt-4">
            <div class="flex items-center">
              <span class="w-3 h-3 rounded-full bg-[#5e77ff] mr-2"></span>
              Mandatory Leave
            </div>
            <div class="flex items-center">
              <span class="w-3 h-3 rounded-full bg-[#38a169] mr-2"></span>
              Special Leave
            </div>
            <div class="flex items-center">
              <span class="w-3 h-3 rounded-full bg-[#f6ad55] mr-2"></span>
              Personal Leave
            </div>
        </div>
      </div>
    </section>

    <section class="mt-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-gray-800">Annual Leave Balances Snapshot</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div class="bg-white p-6 rounded-2xl shadow-xl border border-green-200 flex flex-col">
            <h4 class="text-lg font-semibold text-green-700 mb-4 flex-shrink-0">
              <span class="bg-green-100 px-3 py-1 rounded-full mr-2">✅</span> User with the Most Remaining Leave
            </h4>
            
            <div class="overflow-y-auto max-h-[400px]">
              <div v-for="(user, index) in mostLeaveUsers" :key="user.nik"
                class="p-4 rounded-xl mb-3 last:mb-0"
                :class="{ 'bg-green-50 border border-green-200': index < 4, 'bg-white border border-gray-200': index >= 4 }">

                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span :class="{'w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white': true, 'bg-green-500': index < 3, 'bg-gray-400': index >= 3 }">{{ index + 1 }}</span>
                    <div>
                      <p class="text-sm font-bold text-gray-800">{{ user.name }}</p>
                      <p class="text-xs text-gray-500">{{ user.nik }} | <span class="font-medium text-gray-600">{{ user.role }}</span></p>
                    </div>
                  </div>
                  <div class="text-2xl font-extrabold text-green-600">{{ user.remainingLeave }}</div>
                </div>

                <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-green-100 text-xs text-gray-600">
                  <div>
                    <span class="font-semibold">This Year:</span> {{ user.thisYear }}
                  </div>
                  <div>
                    <span class="font-semibold">Last Year:</span> {{ user.lastYear }}
                  </div>
                  <div>
                    <span class="font-semibold">Average Leave:</span> {{ user.averageLeave }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-xl border border-red-200 flex flex-col">
            <h4 class="text-lg font-semibold text-red-700 mb-4 flex-shrink-0">
              <span class="bg-red-100 px-3 py-1 rounded-full mr-2">⚠</span> Users with the Lowest Remaining Leave
            </h4>
            
            <div class="overflow-y-auto max-h-[400px]">
              <div v-for="(user, index) in lowestLeaveUsers" :key="user.nik"
                class="p-4 rounded-xl mb-3 last:mb-0"
                :class="{ 'bg-red-50 border border-red-200': index < 4, 'bg-white border border-gray-200': index >= 4 }">

                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span :class="{'w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white': true, 'bg-red-500': index < 3, 'bg-gray-400': index >= 3 }">{{ index + 1 }}</span>
                    <div>
                      <p class="text-sm font-bold text-gray-800">{{ user.name }}</p>
                      <p class="text-xs text-gray-500">{{ user.nik }} | <span class="font-medium text-gray-600">{{ user.role }}</span></p>
                    </div>
                  </div>
                  <div class="text-2xl font-extrabold text-red-600">{{ user.remainingLeave }}</div>
                </div>

                <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-red-100 text-xs text-gray-600">
                  <div>
                    <span class="font-semibold">This Year:</span> {{ user.thisYear }}
                  </div>
                  <div>
                    <span class="font-semibold">Last Year:</span> {{ user.lastYear }}
                  </div>
                  <div>
                    <span class="font-semibold">Average Leave:</span> {{ user.averageLeave }}
                  </div>
                </div>
              </div>
            </div>
          </div>

      </div>
    </section>


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
    
  </AdminLayout>
</template>

<script setup>
// Import AdminLayout
import AdminLayout from '../../layouts/AdminLayout.vue'; // Sesuaikan path jika perlu
import { ref, onMounted, watch, computed } from 'vue'; 
import { useRouter } from 'vue-router';
import axios from 'axios';

// --- Load Chart.js Dynamically ---
const loadChartJs = () => {
  // ... (Fungsi loadChartJs sama seperti di kode asli) ...
  return new Promise((resolve) => {
    if (typeof window.Chart !== 'undefined') {
      resolve(window.Chart);
      return;
    }
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
    script.onload = () => {
      resolve(window.Chart);
    };
    script.onerror = () => {
      console.error("Failed to load Chart.js script.");
      resolve(null);
    };
    document.head.appendChild(script);
  });
};

// Ikon untuk Statistik Cards (Sekarang ada di sini, bukan di Layout)
import IconEmployeeStat from 'bootstrap-icons/icons/people-fill.svg';    
import IconCalendar from 'bootstrap-icons/icons/calendar2-check.svg';    
import IconLeave from 'bootstrap-icons/icons/calendar2-x.svg';           
import IconPending from 'bootstrap-icons/icons/clock-history.svg';       

// State
// isHoveringLogout tidak diperlukan lagi di sini karena logika hover bisa dihapus atau dipindahkan ke layout jika ingin mempertahankan efek invert
const monthlyLeaveChartCanvas = ref(null); 
const router = useRouter();

const isSettingsModalOpen = ref(false); 

// State untuk Chart dan Tahun
const availableYears = ref(['2025', '2024', '2023']);
const selectedYear = ref('2025'); 
const leaveData = ref(getSimulatedData('2025')); 

// --- Data Simulasi untuk Employee Leave Balances ---
const mostLeaveUsers = ref([]);
const lowestLeaveUsers = ref([]);

const fetchLeaderboard = async () => {
  try {
    const res = await axios.get('http://localhost:3001/api/dashboard/leaderboard');
    // sesuaikan URL dengan endpoint backend kamu
    const data = res.data.data;

    mostLeaveUsers.value = data.least_used.map(u => ({
      name: u.name,
      nik: u.NIK,
      role: u.role,
      thisYear: u.this_year,
      lastYear: u.last_year,
      averageLeave: u.average_leave,
      remainingLeave: u.given_leave - u.used_leave,
    }));

    lowestLeaveUsers.value = data.most_used.map(u => ({
      name: u.name,
      nik: u.NIK,
      role: u.role,
      thisYear: u.this_year,
      lastYear: u.last_year,
      averageLeave: u.average_leave,
      remainingLeave: u.given_leave - u.used_leave,
    }));
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
  }
};



// --- END OF DATA SIMULASI ---

// Fungsi untuk mensimulasikan data per tahun
function getSimulatedData(year) {
  // ... (Fungsi getSimulatedData sama seperti di kode asli) ...
  if (year === '2025') {
        return {
          mandatory: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          special: [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0], 
          personal: [0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0] 
        };
    } else if (year === '2024') {
        return {
          mandatory: [1, 1, 0, 2, 0, 0, 0, 0, 0, 1, 1, 0], 
          special: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          personal: [0, 0, 3, 0, 5, 0, 0, 0, 2, 0, 0, 0] 
        };
    } else {
        return {
          mandatory: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          special: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], 
          personal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
        };
    }
}

// LOGIC CHART UTAMA
const createMonthlyLeaveChart = async (dataSets) => {
  // ... (Fungsi createMonthlyLeaveChart sama seperti di kode asli) ...
  const Chart = await loadChartJs(); 

  if (monthlyLeaveChartCanvas.value && Chart) {
    const ctx = monthlyLeaveChartCanvas.value.getContext('2d');

    const labels = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    
    const mandatoryColor = '#5e77ff'; 
    const specialColor = '#38a169'; 
    const personalColor = '#f6ad55'; 

    if (monthlyLeaveChartCanvas.value.chart) {
        monthlyLeaveChartCanvas.value.chart.destroy();
    }

    monthlyLeaveChartCanvas.value.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Mandatory Leave',
            data: dataSets.mandatory,
            borderColor: mandatoryColor,
            backgroundColor: mandatoryColor + '20', 
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Special Leave',
            data: dataSets.special,
            borderColor: specialColor,
            backgroundColor: specialColor + '20',
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Personal Leave',
            data: dataSets.personal,
            borderColor: personalColor,
            backgroundColor: personalColor + '20',
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.3,
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, 
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Days'
            },
            ticks: {
              precision: 0
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
};

// Fungsi untuk mengambil/memuat data cuti (simulasi)
const fetchLeaveData = (year) => {
    leaveData.value = getSimulatedData(year);
    createMonthlyLeaveChart(leaveData.value);
};

// Handle Logout (Simulasi)
const handleLogout = () => {
  console.log('Logging out...'); 
  // router.push('/login'); // Uncomment jika sudah ada router Vue
};


// Watcher untuk menggambar ulang chart ketika data berubah
watch(leaveData, (newData) => {
  createMonthlyLeaveChart(newData);
}, { deep: true });

// Initial mount - Buat chart pertama kali
onMounted(() => {
  fetchLeaveData(selectedYear.value);
  fetchLeaderboard();  
});
</script>