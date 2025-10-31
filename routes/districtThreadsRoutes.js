import express from "express";
// import { loginAdmin } from "../controllers/AdminControllers.js";
import { getDistrictThreads } from "../controllers/DistrictThreadsControllers.js";
import { districtProtect } from "../middleware/loginDistrict.js";

const districtThreadRouter = express.Router();

// Get all threads for logged-in admin
districtThreadRouter.get("/getdistrictThreads", districtProtect, getDistrictThreads);

export default districtThreadRouter;
