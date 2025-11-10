import { exportFileServices } from "../../services/upload/exportFile.service.js";

/**
 * fungsi ini mengembalikan sebuah file CSV berisikan data yang ada pada database sesuai dengan query paramater target.
 * 
 * IMPORTANT: fitur ini tidak diterapkan pada website pengajuan cuti.
 * 
 * @param {*} req - target: tabel tujuan yang datanya akan di-export
 * @param {*} res 
 * @param {*} next 
 */
export const exportFile = async (req, res, next) => {
  try {
    const target = req.query.target  

    const result = await exportFileServices(target);

    res.download('./src/temp/result.csv');
  } catch (error) {
    next(error)
  }
}