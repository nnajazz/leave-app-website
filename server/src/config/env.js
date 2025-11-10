import dotenv from 'dotenv';
import path from 'path'

// konfigurasi environtment berdasarkan variable NODE_ENV
const envFile = '.env' // process.env.NODE_ENV === "development" ? '.env.development' : '.env.production'
dotenv.config({path: envFile})

export const {
    PORT, NODE_ENV, HOSTNAME, JWT_SECRET
} = process.env