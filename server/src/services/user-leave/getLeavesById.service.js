import prisma from "../../utils/client.js";

//  Mengambil data cuti spesifik berdasarkan ID cuti dan NIK pengguna.
export const getLeavesById = async (NIK, id_leave) => {
    //  mencari data di tabel tb_leave
    return await prisma.tb_leave.findMany({
        where: {
            id_leave: id_leave,
            NIK
        }
    })
}