import prisma from "../../utils/client.js";
import { createDateFromString } from "../../utils/leaves.utils.js";
import { getApiEmployee } from "../../utils/getApiEmployee.utils.js";

export const updateLeaveBalance = async () => {
  function formatDateLocal(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const today = new Date();
  const currentYear = today.getFullYear();

  // 🔹 Ambil semua data employee dari API (handle pagination)
  let page = 1;
  let limit = 10000;
  let hasMore = true;

  let employees = await prisma.tb_users.findMany({
    orderBy: { fullname: "asc" },
    include: { tb_roles: true, tb_statuses: true },
  });

  if (!employees.length) {
    console.error("[ERROR] Failed get employees data from API");
    return;
  }

  console.log(`👥 Total employees fetched: ${employees.length}`);

  // Counter untuk debugging
  let processedCount = 0;
  let skippedResign = 0;
  let skippedIntern = 0;
  let skippedNull = 0;
  let skippedNotEligible = 0;
  let skippedExisting = 0;
  let processed = 0;

  for (const emp of employees) {
    processedCount++;

    // 🔹 Mapping sesuai kebutuhan logic
    const user = {
      NIK: emp.NIK,
      join_date: emp.join_date,
      isActive: emp.isActive,
      tb_statuses: emp.tb_statuses || null,

      fullname: emp.fullname,
    };

    // Debug log untuk setiap employee
    console.log(
      `[DEBUG ${processedCount}/${employees.length}] NIK: ${
        user.NIK
      }, isActive: ${user.isActive}, status: ${
        user.tb_statuses?.name || "null"
      }`
    );

    const joinDate = new Date(user.join_date);
    const statusName = user.tb_statuses?.name || null;

    // Check isActive langsung tanpa function
    if (
      user.isActive === false ||
      user.isActive === "false" ||
      user.isActive === 0 ||
      user.isActive === "0"
    ) {
      console.log(
        `[SKIP] NIK: ${user.NIK} status: RESIGN (isActive: ${user.isActive})`
      );
      skippedResign++;
      continue;
    } else if (statusName === "Tetap") {
      const todayStr = formatDateLocal(today);
      const joinEffective = new Date(joinDate);
      if (joinDate.getDate() > 20) {
        joinEffective.setMonth(joinEffective.getMonth() + 1);
      }
      joinEffective.setDate(1);

      const eligibleDate = new Date(joinEffective);
      eligibleDate.setMonth(eligibleDate.getMonth() + 3);
      eligibleDate.setDate(1);

      const eligibleStr = formatDateLocal(eligibleDate);

      if (todayStr < eligibleStr) {
        console.log(
          `[SKIP] NIK: ${user.NIK} - not yet received leave rights (hari ini: ${todayStr}, eligible: ${eligibleStr})`
        );
        skippedNotEligible++;
        continue;
      }

      const adjustmentThisYear = await prisma.tb_balance_adjustment.findFirst({
        where: {
          NIK: user.NIK,
          actor: "system",
          balance_year: currentYear,
          NOT: {
            notes: {
              equals: "auto generate balance",
              mode: "insensitive",
            },
          },
        },
      });

      if (!adjustmentThisYear) {
        let leaveAmount = 12;

        const receiveDate = new Date();
        receiveDate.setHours(12, 0, 0, 0);

        const expiredDate = new Date(receiveDate);
        expiredDate.setFullYear(receiveDate.getFullYear() + 2, 3, 1);

        const existingBalance = await prisma.tb_balance.findFirst({
          where: {
            NIK: user.NIK,
            receive_date: {
              gte: new Date(currentYear, 0, 1, 0, 0, 0, 0),
              lte: new Date(currentYear, 11, 31, 23, 59, 59, 999),
            },
          },
        });

        if (existingBalance) {
          // update amount
          const resultBalance = await prisma.$transaction(async (tx) => {
            const newBalance = await tx.tb_balance.update({
              where: { id_balance: existingBalance.id_balance },
              data: {
                amount: existingBalance.amount + leaveAmount,
              },
            });

            const adjustmentLog = await tx.tb_balance_adjustment.create({
              data: {
                NIK: user.NIK,
                adjustment_value: leaveAmount,
                notes: `get ${leaveAmount} days of leave`,
                created_at: createDateFromString(new Date()),
                actor: "system",
                balance_year: currentYear,
                id_balance: newBalance.id_balance,
                fullname: user.fullname,
              },
            });

            return { newBalance, adjustmentLog };
          });

          console.log(
            `[Balance Updated] NIK: ${
              user.NIK
            }, added: ${leaveAmount}, total: ${
              existingBalance.amount + leaveAmount
            }`
          );
          processed++;
        } else {
          const resultBalance = await prisma.$transaction(async (tx) => {
            const newBalance = await tx.tb_balance.create({
              data: {
                NIK: user.NIK,
                amount: leaveAmount,
                receive_date: receiveDate,
                expired_date: expiredDate,
              },
            });

            const adjustmentLog = await tx.tb_balance_adjustment.create({
              data: {
                NIK: user.NIK,
                adjustment_value: leaveAmount,
                notes: `get ${leaveAmount} days of leave`,
                created_at: createDateFromString(new Date()),
                actor: "system",
                balance_year: currentYear,
                id_balance: newBalance.id_balance,
                fullname: user.fullname,
              },
            });

            return { newBalance, adjustmentLog };
          });

          console.log(
            `[Balance Created] NIK: ${user.NIK}, amount: ${leaveAmount}`
          );
          processed++;
        }
      } else {
        console.log(
          `[SKIP] NIK: ${user.NIK} - Balance for ${currentYear} already exists`
        );
        skippedExisting++;
      }
    } else if (statusName === "Kontrak") {
      // Hitung effective join date
      const joinEffective = new Date(joinDate);
      if (joinDate.getDate() > 20) {
        joinEffective.setMonth(joinEffective.getMonth() + 1);
      }
      joinEffective.setDate(1);

      const firstEligibleMonth = new Date(joinEffective);
      firstEligibleMonth.setMonth(firstEligibleMonth.getMonth() + 3);

      const startOfCurrentYear = new Date(`${currentYear}-01-01`);
      const effectiveStart =
        firstEligibleMonth > startOfCurrentYear
          ? firstEligibleMonth
          : startOfCurrentYear;

      // Hitung eligible months sampai bulan ini
      let eligibleMonths = 0;

      // Normalize dates untuk perbandingan yang akurat
      const todayNormalized = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const effectiveStartNormalized = new Date(
        effectiveStart.getFullYear(),
        effectiveStart.getMonth(),
        1
      );

      if (effectiveStartNormalized <= todayNormalized) {
        eligibleMonths =
          (todayNormalized.getFullYear() -
            effectiveStartNormalized.getFullYear()) *
            12 +
          (todayNormalized.getMonth() - effectiveStartNormalized.getMonth()) +
          1;
      }

      if (eligibleMonths >= 1) {
        // Hitung yang sudah diberikan untuk tahun ini (EXCLUDE backfill)
        const adjustmentsThisYear =
          await prisma.tb_balance_adjustment.aggregate({
            where: {
              NIK: user.NIK,
              actor: "system",
              balance_year: currentYear,
              notes: {
                not: { contains: "backfill" },
              },
            },
            _sum: {
              adjustment_value: true,
            },
          });

        const alreadyGivenThisYear =
          adjustmentsThisYear._sum.adjustment_value || 0;
        const toAdd = eligibleMonths - alreadyGivenThisYear;

        if (toAdd > 0) {
          const receiveDate = new Date();
          receiveDate.setHours(12, 0, 0, 0);

          const expiredDate = new Date(receiveDate);
          expiredDate.setFullYear(receiveDate.getFullYear() + 2, 3, 1);

          // Cari existing balance untuk tahun ini
          const existingBalance = await prisma.tb_balance.findFirst({
            where: {
              NIK: user.NIK,
              receive_date: {
                gte: startOfCurrentYear,
                lte: new Date(`${currentYear}-12-31T23:59:59`),
              },
            },
          });

          if (!existingBalance) {
            // Buat balance baru
            const resultBalance = await prisma.$transaction(async (tx) => {
              const newBalance = await tx.tb_balance.create({
                data: {
                  NIK: user.NIK,
                  amount: toAdd,
                  receive_date: receiveDate,
                  expired_date: expiredDate,
                },
              });

              const adjustmentLog = await tx.tb_balance_adjustment.create({
                data: {
                  NIK: user.NIK,
                  adjustment_value: toAdd,
                  notes: `get ${toAdd} days of leave`,
                  created_at: createDateFromString(new Date()),
                  actor: "system",
                  balance_year: currentYear,
                  id_balance: newBalance.id_balance,
                  fullname: user.fullname,
                },
              });

              return { newBalance, adjustmentLog };
            });

            console.log(`[Balance Created] NIK: ${user.NIK}, amount: ${toAdd}`);
            processed++;
          } else {
            // Update balance existing
            const resultBalance = await prisma.$transaction(async (tx) => {
              const newBalance = await tx.tb_balance.update({
                where: {
                  id_balance: existingBalance.id_balance,
                },
                data: {
                  amount: existingBalance.amount + toAdd,
                },
              });

              const adjustmentLog = await tx.tb_balance_adjustment.create({
                data: {
                  NIK: user.NIK,
                  adjustment_value: toAdd,
                  notes: `add ${toAdd} days of leave`,
                  created_at: createDateFromString(new Date()),
                  actor: "system",
                  balance_year: currentYear,
                  id_balance: newBalance.id_balance,
                  fullname: user.fullname,
                },
              });

              return { newBalance, adjustmentLog };
            });

            console.log(
              `[Balance Updated] NIK: ${user.NIK}, added: ${toAdd}, total: ${
                existingBalance.amount + toAdd
              }`
            );
            processed++;
          }
        } else {
          console.log(
            `[SKIP] NIK: ${user.NIK} - No additional balance needed (toAdd: ${toAdd})`
          );
          skippedExisting++;
        }
      } else {
        console.log(
          `[SKIP] NIK: ${user.NIK} - Not eligible yet (eligibleMonths: ${eligibleMonths})`
        );
        skippedNotEligible++;
      }
    } else if (statusName === "Magang") {
      console.log(`[SKIP] NIK: ${user.NIK} statuses Intern`);
      skippedIntern++;
    } else {
      console.log(`[SKIP] NIK: ${user.NIK} statuses ${statusName || "null"}`);
      skippedNull++;
    }
  }

  // Summary report
  console.log("\n=== SUMMARY ===");
  console.log(`Total Processed: ${processedCount}/${employees.length}`);
  console.log(`Resigned (isActive=false): ${skippedResign}`);
  console.log(`Intern: ${skippedIntern}`);
  console.log(`Null/Unknown Status: ${skippedNull}`);
  console.log(`Not Eligible Yet: ${skippedNotEligible}`);
  console.log(`Already Have Balance: ${skippedExisting}`);
  console.log(`Successfully Processed: ${processed}`);
};
