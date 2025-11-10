import prisma from "../../utils/client.js";
import { createDateFromString } from "../../utils/leaves.utils.js";

/**
 * fungsi ini digunakan untuk memodifikasi status pada data pengajuan cuti serta mengurangi atau menambahkan jatah cuti karyawan berdasarkan kondisi approval
 * @param {*} id 
 * @param {*} status 
 * @param {*} reason 
 * @param {*} nik 
 * @param {*} actor_fullname 
 * @returns data pengajuan cuti setelah dimodifikasi
 */
export const updateLeave = async (id, status, reason, nik, actor_fullname) => {
    try {
        // konfigurasi tanggal untuk validasi
        const currentDate = createDateFromString(new Date())
        const previousDateEndOfTheDay = createDateFromString(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1, 23, 59, 59))
        const currentYear = currentDate.getFullYear();
        const currentYearLastMonth = createDateFromString(new Date(currentYear, 11, 31, 23, 59, 59));

        // mengambil data pengajuan cuti berdasarkan id berserta dengan history perubahan cuti terbaru
        const data = await prisma.tb_leave.findUnique({
            where: {
                id_leave: id,
            },
            include: {
                tb_leave_log: {
                    take: 1,
                    orderBy: {
                        changed_at: "desc"
                    }
                }
            }
        });
        console.log(data)

        if (!data) {
            const err = new Error("Leave not found");
            err.statusCode = 404;
            throw err;
        }

        // validasi bahwa user tidak bisa memodifikasi pengajuan cutinya sendiri kecuali untuk cuti dengan tipe mandatory atau wajib.
        if (data.NIK === nik && data.leave_type !== "mandatory_leave") {
            const err = new Error("You cannot approve or reject your own leave request.");
            err.statusCode = 403;
            throw err;
        }

        // tanggal mulai dan berakhirnya cuti
        const start = data.start_date;
        const end = data.end_date;

        // approval pengajuan cuti selain cuti dengan tipe spesial hanya dapat dilakukan satu hari kedepan
        if (start <= currentDate && data.leave_type !== 'special_leave') {
            const err = new Error("The start date of the leave has passed the current date");
            err.statusCode = 400;
            throw err;
        } else if (start < previousDateEndOfTheDay && data.leave_type === 'special_leave') {
            const err = new Error("The start date of the leave has passed the current date");
            err.statusCode = 400;
            throw err;
        }

        if (data.status === status && data.leave_type !== "mandatory_leave") {
            const err = new Error("New status and old status can't be the same");
            err.statusCode = 400;
            throw err;
        }

        // memastikan apakah terdapat cuti di dalam jangka waktu tanggal yang sama dengan status kecuali rejected 
        const existing = await prisma.tb_leave.findFirst({
            where: {
                NIK: data.NIK,
                OR: [
                    {
                        start_date: { lte: end },
                        end_date: { gte: start },
                    },
                ],
                status: {
                    in: ["approved", "pending", "expired"]
                },
                NOT: {
                    id_leave: data.id_leave
                }
            },
        });


        /*
        Mengambil data jatah cuti karyawan yang belum expired (kecuali untuk pembatalan cuti setelah di approved)
        [0] = jatah cuti tahun ini
        [1] = jatah cuti tahun sebelumnya (jika ada)
        [2] = jatah cuti 2 tahun sebelumnya (jika ada)
        */
        const userBalance = await prisma.tb_balance.findMany({
            where: {
                NIK: data.NIK,
                expired_date: {
                    gt: status === "approved" ? start : undefined,
                },
                receive_date: {
                    lte: currentYearLastMonth
                }
            },
            take: 3,
            orderBy: {
                expired_date: "desc"
            }
        });


        let updatedBalances = [...userBalance];
        let balancesUsed = []; // array untuk semua balance yang digunakan (reduce)
        let historyBalancesUsed = []; // array untuk semua balance yang sebelumnya digunakan (restore)
        let totalDaysUsed = data.total_days;

        if (data.tb_leave_log.length !== 0) {
            historyBalancesUsed = data.tb_leave_log[0].balances_used
        }

        const isStartDateNextYear = currentYear < data.start_date.getFullYear();

        // sisa jatah cuti yang tersisa
        const totalAmountAvailable = updatedBalances.reduce((sum, current) => sum + current.amount, 0);

        //logic utama pengurangan dan penambahan balance sesuai kondisi kecuali tipe cuti special yang tidak mengurangi jatah cuti
        if (data.leave_type !== "special_leave") {
            /*
            reduce:
            pengurangan jatah cuti karyawan berdasarkan total_days pada data pengajuan cuti
            - pending -> approved
            - rejected -> approved
            */
            if ((data.status === "pending" || data.status === "rejected") && status === "approved") {

                // validasi jika amount pada balance cukup atau tidak dengan tipe cuti personal
                if ((isStartDateNextYear && totalDaysUsed > totalAmountAvailable) && data.leave_type === "personal_leave") {
                    const err = new Error(`Cannot approve leave for next year because total days ${totalDaysUsed} exceed current year\'s balance ${totalAmountAvailable}`);
                    err.statusCode = 400;
                    throw err;
                }

                // validasi jika amount pada balance cukup atau tidak dengan tipe cuti personal
                if (data.leave_type == "personal_leave" && totalDaysUsed > totalAmountAvailable) {
                    const error = new Error(`Insufficient leave balance, total balance available: ${totalAmountAvailable}`);
                    error.statusCode = 400;
                    throw error;
                }

                if (existing) {
                    const err = new Error("There's overlap leave");
                    err.statusCode = 400;
                    throw err;
                }

                /* 
                   array di fungsi ini disort dari yang paling lama
                   kemudian mengurangi amount setiap record balance 
                */
                function reduceAmount(balances, daysUsed) {
                    for (let i = 0; i < balances.length; i++) {
                        let tempDays = balances[i].amount
                        balances[i].amount -= daysUsed; // mengurangi amount

                        if (balances[i].amount < 0 && i !== balances.length - 1) { // cek jika amount balance negatif dan bukan balance tahun ini
                            daysUsed = -1 * balances[i].amount // untuk pengurangan iterasi selanjutnya
                            balances[i].amount = 0;
                        } else {
                            daysUsed = 0;
                        }

                        // menambahkan history record balance yang digunakan dengan struktur [id balance, tahun balance, amount yang digunakan]
                        balancesUsed.push([balances[i].id_balance, balances[i].receive_date.getFullYear(), tempDays - balances[i].amount]);
                    }

                    return balances
                }

                updatedBalances = reduceAmount(updatedBalances.reverse(), totalDaysUsed);
                console.log(updatedBalances)
            }

            /*
            restore:
            penambahan jatah cuti berdasarkan array historyBalancesUsed
            - approved -> rejected 
            */
            if (data.status === "approved" && status === "rejected") {
                const restoredBalance = updatedBalances;

                for (let i = 0; i < restoredBalance.length; i++) {
                    const balance = restoredBalance[i];
                    balance.amount += historyBalancesUsed.find((item) => item[0] === balance.id_balance)?.[2] ?? 0;
                }
            }
        }


        const balanceUpdates = userBalance.map((balance) =>
            prisma.tb_balance.update({
                where: { id_balance: balance.id_balance },
                data: { amount: balance.amount }
            })
        );

        // update data balance dan leave serta membuat record baru pada tb_leave_log
        const result = await prisma.$transaction([
            prisma.tb_leave.update({ where: { id_leave: id }, data: { status: status } }),
            ...balanceUpdates,
            prisma.tb_leave_log.create({
                data: {
                    old_status: data.status,
                    new_status: status,
                    reason: reason,
                    changed_by_nik: nik,
                    actor_fullname: actor_fullname,
                    id_leave: data.id_leave,
                    balances_used: balancesUsed.sort((a, b) => b[1] - a[1]) ?? []
                }
            })
        ])

        return result[0]
    } catch (error) {
        throw error;
    }
}