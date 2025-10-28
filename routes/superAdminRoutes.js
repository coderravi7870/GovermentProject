import express from "express";
import { loginSuperAdmin } from "../controllers/superAdminControllers.js";


const superAdminRouter = express.Router();

// POST /api/super-admin/login
superAdminRouter.post("/login", loginSuperAdmin);

export default superAdminRouter;
