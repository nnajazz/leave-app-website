import { getSearchMandatoryLeaveService } from "../../services/mandatory/getSearchMandatoryLeave.service.js";
import { responsePagination } from "../../utils/responsePagination.utils.js";

// Controller untuk mengambil semua data cuti mandatory (search)
export const getSearchMandatoryLeave = async (req, res, next) => {
  try {
    // mengambil query parameter yang di kirimkan
    const { value = '', page = 1, limit = 10 } = req.query;

    // Memanggil service untuk mengambil data cuti berdasarkan query
    const result = await getSearchMandatoryLeaveService(value, parseInt(page), parseInt(limit));

    const paginationResponse = responsePagination("Search mandatory leave data retrived succesfully", result);

    res.status(200).json(paginationResponse);
  } catch (error) {
    next(error);
  }
};