import prisma from "../../utils/client.js";

// Service untuk membuat data special leave
export const createSpecialLeaveService = async (data) => {
    // query untuk membuat data special leave
    return await prisma.tb_special_leave.create({
        data,
    })
}