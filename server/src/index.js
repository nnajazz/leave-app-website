import express, { urlencoded } from "express";
import { PORT, HOSTNAME } from "./config/env.js";
import routes from "./routes/index.route.js";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import compression from "compression";
import responseTime from "response-time";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import "./jobs/autoCreateBalance.js";
import "./jobs/leaveScheduler.js";
import "./jobs/autoMandatoryLeave.js";
import { timeouthandle } from "./middlewares/requestTimeout.middleware.js";


const app = express();

// ✅ CORS harus paling atas agar preflight request gak ditolak middleware lain
const allowedOrigins = ["http://localhost:5173", "http://10.10.10.17:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // penting biar cookie (Authorization, device-id) ikut dikirim
    exposedHeaders: ["Authorization", "device-id"],
  })
);

// ✅ Middleware dasar
app.use(timeouthandle);
app.use(morgan("dev"));
app.use(responseTime());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression({ threshold: 0 }));

// ✅ Rute utama API
app.use("/api/v1", routes);

// ✅ Static file untuk upload (misal foto profil atau dokumen)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Middleware penanganan error global
app.use(errorHandler);

// ✅ Jalankan server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
