import { createMandatoryLeaveService } from "../../services/mandatory/createMandatoryLeave.service.js";

// Controller untuk membuat data cuti mandatory
export const createMandatoryLeave = async (req, res, next) => {
  // Mengambil data dari body
  const data = req.body
  try {
    // Memanggil service untuk membuat data cuti special
    const mandatoryLeaves = await createMandatoryLeaveService(data);
    res.status(201).json({
      success: true,
      message: "Mandatory leave created successfully",
      data: mandatoryLeaves
    });
  } catch (error) {
    next(error)
  }
};