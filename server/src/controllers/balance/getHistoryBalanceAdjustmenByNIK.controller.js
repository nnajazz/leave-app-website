import { getAllBalanceAdjustmentByNIK } from "../../services/balance/getAllBalanceAdjustmentByNIK.service.js";
import { decodeToken } from "../../utils/jwt.js"
import { createDateFromString } from "../../utils/leaves.utils.js"
import { responsePagination } from "../../utils/responsePagination.utils.js"

// controller untuk mengambil data modifikasi balance berdasarkan nik karyawan 
export const getHistoryBalanceAdjustmenByNIK = async (req, res, next) => {
     try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const user = await decodeToken(req.cookies["Authorization"])
        const startDate = req.query.start ? createDateFromString(req.query.start) :  undefined
        const endDate = req.query.end ? createDateFromString(req.query.end) : undefined
        const balanceYear = parseInt(req.query.year)
        const searchValue = req.query.value

        endDate?.setUTCHours(23, 59, 59);

        // proses mengambil data dari database
        const logs = await getAllBalanceAdjustmentByNIK(page, limit, user.NIK, searchValue, startDate, endDate, balanceYear)

        // format standar pagination
        const result = responsePagination("Balance Adjustment logs retrieved successfully", logs)

        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}