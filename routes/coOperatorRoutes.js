// routes/coOperatorRoutes.js
import express from "express";
import { createCoOperator, getCoOperators } from "../controllers/CoOperatorController.js";
import { verifyToken } from "../middleware/auth.js";


const coOperatorRoutes = express.Router();

// ✅ Create a new Co-Operator
coOperatorRoutes.post("/", verifyToken, createCoOperator);
coOperatorRoutes.get("/", getCoOperators);

export default coOperatorRoutes;
