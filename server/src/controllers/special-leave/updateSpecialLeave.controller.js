import { updateSpecialLeaveService } from "../../services/special-leave/updateSpecialLeave.service.js";

// Controller untuk update data cuti special
export const updateSpecialLeave = async (req, res) => {
  try {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    // mengambil data dari body
    const { id } = req.params;
    const data = req.body;
    console.log("aaaaaaaaaaaaaaa", id);
    console.log("bbbbbbbbbbb", data);

    // Memanggil service untuk update data cuti special
    const specialLeaves = await updateSpecialLeaveService(id, data);

    res.status(200).json({
      message: "Special leave updated successfully",
      data: specialLeaves,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
