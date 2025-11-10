import prisma from "../../utils/client.js";
import { getApiEmployee } from "../../utils/getApiEmployee.utils.js";
import {
  createDateFromString,
  formatDateIndonesia,
} from "../../utils/leaves.utils.js";

/**
 * fungsi ini mengembalikan semua data history modifikasi balance karyawan
 *
 * @param {*} page - halaman pagination
 * @param {*} limit - limit data yang dikembalikan
 * @param {*} startDate - filter data berdasarkan tanggal pada field created_at
 * @param {*} endDate - filter data berdasarkan tanggal pada field created_at
 * @param {*} balanceYear - filter data berdasarkan tahun pada field balance_year
 * @param {*} searchValue - fitur search yang mengarah pada 3 field yaitu, fullname, NIK dan actor
 * @returns
 */
export const getAllBalanceAdjustment = async (
  page,
  limit,
  startDate,
  endDate,
  balanceYear,
  searchValue
) => {
  try {
    const offset = (page - 1) * limit;

    // filter opsional yang dapat diterapkan, jika variable yang digunakan untuk memfilter data tidak diisi maka digantikan dengan undefined (dalam filtering prisma ini berarti diabaikan)
    const filter = {
      created_at: {
        gte: startDate || undefined,
        lte: endDate || undefined,
      },
      balance_year: balanceYear || undefined,
      OR: searchValue
        ? [
            {
              tb_users: {
                fullname: { contains: searchValue, mode: "insensitive" },
              },
            },
            { NIK: { contains: searchValue, mode: "insensitive" } },
            { actor: { contains: searchValue, mode: "insensitive" } },
          ]
        : undefined,
    };

    // total data untuk acuan pagination
    const totalLogs = await prisma.tb_balance_adjustment.count({
      where: filter,
    });

    // query seluruh data modifikasi balance di sort dari yang terbaru
    const logs = await prisma.tb_balance_adjustment.findMany({
      skip: offset,
      take: limit,
      where: filter,
      orderBy: {
        created_at: "desc",
      },
      include: {
        tb_users: true,
      },
    });

    // modifikasi format data untuk ditampilkan di client
    const logsModified = logs.map((log) => ({
      id: log.id_adjustment,
      NIK: log.NIK,
      name: log.tb_users.fullname,
      adjustment_value: log.adjustment_value,
      balance_year: log.balance_year.toString(),
      date: formatDateIndonesia(createDateFromString(log.created_at)),
      time: log.created_at
        .toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: undefined,
          timeZone: "Asia/Jakarta",
        })
        .replace(".", ":"),
      actor: log.actor,
      notes: log.notes,
    }));

    return {
      data: {
        data: logsModified,
        pagination: {
          total: totalLogs,
          totalPages: Math.ceil(totalLogs / limit),
          currentPage: page,
          limit: limit,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};
