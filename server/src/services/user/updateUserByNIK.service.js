import prisma from "../../utils/client.js";

export const updateUserByNIK = async (nik, data) => {
  const requiredFields = [
    "fullname",
    "email",
    "password",
    "isMale",
    "join_date",
    "role_id",
    "status_id",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      const error = new Error(`${field} is required`);
      error.statusCode = 400;
      throw error;
    }
  }

  const updateData = {};

  if (data.fullname) updateData.fullname = data.fullname;
  if (data.email) updateData.email = data.email;
  if (data.password) updateData.password = data.password;
  if (data.isMale !== undefined) updateData.isMale = data.isMale;
  if (data.join_date) updateData.join_date = data.join_date;
  if (data.role_id) updateData.role_id = data.role_id;
  if (data.status_id) updateData.status_id = data.status_id;

  const updatedUser = await prisma.tb_users.update({
    where: {
      NIK: nik,
    },
    data: updateData,
    include: {
      tb_roles: true,
      tb_statuses: true,
    },
  });

  if (!updatedUser) {
    const error = new Error("user not found");
    error.statusCode = 404;
    throw error;
  }

  return updatedUser;
};
