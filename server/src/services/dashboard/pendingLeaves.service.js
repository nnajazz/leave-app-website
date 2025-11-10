import prisma from "../../utils/client.js";

// helper: ambil semua data employees sampai habis (pagination)

export const pendingLeaves = async () => {
  // ambil data leave dari DB
  const leaves = await prisma.tb_leave.findMany({
    where: { status: "pending" },
    orderBy: { start_date: "asc" },
    include: {
      tb_users: {
        select: {
          fullname: true,
          NIK: true,
          tb_roles: true,
        },
      },
    },
  });



  // format hasil
  const formatted = leaves.map((leave) => {
    const user = userMap.get(leave.NIK);
    return {
      NIK: leave.tb_users.NIK,
      name: leave.tb_users.fullname,
      role: user ? user.role?.slug : null,
      type: leave.leave_type.replace(/_/g, " "),
      start_date: leave.start_date,
      end_date: leave.end_date,
      duration: `${leave.total_days} days`,
      status: leave.status,
    };
  });

  // hitung unique NIK pending
  const totalPending = new Set(formatted.map((f) => f.NIK));

  return {
    total_employee: totalPending.size,
    data: formatted,
  };
};
