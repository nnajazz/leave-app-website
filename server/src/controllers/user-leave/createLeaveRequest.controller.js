import { createLeave } from "../../services/user-leave/createLeave.service.js";
import { decodeToken } from "../../utils/jwt.js";

// Controller untuk menangani permintaan pembuatan cuti baru.
export const createLeaveRequest = async (req, res, next) => {
    try {
        // Mendekode token otorisasi dari cookies untuk mendapatkan informasi pengguna (seperti nik dan nama lengkap).
        const user = await decodeToken(req.cookies["Authorization"])

        // Memanggil service createLeave untuk memproses dan menyimpan data pengajuan cuti ke database.
        const leave = await createLeave({
            ...req.body,
            NIK: user.nik,
            fullname: user.fullname,
            total_days: req.workingDays
        })

        console.log("Data yang akan dikirim ke createLeave:", leave);


        res.status(201).json({
            message: "Leave request created successfully",
            data: leave,
        })
    } catch (error) {
        next(error)
    }
}