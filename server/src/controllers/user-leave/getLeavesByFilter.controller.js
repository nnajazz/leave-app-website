import { getLeavesByFilterService } from "../../services/user-leave/getLeavesByFilter.service.js";
import { decodeToken } from "../../utils/jwt.js";
import { responsePagination } from "../../utils/responsePagination.utils.js";

// Controller untuk mengambil daftar permintaan cuti pengguna 
export const getLeavesByFilter = async (req, res, next) => {
    try {
        // mengambil query parameter yang di kirimkan
        const { value, type, status, page = 1, limit = 10 } = req.query;

        // Mendekode token otentikasi dari cookies untuk mendapatkan data pengguna
        const user = await decodeToken(req.cookies["Authorization"]);

        // Memanggil service untuk mengambil data cuti berdasarkan query
        const leaves = await getLeavesByFilterService(user.NIK, type, status, value, page, limit);

        if (!leaves || leaves.length === 0) {
            res.status(201).json({
                message: "The data doesn't exist",
                data: leaves,
            })
        }

        const result = responsePagination('Filtered leave data retrieved successfully', leaves)
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
};