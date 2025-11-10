import prisma from '../../utils/client.js'
import fs from 'fs';
import { parse } from 'fast-csv';
import { pipeline, Transform } from "stream";
import { processData } from "../../utils/inject.utils.js";

/**
 * Fungsi ini menerapkan metode ETL (Extract, Transfrom, Load) untuk memproses data dari file CSV yang telah diupload kemudian meng-input data ke dalam database.
 *
 * @param {*} path - tempat file csv disimpan
 * @param {*} actor - data karyawan yang melakukan inject
 * @returns 
 */
export const importFileServices = async (path, actor) => {

    // total record yang akan diproses per-chunk
    const CHUNK_BASE = 100

    let data = []
    let chunkCount = 0

    // stream 

    // [1] Extract: stream readable membaca isi file csv yang telah diupload 
    const readable = fs.createReadStream(path)

    // [1] Extract: stream ini mengubah format setiap data dari stream sebelumnya menjadi object
    const parser = parse({
        delimiter: ";",
        headers: true
    })

    try {
        const process = await prisma.$transaction(async (tx) => {
            // [2 & 3] Transfrom & Load: stream ini memodifikasi data sekaligus meng-input data ke database 
            const transform = new Transform({
                objectMode: true,
                async transform(chunk, encoding, cb) {
                    try {
                        // setiap data yang terbaca akan dimasukan ke dalam array data
                        data.push(chunk)

                        // data baru akan diproses setelah mencapai CHUNK_BASE (total record per-chunk)
                        if (data.length === CHUNK_BASE) {

                            await processData(data, chunkCount, tx, CHUNK_BASE, actor)

                            data = []
                        }

                        chunkCount++
                        cb()
                    } catch (error) {
                        cb(error)
                    }
                },
                // memproses data yang tersisa jika total data tidak mencapai CHUNK_BASE
                async flush(cb) {
                    try {
                        console.log("Flushing remaining data...")
                        if (data.length > 0) {

                            await processData(data, chunkCount, tx, CHUNK_BASE, actor)

                            data = []
                        }
                        
                        cb()
                    } catch (error) {
                        cb(error)
                    }
                }
            })

            // semua stream diatas dijalankan pada pipeline dibawah ini mengikuti alur dengan metode ETL
            await new Promise((resolve, reject) => {
                pipeline(readable, parser, transform, async (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                })
            });
        }, {
            timeout: 60000000,
            maxWait: 6000
        }).catch(function (rej) {
            throw rej
        })

        const result = {
            data_received: chunkCount,
        }

        return result;
    } catch (error) {
        throw error
    }
}