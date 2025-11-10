import prisma from "../../utils/client.js";

// Service untuk mengambil semua data cuti special.
export const getSpecialLeaveServiceAdmin = async (page = 1, limit = 10) => {
    // Menghitung offset untuk query database berdasarkan halaman dan limit
    const skip = (page - 1) * limit;

    // Menjalankan dua query database secara paralel 
    const [data, total] = await Promise.all([
        // Query 1: Mengambil daftar cuti special 
        prisma.tb_special_leave.findMany({
            skip,
            take: limit,
            orderBy: { title: 'asc' }
        }),
        // Query 2: Menghitung total jumlah cuti special
        prisma.tb_special_leave.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        data: {
            data: data,
            pagination: {
                total: total,
                totalPages: totalPages,
                currentPage: page,
                limit: limit
            }
        }
    };
};