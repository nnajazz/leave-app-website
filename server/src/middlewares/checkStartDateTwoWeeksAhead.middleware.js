// Middleware untuk memvalidasi tanggal mulai (start_date) dari request body
export const checkStartDateTwoWeeksAhead = (req, res, next) => {

    // Ambil start_date dari body request
    const { start_date } = req.body;

    // Jika tidak ada start_date dikirim
    if (!start_date) {
        return res.status(400).json({
            success: false,
            message: "Start date is required"
        });
    }

    // Konversi start_date dari request menjadi objek Date
    const inputDate = new Date(start_date);

    // Ambil tanggal & waktu saat ini
    const now = new Date();

    // Buat tanggal minimum yang diperbolehkan dimulai dari hari ini (jam diset ke 00:00:00)
    const minAllowedDate = new Date(now.setHours(0, 0, 0, 0));

    // Tambahkan 3 hari ke tanggal minimum → artinya start_date harus minimal H+3 dari hari ini
    minAllowedDate.setDate(minAllowedDate.getDate() + 3);

    console.log(start_date);
    console.log(minAllowedDate);

    // Jika tanggal input lebih kecil dari minimum yang diperbolehkan
    if (inputDate < minAllowedDate) {
        return res.status(400).json({
            success: false,
            message: `Start date must be at least 3 days from today`
        });
    }

    next();
};
