import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { deleteToken } from '../services/auth/deleteToken.service.js';
import { decodeToken, verifyToken } from '../utils/jwt.js';

/**
 * fungsi ini digunakan untuk memvalidasi sesi login user
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies["Authorization"];
    const deviceId = req.cookies['device-id'];
    
    try {

        if (!deviceId || !token) {
            throw new Error("Unauthorized. please login to access this resources.");
        }

        // memeriksa kadaluwarsa token
        const decodedToken = await decodeToken(token);

        // memeriksa token yang ada didatabase
        const isValid = await verifyToken(token, deviceId);

        req.user = decodedToken; 

        if (!decodedToken || !isValid) {
            throw new Error("Unauthorized. please login to access this resources.");
        }

        return next();
    } catch (error) {
        error.statusCode = 401
        if (error.name === "TokenExpiredError" && token) {
            await deleteToken(token, deviceId);
            error.cause = "Login session expired";
        }

        next(error)
    }
};
