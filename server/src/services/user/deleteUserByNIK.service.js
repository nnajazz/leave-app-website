import prisma from "../../utils/client.js";
import { updateLeave } from "../leave/updateLeave.service.js";

export const deleteUserByNIK = async (user_nik,actor_nik) => {
  // Find the ID for the 'Resign' status

  const deletedUser = await prisma.tb_users.update({
    where: {
      NIK: user_nik,
      NOT: {
        isActive: false,
      },
    },
    data: {
      isActive: false, // Set is_active to false
    },
    include: {
      tb_roles: true,
      tb_statuses: true,
    },
  });

  const today = new Date();

  const leaves = await prisma.tb_leave.findMany({
    where: {
      NIK: user_nik,
      start_date: {
        gte: today,
      },
      status: {
        in: ["approved", "pending"],
      },
    },
  });

  const actor = await prisma.tb_users.findUnique({
    where: {
      NIK: actor_nik,
    },
  });

  for (const leave of leaves) {
    try {
        await updateLeave(
            leave.id_leave,
            "rejected",
            "User Resigned",
            actor.NIK,
            actor.fullname,
        );
    } catch (error) {
        console.error(error);
    }
  }

  return deletedUser;
};
