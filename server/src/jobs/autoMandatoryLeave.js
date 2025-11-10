import cron from 'node-cron';
import prisma from '../utils/client.js';
import { createLeave } from '../services/user-leave/createLeave.service.js';
import { getApiEmployee } from '../utils/getApiEmployee.utils.js';

// Menjadwalkan cron job untuk berjalan setiap hari pada tengah malam ('0 0 * * *')
cron.schedule('0 0 * * *', async () => {
    console.log("[CRON] Running auto mandatory leave check...");

    // Persiapan tgl target
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 2);
    targetDate.setHours(0, 0, 0, 0);

    // Menentukan rentang waktu untuk sepanjang hari target
    const startOfTargetDay = new Date(targetDate);
    const endOfTargetDay = new Date(targetDate);
    endOfTargetDay.setHours(23, 59, 59, 999);
    console.log(`Target H-2 date: ${targetDate.toISOString().split('T')[0]}`);
 
    try {
        // Mencari semua cuti wajib (mandatory leave) yang aktif dan akan dimulai pada tanggal target (H-2)
        const upcomingMandatoryLeaves = await prisma.tb_mandatory_leave.findMany({
            where: {
                start_date: {
                    gte: startOfTargetDay,
                    lte: endOfTargetDay,
                },
                is_active: true
            }
        });
 
        console.log(`Found ${upcomingMandatoryLeaves.length} mandatory leaves starting on H-2`);

        // Melakukan iterasi untuk setiap cuti wajib yang ditemukan
        for (const mandatory of upcomingMandatoryLeaves) {
            console.log(`Processing mandatory leave: ${mandatory.title}, start_date: ${mandatory.start_date}`);

            // Mengambil daftar semua karyawan yang aktif dari API
            const allUsers = await prisma.tb_users.findMany({
                where: {
                    isActive: true,
                },
                select: {
                    NIK: true
                }
            });
            let createdCount = 0;

            // Melakukan iterasi untuk setiap karyawan yang aktif
            for (const user of allUsers) {
                // Memeriksa apakah cuti untuk event wajib ini sudah pernah dibuat untuk karyawan tersebut
                const existingLeave = await prisma.tb_leave.findFirst({
                    where: {
                        id_mandatory: mandatory.id_mandatory,
                        NIK: user.NIK
                    }
                }); 

                // Jika belum ada data cuti yang dibuat sebelumnya
                if (!existingLeave) {
                    try {
                        // Memanggil service createLeave untuk membuat data cuti baru secara otomatis
                        await createLeave({
                            title: mandatory.title,
                            leave_type: 'mandatory_leave',
                            NIK: user.NIK,
                            id_mandatory: mandatory.id_mandatory,
                            status: 'approved',
                            fullname: user.fullname
                        });
                        createdCount++;
                        console.log(`[AUTO] Created leave for NIK: ${user.NIK}`);
                    } catch (error) {
                        console.error(`[ERROR] Failed to create leave for NIK: ${user.NIK}`, error.message);
                    }
                }
            }

            console.log(`[SUMMARY] Auto-created ${createdCount} leave entries for mandatory: ${mandatory.title}`);
        }
    } catch (error) {
        console.error("[CRON ERROR] Error during auto mandatory leave check:", error.message);
    }
}, { timezone: 'Asia/Jakarta' });

