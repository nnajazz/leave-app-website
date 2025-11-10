import prisma from "../../utils/client.js";

// Service untuk mengambil semua data cuti special (search).
export const getSearchSpecialLeaveService = async (data, page = 1, limit = 10) => {
    // Menghitung offset untuk query database berdasarkan halaman dan limit
    const skip = (page - 1) * limit;

    // Query dasar: filter berdasarkan title
    const where = {
        title: {
            contains: data,
            mode: 'insensitive'
        }
    };

    // Jalankan query secara paralel
    const [results, total] = await Promise.all([
        // Query 1: Mengambil daftar cuti special 
        prisma.tb_special_leave.findMany({
            where,
            skip,
            take: limit,
            orderBy: { title: 'asc' },
        }),
        // Query 2: Menghitung total jumlah cuti special
        prisma.tb_special_leave.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        data: {
            data: results,
            pagination: {
                total: total,
                totalPages: totalPages,
                currentPage: page,
                limit: limit
            }
        }
    };
};