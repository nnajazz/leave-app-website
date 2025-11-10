import express from "express";
import { login } from "../controllers/auth/login.controller.js";
import { logout } from "../controllers/auth/logout.controller.js";
import { validateUser } from "../middlewares/validateUser.middleware.js";
import { validate } from "../middlewares/validate.js";
import loginFormRequest from "../validators/loginForm.validator.js";

const authRoutes = express.Router();

authRoutes.post("/login", validate(loginFormRequest), validateUser, login);

authRoutes.get("/logout", logout);

export default authRoutes;
