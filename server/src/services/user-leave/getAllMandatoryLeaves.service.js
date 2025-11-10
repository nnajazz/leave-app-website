import prisma from "../../utils/client.js";
import { createDateFromString, formatDateIndonesia } from '../../utils/leaves.utils.js';
import { decodeToken } from "../../utils/jwt.js";
import { leave_type } from "../../../generated/prisma/index.js";

// Service untuk mengambil semua data cuti wajib yang aktif dan akan datang.
export const getAllMandatoryLeavesService = async (page = 1, limit = 10, req) => {
    // Menghitung offset untuk query database berdasarkan halaman dan limit
    const skip = (page - 1) * limit;

    // Mendekode token dari cookie untuk mendapatkan nik pengguna
    const decoded = await decodeToken(req.cookies["Authorization"]);
    const userNIK = decoded.nik;
    // Mendapatkan tanggal hari ini untuk filter query
    const today = new Date()

    // Menjalankan dua query database secara paralel 
    const [rawData, total] = await Promise.all([
        // Query 1: Mengambil daftar cuti wajib yang aktif dan belum berakhir
        prisma.tb_mandatory_leave.findMany({
            skip,
            take: limit,
            orderBy: { start_date: 'asc' }, 
            where: {
                is_active: true, 
                end_date: {
                    gte: today 
                }
            }
        }),
        // Query 2: Menghitung total jumlah cuti wajib yang memenuhi kriteria
        prisma.tb_mandatory_leave.count({
            where: {
                is_active: true,
                end_date: {
                    gte: today
                }
            }
        })
    ]);

    // Mengambil semua data cuti yang telah diajukan oleh pengguna saat ini
    const userLeaves = await prisma.tb_leave.findMany({
        where: {
            NIK: userNIK,
            leave_type: leave_type.mandatory_leave 
        },
        select: { 
            id_mandatory: true,
            status: true
        }
    });

    // Membuat map untuk menyimpan status cuti pengguna agar mudah diakses
    const leaveMap = {};
    for (const leave of userLeaves) {
        leaveMap[leave.id_mandatory] = leave.status;
    }

    // Memproses dan mentransformasi data cuti wajib
    const data = rawData.map(item => {
        const startDate = createDateFromString(item.start_date);

        // Menghitung tanggal batas konfirmasi (2 hari sebelum tanggal mulai cuti)
        const confirmBefore = new Date(startDate);
        confirmBefore.setDate(confirmBefore.getDate() - 2);

        // Membuat pesan pengingat untuk konfirmasi
        const tanggalFormatted = formatDateIndonesia(confirmBefore);
        const message = `konfimasi cuti sebelum tanggal ${tanggalFormatted}`;

        // Mengecek status cuti ini untuk pengguna saat ini dari map
        const status = leaveMap[item.id_mandatory];
        let taken = true; // Default value untuk status 'taken'

        // Logika untuk menentukan apakah cuti sudah 'diambil' atau belum oleh pengguna
        if (status === 'approved') {
            taken = true; 
        } else if (status === 'rejected') {
            taken = false; 
        }
        // Jika statusnya 'pending' atau belum ada, 'taken' akan tetap true (sesuai default)

        return { ...item, message, taken };
    });

    // Menghitung jumlah total halaman untuk paginasi
    const totalPages = Math.ceil(total / limit);
    return {
        data: {
            data: data,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                total: total,
                limit: limit
            }
        }
    };
};