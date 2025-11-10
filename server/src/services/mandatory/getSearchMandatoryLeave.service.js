import prisma from "../../utils/client.js";

// Service untuk mengambil semua data cuti mandatory (search).
export const getSearchMandatoryLeaveService = async (data, page = 1, limit = 10) => {
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
        // Query 1: Mengambil daftar cuti mandatory 
        prisma.tb_mandatory_leave.findMany({
            where,
            skip,
            take: limit,
            orderBy: { start_date: 'asc' },
        }),
        // Query 2: Menghitung total jumlah cuti mandatory
        prisma.tb_mandatory_leave.count({ where })
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