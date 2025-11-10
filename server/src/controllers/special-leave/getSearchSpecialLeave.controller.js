import { getSearchSpecialLeaveService } from "../../services/special-leave/getSearchSpecialLeave.service.js";
import { responsePagination } from "../../utils/responsePagination.utils.js";

// Controller untuk mengambil semua data cuti special (search)
export const getSearchSpecialLeave = async (req, res, next) => {
  try {
    // mengambil query parameter yang di kirimkan
    const { value = '', page = 1, limit = 10 } = req.query;

    // Memanggil service untuk mengambil data cuti berdasarkan query
    const result = await getSearchSpecialLeaveService(value, parseInt(page), parseInt(limit));

    const paginationResponse = responsePagination("Search special leave data retrieved successfully", result);

    res.status(200).json(paginationResponse);
  } catch (error) {
    next(error)
  }
};