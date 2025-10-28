import express from "express";
import { sendMessage, getMessages } from "../controllers/MessageController.js"
// import { authMiddleware } from "../middleware/fileUpload.js"
import { upload } from "../middleware/fileUpload.js";
import { verifyToken } from "../middleware/auth.js";

const messageRouter = express.Router();

// send text or file message
messageRouter.post("/", verifyToken, upload.single("file"), sendMessage);
// messageRouter.post("/", upload.single("file"), sendMessage);

// get all messages of a thread
messageRouter.get("/:threadId", verifyToken, getMessages);

export default messageRouter;
