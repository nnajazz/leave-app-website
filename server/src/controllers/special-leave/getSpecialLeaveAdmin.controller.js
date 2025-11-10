import { getSpecialLeaveServiceAdmin } from "../../services/special-leave/getSpecialLeaveAdmin.service.js";
import { responsePagination } from "../../utils/responsePagination.utils.js";

// Controller untuk mengambil semua data cuti special 
export const getSpecialLeaveAdmin = async (req, res, next) => {
  try {
    // Mengambil parameter 'page' dan 'limit' dari query string untuk paginasi
    // Jika tidak ada, gunakan nilai default (page=1, limit=10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Memanggil service untuk mendapatkan data cuti special
    const result = await getSpecialLeaveServiceAdmin(page, limit);

    const paginationResponse = responsePagination("All special leave was successfully taken", result);

    res.status(200).json(paginationResponse);
  } catch (error) {
    next(error)
  }
};