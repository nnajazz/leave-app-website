import express from 'express'
import { uploadFile } from '../middlewares/uploadFile.middleware.js';
import { importFile } from '../controllers/upload/importFile.controller.js';
import { exportFile } from '../controllers/upload/exportFile.controller.js';
import { importBalanceAdjustment } from '../controllers/upload/importBalanceAdjustment.controller.js';
import { validateRole } from '../middlewares/validateRole.middleware.js';
const uploadRoutes = express.Router();

uploadRoutes.post('/import', validateRole('super-admin'), uploadFile, importFile);
uploadRoutes.post('/balance-adjustment', validateRole('super-admin', 'admin', 'hr-manager'), uploadFile, importBalanceAdjustment)
uploadRoutes.get('/export', validateRole('super-admin'), exportFile);

export default uploadRoutes