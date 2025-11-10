import prisma from "../../utils/client.js";

// Service untuk update tahun mandatory secara massal
export const updateMandatoryYearService = async (data) => {
    // mengambil tahun di parameter
    const { year } = data;

    // mengambil semua mandatory yang masih aktid
    const leaves = await prisma.tb_mandatory_leave.findMany({
        where: { is_active: true },
    });

    // Update untuk setiap data mandatory leave aktif
    const updatePromises = leaves.map((leave) => {
        // Konversi tanggal awal & akhir ke objek Date
        const startDate = new Date(leave.start_date);
        const endDate = new Date(leave.end_date);

        // Buat tanggal baru dengan tahun yang diperbarui
        const newStartDate = new Date(Date.UTC(year, startDate.getUTCMonth(), startDate.getUTCDate()));
        const newEndDate = new Date(Date.UTC(year, endDate.getUTCMonth(), endDate.getUTCDate()));

        // Kembalikan promise untuk update data mandatory leave
        return prisma.tb_mandatory_leave.update({
            where: { id_mandatory: leave.id_mandatory },
            data: {
                start_date: newStartDate,
                end_date: newEndDate,
            },
        });
    });

    return await prisma.$transaction(updatePromises);
};
