import prisma from "../../utils/client.js";

// menghapus data pada tb_jwt_token berdasarkan nik dan deviceId
export const deleteToken = async (nik, deviceId) => {
    try {
        const deletedToken = await prisma.tb_jwt_token.deleteMany({
            where: {
                NIK: nik,
                device_id: deviceId
            }
        })
        return deletedToken;
    } catch (error) {
        return null;
    }
        
}