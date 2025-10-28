import express from "express";
import { createAdmin, deleteAdmin, getAdminById, getAdmins, loginAdmin, updateAdmin } from "../controllers/AdminControllers.js";
import { verifyToken } from "../middleware/auth.js";


const adminRouter = express.Router();

adminRouter.post("/", verifyToken, createAdmin);
adminRouter.get("/", getAdmins);
adminRouter.get("/:id", getAdminById);
adminRouter.patch("/:id", updateAdmin);
adminRouter.delete("/:id", deleteAdmin);

//login admin
// adminRouter.post("/login", loginAdmin);

export default adminRouter;
