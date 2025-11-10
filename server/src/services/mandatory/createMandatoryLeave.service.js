import prisma from "../../utils/client.js";

// Service untuk membuat data mandatory leave
export const createMandatoryLeaveService = async (data) => {
    // query untuk membuat data mandatory leave
    return await prisma.tb_mandatory_leave.create({ data });
};