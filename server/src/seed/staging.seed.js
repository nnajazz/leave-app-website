import prisma from "../utils/client.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { createDateFromString } from "../utils/leaves.utils.js";
import { getApiEmployee } from "../utils/getApiEmployee.utils.js";

async function manualSeed() {

  await prisma.$transaction(async (tx) => {
    await tx.tb_leave_log.deleteMany();
    await tx.tb_leave.deleteMany();
    await tx.tb_balance_adjustment.deleteMany();
    await tx.tb_balance.deleteMany();
    await tx.tb_jwt_token.deleteMany();
    await tx.tb_special_leave.deleteMany();
    await tx.tb_mandatory_leave.deleteMany();
    await tx.tb_settings.deleteMany();

    // Seed Settings
    await tx.tb_settings.create({
      data: {
        light_image: `http://${process.env.HOSTNAME}:${process.env.PORT}/uploads/dark.svg`,
        light_background: "#FFFFFF",
        light_foreground: "#191B21",
        light_card: "#dbeafe",
        light_cardForeground: "#193cb8",
        light_primary: "#dbeafe",
        light_primaryForeground: "#191B21",
        light_secondary: "#155dfc",
        light_secondaryForeground: "#FFFFFF",
        dark_image: `http://${process.env.HOSTNAME}:${process.env.PORT}/uploads/light.svg`,
        dark_background: "#191B21",
        dark_foreground: "#FFFFFF",
        dark_card: "#212838",
        dark_cardForeground: "#FFFFFF",
        dark_primary: "#212838",
        dark_primaryForeground: "#dbeafe",
        dark_secondary: "#155dfc",
        dark_secondaryForeground: "#191B21",
      },
    });
  });
}

manualSeed()
  .then(() => {
    console.log("✅ Seed selesai.");
    return prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Seed gagal:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
