import { updateMandatoryYearService } from "../../services/mandatory/updateMandatoryYearService.service.js"

// Controller untuk update tahun mandatory secara massal
export const updateMandatoryYear = async (req, res) => {
    try {
        // mengambil tahun yang akan di update
        const year = req.params
        // Memanggil service untuk update tahun secara massal
        const data = await updateMandatoryYearService(year)

        res.status(201).json({
            message: "Mandatory leave updated successfully",
            data: data
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}