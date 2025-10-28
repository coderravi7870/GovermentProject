import express from "express";
import { getAdminMessages, markMessagesAsSeen, sendAdminMessage } from "../controllers/AdminMessageControllers.js";
import { protect } from "../middleware/loginAdmin.js";
import { upload } from "../middleware/fileUpload.js";

const adminMessageRouter = express.Router();

// Get all threads for logged-in admin
adminMessageRouter.post("/sendAdminMessage", protect, upload.single("file"), sendAdminMessage);
adminMessageRouter.get("/:threadId", protect, getAdminMessages);
// 👁️ Mark all messages of a thread as seen
adminMessageRouter.put("/seen/:threadId", protect, markMessagesAsSeen);


export default adminMessageRouter;
