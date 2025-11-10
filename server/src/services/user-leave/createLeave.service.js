import prisma from "../../utils/client.js";
import { calculateHolidaysDays, createDateFromString } from '../../utils/leaves.utils.js';
import { updateLeave } from "../leave/updateLeave.service.js";

// Service untuk membuat pengajuan cuti baru
export const createLeave = async (data) => {
    // Melakukan destrukturisasi data input untuk mendapatkan variabel.
    let {
        title,
        leave_type,
        start_date,
        reason,
        NIK,
        status,
        fullname
    } = data;
    console.log(`fullname : ${fullname}`)

    console.log("TESTTT", new Date())

    console.log("Data di createLeave (full object):", JSON.stringify(data, null, 2));
    console.log("STATUS di createLeave:", status);
    console.log("Type of status:", typeof status);

    // Menginisialisasi variabel yang akan dimodifikasi berdasarkan jenis cuti.
    let end_date = data.end_date;
    let total_days = data.total_days;
    let id_special = null;

    // Logika khusus jika jenis cuti adalah 'special_leave'.
    if (leave_type === "special_leave") {
        id_special = data.id_special;
        // Memastikan id_special disediakan untuk cuti khusus.
        if (!id_special) {
            throw new Error("id_special is required for special leave");
        }

        // Mengambil detail cuti khusus dari database.
        const specialLeave = await prisma.tb_special_leave.findUnique({
            where: { id_special }
        });

        // Memastikan cuti khusus yang dimaksud ada di database.
        if (!specialLeave) {
            throw new Error("Invalid id_special provided");
        }

        // Mendapatkan durasi dari data cuti khusus.
        const duration = specialLeave.duration;
        const startDate = createDateFromString(start_date);

        // Menghitung tanggal berakhir dan total hari berdasarkan tipe durasi (bulan atau hari).
        if (specialLeave.type === 'month') {
            let tempDate = new Date(startDate);
            tempDate.setUTCMonth(tempDate.getUTCMonth() + duration);
            end_date = tempDate;

            // Menghitung ulang total hari kerja dalam rentang tanggal yang baru.
            total_days = calculateHolidaysDays(
                createDateFromString(start_date),
                createDateFromString(end_date)
            );

        } else {
            // Jika durasi dalam hari, hitung tanggal berakhir dengan menambahkan durasi.
            let count = 0;
            let tempDate = new Date(startDate);
            while (count < duration - 1) {
                tempDate.setUTCDate(tempDate.getUTCDate() + 1);
                const day = tempDate.getUTCDay();
                count++;
            }
            end_date = tempDate;
            total_days = duration;
        }

        // Menggunakan judul dari data cuti khusus sebagai judul dan alasan cuti.
        title = specialLeave.title;
        reason = specialLeave.title;
    }

    // Logika khusus jika jenis cuti adalah 'mandatory_leave'.
    if (leave_type === 'mandatory_leave') {
        const { id_mandatory } = data;

        // Memastikan status disediakan karena ini penting untuk alur cuti wajib.
        if (!status) {
            throw new Error("Status is required for mandatory leave and cannot be undefined.");
        }

        // Mengambil detail cuti wajib dari database.
        const mandatoryLeave = await prisma.tb_mandatory_leave.findUnique({
            where: { id_mandatory }
        });

        if (!mandatoryLeave) {
            throw new Error("Invalid id_mandatory provided");
        }

        // Menentukan alasan akhir (finalReason) berdasarkan status yang diberikan.
        let finalReason;
        if (status === "approved") {
            finalReason = "-";
        } else if (status === "rejected") {
            if (!reason || reason.trim() === "") {
                throw new Error("Reason is required when status is rejected");
            }
            finalReason = reason;
        } else {
            finalReason = data.reason || "mandatory leave created";
        }

        // Fungsi helper untuk mendapatkan semua tanggal hari kerja dalam sebuah rentang.
        const getDatesInRange = (start, end) => {
            let arr = [];
            let dt = new Date(start);
            while (dt <= end) {
                const day = dt.getDay();
                if (day !== 0 && day !== 6) { // Mengecualikan hari Minggu (0) dan Sabtu (6)
                    arr.push(new Date(dt));
                }
                dt.setDate(dt.getDate() + 1);
            }
            return arr;
        };

        const startDate = createDateFromString(mandatoryLeave.start_date);
        const endDate = createDateFromString(mandatoryLeave.end_date);

        let newMandatoryDates = getDatesInRange(startDate, endDate);

        // Mengambil semua cuti wajib yang sudah disetujui untuk NIK tersebut.
        const existingMandatory = await prisma.tb_leave.findMany({
            where: {
                NIK,
                leave_type: "mandatory_leave",
                status: "approved"
            },
            select: { start_date: true, end_date: true }
        });

        // Mengumpulkan semua tanggal dari cuti wajib yang sudah ada.
        let existingMandatoryDates = [];
        for (let m of existingMandatory) {
            existingMandatoryDates.push(...getDatesInRange(m.start_date, m.end_date));
        }

        // Mengambil semua cuti pribadi yang sudah disetujui untuk NIK tersebut.
        const existingPersonal = await prisma.tb_leave.findMany({
            where: {
                NIK,
                leave_type: "personal_leave",
                status: "approved"
            },
            select: { start_date: true, end_date: true }
        });

        // Mengumpulkan semua tanggal dari cuti pribadi yang sudah ada.
        let existingPersonalDates = [];
        for (let p of existingPersonal) {
            existingPersonalDates.push(...getDatesInRange(p.start_date, p.end_date));
        }

        // Menyaring tanggal cuti wajib baru untuk memastikan tidak ada tumpang tindih dengan cuti yang sudah ada.
        const uniqueDates = newMandatoryDates.filter(date => {
            const dateStr = date.toISOString().split("T")[0];
            const inMandatory = existingMandatoryDates.some(d => d.toISOString().split("T")[0] === dateStr);
            const inPersonal = existingPersonalDates.some(d => d.toISOString().split("T")[0] === dateStr);
            return !inMandatory && !inPersonal;
        });

        // Total hari adalah jumlah tanggal unik yang tidak tumpang tindih.
        const total_days = uniqueDates.length;

        const leaveYear = startDate.getFullYear();
        const startOfYear = new Date(leaveYear, 0, 1);
        const endOfYear = new Date(leaveYear, 11, 31, 23, 59, 59, 999);

        // Memeriksa apakah sudah ada entri cuti untuk cuti wajib ini di tahun yang sama.
        const existingLeave = await prisma.tb_leave.findFirst({
            where: {
                id_mandatory,
                NIK,
                start_date: {
                    gte: startOfYear,
                    lte: endOfYear
                }
            },
        });

        // Jika sudah ada, perbarui status dan alasannya.
        if (existingLeave) {
            const mandatory = await updateLeave(
                existingLeave.id_leave,
                status,
                finalReason,
                NIK,
                fullname
            );

            console.log("Data mandatory")
            console.log(mandatory)
            return mandatory
        }

        // Jika belum ada, buat entri cuti baru dengan status pending.
        const createdLeave = await prisma.tb_leave.create({
            data: {
                title: mandatoryLeave.title,
                leave_type: 'mandatory_leave',
                start_date: startDate,
                end_date: endDate,
                reason: finalReason,
                NIK,
                fullname,
                total_days,
                id_mandatory,
                created_at: new Date(),
                status: 'pending'
            }
        });

        // Jika status awal yang diminta bukan pending, perbarui statusnya.
        if (status !== 'pending') {
            try {
                const updatedLeave = await updateLeave(
                    createdLeave.id_leave,
                    status,
                    finalReason,
                    NIK,
                    fullname
                );
                return updatedLeave;
            } catch (error) {
                // Jika pembaruan gagal, hapus entri yang baru dibuat untuk menjaga konsistensi data.
                await prisma.tb_leave.delete({
                    where: { id_leave: createdLeave.id_leave }
                });
                throw error;
            }
        }

        return createdLeave;
    }

    // Logika untuk cuti pribadi .
    // Jika total_days tidak disediakan, hitung berdasarkan tanggal mulai dan berakhir.
    if (!total_days) {
        total_days = calculateHolidaysDays(
            createDateFromString(start_date),
            createDateFromString(end_date)
        );
    }

    // Menyiapkan objek data untuk dimasukkan ke dalam database.
    const leaveData = {
        title,
        leave_type,
        start_date: createDateFromString(start_date),
        end_date: createDateFromString(end_date || start_date),
        reason,
        NIK,
        fullname,
        total_days,
        id_special
    };

    // Membuat entri cuti baru di database.
    const leave2 = await prisma.tb_leave.create({
        data: leaveData,
    });

    return leave2
};