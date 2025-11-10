import cron from 'node-cron';
import prisma from "../utils/client.js";
import { updateLeaveBalance } from '../services/leave/updateLeaveBalance.service.js';
import { expiredLeave } from '../services/leave/expiredLeave.service.js';

// Menjalankan setiap tanggal 1 pukul 00:30 pagi
cron.schedule('30 0 1 * *', async () => {
  console.log('⏳ [Cron] Mulai penambahan cuti otomatis...');

  try {
    await updateLeaveBalance();
    console.log('[Cron] Penambahan cuti selesai.');
  } catch (error) {
    console.error('[Cron] Gagal memperbarui cuti:', error);
  }
}, {
  timezone: 'Asia/Jakarta'
});



// Cron: jalan setiap hari jam 00:00
cron.schedule('0 0 * * *', async () => {
  console.log(`[CRON] Mengecek cuti yang expired...`);
  await expiredLeave();
}, {
  timezone: 'Asia/Jakarta'
});

