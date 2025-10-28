// routes/departmentRoutes.js
import express from "express";
import { createDepartment, getDepartments } from "../controllers/DepartmentController.js";
import { verifyToken } from "../middleware/auth.js";

const departmentRouter = express.Router();


departmentRouter.post("/", verifyToken, createDepartment);
departmentRouter.get("/", getDepartments);

export default departmentRouter;
