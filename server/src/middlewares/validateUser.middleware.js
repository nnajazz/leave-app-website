import { fetchUserData } from "../services/auth/fetchUserData.service.js";
import { decodeToken } from "../utils/jwt.js";

export const validateUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await fetchUserData("email", email.toLowerCase());

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    console.log(`email user : ${user.email}`);
    console.log(`password db user : ${user.password}`);
    console.log(`password input : ${password}`);

    // sementara pakai perbandingan langsung
    const match = user.password === password;
    console.log("Password match:", match);

    if (!match) {
      const error = new Error("Your email or password is incorrect.");
      error.statusCode = 400;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error("Account is no longer active.");
      error.statusCode = 401;
      throw error;
    }

    if (user.tb_statuses.name === "Magang") {
      const error = new Error("Your role does not have access to this system.");
      error.statusCode = 401;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};
