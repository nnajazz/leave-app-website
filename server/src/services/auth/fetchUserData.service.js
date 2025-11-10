import prisma from "../../utils/client.js";
import { getApiEmployee } from "../../utils/getApiEmployee.utils.js";

// fungsi ini digunakan untuk mengambil data user berdasarkan emailKantor
export const fetchUserData = async (params, uniqueId) => {
    try {
        const user = await prisma.tb_users.findUnique({
            where: {
                [params]: uniqueId,
            },
            include: {
                tb_roles: true, 
                tb_statuses: true 
            }
        })

        console.log(user)

        if (!user) {
            const error = new Error("User not found")
            error.statusCode = 404
            throw error
        }

        console.log("Fetched user data:", user);
        return user;
    } catch (error) {
        throw error;
    }
}