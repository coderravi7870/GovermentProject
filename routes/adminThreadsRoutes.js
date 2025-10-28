import express from "express";
// import { loginAdmin } from "../controllers/AdminControllers.js";
import { getAdminThreads } from "../controllers/AdminThreadsControllers.js";
import { protect } from "../middleware/loginAdmin.js";

const adminThreadRouter = express.Router();

// Get all threads for logged-in admin
adminThreadRouter.get("/getAdminThreads", protect, getAdminThreads);

export default adminThreadRouter;
