// routes/districtRoutes.js
import express from "express";
import { assignDistrictHead, getDistrHead } from "../controllers/DistrictHeadController.js";
import { verifyToken } from "../middleware/auth.js";

const districtHeadRouter = express.Router();

// ✅ Create a new District
districtHeadRouter.post("/", verifyToken, assignDistrictHead);
districtHeadRouter.get("/", getDistrHead);

export default districtHeadRouter;
