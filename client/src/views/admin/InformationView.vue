<template>
    <AdminLayout>
        <div class="space-y-6">

            <div class="bg-white p-6 rounded-2xl shadow-lg">
                <div class="flex flex-col md:flex-row md:items-center justify-center space-y-4 md:space-y-0">
                    <h1 class="text-2xl font-bold text-gray-800 flex items-center">
                        <span class="p-2 mr-3 bg-[#5e77ff] rounded-lg text-white">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 17h-2V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v12H3c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1v-2h4v2c0 .55.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1zm-4 0v-2H7v2h10zM19 7h-2v2h2V7z"/>
                            </svg>
                        </span>
                        Panduan Penggunaan Aplikasi Cuti - Admin
                    </h1>
                </div>
            </div>

            <div class="bg-white p-8 rounded-2xl shadow-lg">
                
                <div class="flex justify-center">
                    <h2 class="text-2xl font-bold text-gray-800 flex items-center mb-4">
                        <span class="p-2 mr-3 bg-[#5e77ff] rounded-lg text-white">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-6h2v6zm0-8h-2V7h2v1z"/>
                            </svg>
                        </span>
                        Dashboard Admin
                    </h2>
                </div>
                
                <p class="text-gray-600 mb-6">
                    Dashboard utama yang memberikan pandangan menyeluruh terhadap aktivitas cuti di perusahaan, mencakup:
                </p>
                
                <ol class="list-decimal list-inside space-y-3 pl-4 text-gray-700">
                    <li><span class="font-semibold">Total Karyawan:</span> Jumlah karyawan aktif (Tetap & Kontrak).</li>
                    <li><span class="font-semibold">Cuti 6 Bulan:</span> Agregat jumlah permintaan cuti dalam 6 bulan terakhir.</li>
                    <li><span class="font-semibold">Karyawan Cuti Mingguan:</span> Jumlah karyawan yang sedang cuti pada minggu berjalan.</li>
                    <li><span class="font-semibold">Cuti Pending:</span> Total permintaan cuti yang masih menunggu persetujuan.</li>
                    <li><span class="font-semibold">Karyawan Cuti Pending:</span> Shortcut untuk langsung melihat daftar karyawan yang pengajuannya masih Pending.</li>
                    <li><span class="font-semibold">Trend Cuti Bulanan:</span> Grafik tren pengajuan cuti dari Januari hingga Desember.</li>
                    <li><span class="font-semibold">User dengan Sisa Cuti Terbanyak:</span> Leaderboard karyawan dengan saldo cuti tertinggi.</li>
                    <li><span class="font-semibold">User dengan Sisa Cuti Terendah:</span> Leaderboard karyawan dengan saldo cuti terendah.</li>
                    <li><span class="font-semibold">Menu "Employee List":</span> Masuk ke halaman daftar semua karyawan.</li>
                    <li><span class="font-semibold">List of Leave:</span> Menu utama yang berisi sub-menu **Request Leave** (Permintaan yang sedang berjalan) dan **History Leave** (Riwayat yang sudah selesai).</li>
                    <li><span class="font-semibold">Sub-Menu "Request Leave":</span> Halaman manajemen untuk semua permintaan cuti yang sedang berjalan.</li>
                    <li><span class="font-semibold">Sub-Menu "History Leave":</span> Halaman riwayat untuk semua permintaan cuti yang sudah selesai.</li>
                    <li><span class="font-semibold">Special Leave:</span> Halaman manajemen untuk master data Cuti Khusus.</li>
                    <li><span class="font-semibold">Mandatory Leave:</span> Halaman manajemen untuk master data Cuti Wajib.</li>
                    <li><span class="font-semibold">Adjust Balance:</span> Fitur untuk menambah/mengurangi saldo cuti karyawan secara manual.</li>
                    <li><span class="font-semibold">Adjust History:</span> Halaman riwayat untuk semua penyesuaian saldo cuti yang sudah dilakukan.</li>
                    <li><span class="font-semibold">Information / Panduan:</span> Halaman yang sedang Anda lihat ini, berisi panduan penggunaan aplikasi.</li>
                    <li><span class="font-semibold">Setting:</span> Untuk mengubah tema warna tampilan website Anda pribadi.</li>
                </ol>
                
            </div>
            
            <hr class="border-gray-300"> 

            <div class="bg-white p-8 rounded-2xl shadow-lg">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center mb-4">
                    <span class="p-2 mr-3 bg-green-500 rounded-lg text-white">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.57.84 2.5 1.57 2.5 2.45V19h7v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                        </svg>
                    </span>
                    Employee List
                </h2>
                <ol class="list-decimal list-inside space-y-3 pl-4 text-gray-700">
                    <li>
                        Halaman ini menampilkan daftar seluruh karyawan beserta informasi statistik kunci per individu.
                    </li>
                    <li>
                        Statistik meliputi total cuti yang diajukan dan total yang disetujui.
                    </li>
                </ol>
            </div>

            <div class="bg-white p-8 rounded-2xl shadow-lg">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center mb-4">
                    <span class="p-2 mr-3 bg-purple-600 rounded-lg text-white">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 3h-2.25a2 2 0 0 0-2-2h-3.5a2 2 0 0 0-2 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 16h-2v-2h2v2zm0-4h-2V7h2v8zm4 4h-2v-2h2v2zm0-4h-2V7h2v8zM9 15h-2v-2h2v2zm0-4H7V7h2v4z"/>
                        </svg>
                    </span>
                    List of Leave - Request Leave
                </h2>
                <ol class="list-decimal list-inside space-y-3 pl-4 text-gray-700">
                    <li>
                        Halaman kerja utama untuk memproses permintaan cuti.
                    </li>
                    <li>
                        Status Pengajuan:
                        <ul class="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li>Pending: Menunggu tindakan Anda.</li>
                            <li>Approved: Disetujui.</li>
                            <li>Rejected: Ditolak.</li>
                            <li>Expired: Permintaan yang dibiarkan Pending hingga hari-H otomatis menjadi Expired.</li>
                        </ul>
                    </li>
                    <li>
                        Antisipasi Overlapping: Sistem memberi notifikasi jika permintaan berpotensi tumpang tindih.
                    </li>
                    <li>
                        Filter: Cari permintaan berdasarkan nama, departemen, atau tanggal.
                    </li>
                    <li>
                        Aturan Penting: Admin tidak dapat memproses (Approve/Reject) permintaan cuti miliknya sendiri.
                    </li>
                </ol>
            </div>

            <div class="bg-white p-8 rounded-2xl shadow-lg">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center mb-4">
                    <span class="p-2 mr-3 bg-orange-500 rounded-lg text-white">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-8h14V7H7v2z"/>
                        </svg>
                    </span>
                    List of Leave - History Leave
                </h2>
                <p class="text-gray-600 mb-4">
                    Arsip semua permintaan cuti di perusahaan.
                </p>
                <ol class="list-decimal list-inside space-y-3 pl-4 text-gray-700">
                    <li>
                        Mengubah Status: Bisa diubah antara Approved dan Rejected maksimal H-1 sebelum cuti dimulai.
                    </li>
                    <li>
                        Informasi Saldo: Lihat apakah cuti berasal dari jatah tahun ini atau tahun lalu.
                    </li>
                    <li>
                        Aturan Penting: Admin tidak dapat mengubah status untuk permintaan yang diajukannya sendiri.
                    </li>
                </ol>
            </div>

            <div class="bg-white p-8 rounded-2xl shadow-lg">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center mb-4">
                    <span class="p-2 mr-3 bg-pink-500 rounded-lg text-white">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 16H7V6h10v12zm-3-5h-2v2h2v-2zm-4-2H8V9h2v2zm4 0h-2V9h2v2z"/>
                        </svg>
                    </span>
                    Manajemen Master Data
                </h2>
                <ol class="list-decimal list-inside space-y-3 pl-4 text-gray-700">
                    <li>
                        Special Leave Management: Tambah, edit, atau nonaktifkan jenis-jenis Cuti Khusus.
                    </li>
                    <li>
                        Mandatory Leave Management: Tambah, edit, atau nonaktifkan jadwal Cuti Wajib (maksimal dibuat H-14 sebelum mulai).
                    </li>
                    <li>
                        Adjust Balance: Tambah saldo cuti manual ke karyawan tertentu (tentukan tahun saldo).
                    </li>
                    <li>
                        Saldo tambahan mengikuti aturan kedaluwarsa dari kategorinya.
                    </li>
                </ol>
            </div>
            
        </div>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '../../layouts/AdminLayout.vue'; 
</script>

<style scoped>
/* Tidak ada style custom tambahan yang diperlukan */
</style>

