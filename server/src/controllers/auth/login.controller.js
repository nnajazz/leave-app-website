import { toLowerCase } from "zod/v4";
import { status } from "../../../generated/prisma/index.js";
import { fetchUserData } from "../../services/auth/fetchUserData.service.js";
import { generateToken } from "../../utils/jwt.js";
import { getDeviceInfo } from "../../utils/UAParser.js";
import { v4 as uuidv4 } from "uuid";

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let deviceId = req.cookies["device-id"];
  if (!deviceId) {
    deviceId = uuidv4();
  }

  try {
    const user = await fetchUserData("email", email.toLowerCase());
    const deviceInfo = await getDeviceInfo(req.get("user-agent"));

    if (!user || password !== user.password) {
      const error = new Error("Your email or password is incorrect");
      error.statusCode = 404;
      throw error;
    }

    // Check user active status
    if (user.isActive === false) {
      const error = new Error(`Account is no longer active.`);
      error.statusCode = 403;
      throw error;
    }

    // Check for "Intern" role using slug
    if (toLowerCase(user.tb_statuses.name) === "magang") {
      const error = new Error(`Your role does not have access to this system.`);
      error.statusCode = 403;
      throw error;
    }

    const deviceInfoData = `${deviceInfo.browser.version}-${deviceInfo.browser.name}-${deviceInfo.os.name}`;

    const userData = {
      NIK: user.NIK,
      email: user.email,
      fullname: user.fullname,
      tb_roles: {
        id: user.tb_roles.id,
        name: user.tb_roles.name,
        slug: user.tb_roles.slug,
      },
      tb_statuses: {
        id: user.tb_statuses.id,
        name: user.tb_statuses.name,
      },
      isMale: user.isMale,
    };

    const deviceData = {
      deviceInfo: deviceInfoData,
      deviceId: deviceId,
    };

    const newToken = await generateToken(userData, deviceData);

    if (!newToken) {
      const error = new Error("login failed. please try again");
      error.statusCode = 400;
      throw error;
    }


    const authCookieOptions = {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "staging" ||
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 86400000),
    };

    res.cookie("Authorization", newToken, authCookieOptions);
    res.cookie("device-id", deviceId, authCookieOptions);

    res.status(200).json({
      success: true,
      message: `Welcome ${user.fullname}`,
      data: {
        nik: user.NIK,
        name: user.fullname,
        role: {
          id: user.tb_roles.id,
          name: user.tb_roles.name,
          slug: user.tb_roles.slug,
        },
        status: {
          id: user.tb_statuses.id,
          name: user.tb_statuses.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
