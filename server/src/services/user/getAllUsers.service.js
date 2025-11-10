import prisma from "../../utils/client.js";

/**
 * Ambil semua user beserta leave balance
 * @param {number} page 
 * @param {number} limit 
 * @param {string} search 
 * @param {boolean} isMale 
 * @param {string} statusName 
 * @param {string} roleSlug 
 * @param {boolean} isActive 
 * @returns {object} data dan pagination
 */
export const getAllUsers = async (
    page = 1,
    limit = 100,
    search = '',
    isMale,
    statusName = '',
    roleSlug = '',
    isActive
) => {
    try {
        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 1;
        const lastTwoYear = currentYear - 2;

        // =======================
        // Build filter condition
        // =======================
        const filterCondition = {
            AND: [
                {
                    OR: [
                        { fullname: { contains: search, mode: 'insensitive' } },
                        { NIK: { contains: search, mode: 'insensitive' } },
                    ]
                },
                ...(isMale !== undefined ? [{ isMale }] : []),
                ...(statusName ? [{ tb_statuses: { name: statusName } }] : []),
                ...(roleSlug ? [{ tb_roles: { slug: roleSlug } }] : []),
                ...(isActive !== undefined ? [{ isActive }] : []),
            ],
            NOT: {
                tb_statuses: { name: "Magang" }
            }
        };

        // =======================
        // Total user count
        // =======================
        const totalUsers = await prisma.tb_users.count({
            where: filterCondition
        });

        // =======================
        // Fetch users
        // =======================
        const users = await prisma.tb_users.findMany({
            where: filterCondition,
            orderBy: { fullname: 'asc' },
            include: {
                tb_roles: true,
                tb_statuses: true
            },
            skip: (page - 1) * limit,
            take: limit
        });

        // =======================
        // Fetch leave balance
        // =======================
        const leaveBalances = await prisma.tb_balance.findMany({
            where: { expired_date: { gte: new Date() } },
            orderBy: { expired_date: "desc" }
        });

        // =======================
        // Map user data + leave
        // =======================
        const result = users.map(user => {
            const userLeave = leaveBalances.filter(b => b.NIK === user.NIK);

            const getAmountByYear = (year) => userLeave
                .filter(b => b.receive_date.getFullYear() === year)
                .reduce((sum, b) => sum + b.amount, 0);

            const current = getAmountByYear(currentYear);
            const last = getAmountByYear(lastYear);
            const lastTwo = getAmountByYear(lastTwoYear);

            return {
                nik: user.NIK,
                fullname: user.fullname,
                emailKantor: user.email,
                tanggalMasukKerja: user.join_date,
                isActive: user.isActive,
                isMale: user.isMale,
                role: { id: user.tb_roles.id, name: user.tb_roles.name },
                status: { id: user.tb_statuses.id, name: user.tb_statuses.name },
                last_two_year_leave: lastTwo,
                last_year_leave: last,
                this_year_leave: current,
                leave_total: current + last + lastTwo
            };
        });

        const totalPages = Math.ceil(totalUsers / limit);

        return {
            data: {
                data: result,
                pagination: {
                    total: totalUsers,
                    totalPages,
                    currentPage: page,
                    limit
                }
            }
        };
    } catch (error) {
        console.error("Error getAllUsers:", error.message);
        throw error;
    }
};
