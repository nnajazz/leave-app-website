import { getLeavesByFilterService } from "../../services/leave/getLeavesByFilter.service.js";
import { responsePagination } from "../../utils/responsePagination.utils.js";

// Controller untuk menangani permintaan pengambilan semua data cuti 
export const getLeavesByFilter = async (req, res, next) => {
  try {
    // mendapatkan query yang di berikan
    const { value, type, page = 1, limit = 10 } = req.query;

    // Memanggil service untuk mengambil data cuti 
    const leaves = await getLeavesByFilterService(type, value, parseInt(page), parseInt(limit));

    const paginationResponse = responsePagination("Filtered leave data retrieved successfully", leaves);

    res.status(200).json(paginationResponse);

  } catch (error) {
    next(error)
  }
}