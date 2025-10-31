import express from "express";
import {
    sendDistrictMessage,
    getDistrictMessages,
    markDistrictMessagesAsSeen,
} from "../controllers/districtMessageControllers.js";
import { districtProtect } from "../middleware/loginDistrict.js"; // 🧩 your district middleware
import { upload } from "../middleware/fileUpload.js"; // multer upload config

const districtMessageRouter = express.Router();

districtMessageRouter.post("/send", districtProtect, upload.single("file"), sendDistrictMessage);
districtMessageRouter.get("/:threadId", districtProtect, getDistrictMessages);
districtMessageRouter.put("/seen/:threadId", districtProtect, markDistrictMessagesAsSeen);

export default districtMessageRouter;
