import { success } from "zod/v4"
import { getUserHistoryByNIK } from "../../services/user/getUserHistoryByNIK.service.js"
import { responsePagination } from "../../utils/responsePagination.utils.js"

/**
 * fungsi ini mengembalikan gabungan history data modifikasi balance dan pengajuan cuti karyawan
 */
export const getUserHistory = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || undefined
        const limit = Number(req.query.limit) || undefined
        const dataSource = ["adjustment", "leave"]

         // filter berdasarkan jenis data yang tersedia
        const resources = dataSource.includes(req.query.resources) ? req.query.resources : undefined;
        
        const userHistory = await getUserHistoryByNIK(req.params.nik, limit, page, resources);
        console.log(userHistory)

        // konversi ke format standar pagination
        const result = responsePagination("User history data retrieved successfully", userHistory)

        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}