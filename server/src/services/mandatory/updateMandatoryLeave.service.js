import prisma from "../../utils/client.js";

// Service untuk update data mandatory leave
export const updateMandatoryLeaveService = async (id, data) => {
    // query untuk update data update leave
    return await prisma.tb_mandatory_leave.update({
        where: { id_mandatory: id },
        data,
    });
};