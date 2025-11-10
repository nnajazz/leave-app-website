import prisma from "../../utils/client.js";

/**
 * fungsi ini digunakan untuk menambahkan record pada tb_jwt_token sebagai data session user
 * @param {*} token - JWT 
 * @param {*} nik - nik user
 * @param {*} deviceInfo - informasi device user
 * @param {*} deviceId - id yang disimpan pada cookies untuk mengizinkan multiple devices login
 * @returns 
 */
export const addToken = async (token, nik, deviceInfo, deviceId) => {
    try {
        const addedToken = await prisma.tb_jwt_token.create({
            data: {
                access_token: token,
                NIK: nik,
                device_info: deviceInfo,
                device_id: deviceId
            }
        })

        return addedToken;
    } catch (error) {
        return null;
    }
}