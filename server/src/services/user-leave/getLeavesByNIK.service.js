import prisma from "../../utils/client.js";

// Mengambil daftar data cuti berdasarkan NIK pengguna dengan paginasi.
export const getLeavesByNIK = async (nik, page, limit) => {
    // Menghitung jumlah data yang akan dilewati (skip) berdasarkan halaman saat ini
    const skip = (page - 1) * limit;

    // Menjalankan beberapa promise secara paralel
    const [data, total] = await Promise.all([
        // 1. Mengambil data cuti (tb_leave) dengan log
        prisma.tb_leave.findMany({
            skip,
            take: limit,
            where: { NIK: nik },
            include: {
                tb_leave_log: {
                    orderBy: { changed_at: 'desc' },
                    take: 1,
                    select: {
                        reason: true,
                        changed_by_nik: true,
                        actor_fullname: true
                    }
                }
            }
        }),
        // 2. Menghitung total jumlah data cuti untuk NIK yang sama
        prisma.tb_leave.count({ where: { NIK: nik } }),
    ]);

    // Mentransformasi data cuti untuk menyesuaikan format respons
    const transformedData = data.map((item) => {
        const log = item.tb_leave_log[0];

        delete item.tb_leave_log
        
        return {
            ...item,
            leave_log: log
                ? {
                    reason: log.reason,
                    fullname: log.actor_fullname ? log.actor_fullname : "-"
                }
                : {
                    reason: "-",
                    fullname: "-"
                }
        };
    });

    return {
        data: {
            data: transformedData,
            pagination: {
                total: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit: limit
            }
        }
    };
};