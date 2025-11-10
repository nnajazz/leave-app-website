import prisma from "../../utils/client.js";

export const getLeavesByFilterService = async (type, value, page, limit) => {
    const where = {
        status: 'pending'
    };

    // Filter berdasarkan tipe cuti jika ada
    if (type) {
        const typeMapping = {
            personal_leave: 'personal_leave',
            mandatory_leave: 'mandatory_leave',
            special_leave: 'special_leave'
        };
        const mapped = typeMapping[type.toLowerCase()];
        if (!mapped) throw new Error('Invalid leave type');
        where.leave_type = mapped;
    }

    // Jika ada nilai pencarian (untuk nama)
    if (value) {
        where.fullname = {
            contains: value,
            mode: 'insensitive',
        };
    }

    const skip = (page - 1) * limit;

    // Menjalankan query untuk mengambil data cuti dan total hitungan secara paralel
    const [leaves, total] = await Promise.all([
        prisma.tb_leave.findMany({
            orderBy: { created_at: 'desc' },
            where,
            skip,
            take: limit,
        }),
        prisma.tb_leave.count({ where })
    ]);

    if (leaves.length === 0) {
        return {
            data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: page, limit: limit } }
        };
    }

    const totalPages = Math.ceil(total / limit);

    // Mengembalikan data yang sudah digabungkan beserta informasi paginasi
    return {
        data: {
            data: leaves,
            pagination: {
                total: total,
                totalPages: totalPages,
                currentPage: page,
                limit: limit
            }
        }
    };
};