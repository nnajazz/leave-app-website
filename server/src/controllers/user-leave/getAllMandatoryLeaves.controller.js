import { getAllMandatoryLeavesService } from "../../services/user-leave/getAllMandatoryLeaves.service.js";
import { responsePagination } from "../../utils/responsePagination.utils.js";

// Controller untuk mengambil semua data cuti wajib 
export const getAllMandatoryLeaves = async (req, res, next) => {
    try {
        // Mengambil parameter 'page' dan 'limit' dari query string untuk paginasi
        // Jika tidak ada, gunakan nilai default (page=1, limit=10)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Memanggil service untuk mendapatkan data cuti wajib
        const result = await getAllMandatoryLeavesService(page, limit, req); 

        const paginationResponse = responsePagination("All mandatory leave was successfully taken", result);

        res.status(200).json(paginationResponse);
    } catch (error) {
        next(error)
    }
};