import { getUserByNIK } from "../../services/user/getUserByNIK.service.js";
import { decodeToken } from "../../utils/jwt.js";

/**
 *  fungsi ini mengembalikan data user beserta sisa jatah cutinya berdasarkan nik
 *  yang ada pada token jwt.
 */
export const getUserMe = async (req, res, next) => {
    try {
        const decodedToken = await decodeToken(req.cookies["Authorization"]);
        const { NIK } = decodedToken;

        const user = await getUserByNIK(NIK);

        res.status(200).json({
            success: true,
            message: `Data retrieve successfully`,
            user_data: user
        });
    } catch (error) {
        next(error);
    }
}