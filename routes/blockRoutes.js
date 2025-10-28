import express from "express";
import { createBlock, getBlocks } from "../controllers/BlockController.js";
import { verifyToken } from "../middleware/auth.js";


const blockRouter = express.Router();


blockRouter.post("/", verifyToken, createBlock);
blockRouter.get("/", getBlocks);

export default blockRouter;
