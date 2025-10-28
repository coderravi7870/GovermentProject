import express from "express";
import {
    createThread,
    getThreads,
    getThreadById,
    updateThread,
    deleteThread,
} from "../controllers/ThreadControllers.js";
import { verifyToken } from "../middleware/auth.js";
// import { verifyToken } from "../middleware/auth.js";

const threadRouter = express.Router();

threadRouter.post("/", verifyToken, createThread);
threadRouter.get("/", getThreads);
threadRouter.get("/:id", getThreadById);
threadRouter.put("/:id", updateThread);
threadRouter.delete("/:id", deleteThread);

export default threadRouter;
