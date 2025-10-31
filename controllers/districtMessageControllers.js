import Message from "../models/message.js";
import Thread from "../models/ThreadSchema.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();


// 📨 Send Message (District)
export const sendDistrictMessage = async (req, res) => {
    try {
        const { threadId, text } = req.body;
        const file = req.file;

        if (!text && !file) {
            return res.status(400).json({
                success: false,
                message: "Message or file is required",
            });
        }

        // ✅ Validate thread
        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res
                .status(404)
                .json({ success: false, message: "Thread not found" });
        }

        // console.log("Incoming body:", req.body);
        // console.log("Incoming file:", req.file);
        // console.log("Decoded district:", req.district);


        // ✅ Get sender (district)
        const senderEmail = req.districtHead?.districtHeadEmail;
        if (!senderEmail) {
            return res
                .status(400)
                .json({ success: false, message: "District email missing in token" });
        }

        const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
        const fileUrl = file ? `${backendUrl}/uploads/${file.filename}` : null;

        // ✅ Create message with seenBy including sender
        const message = new Message({
            thread: threadId,
            sender: senderEmail,
            text: text || "",
            fileUrl,
            fileType: file ? file.mimetype : null,
            seenBy: [senderEmail], // 👈 sender ne apna msg dekha
        });

        await message.save();

        // ✅ Update latest message reference in thread
        thread.latestMessage = message._id;
        await thread.save();

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: message,
        });
    } catch (err) {
        console.error("Error sending district message:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
};


// 💬 Get All Messages of a Thread (District)
export const getDistrictMessages = async (req, res) => {
    try {
        const { threadId } = req.params;
        const districtEmail = req.districtHead?.districtHeadEmail;

        if (!districtEmail) {
            return res.status(400).json({
                success: false,
                message: "District email missing in token",
            });
        }

        // console.log("📩 District GET messages hit!");
        // console.log("Thread ID:", req.params.threadId);
        // console.log("Decoded district:", req.district);

        // 🧠 Fetch messages
        const messages = await Message.find({ thread: threadId })
            .sort({ createdAt: 1 })
            .lean();

        // 👁️ Mark unseen messages as seen by district
        await Message.updateMany(
            { thread: threadId, seenBy: { $ne: districtEmail } },
            { $addToSet: { seenBy: districtEmail } }
        );

        res.status(200).json({
            success: true,
            count: messages.length,
            messages,
        });
    } catch (error) {
        console.error("Error fetching district messages:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch district messages",
            error: error.message,
        });
    }
};


// ✅ Mark all unseen messages as seen (District)
export const markDistrictMessagesAsSeen = async (req, res) => {
    try {
        const { threadId } = req.params;
        const districtEmail =
            req.districtHead?.districtHeadEmail || req.user?.districtHeadEmail;

        if (!districtEmail) {
            return res.status(400).json({
                success: false,
                message: "District email missing in token",
            });
        }

        // 🔍 Step 1: Find messages not yet seen by this district
        const unseenMessages = await Message.find({
            thread: threadId,
            seenBy: { $ne: districtEmail },
        });

        if (unseenMessages.length === 0) {
            return res.status(200).json({
                success: true,
                message: "All messages already seen by this district",
                updated: 0,
            });
        }

        // 🧩 Step 2: Update messages - add districtEmail to seenBy
        const result = await Message.updateMany(
            { thread: threadId, seenBy: { $ne: districtEmail } },
            { $addToSet: { seenBy: districtEmail } }
        );

        res.status(200).json({
            success: true,
            message: "Messages marked as seen (seenBy updated)",
            updated: result.modifiedCount,
        });
    } catch (error) {
        console.error("Error marking district messages as seen:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark as seen",
            error: error.message,
        });
    }
};
