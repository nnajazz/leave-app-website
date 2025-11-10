import { request } from "http"
import timeout from 'connect-timeout';

/**
 * middlewares ini akan men-invoke timeout jika waktu hingga response diberikan melebihi waktu yang telah ditentukan
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const timeouthandle = async (req, res, next) => {
    try {
        const routeExludes = ['/api/v1/uploads/import', '/api/v1/uploads/balance-adjustment', '/api/v1/uploads/export']
        if (routeExludes.includes(req.path)) {
            return next()
        } else{
            const seconds = process.env.NODE_ENV === "development" ? '100s' : '10s'
            return timeout(seconds)(req, res, next);
        }
    } catch (error) {
        next(error)
    }
}