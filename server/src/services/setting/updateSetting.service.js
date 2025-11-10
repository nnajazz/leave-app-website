import prisma from "../../utils/client.js"

// Service untuk update data setting dengan data baru
export const serviceUpdateSetting = async (data) => {

    // Ambil data setting pertama dari tabel tb_settings
    // hanya ada satu row setting yang aktif dipakai aplikasi
    const setting = await prisma.tb_settings.findFirst();

    if (!setting) {
        throw new Error("Setting not found");
    }

    return await prisma.tb_settings.update({
        where: {
            id: setting.id
        },
        data
    })
}
