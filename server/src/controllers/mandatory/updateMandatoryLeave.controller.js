import { updateMandatoryLeaveService } from "../../services/mandatory/updateMandatoryLeave.service.js";

// Controller untuk update data cuti mandatory
export const updateMandatoryLeave = async (req, res) => {
  try {

    // mengambil data dari body
    const { id } = req.params
    const data = req.body
    console.log(id)
    console.log(data)

    // Memanggil service untuk update data cuti mandatory
    const mandatoryLeave = await updateMandatoryLeaveService(id, data)

    res.status(200).json({
      message: "Mandatory leave updated successfully",
      data: mandatoryLeave
    })

  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
};