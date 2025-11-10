import jwt, { decode } from 'jsonwebtoken';
import { addToken } from '../services/auth/addToken.service.js';
import { deleteToken } from '../services/auth/deleteToken.service.js';
import { JWT_SECRET } from '../config/env.js';
import prisma from './client.js';

/**
 * fungsi ini digunakan untuk mengenerate JWT token baru yang kemudian akan dikirimkan kepada client sebagai cookies dan juga disimpan di dalam database untuk keamanan session
 * @param {*} payload - data yang akan dijadikan token
 * @param {*} deviceData - informasi mengenai device user
 * @param {*} expiresIn - jangka waktu token kadaluwarsa
 * @returns 
 */
export const generateToken = async (payload, deviceData, expiresIn = '24h') => {
    try {

        // generate token JWT baru
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn });

        // menambahkan record baru di database pada tb_jwt_token
        // penggunaan deviceId mencegah user untuk double login pada browser yang sama
        const newToken = await addToken(token, payload.NIK, deviceData.deviceInfo, deviceData.deviceId);


        if (!newToken) { // jika terjadi kegagalan saat input record ke database

            // cek apakah ada token yang lama berdasarkan nik dan deviceId
            const oldToken = await prisma.tb_jwt_token.findFirst({
                where: {
                    NIK: payload.NIK,
                    device_id: deviceData.deviceId
                }
            });

            // jika tidak ada maka coba kembali untuk menginput record baru
            if (!oldToken) {
                const overToken = await addToken(token, payload.NIK, deviceData.deviceInfo, deviceData.deviceId);
                return token;
            }

            // validasi token sudah kadaluwarsa, jika kadaluwarsa maka hapus token lama dan input token baru
            if (!await verifyToken(oldToken.access_token, oldToken.device_id)) {
                await prisma.$transaction(async (tx) => {
                    await deleteToken(oldToken.NIK, oldToken.device_id, tx);
                    await addToken(token, payload.NIK, deviceData.deviceInfo, deviceData.deviceId, tx);
                });
            } else {
                const error = new Error("User already logged in");
                error.statusCode = 400;
                throw error;
            }
        }

        return token;
    } catch (error) {
        throw error;
    }
}

/**
 * fungsi ini berguna untuk memeriksa apakah token dari cookies yang dikirim user valid atau tidak dan hanya mengembalikan true or false
 * @param {*} token - JWT token
 * @param {*} deviceId - device id yang disimpan pada cookies
 * @returns boolean
 */
export const verifyToken = async (token, deviceId) => {
    if (!token) return false;
    try {

        // cek apakah ada record token dan deviceId yang sama di database
        const oldToken = await prisma.tb_jwt_token.findFirst({
            where: {
                access_token: token,
                device_id: deviceId
            }
        });

        if (!oldToken) {
            return false;
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        return true;
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return false;
    }
};

/**
 * fungsi ini berguna hanya untuk mendecode token menjadi data yang dapat diakses tanpa cek ke dalam database
 * @param {*} token - JWT token
 * @returns 
 */
export const decodeToken = async (token) => {
    try {
        const decodeToken = jwt.verify(token, JWT_SECRET);

        return decodeToken;
    } catch (error) {
        throw error;
    }

}
