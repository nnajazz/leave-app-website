import path from "path";
import { importBalanceAdjustmentServices } from "../../services/upload/importBalanceAdjustment.services.js";
import { decodeToken } from "../../utils/jwt.js"
import fs from 'fs'

export const importBalanceAdjustment = async (req, res, next) => {
    try {
        // data user yang melakukan proses inject
        const decodedToken = await decodeToken(req.cookies["Authorization"]);
        const actor = {
            nik: decodedToken.nik,
            role: decodedToken.role.slug,
            name: decodedToken.namaLengkap
        };

        // path file yang diupload
        const filepath = path.resolve("src", "temp", req.file.originalname)

        // proses inject data ke database
        const process = await importBalanceAdjustmentServices(filepath, actor)

         // menghapus file agar tidak membebankan memory server setelah data berhasil di-inject 
        if (process) {
            fs.unlink(filepath, (err) => {
                if (err) {
                    throw err
                }
            })

            res.json({
                success: true,
                message: "Balance Adjustment data imported successfully.",
                data: {
                    process
                }
            })
        }
    } catch (error) {
        // menghapus file agar tidak membebankan memory server jika terjadi kegagalan saat proses inject
        fs.unlink(path.resolve("src", "temp", req.file.originalname), (error) => {
            if (error) {
                next(error)
            }
        })

        next(error)
    }
}