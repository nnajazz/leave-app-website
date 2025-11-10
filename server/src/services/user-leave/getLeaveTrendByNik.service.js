import prisma from "../../utils/client.js";
import { getApiEmployee } from "../../utils/getApiEmployee.utils.js";

export const getLeaveTrendByNik = async (nik) => {
  // 🔹 Ambil user dari API
  const employee = await prisma.tb_users.findUnique({
        where: { NIK: nik },
        select: { join_date: true }

    })

  if (!employee) {
    return {
      message: `Employee not found`,
      trend: {},
    };
  }

  // 🔹 Ambil tanggal masuk kerja dari API
  const joinDate = new Date(employee.tanggalMasukKerja);
  const joinYear = joinDate.getFullYear();
  const currentYear = new Date().getFullYear();

  // 🔹 Ambil data cuti dari DB
  const leaves = await prisma.tb_leave.findMany({
    where: {
      NIK: nik,
      status: "approved",
      start_date: {
        gte: joinDate,
      },
    },
    orderBy: {
      start_date: "asc",
    },
  });

  if (leaves.length === 0) {
    return {
      message: `There is no leave data for NIK ${nik} since joining in ${joinYear}`,
      trend: {},
    };
  }

  // 🔹 Siapkan struktur trend per tahun
  const trend = {};
  for (let year = joinYear; year <= currentYear; year++) {
    trend[year] = {
      mandatory_leave: 0,
      special_leave: 0,
      personal_leave: 0,
    };
  }

  // 🔹 Hitung leave per tahun
  leaves.forEach((leave) => {
    const year = leave.start_date.getFullYear();
    // normalisasi: lowercase + spasi jadi underscore
    const leaveType = leave.leave_type?.toLowerCase().replace(/\s+/g, "_");

    if (!(leaveType in trend[year])) {
      throw new Error(`Unknown leave type ${leaveType}`);
    }

    trend[year][leaveType] += 1;
  });

  return {
    message: `Successfully get leave data trends for NIK ${nik}`,
    employee: {
      nik: employee.nik,
      namaLengkap: employee.namaLengkap,
      emailKantor: employee.emailKantor,
      status: employee.status?.name,
      role: employee.role?.name,
      join_date: employee.tanggalMasukKerja,
    },
    trend,
  };
};
