import prisma from "../../utils/client.js";

// Service untuk mengambil semua data cuti dengan paginasi
export const getAllLeavesService = async (page, limit) => {
    // Menghitung jumlah data yang akan dilewati (skip) untuk paginasi
    const skip = (page - 1) * limit;

    // Mengambil daftar data cuti dari database dengan status 'pending'
    const leaves = await prisma.tb_leave.findMany({
        skip,
        take: limit,
        include: {
            tb_users: {
                select: { fullname: true }
            }
        },
        orderBy: { created_at: "desc" },
        where: {
            status: "pending",
        },
    });

    
    const mappedLeaves = leaves.map(leave => ({
        ...leave,
        name: leave.tb_users.fullname
    }))
    // Menghitung total jumlah data cuti dengan status 'pending'
    const total = await prisma.tb_leave.count({
        where: {
            status: "pending",
        },
    });

    // Jika tidak ada data cuti yang ditemukan, kembalikan respons kosong
    if (mappedLeaves.length === 0) {
        return {
            data: {
                data: [],
                pagination: {
                    total: total,
                    totalPages: 0,
                    currentPage: page,
                    limit: limit,
                },
            },
        };
    }

    // Menghitung total jumlah halaman berdasarkan total data dan batas per halaman
    const totalPages = Math.ceil(total / limit);

    return {
        data: {
            data: mappedLeaves,
            pagination: {
                total: total,
                totalPages: totalPages,
                currentPage: page,
                limit: limit,
            },
        },
    };
};