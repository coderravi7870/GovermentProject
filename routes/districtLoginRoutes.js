// routes/districtHeadRoutes.js
import express from "express";
import { loginDistrictHead } from "../controllers/DistrictHeadController.js"
// import { districtProtect } from "../middleware/loginDistrict.js";
const districtHeadLoginRouter = express.Router();

districtHeadLoginRouter.post("/login", loginDistrictHead);

export default districtHeadLoginRouter;
