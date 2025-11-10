<template>
    <!-- Menggunakan UserLayout untuk tampilan Karyawan -->
    <UserLayout>
        <div class="space-y-6">

            <!-- Header Utama (DI TENGAHKAN) -->
            <div class="bg-white p-6 rounded-2xl shadow-lg">
                <!-- Perubahan: Mengganti justify-start menjadi justify-center untuk menengahkan judul utama -->
                <div class="flex flex-col md:flex-row md:items-center justify-center space-y-4 md:space-y-0 text-center">
                    <h1 class="text-2xl font-bold text-gray-800 flex items-center mx-auto">
                        <span class="p-2 mr-3 bg-[#5e77ff] rounded-lg text-white flex-shrink-0">
                            <!-- Icon untuk Panduan/Information -->
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 17h-2V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v12H3c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1v-2h4v2c0 .55.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1zm-4 0v-2H7v2h10zM19 7h-2v2h2V7z"/>
                            </svg>
                        </span>
                        Panduan Penggunaan Aplikasi Cuti - Karyawan
                    </h1>
                </div>
            </div>

            <!-- Bagian 1: Dashboard Karyawan (TETAP DI KIRI) -->
            <div class="bg-white p-8 rounded-2xl shadow-lg">
                <!-- Sudah benar menggunakan justify-start (default) -->
                <div class="flex justify-start"> 
                    <h2 class="text-2xl font-bold text-gray-800 flex items-center mb-4">
                        <span class="p-2 mr-3 bg-[#5e77ff] rounded-lg text-white">
                            <!-- Icon untuk Dashboard -->
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 20H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h6v16zm10 0h-8V4h8c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2zM4 6h6v2H4V6zm0 4h6v2H4v-2zm0 4h6v2H4v-2z"/>
                            </svg>
                        </span>
                        Dashboard Karyawan
                    </h2>
                </div>
                
                <p class="text-gray-600 mb-6">
                    Halaman Dashboard adalah pusat kendali Anda untuk semua aktivitas yang berkaitan dengan cuti, mencakup:
                </p>
                
                <ol class="list-decimal list-inside space-y-3 pl-4 text-gray-700">
                    <li><span class="font-semibold">Remaining Leave This Year (Sisa Cuti Tahun Ini):</span> Sisa jatah cuti tahunan Anda yang masih tersedia untuk tahun ini.</li>
                    <li><span class="font-semibold">Remaining Leave From Last Year (Sisa Cuti Tahun Lalu):</span> Sisa jatah cuti dari tahun sebelumnya yang belum *expired*.</li>
                    <li><span class="font-semibold">Total Available (Total Cuti Tersedia):</span> Jumlah total dari sisa cuti tahun ini dan tahun lalu.</li>
                    <li><span class="font-semibold">Days Used (Hari Terpakai):</span> Total hari cuti yang telah Anda gunakan (status Approved).</li>
                    <li><span class="font-semibold">Pending Request (Pengajuan Tertunda):</span> Jumlah pengajuan cuti Anda yang sedang menunggu persetujuan dari Admin.</li>
                    <li><span class="font-semibold">Tombol "Apply for Leave":</span> Tombol utama untuk mengajukan cuti baru (Personal Leave).</li>
                    <li><span class="font-semibold">Menu "History":</span> Membawa Anda ke halaman Riwayat Cuti.</li>
                    <li><span class="font-semibold">Menu "Mandatory":</span> Membawa Anda ke halaman Cuti Wajib Perusahaan.</li>
                    <li><span class="font-semibold">Menu "Setting":</span> Untuk mengganti tema warna tampilan website Anda pribadi.</li>
                    <li><span class="font-semibold">Tombol "Logout":</span> Untuk keluar dari akun Anda secara aman.</li>
                </ol>
            </div>

            <hr class="border-gray-300"> 

            <!-- Bagian 2: Riwayat Cuti (History) (UPDATED: Icon dan Warna Ungu) -->
            <div class="bg-white p-8 rounded-2xl shadow-lg">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center mb-4">
                    <span class="p-2 mr-3 bg-purple-600 rounded-lg text-white">
                        <!-- Icon untuk History (Mirip clock-history/riwayat) -->
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 13H11V7h1.5v8zm-2.25 1.75a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                        </svg>
                    </span>
                    Riwayat Cuti (History)
                </h2>
                <p class="text-gray-600 mb-4">
                    Halaman ini menampilkan arsip dan status dari semua pengajuan cuti pribadi Anda.
                </p>
                <ol class="list-decimal list-inside space-y-3 pl-4 text-gray-700">
                    <li>
                        Daftar Pengajuan: Menampilkan seluruh riwayat pengajuan dengan statusnya (Pending, Approved, Rejected, Expired).
                    </li>
                    <li>
                        Tombol "Detail": Untuk melihat informasi lengkap mengenai sebuah pengajuan.
                    </li>
                    <li>
                        Fitur "Filter": Untuk mencari riwayat pengajuan berdasarkan tanggal atau status.
                    </li>
                </ol>
            </div>

            <!-- Bagian 3: Cuti Wajib (Mandatory Leave) (TETAP DI KIRI) -->
            <div class="bg-white p-8 rounded-2xl shadow-lg">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center mb-4">
                    <span class="p-2 mr-3 bg-purple-600 rounded-lg text-white">
                        <!-- Icon untuk Mandatory (Kalender) -->
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                        </svg>
                    </span>
                    Cuti Wajib (Mandatory Leave)
                </h2>
                <p class="text-gray-600 mb-4">
                    Halaman untuk mengonfirmasi partisipasi Anda dalam Cuti Wajib Perusahaan (misal: Cuti Bersama).
                </p>
                <ol class="list-decimal list-inside space-y-3 pl-4 text-gray-700">
                    <li>
                        Mekanisme: Secara default, semua karyawan dianggap "Ikut (approved)". Anda harus secara manual mengubahnya menjadi "Tidak Ikut" jika tidak berpartisipasi.
                    </li>
                    <li>
                        Konfirmasi terakhir harus dilakukan H-7 (tujuh hari) sebelum tanggal Cuti Wajib dimulai.
                    </li>
                    <li>
                        Bagi yang statusnya "Ikut (approved)", saldo cuti akan otomatis terpotong pada H-7.
                    </li>
                </ol>
            </div>

            <!-- Bagian 4: Riwayat Penyesuaian Saldo (Adjust History) (TETAP DI KIRI) -->
            <div class="bg-white p-8 rounded-2xl shadow-lg">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center mb-4">
                    <span class="p-2 mr-3 bg-orange-500 rounded-lg text-white">
                        <!-- Icon untuk Adjust History (list dengan tanda +/-) -->
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-8h14V7H7v2z"/>
                        </svg>
                    </span>
                    Pengajuan Cuti Pribadi (Personal Leave)
                </h2>
                <p class="text-gray-600 mb-4">
                    Formulir untuk mengajukan cuti pribadi.
                </p>
                <ol class="list-decimal list-inside space-y-3 pl-4 text-gray-700">
                    <li>
                        Waktu Pengajuan: Pengajuan harus dilakukan minimal H-1. Anda tidak bisa mengajukan cuti untuk hari ini.
                    </li>
                    <li>
                        Overlapping: Anda tidak bisa mengajukan cuti pada tanggal yang tumpang tindih dengan pengajuan lain yang masih Pending atau Approved.
                    </li>
                    <li>
                        Validasi Saldo: Pengajuan tidak boleh melebihi Total Available Anda.
                    </li>
                    <li>
                        Status Terkunci: Setelah tanggal mulai cuti tiba, status pengajuan tidak dapat diubah lagi oleh siapa pun.
                    </li>
                </ol>
            </div>
            
             <!-- Bagian 5:Pengajuan Cuti Khusus (Special Leave) (TETAP DI KIRI) -->
            <div class="bg-white p-8 rounded-2xl shadow-lg">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center mb-4">
                    <span class="p-2 mr-3 bg-orange-500 rounded-lg text-white">
                        <!-- Icon untuk Adjust History (list dengan tanda +/-) -->
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-8h14V7H7v2z"/>
                        </svg>
                    </span>
                    Pengajuan Cuti Khusus (Special Leave)
                </h2>
                <p class="text-gray-600 mb-4">
                    Formulir untuk mengajukan cuti khusus (cuti menikah, duka, melahirkan, dll).
                </p>
                <ol class="list-decimal list-inside space-y-3 pl-4 text-gray-700">
                    <li>
                        Tidak Mengurangi Saldo: Cuti Special yang disetujui TIDAK akan mengurangi jatah cuti tahunan Anda.
                    </li>
                    <li>
                       Batas Keputusan: Keputusan dari Admin akan diberikan maksimal H-1 sebelum cuti dimulai.
                    </li>
                    <li>
                        Status Terkunci: Saat tanggal mulai cuti tiba, status pengajuan tidak dapat diubah lagi.
                    </li>
                    <li>
                        Validasi Gender: Opsi cuti khusus akan disesuaikan dengan gender Anda yang terdaftar di sistem.
                    </li>
                </ol>
            </div>

            <!-- Bagian 6:Aturan Umum Cuti untuk Karyawan (TETAP DI KIRI) -->
            <div class="bg-white p-8 rounded-2xl shadow-lg">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center mb-4">
                    <span class="p-2 mr-3 bg-orange-500 rounded-lg text-white">
                        <!-- Icon untuk Adjust History (list dengan tanda +/-) -->
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-8h14V7H7v2z"/>
                        </svg>
                    </span>
                    Aturan Umum Cuti untuk Karyawan
                </h2>
                <ol class="list-decimal list-inside space-y-3 pl-4 text-gray-700">
                    <li>
                        Jatah Karyawan Tetap/Admin: Mendapatkan 12 hari cuti per tahun, diberikan setiap 1 Januari.
                    </li>
                    <li>
                       Jatah Karyawan Kontrak: Mendapatkan 1 hari cuti per bulan, diberikan setiap awal bulan.
                    </li>
                    <li>
                        Prioritas Penggunaan Saldo: Sistem akan memprioritaskan penggunaan sisa cuti dari tahun lalu terlebih dahulu sebelum memotong saldo cuti tahun ini.
                    </li>
                    <li>
                        Jenis Cuti yang Memotong Saldo: Hanya Personal Leave dan Mandatory Leave yang Approved yang akan mengurangi saldo cuti Anda.
                    </li>
                </ol>
            </div>

        </div>
    </UserLayout>
</template>

<script setup>
import UserLayout from '../../layouts/UserLayout.vue'; 
</script>

<style scoped>
/* Tailwind CSS digunakan, jadi custom style minimal */
</style>
