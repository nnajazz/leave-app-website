<script setup>
import AdminLayout from '../../layouts/AdminLayout.vue'
import { ref, computed, onMounted, watch } from 'vue'
import ApiClient from '@/api/api_client' // <-- gunakan apiClient

onMounted(() => {
  fetchSpecialLeaves()
})

// URL endpoint khusus special leaves (otomatis ikut baseURL dari apiClient)
const API_PATH = '/leaves/special'

const specialLeaves = ref([])
const tableHeaders = ref(['No', 'Title', 'Gender', 'Amount', 'Information', 'Action'])
const searchQuery = ref('')
const genderFilter = ref('')
const isAddModalOpen = ref(false)
const isEditModalOpen = ref(false)

const newLeaveRule = ref({
  title: '',
  gender: '',
  amountValue: 0,
  amountUnit: 'Day',
  information: '',
})

const editLeaveRule = ref({
  id: null,
  title: '',
  gender: '',
  amountValue: 0,
  amountUnit: 'Day',
  information: '',
  isActive: false,
})

// ====================== FETCH DATA ======================
const fetchSpecialLeaves = async () => {
  try {
    const response = await ApiClient.get(API_PATH)
    const backendData = response.data.data || response.data.serviceResult?.data || []

    specialLeaves.value = backendData.map((leave) => ({
      id: leave.id_special,
      title: leave.title,
      gender: leave.applicable_gender.toUpperCase(),
      amount: `${leave.duration} ${leave.type}`,
      information: leave.description,
      isActive: leave.is_active,
    }))
  } catch (error) {
    console.error('Error fetching leaves:', error)
  }
}

// ====================== TAMBAH DATA ======================
const addSpecialLeaveRule = async () => {
  const ruleData = newLeaveRule.value
  if (
    !ruleData.title ||
    !ruleData.gender ||
    ruleData.amountValue === null ||
    ruleData.amountValue === undefined ||
    !ruleData.information
  ) {
    alert('Mohon isi semua kolom yang wajib diisi.')
    return
  }

  const payload = {
    title: ruleData.title,
    applicable_gender: ruleData.gender.toLowerCase(), // biar 'M' → 'm'
    duration: ruleData.amountValue,
    type: ruleData.amountUnit.toLowerCase(), // 'Days' → 'day'
    description: ruleData.information,
  }

  try {
    const response = await ApiClient.post(API_PATH, payload)
    const newRule = response.data.data || response.data

    specialLeaves.value.push({
      ...newRule,
      isActive: newRule.is_active,
    })

    await fetchSpecialLeaves()
    isAddModalOpen.value = false
    resetNewLeaveRule()
    alert(`Aturan Cuti Khusus "${newRule.title}" berhasil ditambahkan!`)
  } catch (error) {
    console.error('Error adding special leave:', error)
    alert('Gagal menambahkan aturan cuti.')
  }
}

// ====================== UPDATE DATA ======================
const updateSpecialLeaveRule = async () => {
  const rule = editLeaveRule.value

  const payload = {
    title: rule.title,
    applicable_gender: rule.gender.toLowerCase(), // biar 'M' → 'm'
    duration: rule.amountValue,
    type: rule.amountUnit.toLowerCase(), // 'Days' → 'day'
    description: rule.information,
    is_active: rule.isActive || true,
  }
  try {
    // Kirim PATCH ke API
    await ApiClient.patch(`${API_PATH}/${rule.id}`, payload)

    // Setelah berhasil, langsung fetch ulang dari backend
    await fetchSpecialLeaves()

    alert(`Aturan "${rule.title}" berhasil diperbarui!`)
    isEditModalOpen.value = false
  } catch (error) {
    console.error('Error updating special leave:', error)
    alert('Gagal memperbarui aturan.')
  }
}

// ====================== TOGGLE STATUS ======================
const toggleRuleStatus = async (leave) => {
  const newStatus = !leave.isActive
  try {
    await ApiClient.patch(`${API_PATH}/${leave.id}`, { is_active: newStatus })
    leave.isActive = newStatus
    alert(`Aturan "${leave.title}" berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}.`)

    await fetchSpecialLeaves()
  } catch (error) {
    console.error('Error updating status:', error)
  }
}

// ====================== SEARCH ======================
watch(searchQuery, async (newVal) => {
  if (!newVal.trim()) return fetchSpecialLeaves()
  try {
    const response = await ApiClient.get(`${API_PATH}/search`, { params: { value: newVal } })
    specialLeaves.value = response.data.data || []
  } catch (error) {
    console.error('Error searching:', error)
  }
})

// ====================== UTIL ======================
const resetNewLeaveRule = () => {
  newLeaveRule.value = {
    title: '',
    gender: '',
    amountValue: 0,
    amountUnit: 'Day',
    information: '',
  }
}

const openAddSpecialLeaveModal = () => {
  resetNewLeaveRule()
  isAddModalOpen.value = true
}

const openEditSpecialLeaveModal = (id) => {
  const leave = specialLeaves.value.find((item) => item.id === id)
  if (!leave) return alert('Aturan tidak ditemukan!')
  const [amountValue, amountUnit] = leave.amount.split(' ')
  editLeaveRule.value = {
    ...leave,
    amountValue: parseInt(amountValue) || 0,
    amountUnit: amountUnit || 'Day',
  }
  isEditModalOpen.value = true
}

const filteredSpecialLeaves = computed(() => {
  if (!searchQuery.value.trim()) return specialLeaves.value
  return specialLeaves.value.filter((leave) =>
    leave.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="bg-white p-6 rounded-2xl shadow-lg">
        <div
          class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0"
        >
          <h1 class="text-2xl font-bold text-gray-800">Special Leave List</h1>

          <div
            class="flex flex-col md:flex-row md:justify-end md:items-center space-y-4 md:space-y-0 md:space-x-4"
          >
            <div class="relative w-full md:w-80 lg:w-96">
              <input
                type="text"
                placeholder="Search by Title..."
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

            <button
              @click="openAddSpecialLeaveModal"
              class="flex items-center justify-center px-4 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition duration-150 shadow-md whitespace-nowrap"
            >
              <svg
                class="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Add Special Leave
            </button>
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
              v-for="(leave, index) in filteredSpecialLeaves"
              :key="leave.id"
              :class="[
                index % 2 !== 0 ? 'bg-blue-50' : 'bg-white',
                'hover:bg-blue-100/70 transition-colors duration-150',
              ]"
            >
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {{ leave.title }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ leave.gender }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ leave.amount }}</td>
              <td class="px-4 py-4 max-w-xs text-sm text-gray-900 overflow-hidden text-ellipsis">
                {{ leave.information }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex space-x-2 items-center">
                  <button
                    @click="openEditSpecialLeaveModal(leave.id)"
                    class="text-gray-400 hover:text-green-500 focus:outline-none p-1 rounded-full transition duration-150"
                    title="Edit"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                  </button>

                  <button
                    @click="toggleRuleStatus(leave)"
                    :class="[
                      leave.isActive ? 'bg-[#5e77ff]' : 'bg-gray-300',
                      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5e77ff]',
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
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
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
          <p>
            Showing 1 to {{ filteredSpecialLeaves.length }} of {{ specialLeaves.length }} entries
          </p>
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
        v-if="isAddModalOpen"
        class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[1000]"
        @click.self="isAddModalOpen = false"
      >
        <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg" @click.stop>
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Add Special Leave</h2>

          <form @submit.prevent="addSpecialLeaveRule" class="space-y-5">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                v-model="newLeaveRule.title"
                required
                class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div class="flex space-x-6">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="newLeaveRule.gender"
                    value="F"
                    class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]"
                    required
                  />
                  <span class="ml-2 text-gray-700">Female (F)</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="newLeaveRule.gender"
                    value="M"
                    class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]"
                  />
                  <span class="ml-2 text-gray-700">Male (M)</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="newLeaveRule.gender"
                    value="MF"
                    class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]"
                  />
                  <span class="ml-2 text-gray-700">Male & Female (MF)</span>
                </label>
              </div>
            </div>

            <div>
              <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
              <div class="mt-1 flex rounded-xl shadow-sm">
                <input
                  type="number"
                  id="amount"
                  v-model.number="newLeaveRule.amountValue"
                  min="1"
                  required
                  class="flex-1 block w-full border border-gray-300 rounded-l-xl p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm"
                />
                <select
                  v-model="newLeaveRule.amountUnit"
                  required
                  class="border border-gray-300 rounded-r-xl bg-gray-50 p-3 text-sm focus:ring-[#5e77ff] focus:border-[#5e77ff]"
                >
                  <option value="Day">Days</option>
                  <option value="Month">Month</option>
                </select>
              </div>
            </div>

            <div>
              <label for="information" class="block text-sm font-medium text-gray-700"
                >Information</label
              >
              <textarea
                id="information"
                v-model="newLeaveRule.information"
                rows="3"
                required
                class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm"
              ></textarea>
            </div>

            <div class="flex justify-end pt-4 space-x-3">
              <button
                type="button"
                @click="isAddModalOpen = false"
                class="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition duration-150"
              >
                Back
              </button>
              <button
                type="submit"
                class="px-5 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition duration-150"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div
        v-if="isEditModalOpen"
        class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[1000]"
        @click.self="isEditModalOpen = false"
      >
        <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg" @click.stop>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Edit Special Leave</h2>
            <button
              @click="isEditModalOpen = false"
              class="text-gray-400 hover:text-gray-600 transition"
            >
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

          <form @submit.prevent="updateSpecialLeaveRule" class="space-y-5">
            <div>
              <label for="edit-title" class="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="edit-title"
                v-model="editLeaveRule.title"
                required
                class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div class="flex space-x-6">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="editLeaveRule.gender"
                    value="F"
                    class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]"
                    required
                  />
                  <span class="ml-2 text-gray-700">Female (F)</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="editLeaveRule.gender"
                    value="M"
                    class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]"
                  />
                  <span class="ml-2 text-gray-700">Male (M)</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="editLeaveRule.gender"
                    value="MF"
                    class="form-radio h-4 w-4 text-[#5e77ff] focus:ring-[#5e77ff]"
                  />
                  <span class="ml-2 text-gray-700">Male & Female (MF)</span>
                </label>
              </div>
            </div>

            <div>
              <label for="edit-amount" class="block text-sm font-medium text-gray-700"
                >Amount</label
              >
              <div class="mt-1 flex rounded-xl shadow-sm">
                <input
                  type="number"
                  id="edit-amount"
                  v-model.number="editLeaveRule.amountValue"
                  min="1"
                  required
                  class="flex-1 block w-full border border-gray-300 rounded-l-xl p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm"
                />
                <select
                  v-model="editLeaveRule.amountUnit"
                  required
                  class="border border-gray-300 rounded-r-xl bg-gray-50 p-3 text-sm focus:ring-[#5e77ff] focus:border-[#5e77ff]"
                >
                  <option value="Day">Days</option>
                  <option value="Month">Month</option>
                </select>
              </div>
            </div>

            <div>
              <label for="edit-information" class="block text-sm font-medium text-gray-700"
                >Information</label
              >
              <textarea
                id="edit-information"
                v-model="editLeaveRule.information"
                rows="3"
                required
                class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-[#5e77ff] focus:border-[#5e77ff] sm:text-sm"
              ></textarea>
            </div>

            <div class="flex justify-end pt-4 space-x-3">
              <button
                type="button"
                @click="isEditModalOpen = false"
                class="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition duration-150"
              >
                Back
              </button>
              <button
                type="submit"
                class="px-5 py-2 bg-[#5e77ff] text-white font-semibold rounded-xl hover:bg-blue-600 transition duration-150"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </AdminLayout>
</template>

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
