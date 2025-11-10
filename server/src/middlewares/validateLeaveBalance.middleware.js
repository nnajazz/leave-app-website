import { decodeToken } from '../utils/jwt.js';
import { getUserLeaveBalance } from '../services/user-balance/getUserLeaveBalance.service.js';
import { getUserCurrentYearLeaveBalance } from '../services/user-balance/getUserCurrentYearLeaveBalance.service.js';
import { getPendingLeaveDays } from '../services/user-balance/getPendingLeaveDays.service.js';
import { isValidDateRange, calculateHolidaysDays } from '../utils/leaves.utils.js';

// Middleware untuk memvalidasi saldo cuti pengguna sebelum mengajukan cuti.
export const validateLeaveBalance = async (req, res, next) => {
    // Mendapatkan data dari body request.
    const { start_date, end_date, leave_type } = req.body;
    // Mendekode token untuk mendapatkan nik pengguna.
    const { NIK } = await decodeToken(req.cookies["Authorization"]);

    // Jika tipe cuti bukan personal_leave, maka akan di lanjutkan
    if (leave_type !== "personal_leave") {
        return next();
    }

    try {

        // Mengubah string tanggal menjadi objek Date.
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (!isValidDateRange(startDate, endDate)) {
            const error = new Error("Start date cannot be after end date");
            error.status = 400;
            return next(error);
        }

        // Menghitung jumlah hari kerja yang diminta untuk cuti, tidak termasuk akhir pekan dan hari libur nasional.
        const requestedHolidaysDays = calculateHolidaysDays(startDate, endDate);

        // Mendapatkan tahun saat ini dan tahun mulai cuti.
        const now = new Date();
        const currentYear = now.getFullYear()
        const startYear = startDate.getFullYear()

        let totalLeaveBalance

        // Logika untuk menentukan saldo cuti yang akan digunakan.
        // Jika tahun pengajuan cuti lebih besar dari tahun sekarang,
        // maka saldo cuti yang digunakan adalah saldo cuti tahun ini.
        // Jika tidak, maka saldo cuti yang digunakan adalah total saldo cuti (termasuk sisa tahun lalu).
        if (currentYear < startYear) {
            totalLeaveBalance = await getUserCurrentYearLeaveBalance(NIK);
        } else {
            totalLeaveBalance = await getUserLeaveBalance(NIK);
        }

        // Mendapatkan jumlah hari cuti yang statusnya masih 'pending'.
        const pendingDays = await getPendingLeaveDays(NIK);
        // Menghitung saldo cuti yang tersedia dengan mengurangi total saldo dengan cuti yang masih pending.
        const availableLeaveBalance = totalLeaveBalance - pendingDays;

        // Memeriksa apakah jumlah hari cuti yang diminta melebihi saldo yang tersedia.
        if (requestedHolidaysDays > availableLeaveBalance) {
            const error = new Error(
                `Insufficient leave balance. Available: ${availableLeaveBalance} days, Requested: ${requestedHolidaysDays} Holidays days`
            );
            error.statusCode = 400;
            error.data = {
                total_balance: totalLeaveBalance,
                pending_days: pendingDays,
                available_balance: availableLeaveBalance,
                requested_Holidays_days: requestedHolidaysDays
            };
            return next(error);
        }

        // Menyimpan jumlah hari cuti yang diminta ke dalam objek request
        req.HolidaysDays = requestedHolidaysDays;

        next();
    } catch (error) {
        error.statusCode = 500;
        error.message = "Internal server error during leave balance validation";
        return next(error);
    }
};