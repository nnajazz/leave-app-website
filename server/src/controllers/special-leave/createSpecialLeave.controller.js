import { createSpecialLeaveService } from "../../services/special-leave/createSpecialLeave.service.js";

// Controller untuk membuat data cuti special 
export const createSpecialLeave = async (req, res) => {
  // Mengambil data dari body
  const data = req.body
  try {

    // Memanggil service untuk membuat data cuti special
    const specialLeaves = await createSpecialLeaveService(data)

    res.status(201).json({
      message: "Special leave created successfully",
      data: specialLeaves,
    })

  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}