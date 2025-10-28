// routes/districtRoutes.js
import express from "express";
import { createDistrict, getDistricts } from "../controllers/DistrictController.js";
import { verifyToken } from "../middleware/auth.js";


const districtRouter = express.Router();

// ✅ Create a new District
districtRouter.post("/", verifyToken, createDistrict);
districtRouter.get("/", getDistricts);

export default districtRouter;
