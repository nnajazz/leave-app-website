import { getAllLeavesService } from "../../services/leave/getAllLeaves.service.js";
import { responsePagination } from "../../utils/responsePagination.utils.js";

// Controller untuk menangani permintaan pengambilan semua data cuti
export const getAllLeaves = async (req, res, next) => {
  try {
    // Mendapatkan nomor halaman dari query parameter, default ke 1 jika tidak ada
    const page = parseInt(req.query.page) || 1;
    // Mendapatkan batas jumlah data per halaman dari query parameter, default ke 10 jika tidak ada
    const limit = parseInt(req.query.limit) || 10;

    // Memanggil service untuk mengambil data cuti 
    const leaves = await getAllLeavesService(page, limit);

    const paginationResponse = responsePagination("Leave data retrieved successfully", leaves);

    res.status(200).json(paginationResponse);
  } catch (error) {
    next(error);
  }
};
