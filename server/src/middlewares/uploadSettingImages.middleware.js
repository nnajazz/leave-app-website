import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

// Tentukan folder untuk menyimpan file upload
const uploadDir = path.join(process.cwd(), 'uploads')

// Jika folder belum ada, buat folder uploads secara rekursif
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Konfigurasi penyimpanan multer (pakai diskStorage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Tentukan lokasi penyimpanan file
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        // Ambil ekstensi file asli
        const ext = path.extname(file.originalname)
        // Buat nama file unik dengan UUID + ekstensi asli
        const uniqueName = `${uuidv4()}${ext}`
        cb(null, uniqueName)
    }
})

// Filter file yang boleh diupload
const fileFilter = (req, file, cb) => {
    // Hanya izinkan jenis gambar tertentu
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true) 
    } else {
        cb(new Error('Only image files are allowed'), false) 
    }
}

// Buat instance multer dengan konfigurasi storage & filter
const upload = multer({ storage, fileFilter })

// Middleware untuk upload gambar setting
// Hanya menerima 2 field: light_image & dark_image (masing-masing max 1 file)
export const uploadSettingImages = upload.fields([
    { name: 'light_image', maxCount: 1 },
    { name: 'dark_image', maxCount: 1 }
])