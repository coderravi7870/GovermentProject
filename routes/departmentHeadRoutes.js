// routes/departmentHeadRoutes.js
import express from "express";
import { assignDepartmentHead, getDeartmentHead } from "../controllers/DepartmentHeadController.js";
import { verifyToken } from "../middleware/auth.js";

const departmentHeadRouter = express.Router();


departmentHeadRouter.post("/", verifyToken, assignDepartmentHead);
departmentHeadRouter.get("/", getDeartmentHead);

export default departmentHeadRouter;
