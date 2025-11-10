import { getLeavesById } from "../../services/user-leave/getLeavesById.service.js";
import { decodeToken } from "../../utils/jwt.js";

// Controller untuk mengambil detail permintaan cuti berdasarkan ID
export const getLeaveRequestsById = async (req, res, next) => {
    try {
        // Mengambil ID cuti dari parameter URL
        const { id } = req.params
        // Mendekode token otentikasi dari cookies untuk mendapatkan data pengguna
        const user = await decodeToken(req.cookies["Authorization"])

        // Memanggil service untuk mengambil data cuti spesifik berdasarkan NIK pengguna dan ID cuti
        const leaves = await getLeavesById(user.NIK, id)

        res.status(201).json({
            message: 'Successfully retrieved leave data by ID',
            data: leaves
        })

    } catch (error) {
        next(error)
    }
}