<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="bg-white p-6 rounded-2xl shadow-lg">
        <div
          class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0"
        >
          <h1 class="text-2xl font-bold text-gray-800">Employee List</h1>
          <div
            class="flex flex-col md:flex-row md:justify-end md:items-center space-y-4 md:space-y-0 md:space-x-4"
          >
            <div class="relative w-full md:w-80 lg:w-96">
              <input
                type="text"
                placeholder="Search by NIK or Name..."
                v-model="searchQuery"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm"
              />
              <svg
                class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div class="flex space-x-2 sm:space-x-4 shrink-0">
              <select
                v-model="genderFilter"
                class="p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm shrink-0"
              >
                <option value="">Gender</option>
                <option value="F">Female</option>
                <option value="M">Male</option>
              </select>
              <select
                v-model="statusFilter"
                class="p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm shrink-0 hidden sm:block"
              >
                <option value="">Status</option>
                <option value="Active">Active</option>
                <option value="Resign">Resign</option>
              </select>
              <select
                v-model="roleFilter"
                class="p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e77ff] text-sm shrink-0 hidden md:block"
              >
                <option value="">Role</option>
                <option value="Admin">Admin</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Karyawan Tetap">Karyawan Tetap</option>
                <option value="Karyawan Kontrak">Karyawan Kontrak</option>
                <option value="Magang">Magang</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
        <table class="min-w-full">
          <thead class="border-b-2 border-gray-200 bg-gray-50">
            <tr>
              <th
                v-for="header in tableHeaders"
                :key="header"
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr
              v-for="(employee, index) in filteredEmployees"
              :key="employee.nik"
              :class="[
                index % 2 !== 0 ? 'bg-blue-50' : 'bg-white',
                'hover:bg-blue-100/70 transition-colors duration-150',
              ]"
            >
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ employee.nik }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ employee.name }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ employee.gender }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ employee.lastYear }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ employee.thisYear }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ employee.totalLeave }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ employee.role }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm">
                <span :class="getStatusClass(employee.status)">
                  {{ employee.status }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="relative inline-block text-left">
                  <button
                    @click="toggleMenu(employee.nik)"
                    type="button"
                    class="text-gray-400 hover:text-[#5e77ff] focus:outline-none p-1 rounded-full transition duration-150"
                    aria-expanded="true"
                    aria-haspopup="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 11-2 0 1 1 0 012 0z"
                      />
                    </svg>
                  </button>

                  <Transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <div
                      v-if="openNik === employee.nik"
                      class="origin-top-right absolute right-0 mt-2 w-40 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-20"
                    >
                      <div
                        class="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <a
                          href="#"
                          @click.prevent="selectAction(employee.nik, 'Statistic')"
                          class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#5e77ff] transition duration-100 rounded-lg mx-1"
                          role="menuitem"
                        >
                          <svg
                            class="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                            ></path>
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                            ></path>
                          </svg>
                          Statistic
                        </a>

                        <div class="border-t border-gray-100 my-1"></div>

                        <a
                          href="#"
                          @click.prevent="selectAction(employee.nik, 'History')"
                          class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#5e77ff] transition duration-100 rounded-lg mx-1"
                          role="menuitem"
                        >
                          <svg
                            class="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          History
                        </a>
                      </div>
                    </div>
                  </Transition>
                </div>
              </td>
            </tr>
            <tr v-if="filteredEmployees.length === 0">
              <td colspan="9" class="text-center py-6 text-gray-500 text-base">
                No employee found matching the current filters.
              </td>
            </tr>
          </tbody>
        </table>

        <div class="mt-4 flex justify-between items-center text-sm text-gray-600">
          <p>Showing 1 to {{ filteredEmployees.length }} of {{ employees.length }} entries</p>
          <div class="flex space-x-1">
            <button class="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100">
              &lt;
            </button>
            <button class="px-3 py-1 border border-gray-300 rounded-xl bg-[#5e77ff] text-white">
              1
            </button>
            <button class="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>

    <Transition name="modal-fade">
      <div
        v-if="selectedNikForHistory"
        class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[1000]"
        @click.self="closeHistoryModal"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100"
        >
          <div class="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-800">
              {{ employeeForHistory ? employeeForHistory.name : 'Employee' }}'s Leave & Adjustment
              History
              <span class="text-sm font-normal text-gray-500 block">
                (NIK: {{ selectedNikForHistory }})
              </span>
            </h2>
            <button @click="closeHistoryModal" class="text-gray-400 hover:text-gray-600 transition">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Detail
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(item, index) in employeeHistory"
                    :key="item.id"
                    :class="[
                      index % 2 !== 0 ? 'bg-blue-50' : 'bg-white',
                      'hover:bg-blue-100/70 transition-colors duration-150',
                    ]"
                  >
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {{ item.date }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {{ item.type }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm">
                      <span :class="getStatusClass(item.status)">
                        {{ item.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <button
                        @click="openDetailModal(item)"
                        class="text-gray-400 hover:text-[#5e77ff] focus:outline-none p-1 rounded-full transition duration-150"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="!employeeHistory.length">
                    <td colspan="4" class="text-center py-6 text-gray-500">No history found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="p-4 border-t border-gray-200 flex justify-end">
            <button
              @click="closeHistoryModal"
              class="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div
        v-if="selectedHistoryDetail"
        class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[2000]"
        @click.self="closeDetailModal"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100"
        >
          <div class="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-800">
              Detail {{ selectedHistoryDetail.type }}
            </h2>
            <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div class="p-6 text-gray-700 space-y-3 overflow-y-auto">
            <p class="font-semibold text-gray-800">Basic Information:</p>
            <div class="bg-gray-50 p-4 rounded-lg text-sm space-y-2 mb-4">
              <div class="grid grid-cols-3">
                <p class="col-span-1 font-medium text-gray-800">NIK</p>
                <p class="col-span-2 text-gray-700">: {{ employeeDetailInfo.nik }}</p>
              </div>
              <div class="grid grid-cols-3">
                <p class="col-span-1 font-medium text-gray-800">Name</p>
                <p class="col-span-2 text-gray-700">: {{ employeeDetailInfo.name }}</p>
              </div>
              <div class="grid grid-cols-3">
                <p class="col-span-1 font-medium text-gray-800">Actor</p>
                <p class="col-span-2 text-gray-700">: {{ employeeDetailInfo.actor }}</p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <p class="col-span-1 font-medium text-gray-900">Date</p>
              <p class="col-span-2 text-gray-700">: {{ selectedHistoryDetail.date }}</p>

              <p class="col-span-1 font-medium text-gray-900">Type</p>
              <p class="col-span-2 text-gray-700">: {{ selectedHistoryDetail.type }}</p>

              <p class="col-span-1 font-medium text-gray-900">Status</p>
              <p class="col-span-2">
                :
                <span :class="getStatusClass(selectedHistoryDetail.status)">{{
                  selectedHistoryDetail.status
                }}</span>
              </p>
            </div>

            <hr class="border-gray-100" />
            <p class="font-semibold text-gray-800">Detail Information:</p>

            <div v-if="parsedDetail.length > 0" class="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
              <div
                v-for="(detailItem, index) in parsedDetail"
                :key="index"
                class="grid grid-cols-3"
              >
                <p class="col-span-1 font-medium text-gray-800 whitespace-nowrap">
                  {{ detailItem.label }}
                </p>
                <p class="col-span-2 text-gray-700 break-words">: {{ detailItem.value }}</p>
              </div>
            </div>
            <div v-else class="bg-gray-50 p-4 rounded-lg text-sm text-gray-500">
              No detail information available.
            </div>
          </div>

          <div class="p-4 border-t border-gray-200 flex justify-end">
            <button
              @click="closeDetailModal"
              class="px-4 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '../../layouts/AdminLayout.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'

// ======================================================================
// === STATE & FUNGSI UNTUK MODAL HISTORY & DETAIL ===
// ======================================================================
const selectedNikForHistory = ref(null)
const employeeHistory = ref([])
const selectedHistoryDetail = ref(null)
// State baru untuk menyimpan NIK, Name, dan Actor saat modal detail dibuka
const employeeDetailInfo = ref({ nik: '', name: '', actor: '' })

const employeeForHistory = computed(() => {
  return employees.value.find((emp) => emp.nik === selectedNikForHistory.value)
})

// DATA MOCKUP HISTORY (SIMULASI)
const mockHistoryData = {
  123456: [
    // Admin WGS - Super Admin
    {
      id: 1,
      date: '2023-01-10',
      type: 'Leave Request',
      status: 'Approved',
      detail:
        'Type: Personal Leave\nDuration: 3 days (2023-01-15 to 2023-01-17)\nReason: Family Event.',
    },
    {
      id: 2,
      date: '2023-03-01',
      type: 'Adjustment',
      status: 'Approved',
      detail:
        'Adjustment Value: +2 days Personal Leave\nBalance Year: 2025\nDate: 2023-03-01\nTime: 00:00:07\nActor: System\nNotes: Error in system initial balance calculation.',
    },
    {
      id: 3,
      date: '2023-05-20',
      type: 'Leave Request',
      status: 'Rejected',
      detail:
        'Type: Special Leave\nDuration: 1 day (2023-06-01)\nReason: Attend concert.\nRejection Reason: High workload on that date.',
    },
  ],
  232410: [
    // User Dua - Admin
    {
      id: 4,
      date: '2024-02-15',
      type: 'Leave Request',
      status: 'Approved',
      detail:
        'Type: Annual Leave\nDuration: 2 days (2024-03-01 to 2024-03-02)\nReason: Short vacation.',
    },
    {
      id: 5,
      date: '2024-02-20',
      type: 'Adjustment',
      status: 'Pending',
      detail:
        'Adjustment Value: -1 day Annual Leave\nBalance Year: 2025\nDate: 2024-02-20\nTime: 12:00:00\nActor: User Dua\nNotes: Correction for previous over-calculation.',
    },
  ],
  323456: [
    // Budi Santoso - Karyawan Tetap
    {
      id: 6,
      date: '2023-10-05',
      type: 'Adjustment',
      status: 'Rejected',
      detail:
        'Adjustment Value: 0 days\nBalance Year: 2025\nDate: 2023-10-05\nTime: 10:30:00\nActor: Admin\nNotes: Request to reset Mandatory Leave balance. Rejection Reason: Not allowed by company policy.',
    },
    {
      id: 7,
      date: '2023-11-01',
      type: 'Leave Request',
      status: 'Approved',
      detail: 'Type: Mandatory Leave\nDuration: 1 day (2023-11-10)\nReason: Birthday.',
    },
    {
      id: 8,
      date: '2024-01-01',
      type: 'Adjustment',
      status: 'Approved',
      detail:
        'Adjustment Value: +12 days Annual Leave\nBalance Year: 2025\nDate: 2024-01-01\nTime: 00:00:00\nActor: System\nNotes: Annual leave reset.',
    },
  ],
  54397: [
    // Ani Lestari - Karyawan Tetap (Resign)
    {
      id: 9,
      date: '2023-07-01',
      type: 'Leave Request',
      status: 'Approved',
      detail: 'Type: Annual Leave\nDuration: 5 days (2023-07-10 to 2023-07-14)\nReason: Vacation.',
    },
    {
      id: 10,
      date: '2023-08-01',
      type: 'Adjustment',
      status: 'Approved',
      detail:
        'Adjustment Value: 0 days\nBalance Year: 2025\nDate: 2023-08-01\nTime: 09:00:00\nActor: HRD\nNotes: Employee termination process (Resign).',
    },
  ],
  12345: [
    // Charlie P. - Karyawan Kontrak (Resign)
    {
      id: 11,
      date: '2024-01-20',
      type: 'Leave Request',
      status: 'Approved',
      detail: 'Type: Paid Leave\nDuration: 1 day (2024-01-25)\nReason: Sickness.',
    },
  ],
  98765: [
    // Dewi Ayu - Karyawan Tetap
    {
      id: 12,
      date: '2023-12-05',
      type: 'Leave Request',
      status: 'Pending',
      detail:
        'Type: Annual Leave\nDuration: 4 days (2023-12-26 to 2023-29)\nReason: End of year holiday.',
    },
  ],
  765432: [
    // Eko Putra - Magang
    {
      id: 13,
      date: '2024-03-10',
      type: 'Adjustment',
      status: 'Approved',
      detail:
        'Adjustment Value: +1 day Mandatory Leave\nBalance Year: 2025\nDate: 2024-03-10\nTime: 11:45:00\nActor: Supervisor\nNotes: Reward for high performance.',
    },
  ],
  765431: [
    // Fadil - Admin
    {
      id: 14,
      date: '2024-02-01',
      type: 'Leave Request',
      status: 'Approved',
      detail:
        'Type: Personal Leave\nDuration: 5 days (2024-02-05 to 2024-02-09)\nReason: Travel to home town.',
    },
  ],
  765430: [
    // Gita - Magang (Resign)
    {
      id: 15,
      date: '2023-12-01',
      type: 'Leave Request',
      status: 'Approved',
      detail: 'Type: Sick Leave\nDuration: 1 day (2023-12-01)\nReason: Fever.',
    },
  ],
}

// FUNGSI UNTUK MEMUAT DATA HISTORY
const loadHistoryData = (nik) => {
  employeeHistory.value = []

  // Simulasi penundaan API
  setTimeout(() => {
    employeeHistory.value = mockHistoryData[nik] || []
  }, 300)
}

// FUNGSI UNTUK MENGELOLA MODAL HISTORY
const openHistoryModal = (nik) => {
  selectedNikForHistory.value = nik
  loadHistoryData(nik)
}

const closeHistoryModal = () => {
  selectedNikForHistory.value = null
  employeeHistory.value = []
  closeDetailModal() // Pastikan detail juga tertutup
}

// FUNGSI UNTUK MENGELOLA MODAL DETAIL
const openDetailModal = (item) => {
  selectedHistoryDetail.value = item

  // Temukan data karyawan saat ini
  const employee = employees.value.find((emp) => emp.nik === selectedNikForHistory.value)

  // Ekstrak 'Actor' dari string detail jika ada, atau gunakan nilai default
  const actorMatch = item.detail.match(/Actor: (.*?)(?:\n|$)/i)
  let actor = 'Employee' // Default untuk Leave Request

  if (item.type === 'Adjustment') {
    actor = actorMatch ? actorMatch[1].trim() : 'System/Admin'
  }

  employeeDetailInfo.value = {
    nik: employee ? employee.nik : 'N/A',
    name: employee ? employee.name : 'N/A',
    actor: actor,
  }
}

const closeDetailModal = () => {
  selectedHistoryDetail.value = null
  employeeDetailInfo.value = { nik: '', name: '', actor: '' } // Reset info
}

// === COMPUTED PROPERTY UNTUK MEMPARSING DETAIL (Filter NIK/Name/Actor dan field yang tidak relevan) ===
const parsedDetail = computed(() => {
  if (!selectedHistoryDetail.value || !selectedHistoryDetail.value.detail) {
    return []
  }

  const detailString = selectedHistoryDetail.value.detail
  const itemType = selectedHistoryDetail.value.type

  // Kata kunci yang harus di-filter (sudah dipindahkan ke Basic Information)
  const filteredKeys = ['nik', 'name', 'actor']

  // Kata kunci spesifik yang Anda minta untuk Adjustment
  const adjustmentKeys = [
    'adjustment value',
    'balance year',
    'date',
    'time',
    'notes',
    'rejection reason',
  ]

  // Kata kunci untuk Leave Request
  const leaveRequestKeys = ['type', 'duration', 'reason', 'rejection reason']

  const lines = detailString.split('\n').filter((line) => line.trim() !== '')

  const result = []
  for (const line of lines) {
    const separatorIndex = line.indexOf(':')
    let label = line
    let value = ''

    if (separatorIndex !== -1) {
      label = line.substring(0, separatorIndex).trim()
      value = line.substring(separatorIndex + 1).trim()
    }

    const lowerLabel = label.toLowerCase()

    // 1. Filter NIK/Name/Actor (karena sudah di Basic Info)
    if (filteredKeys.some((key) => lowerLabel.startsWith(key))) {
      continue
    }

    // 2. Filter spesifik untuk Adjustment
    if (itemType === 'Adjustment') {
      if (!adjustmentKeys.some((key) => lowerLabel.includes(key))) {
        continue // Skip field Adjustment yang tidak ada di adjustmentKeys
      }
    }
    // 3. Filter spesifik untuk Leave Request (Type, Duration, Reason)
    else if (itemType === 'Leave Request') {
      if (!leaveRequestKeys.some((key) => lowerLabel.includes(key))) {
        continue // Skip field Leave Request yang tidak ada di leaveRequestKeys
      }
    }

    // 4. Perapihan Label
    if (itemType === 'Adjustment') {
      if (lowerLabel.includes('adjustment value')) {
        label = 'Adjustment Value'
      } else if (lowerLabel.includes('balance year')) {
        label = 'Balance Year'
      } else if (lowerLabel.includes('rejection reason')) {
        label = 'Rejection Reason'
      } else if (lowerLabel === 'date') {
        label = 'Date (Detail)' // Membedakan dari Date Basic
      } else if (lowerLabel === 'time') {
        label = 'Time'
      } else if (lowerLabel === 'notes') {
        label = 'Notes'
      }
    }

    result.push({ label, value })
  }

  return result
})

// ======================================================================
// === LOGIKA FILTERING DAN DATA KARYAWAN ===
// ======================================================================
const tableHeaders = ref([
  'NIK',
  'Name',
  'Gender',
  'Last Year Leave',
  'This Year Leave',
  'Total Leave',
  'Role',
  'Status',
  'Action',
])

const employees = ref([
  {
    nik: '123456',
    name: 'Admin WGS',
    gender: 'F',
    lastYear: 0,
    thisYear: 11,
    totalLeave: 11,
    role: 'Super Admin',
    status: 'Active',
  },
  {
    nik: '232410',
    name: 'User Dua',
    gender: 'F',
    lastYear: 2,
    thisYear: 8,
    totalLeave: 10,
    role: 'Admin',
    status: 'Active',
  },
  {
    nik: '323456',
    name: 'Budi Santoso',
    gender: 'M',
    lastYear: 2,
    thisYear: 5,
    totalLeave: 7,
    role: 'Karyawan Tetap',
    status: 'Active',
  },
  {
    nik: '54397',
    name: 'Ani Lestari',
    gender: 'F',
    lastYear: 1,
    thisYear: 5,
    totalLeave: 6,
    role: 'Karyawan Tetap',
    status: 'Resign',
  },
  {
    nik: '12345',
    name: 'Charlie P.',
    gender: 'F',
    lastYear: 3,
    thisYear: 10,
    totalLeave: 13,
    role: 'Karyawan Kontrak',
    status: 'Resign',
  },
  {
    nik: '98765',
    name: 'Dewi Ayu',
    gender: 'F',
    lastYear: 0,
    thisYear: 9,
    totalLeave: 9,
    role: 'Karyawan Tetap',
    status: 'Active',
  },
  {
    nik: '765432',
    name: 'Eko Putra',
    gender: 'M',
    lastYear: 1,
    thisYear: 10,
    totalLeave: 11,
    role: 'Magang',
    status: 'Active',
  },
  {
    nik: '765431',
    name: 'Fadil',
    gender: 'M',
    lastYear: 0,
    thisYear: 5,
    totalLeave: 5,
    role: 'Admin',
    status: 'Active',
  },
  {
    nik: '765430',
    name: 'Gita',
    gender: 'F',
    lastYear: 0,
    thisYear: 1,
    totalLeave: 1,
    role: 'Magang',
    status: 'Resign',
  },
])

// State untuk Search dan Filters
const searchQuery = ref('')
const genderFilter = ref('')
const statusFilter = ref('')
const roleFilter = ref('')

// State untuk menu Action
const openNik = ref(null)

const toggleMenu = (nik) => {
  openNik.value = openNik.value === nik ? null : nik
}

const closeMenu = () => {
  openNik.value = null
}

const selectAction = (nik, action) => {
  if (action === 'Statistic') {
    alert(`Fungsi Statistik untuk NIK ${nik} dinonaktifkan sementara.`)
  } else if (action === 'History') {
    openHistoryModal(nik)
  } else {
    console.log(`Melakukan aksi: ${action} untuk NIK ${nik}`)
  }

  closeMenu()
}

// Logika untuk menutup menu/modal ketika klik di luar area
const handleClickOutside = (event) => {
  // Tutup menu dropdown Action
  if (openNik.value && !event.target.closest('.relative.inline-block')) {
    closeMenu()
  }
  // Tidak perlu menangani penutupan modal di sini karena sudah ada @click.self
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// --- LOGIKA FILTERING GABUNGAN (COMPUTED PROPERTY) ---
const filteredEmployees = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  const gender = genderFilter.value
  const status = statusFilter.value
  const role = roleFilter.value

  return employees.value.filter((employee) => {
    const searchMatch =
      !query ||
      employee.nik.toLowerCase().includes(query) ||
      employee.name.toLowerCase().includes(query)

    const genderMatch = !gender || employee.gender === gender
    const statusMatch = !status || employee.status === status
    const roleMatch = !role || employee.role === role

    return searchMatch && genderMatch && statusMatch && roleMatch
  })
})

// --- FUNGSI UTILITY ---
const getStatusClass = (status) => {
  const base = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
  if (status.toLowerCase() === 'active' || status.toLowerCase() === 'approved') {
    return `${base} bg-green-100 text-green-800`
  } else if (status.toLowerCase() === 'resign' || status.toLowerCase() === 'rejected') {
    return `${base} bg-red-100 text-red-800`
  }
  return `${base} bg-gray-100 text-gray-800`
}
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
