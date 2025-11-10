import prisma from "../../utils/client.js";
import { createDateFromString } from "../../utils/leaves.utils.js";

export const expiredLeave = async () => {
    // will works fine on production but not accurately in local when the timezone is not UTC
    // menyesuaikan dengan waktu server (UTC) dan cron yang dimulai pada jam 00:00 timezone jakarta
    const now = new Date()
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const yesterday = new Date(now)
    yesterday.setHours(23, 59, 59, 999)

    try {
        const pendingLeavesPersonalAndMandatory = await prisma.tb_leave.findMany({
            where: {
                status: 'pending',
                start_date: {
                    lte: todayDate
                },
                NOT: {
                    leave_type: 'special_leave'
                }
            }
        })

        const pendingLeavesSpecial = await prisma.tb_leave.findMany({
            where: {
                status: 'pending',
                start_date: {
                    lte: yesterday
                },
                leave_type: 'special_leave'
            } 
        })

        const pendingLeaves = pendingLeavesPersonalAndMandatory.concat(pendingLeavesSpecial)

        // console.log(endOfYesterday)
        console.log(todayDate)
        console.log(yesterday)
        // console.log(startOfTomorrow)
        console.log(pendingLeaves);


        if (pendingLeaves.length === 0) {
            console.log('[CRON] There is no pending leave that has passed its start date')
            return
        }

        const updateStatus = pendingLeaves.map((leave) =>
            prisma.tb_leave.update({
                where: { id_leave: leave.id_leave },
                data: { status: 'expired' }
            })
        )
        await Promise.all(updateStatus)
        console.log(`[CRON] ${updateStatus.length} leave data successfully changed to expired status`)

    } catch (error) {
        console.error('[CRON] Failed to update leave status to expired : ', error)
        throw error
    }
}

expiredLeave()