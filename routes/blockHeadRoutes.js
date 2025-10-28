// routes/blockHeadRoutes.js
import express from "express";
import { assignBlockHead, getBlockHead } from "../controllers/BlockHeadController.js";
import { verifyToken } from "../middleware/auth.js";


const blockHeadRouter = express.Router();


blockHeadRouter.post("/", verifyToken, assignBlockHead);
blockHeadRouter.get("/", getBlockHead);

export default blockHeadRouter;
