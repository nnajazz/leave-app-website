import prisma from "../../utils/client.js";

export const leaveLeaderboard = (order = "desc") => {
  return prisma.tb_users.findMany({
    where: {
      tb_statuses: {
        name: { not: "Magang" }
      }
    },
    include: {
      tb_roles: true,
      tb_balance: true,
      tb_leave: { where: { status: "approved" } },
      tb_balance_adjustment: true
    }
  }).then(users => {
    const today = new Date();
    const currentYear = today.getFullYear();

    const leaderboard = users.map(user => {
      const joinDate = new Date(user.join_date);

      let effectiveJoin = new Date(joinDate);
      if (joinDate.getDate() > 20) effectiveJoin.setMonth(effectiveJoin.getMonth() + 1);
      effectiveJoin.setDate(1);

      let eligibleDate = new Date(effectiveJoin);
      eligibleDate.setMonth(effectiveJoin.getMonth() + 3);
      eligibleDate.setDate(1);

      if (today < eligibleDate) return null;

      const currentBalance = user.tb_balance.find(b => new Date(b.receive_date).getFullYear() === currentYear);
      const lastYearBalance = user.tb_balance.find(b => new Date(b.receive_date).getFullYear() === currentYear - 1);

      const thisYearAmount = currentBalance ? currentBalance.amount : 0;
      const lastYearAmount = lastYearBalance ? lastYearBalance.amount : 0;
      const totalBalance = thisYearAmount + lastYearAmount;

      let monthsSinceEligible = (today.getFullYear() - eligibleDate.getFullYear()) * 12 +
                                (today.getMonth() - eligibleDate.getMonth()) + 1;
      monthsSinceEligible = Math.max(monthsSinceEligible, 0);
      const monthsCount = Math.min(monthsSinceEligible, 24);

      const averageLeave = monthsCount > 0 ? Number((totalBalance / monthsCount).toFixed(2)) : 0;

      return {
        NIK: user.NIK,
        name: user.fullname,
        role: user.tb_roles?.slug ?? null,
        this_year: thisYearAmount,
        last_year: lastYearAmount,
        total_amount: totalBalance,
        average_leave: averageLeave
      };
    });

    const filteredLeaderboard = leaderboard.filter(u => u !== null);

    filteredLeaderboard.sort((a, b) => 
      order === "asc" ? a.average_leave - b.average_leave : b.average_leave - a.average_leave
    );

    return filteredLeaderboard;
  });
};
