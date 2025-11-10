import cron from 'node-cron';
import prisma from "../utils/client.js";
import { createDateFromString } from '../utils/leaves.utils.js';
import { getApiEmployee } from '../utils/getApiEmployee.utils.js';

// Menjadwalkan cron job untuk berjalan setiap hari pada tengah malam ('0 0 * * *')
cron.schedule('0 0 * * *', async () => {
    console.log('⏳ [Cron] Mulai cek balance...');

    // Mendapatkan tanggal hari ini
    const today = new Date();
    // Pengecekan: jika hari ini adalah tanggal 1, hentikan proses.
    if (today.getDate() === 1) {
        console.log('[Cron] Hari ini tanggal 1, proses pembuatan balance dilewati.');
        return;
    }

    try {
        // Menentukan tahun target berdasarkan tahun saat ini
        const targetYear = today.getFullYear();
        // Menentukan tanggal awal tahun (1 Januari tahun ini)
        const startOfYear = new Date(`${targetYear}-01-01`);
        // Menentukan tanggal akhir pengecekan (31 Desember dua tahun dari sekarang)
        const endOfYear = new Date(`${targetYear + 2}-12-31`);

        // Mengambil daftar semua karyawan 
        
        const users = await prisma.tb_users.findMany({
            include: {
                tb_statuses: true,
                tb_roles: true
            }
        });

        // Menyaring karyawan: hanya yang berstatus aktif dan bukan 'intern'
        const filteredUsers = users.filter(user => user.tb_statuses.name !== 'Magang' && user.isActive === true);

        // Melakukan iterasi untuk setiap karyawan yang telah disaring
        for (const user of filteredUsers) {
            const nik = user.NIK;

            // Mencari apakah karyawan sudah memiliki saldo cuti (balance) dalam rentang waktu yang ditentukan
            const balance = await prisma.tb_balance.findFirst({
                where: {
                    NIK: nik,
                    receive_date: {
                        gte: startOfYear,
                        lte: endOfYear
                    }
                }
            });

            // Jika tidak ada saldo cuti yang ditemukan untuk karyawan ini
            if (!balance) {
                // Menyiapkan data untuk pembuatan saldo baru
                const adjustment_value = 0;
                const notes = "Auto generate balance";
                const actor = "system";

                // Data untuk tabel tb_balance
                const newBalanceData = {
                    NIK: nik,
                    amount: adjustment_value,
                    receive_date: startOfYear,
                    expired_date: new Date(`${targetYear + 2}-04-01`)
                };

                // Menjalankan operasi database dalam sebuah transaksi untuk memastikan integritas data
                const result = await prisma.$transaction(async (tx) => {
                    // 1. Membuat record saldo baru di tabel tb_balance
                    const newBalance = await tx.tb_balance.create({
                        data: newBalanceData
                    });

                    // 2. Membuat log penyesuaian saldo di tabel tb_balance_adjustment
                    const adjustmentLog = await tx.tb_balance_adjustment.create({
                        data: {
                            adjustment_value,
                            notes,
                            actor,
                            NIK: nik,
                            fullname: user.fullname,
                            created_at: new Date(),
                            balance_year: newBalance.receive_date.getFullYear(),
                            id_balance: newBalance.id_balance
                        }
                    })

                    // Mengembalikan hasil dari kedua operasi
                    return { newBalance, adjustmentLog };
                });

                console.log(`✅ Balance baru dibuat untuk NIK: ${nik}`);
            } else {
                // Jika saldo sudah ada, hanya memberikan log informasi
                console.log(`ℹ️ Balance sudah ada untuk NIK: ${nik}`);
            }
        }

        console.log('[Cron] Penambahan balance selesai.');
    } catch (error) {
        // Menangani dan mencatat jika terjadi error selama proses
        console.error('[Cron] Gagal membuat balance:', error);
    }
}, { timezone: 'Asia/Jakarta' });