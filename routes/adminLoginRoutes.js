import express from "express";
import { loginAdmin } from "../controllers/AdminControllers.js";


const adminLoginRouter = express.Router();

//login admin
adminLoginRouter.post("/login", loginAdmin);

export default adminLoginRouter;
