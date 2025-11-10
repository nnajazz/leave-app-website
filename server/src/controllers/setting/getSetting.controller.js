import { serviceGetSetting } from "../../services/setting/getSetting.service.js";
import { formatSettingResponse } from "../../utils/formatSettingResponse.utils.js"

// Controller untuk mengambil semnua data setting
export const getSetting = async (req, res, next) => {
    try {
        // Memanggil service untuk mendapatkan data setting
        const data = await serviceGetSetting()

        const setting = data[0]

        res.status(200).json({
            message: "successfully retrieved the setting data",
            data: formatSettingResponse(setting)
        })
    } catch (error) {
        next(error)
    }
}