import prisma from "../../utils/client.js";

// Service untuk mendapatkan data cuti (leave) berdasarkan filter
export const getLeavesByFilterService = async (NIK, type, status, value, page, limit) => {
    // Konversi page & limit menjadi number dan hitung offset (skip) untuk pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Query dasar: filter berdasarkan NIK karyawan
    const whereClause = {
        NIK,
    };

    // Jika ada filter type
    if (type) {
        // Mapping type dari request ke nama kolom di database
        const typeMapping = {
            personal: 'personal_leave',
            mandatory: 'mandatory_leave',
            special: 'special_leave'
        };

        // Validasi: jika type tidak valid, lempar error
        const mappedType = typeMapping[type.toLowerCase()];
        if (!mappedType) {
            throw new Error('Invalid leave type. Allowed: personal, mandatory, special');
        }

        // Tambahkan filter type ke whereClause
        whereClause.leave_type = mappedType;
    }

    // Jika ada filter status
    if (status) {
        const allowedStatus = ['pending', 'approved', 'rejected'];
        const lowerStatus = status.toLowerCase();

        // Validasi: hanya boleh status tertentu
        if (!allowedStatus.includes(lowerStatus)) {
            throw new Error('Invalid leave status. Allowed: pending, approved, rejected');
        }

        // Tambahkan filter status ke whereClause
        whereClause.status = lowerStatus;
    }

    // Jika ada pencarian berdasarkan title cuti
    if (value) {
        // Cari data dengan title yang mengandung "value", tidak case-sensitive
        whereClause.OR = [
            {
                title: {
                    contains: value,
                    mode: 'insensitive',
                },
            },
        ];
    }

    // Jalankan query secara paralel
    const [data, total] = await Promise.all([
        prisma.tb_leave.findMany({
            skip,
            take: limitNum,
            where: whereClause,
            orderBy: { created_at: 'desc' },
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
        prisma.tb_leave.count({ where: whereClause }),
    ]);

    // Transformasi data untuk response
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
                totalPages: Math.ceil(total / limitNum),
                currentPage: pageNum,
                limit: limitNum
            }
        }
    };
};