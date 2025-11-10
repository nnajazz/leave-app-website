import { deleteToken } from "../../services/auth/deleteToken.service.js";
import { decodeToken } from "../../utils/jwt.js";

export const logout = async (req, res, next) => {
  try {
    const deviceId = req.cookies["device-id"];
    const token = req.cookies["Authorization"];

    if (!token) {
      // Kalau token kosong, tetap bersihkan cookie
      res.clearCookie("Authorization", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.clearCookie("device-id", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      return res.status(200).json({
        success: true,
        message: "Logged out (no token found).",
      });
    }

    // Coba decode token dengan aman
    let decode;
    try {
      decode = decodeToken(token);
    } catch (err) {
      console.warn("⚠️ Token invalid saat logout:", err.message);
    }

    if (decode?.NIK && deviceId) {
      await deleteToken(decode.NIK, deviceId);
    }

    // Bersihkan cookie dari browser
    res.clearCookie("Authorization", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    res.clearCookie("device-id", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "You have been successfully logged out.",
    });
  } catch (error) {
    next(error);
  }
};
