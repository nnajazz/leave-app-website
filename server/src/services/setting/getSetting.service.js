import prisma from "../../utils/client.js"

// Service untuk mengambil semua data setting
export const serviceGetSetting = async () => {
    return await prisma.tb_settings.findMany()
}