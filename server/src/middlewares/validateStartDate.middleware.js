import { createDateFromString } from "../utils/leaves.utils.js"

// Middleware untuk memvalidasi tanggal mulai cuti (start_date).
export const validateStartDate = (req, res, next) => {
    // Ambil start_date dan leave_type dari body request.
    const { start_date, leave_type } = req.body

    // Jika tipe cuti adalah 'mandatory_leave' atau 'special_leave', lewati validasi ini.
    if (leave_type === "mandatory_leave" || leave_type === "special_leave") {
        return next();
    }

    // Konversi string tanggal 'start_date' dan tanggal hari ini menjadi objek Date untuk perbandingan.
    const startDate = createDateFromString(start_date)
    const today = createDateFromString(new Date())

    // Cek jika tanggal mulai cuti adalah hari ini.
    if (startDate.getTime() === today.getTime()) {
        // Jika ya, kirim error karena pengajuan tidak boleh hari ini juga
        const error = new Error("Leave cannot be requested for today. Please request leave at least one day in advance.")
        error.status = 400;
        return next(error)
    }

    // Cek jika tanggal mulai cuti adalah tanggal di masa lalu.
    if (startDate.getTime() < today.getTime()) {
        // Jika ya, kirim error.
        const error = new Error("The leave start date cannot be in the past. Please select a future date.");
        error.status = 400;
        return next(error);
    }

    // Hitung perbedaan tahun antara tanggal mulai cuti dan hari ini.
    const yearDiff = startDate.getFullYear() - today.getFullYear()

    // Cek jika pengajuan cuti lebih dari 1 tahun di masa depan.
    if (yearDiff > 1) {
        // Jika ya, kirim error.
        const error = new Error("you can't apply for leave two years or more in advance.")
        error.status = 400
        return next(error)
    }

    next()
}
