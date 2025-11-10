import { createDateFromString } from "../utils/leaves.utils.js"

// Middleware untuk memvalidasi rentang tanggal cuti.
export const validateLeaveDateRange = (req, res, next) => {
    // Ambil start_date dan end_date dari body request.
    const { start_date, end_date } = req.body

    // Konversi string tanggal menjadi objek Date untuk perbandingan.
    const startDate = createDateFromString(new Date(start_date))
    const endDate = createDateFromString(new Date(end_date))

    // Cek jika tanggal akhir (endDate) lebih awal dari tanggal mulai (startDate).
    if(endDate < startDate){
        // Jika ya, buat error dan teruskan ke error handler.
        const error = new Error("Your leave end date cannot be less than your start date. Please double-check.")
        return next(error)
    }
    
    next()
}