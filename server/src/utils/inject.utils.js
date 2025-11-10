import { v4 as uuid } from "uuid";
import { Prisma, status } from "../../generated/prisma/client.js";
import {
  balanceAdjustmentSchema,
  balanceSchema,
  importBalanceAdjustmentSchema,
  leaveLogSchema,
  leaveSchema,
  userSchema,
  validateInjectDataType,
} from "../validators/inject.validator.js";
import prisma from "./client.js";
import { adjustModifyAmount } from "../services/user-balance/adjustModifyAmount.service.js";
import { createDateFromString } from "./leaves.utils.js";
import { getApiEmployee } from "./getApiEmployee.utils.js";
import { allUsers } from "../controllers/user/allUsers.controller.js";
import { date, includes, lte } from "zod/v4";

/**
 * proses modifikasi data sesuai dengan target table (tabel tujuan) dan bulk insert ke dalam database
 *
 * @param {*} data - data per-chunk
 * @param {*} number - jumlah data yang telah diproses termasuk dengan data yang baru akan diproses
 * @param {*} tx - prisma transaction context
 * @param {*} CHUNK_BASE - total record per-chunk
 * @param {*} actor - data karyawan yang melakukan inject (didapat dari token)
 */
export const processData = async (data, number, tx, CHUNK_BASE, actor) => {
  let count = 0;
  let dataLeave = [];
  let dataLog = [];
  let dataBalance = [];
  let dataUser = [];
  let dataBalanceAdjustment = [];
  let dataBalanceAdjustmentCreated = [];

  try {
    // fecth semua data user dari API eksternal
    const allUsersData = await prisma.tb_users.findMany({
        include: {
            tb_statuses: true,
            tb_roles: true
        }
    });

    // memproses setiap data berdasarkan dengan target tabel
    for (const item of data) {
      const userData = allUsersData.find((user) => user.NIK === item.NIK);

      // validasi jika nik ada di database eksternal (data karyawan) untuk menghindari kekeliruan sistem nantinya
      if (!userData && item.target_table !== "user") {
        const error = new Error(
          `There is no user with NIK ${item.NIK} in the database.`
        );
        error.statusCode = 400;
        throw error;
      }

      item.fullname = userData.fullname || item.fullname;

      switch (item.target_table) {
        case "leave":
          const leaveData = modifyLeaveData(item);
          dataLeave.push(leaveData);

          if (item.status_leave_o !== "pending") {
            let leaveLogData = modifyLeaveLogData(
              item,
              leaveData,
              actor,
              allUsersData
            );
            dataLog.push(leaveLogData);
          }
          break;

        case "balance":
          const balanceData = await modifyBalanceData(item, tx);

          if (balanceData) {
            const balanceAdjustmentData = createBalanceAdjustmentData(
              item,
              balanceData
            );
            dataBalance.push(balanceData);
            dataBalanceAdjustmentCreated.push(balanceAdjustmentData);
          }

          break;

        case "user":
          const userData = await modifyUserData(item)
          dataUser.push(userData)
        //   console.log(
        //     'Data with target_table "user" was skipped because it is not needed.'
        //   );
          break;

        case "balance_adjustment":
          const balanceUdjestmentData = modifyBalanceAdjustmentData(item);
          dataBalanceAdjustment.push(balanceUdjestmentData);
          break;

        default:
          const error = new Error("Invalid target table value");
          error.statusCode = 400;
          throw error;
      }

      console.log(`LINES ${count}: `, item, "\n");
      count++;
    }

    // proses menginput data secara bersamaan (bulk insert)
    if (dataUser.length > 0) {
      await tx.tb_users.createMany({
        data: dataUser,
      });
    }

    if (dataLeave.length > 0) {
      await tx.tb_leave.createMany({
        data: dataLeave,
      });
    }

    if (dataLog.length > 0) {
      await tx.tb_leave_log.createMany({
        data: dataLog,
      });
    }

    if (dataBalance.length > 0) {
      await tx.tb_balance.createMany({
        data: dataBalance,
      });
    }

    if (dataBalanceAdjustment.length > 0) {
      await tx.tb_balance_adjustment.createMany({
        data: dataBalanceAdjustment,
      });
    }

    if (dataBalanceAdjustmentCreated.length > 0) {
      await tx.tb_balance_adjustment.createMany({
        data: dataBalanceAdjustmentCreated,
      });
    }

    console.log("TOTAL DATA RECEIVED: ", number);
  } catch (error) {
    error.statusCode = 400;

    let startLine = number - CHUNK_BASE < 0 ? 0 : number - CHUNK_BASE;
    let endLine = number + 1;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        error.message = "There's duplicate data in the database.";
      }
    }

    error.cause = {
      lines_between: `${startLine}-${endLine}`,
    };

    throw error;
  }
};

// validasi dan modifikasi data pengajuan cuti menyesuaikan dengan schema tb_leave
const modifyLeaveData = (data) => {
  try {
    const startDate = createDateFromString(new Date(data.start_date_leave));
    const endDate = createDateFromString(new Date(data.end_date_leave));

    console.log(data);
    const result = {
      id_leave: data.id || uuid(),
      title: data.title_leave,
      leave_type: data.type_leave,
      start_date: startDate,
      end_date: endDate,
      total_days: Number(data.total_days_leave),
      reason: data.reason_leave_o || data.title_leave,
      status: data.status_leave_o || "pending",
      created_at: new Date(),
      NIK: data.NIK,
      fullname: data.fullname,
    };

    validateInjectDataType(leaveSchema, result);

    return result;
  } catch (error) {
    throw error;
  }
};

// validasi dan modifikasi data perubahan terakhir cuti menyesuaikan dengan schema tb_leave_log
const modifyLeaveLogData = (data, leaveData, actor, usersData) => {
  try {
    const result = {
      id_leave: leaveData.id_leave,
      old_status: data.old_status_leave_log_o || "pending",
      new_status: data.status_leave_o,
      reason:
        data.reason_leave_log_o || "Added by injecting data into database",
      changed_by_nik: data.changed_by_nik_leave_log_o || actor.NIK,
      actor_fullname:
        usersData.find((user) => data.changed_by_nik_leave_log_o === user.NIK)
          ?.fullname || actor.fullname,
      changed_at: data.changed_at_leave_log_o
        ? createDateFromString(new Date(data.changed_at_leave_log_o))
        : new Date(),
      balances_used: [],
    };

    validateInjectDataType(leaveLogSchema, result);

    return result;
  } catch (error) {
    throw error;
  }
};

// validasi dan modifikasi data jatah cuti karyawan menyesuaikan dengan schema tb_balance
const modifyBalanceData = async (data, tx) => {
  try {
    const receive = createDateFromString(new Date(data.receive_date_balance));
    const expired = data.expired_date
      ? createDateFromString(new Date(data.expired_date_balance_o))
      : createDateFromString(
          new Date(receive.getFullYear() + 2, 3, 1, 0, 0, 0, 0)
        );

    const startOfYear = createDateFromString(
      new Date(receive.getFullYear(), 0, 1)
    );
    const endOfYear = createDateFromString(
      new Date(receive.getFullYear(), 11, 31, 23, 59, 59)
    );

    const existingBalance = await tx.tb_balance.findFirst({
      where: {
        NIK: data.NIK,
        receive_date: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
    });

    if (existingBalance) {
      const updatedBalance = await tx.tb_balance.update({
        where: {
          id_balance: existingBalance.id_balance,
        },
        data: {
          amount: Number(data.amount_balance),
        },
      });

      await tx.tb_balance_adjustment.create({
        data: {
          NIK: data.NIK,
          fullname: data.fullname,
          adjustment_value: updatedBalance.amount,
          actor: "system",
          notes: "updated balance from injecting data into database",
          balance_year: updatedBalance.receive_date.getFullYear(),
          id_balance: updatedBalance.id_balance,
        },
      });

      return;
    }

    const result = {
      id_balance: data.id || uuid(),
      amount: Number(data.amount_balance),
      receive_date: receive,
      expired_date: expired,
      NIK: data.NIK,
    };

    validateInjectDataType(balanceSchema, result);

    return result;
  } catch (error) {
    throw error;
  }
};

/**
 *  validasi dan modifikasi data karyawan menyesuaikan dengan schema tb_users
 *  @deprecated fungsi ini tidak digunakan jika aplikasi telah dihubungkan dengan API eksternal (data karyawan)
 */
const modifyUserData = async (data) => {
  try {
    const isMale = data.gender_user === "male";
    const isActive = data.status_active_user === "active";

    const role = await prisma.tb_roles.findFirst({
      where: {
        slug: {
          contains: data.role_user,
          mode: "insensitive",
        },
      },
    });

    if (!role) {
      const error = new Error("Value for column role_user is invalid");
      error.statusCode = 400;
      throw error;
    }

    const employee_status = await prisma.tb_statuses.findFirst({
      where: {
        name: {
          contains: data.employee_status_user,
          mode: "insensitive",
        },
      },
    });

    if (!employee_status) {
      const error = new Error("Value for column role_user is invalid");
      error.statusCode = 400;
      throw error;
    }

    const result = {
      NIK: data.NIK,
      fullname: data.fullname_user,
      email: data.email_user,
      password: data.password_user,
      isMale: isMale,
      role_id: role.id,
      status_id: employee_status.id,
      isActive: isActive,
      join_date: createDateFromString(new Date(data.join_date_user)),
    };

    validateInjectDataType(userSchema, result);

    console.log(result);

    return result;
  } catch (error) {
    throw error;
  }
};

// validasi dan modifikasi data modfikasi balance menyesuaikan dengan schema tb_balance_adjustment
const modifyBalanceAdjustmentData = (data) => {
  try {
    const created_at = data.created_at_balance_adjustment_o
      ? new Date(data.created_at_balance_adjustment_o)
      : new Date();

    const result = {
      id_adjustment: data.id || uuid(),
      NIK: data.NIK,
      fullname: data.fullname,
      adjustment_value: Number(data.value_balance_adjustment),
      notes: data.notes_balance_adjustment,
      actor: data.actor_balance_adjustment,
      balance_year: Number(data.balance_year_balance_adjustment),
      created_at: created_at,
      id_balance: data.id_balance_balance_adjustment_o || undefined,
    };

    validateInjectDataType(balanceAdjustmentSchema, result);

    return result;
  } catch (error) {
    throw error;
  }
};

// membuat data modfikasi balance baru untuk setiap record balance yang di input agar tidak terjadi duplikasi pada penambahan amount otomatis (cron auto add amount)
const createBalanceAdjustmentData = (data, balanceData) => {
  try {
    console.log(data);
    const balance_year = balanceData.receive_date.getFullYear();
    const result = {
      id_adjustment: uuid(),
      NIK: balanceData.NIK,
      fullname: data.fullname,
      adjustment_value: balanceData.amount,
      notes: "Added by injecting data balance into database",
      actor: "system",
      balance_year: balance_year,
      created_at: new Date(),
      id_balance: balanceData.id_balance,
    };

    validateInjectDataType(balanceAdjustmentSchema, result);

    return result;
  } catch (error) {
    throw error;
  }
};

export const processDataImportBalanceAdjustment = async (
  data,
  chunkCount,
  tx,
  CHUNK_BASE,
  actor
) => {
  let count = 0;

  // memetakan input balance_year agar menyesuaikan dengan fungsi adjustBalanceData
  const balance_year = {
    current: "this_year_leave",
    last_year: "last_year_leave",
    last_two_year: "last_two_year",
  };

  try {
    // fetch seluruh data user dari API eksternal
    const allUsersData = await prisma.tb_users.findMany({
        include: {
            tb_statuses: true,
            tb_roles: true
        }
    });

    for (const item of data) {
      count++;

      // mencocokkan data user untuk setiap data yang di input
      const userData = allUsersData.find((user) => user.NIK === item.NIK);

      // validasi jika nik ada di database eksternal (data karyawan) untuk menghindari kekeliruan sistem nantinya
      if (!userData) {
        const error = new Error(
          `There is no user with NIK ${item.NIK} in the database.`
        );
        error.statusCode = 400;
        throw error;
      }

      const modifiedData = {
        NIK: item.NIK,
        fullname: userData.fullname,
        amount: Number(item.amount),
        notes: item.notes,
        leave_balances: item.leave_balances,
      };

      validateInjectDataType(importBalanceAdjustmentSchema, modifiedData);

      // operasi disesuaikan dengan amount yang di-input
      const operation =
        modifiedData.amount >= 0 ? "add_amount" : "reduce_amount";

      // amount kemudian diubah menjadi bilangan positif untuk menyesuaikan dengan logic pada fungsi adjustModifyAmount
      modifiedData.amount =
        modifiedData.amount >= 0
          ? modifiedData.amount
          : Math.abs(modifiedData.amount);

      // proses modifikasi balance
      const result = await AdjustBalanceData(
        modifiedData.NIK,
        modifiedData.fullname,
        modifiedData.amount,
        modifiedData.notes,
        actor,
        userData.role.slug,
        balance_year[modifiedData.leave_balances],
        operation,
        tx
      );
    }

    console.log(
      "Balance Adjustment data imported successfully. \nTotal data received: ",
      chunkCount
    );
  } catch (error) {
    const errorLine =
      chunkCount <= CHUNK_BASE ? count : chunkCount - CHUNK_BASE + count + 1;

    error.statusCode = 400;
    error.cause = error.message;
    error.message = `An error occurred in the data input on CSV file at line ${errorLine}`;

    throw error;
  }
};

/**
 * fungsi ini diambil dari file adjustModifyAmount.services.js namun prisma transaction context (tx berasal dari importBalanceAdjustment.services.js)
 * diubah agar dapat menerapkan prinsip all or nothing pada saat menggunakan fitur inject balance adjustment
 * */
const AdjustBalanceData = async (
  nik,
  fullname,
  adjustment_value,
  notes,
  actor,
  targetRole,
  leave_type,
  operation,
  tx
) => {
  try {
    if (
      !leave_type ||
      !["this_year_leave", "last_year_leave", "last_two_year"].includes(
        leave_type
      )
    ) {
      throw new Error(
        "Parameter 'leave_type' harus 'this_year_leave' | 'last_year_leave' | 'last_two_year'"
      );
    }
    if (
      !operation ||
      (operation !== "add_amount" && operation !== "reduce_amount")
    ) {
      throw new Error(
        "Parameter 'operation' harus 'add_amount' atau 'reduce_amount'"
      );
    }
    if (actor?.NIK === nik) {
      throw new Error("You are not allowed to add your own leave balance");
    }
    if (targetRole === "magang") {
      throw new Error("Cannot adjust leave balance for intern");
    }

    const currentYear = new Date().getFullYear();
    const today = new Date();
    const targetYear =
      leave_type === "last_year_leave"
        ? currentYear - 1
        : leave_type === "last_two_year"
        ? currentYear - 2
        : currentYear;

    let balance;
    const startOfYear = new Date(`${targetYear}-01-01`);
    const endOfYear = new Date(`${targetYear}-12-31`);
    balance = await tx.tb_balance.findFirst({
      where: {
        NIK: nik,
        receive_date: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
    });

    console.log(balance);

    if (leave_type === "last_two_year") {
      if (!balance) {
        throw new Error(`There is no balance for ${targetYear}`);
      }
      if (balance.expired_date <= today) {
        throw new Error(
          `Balance ${targetYear} has expired, cannot be adjusted`
        );
      }
    }

    if (!balance) {
      const newBalanceData = {
        NIK: nik,
        amount:
          operation === "reduce_amount"
            ? -Math.abs(adjustment_value)
            : adjustment_value,
        receive_date: new Date(`${targetYear}-01-01`),
        expired_date: new Date(`${targetYear + 2}-04-01`),
      };

      const newBalance = tx.tb_balance.create({ data: newBalanceData });
      const adjustmentLog = tx.tb_balance_adjustment.create({
        data: {
          adjustment_value:
            operation === "reduce_amount"
              ? -Math.abs(adjustment_value)
              : adjustment_value,
          notes,
          actor: actor.name,
          NIK: nik,
          fullname: fullname,
          created_at: createDateFromString(new Date()),
          id_balance: balance.id_balance,
          balance_year: balance.receive_date.getFullYear(),
        },
      });
      return [newBalance, adjustmentLog];
    }

    await tx.tb_balance.update({
      where: { id_balance: balance.id_balance },
      data: {
        amount:
          operation === "add_amount"
            ? { increment: adjustment_value }
            : { decrement: adjustment_value },
      },
    });

    await tx.tb_balance_adjustment.create({
      data: {
        adjustment_value:
          operation === "reduce_amount"
            ? -Math.abs(adjustment_value)
            : adjustment_value,
        notes,
        actor: actor.name,
        fullname: fullname,
        NIK: nik,
        created_at: createDateFromString(new Date()),
        id_balance: balance.id_balance,
        balance_year: balance.receive_date.getFullYear(),
      },
    });
  } catch (error) {
    throw error;
  }
};
