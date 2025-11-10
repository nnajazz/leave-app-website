import prisma from "../../utils/client.js";
import { createDateFromString } from "../../utils/leaves.utils.js";

export const getUserByNIK = async (nik) => {
    try {
        const currentDate = createDateFromString(new Date());
        const currentYear = currentDate.getFullYear();
        const firstOfYear = createDateFromString(new Date(currentYear, 0, 1));
        const endOfYear = createDateFromString(new Date(currentYear, 11, 31, 23, 59, 59));

        // Ambil data user + 3 balance terakhir
        const user = await prisma.tb_users.findUnique({
            where: { NIK: nik },
            select: {
                NIK: true,
                fullname: true,
                email: true,
                isMale: true,
                join_date: true,
                tb_roles: true,
                tb_statuses: true,
                tb_balance: {
                    take: 3,
                    orderBy: { expired_date: "desc" }
                },
            }
        });

        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            throw err;
        }

        const { tb_balance } = user;
        const getBalance = (year) => tb_balance.filter(b => b.receive_date.getFullYear() === year)?.[0]?.amount || 0;
        const currentBalance = getBalance(currentYear);
        const lastYearBalance = getBalance(currentYear - 1);
        const lastTwoYearBalance = getBalance(currentYear - 2);

        const totalAmount = currentDate > createDateFromString(new Date(currentYear, 3, 1))
            ? currentBalance + lastYearBalance
            : currentBalance + lastYearBalance + lastTwoYearBalance;

        // Pending request
        const pending_request = await prisma.tb_leave.count({
            where: {
                NIK: nik,
                status: "pending",
                leave_type: { in: ["personal_leave", "mandatory_leave"] },
                created_at: { lte: currentDate }
            }
        });

        // Approved request this year
        const approved_request = await prisma.tb_leave.aggregate({
            _sum: { total_days: true },
            where: {
                NIK: nik,
                status: "approved",
                leave_type: { in: ["personal_leave", "mandatory_leave"] },
                start_date: { gte: firstOfYear, lte: endOfYear }
            }
        });

        return {
            NIK: user.NIK,
            fullname: user.fullname,
            isMale: user.isMale,
            status: {
                id: user.tb_statuses.id,
                name: user.tb_statuses.name
            },
            role: {
                id: user.tb_roles.id,
                name: user.tb_roles.name,
                slug: user.tb_roles.slug
            },
            balance: {
                total_amount: totalAmount,
                current_amount: currentBalance,
                carried_amount: lastYearBalance,
                last_two_year_amount: lastTwoYearBalance,
                used_days: approved_request._sum.total_days || 0,
                pending_request
            }
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};
