import prisma from "../utils/client.js";
import { decodeToken } from "../utils/jwt.js";

// Fungsi bantuan untuk memeriksa apakah string tanggal valid.
const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

// Middleware untuk memeriksa apakah ada pengajuan cuti yang tumpang tindih (duplikat).
export const checkDuplicateLeave = async (req, res, next) => {
    try {
        // Decode token untuk mendapatkan data pengguna (terutama nik).
        const token = req.cookies["Authorization"];
        const user = await decodeToken(token);
        // Ambil data cuti dari body request.
        const { start_date, end_date, leave_type } = req.body;

        // Validasi ini hanya berlaku untuk 'personal_leave'.
        if (leave_type !== "personal_leave") {
            // Lewati jika bukan cuti pribadi.
            return next();
        }

        // Periksa apakah format tanggal valid.
        if (!isValidDate(start_date) || (end_date && !isValidDate(end_date))) {
            const error = new Error("Invalid date format. Please use YYYY-MM-DD");
            error.statusCode = 400;
            return next(error);
        }

        // Buat objek Date dari string tanggal untuk perbandingan.
        const start = new Date(start_date);
        const end = end_date ? new Date(end_date) : start;

        // Cek apakah ada cuti wajib (mandatory leave) yang aktif dan tumpang tindih.
        const overlappingMandatory = await prisma.tb_mandatory_leave.findFirst({
            where: {
                is_active: true,
                start_date: { lte: end },
                end_date: { gte: start },  
            },
        });

        // Jika ada cuti wajib yang tumpang tindih, tolak pengajuan.
        if (overlappingMandatory) {
            const error = new Error(
                `Cannot apply for personal leave. There is a mandatory leave period from ${overlappingMandatory.start_date.toDateString().slice(4)} to ${overlappingMandatory.end_date.toDateString().slice(4)}.`
            );
            error.statusCode = 400;
            return next(error);
        }

        // Cek apakah pengguna sudah memiliki cuti lain pada rentang tanggal yang sama.
        const existingLeaves = await prisma.tb_leave.findMany({
            where: {
                NIK: user.NIK,
                start_date: { lte: end },
                end_date: { gte: start },
            },
        });

        // Jika ada pengajuan cuti yang sudah ada pada rentang tanggal tersebut.
        if (existingLeaves.length > 0) {
            // Cek secara spesifik jika yang tumpang tindih adalah cuti wajib.
            const mandatoryLeave = existingLeaves.find(leave => leave.leave_type === 'mandatory_leave');
            if (mandatoryLeave) {
                const error = new Error(
                    `Cannot apply for personal leave. You have an overlapping mandatory leave from ${mandatoryLeave.start_date.toDateString().slice(4)} to ${mandatoryLeave.end_date.toDateString().slice(4)}.`
                );
                error.statusCode = 400;
                return next(error);
            }

            // Cek untuk cuti lain (bukan cuti wajib) yang statusnya masih 'pending' atau 'approved'.
            const otherLeave = existingLeaves.find(leave => leave.leave_type !== 'mandatory_leave' && ['pending', 'approved'].includes(leave.status));
            if (otherLeave) {
                const error = new Error(
                    `You already have a leave request from ${otherLeave.start_date.toDateString().slice(4)} to ${otherLeave.end_date.toDateString().slice(4)}.`
                );
                error.statusCode = 400;
                return next(error);
            }
        }

        next();
    } catch (err) {
        next(err);
    }
};
