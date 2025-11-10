import prisma from '../../utils/client.js'
import fs from 'fs';
import { format } from 'fast-csv';

export const exportFileServices = async (target) => {
    let result = [];

    try {
        console.log('target', target);

        // Pilih tabel berdasarkan target yang diberikan
        switch (target) {
            case 'leave':
                // Ambil data cuti dengan hanya field tertentu
                result = await prisma.tb_leave.findMany({
                    select: {
                        title: true,
                        leave_type: true,
                        start_date: true,
                        end_date: true,
                        total_days: true,
                        NIK: true
                    }
                });
                break;

            case 'user':
                // Ambil seluruh data user
                result = await prisma.tb_users.findMany();
                break;

            case 'balance':
                // Ambil seluruh data jatah cuti karyawan
                result = await prisma.tb_balance.findMany({});
                break;

            case 'log':
                // Ambil data log cuti
                result = await prisma.tb_leave_log.findMany({
                });
                break;

            default:
                // Jika target tidak dikenal, kembalikan array kosong
                console.warn(`Unknown target: ${target}`);
                break;
        }

        // Siapkan file CSV untuk ditulis
        const writeable = fs.createWriteStream('./src/temp/result.csv');
        const write = format({ headers: true, delimiter: ';' });

        // Hubungkan fast-csv dengan writable stream
        write.pipe(writeable);

        // Tulis setiap baris data ke file CSV
        result.forEach(row => write.write(row));

        // Akhiri penulisan
        write.end();

        // Kembalikan promise agar pemanggil bisa menunggu sampai file selesai ditulis
        return new Promise((resolve, reject) => {
            writeable.on('finish', () => {
                console.log('Finish writing data');
                resolve({ success: true, count: result.length });
            });
            writeable.on('error', reject);
        });

    } catch (error) {
        // Lempar error agar bisa ditangani di layer yang memanggil
        throw error;
    }
};