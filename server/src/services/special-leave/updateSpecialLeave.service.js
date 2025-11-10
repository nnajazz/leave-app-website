import prisma from "../../utils/client.js";

// Service untuk update data special leave
export const updateSpecialLeaveService = async (id, data) => {
    // query untuk update data special leave
    return await prisma.tb_special_leave.update({
        where: {
            id_special: id
        },
        data
    })
}