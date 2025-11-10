import fs from 'fs'
import { importFileServices } from "../../services/upload/importFile.service.js";
import { decodeToken } from '../../utils/jwt.js';
import path from 'path';

export const importFile = async (req, res, next) => {
  try {
    // data user yang melakukan proses inject
    const actor = await decodeToken(req.cookies["Authorization"])

    // path file yang diupload
    const filepath = path.resolve("src", "temp", req.file.originalname)

    // proses inject data ke database
    const process = await importFileServices(filepath, actor)
    
    // menghapus file agar tidak membebankan memory server setelah data berhasil di-inject 
    if (process) {
      fs.unlink(filepath, (err) => {
        if (err) {
          throw err
        }
      })

      res.json({
        success: true,
        data: {
          process
        }
      })
    }

  } catch (error) {
    // menghapus file agar tidak membebankan memory server jika terjadi kegagalan saat proses inject
    fs.unlink(path.resolve("src", "temp", req.file.originalname), (err) => {
      if (err) {
        next(error)
      }
    })
    
    next(error)
  }
}