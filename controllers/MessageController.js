import Message from "../models/message.js";
import Thread from "../models/ThreadSchema.js";
import dotenv from "dotenv";

dotenv.config();


// Send Message
export const sendMessage = async (req, res) => {
    try {
        const { threadId, text } = req.body;
        const file = req.file;

        if (!text && !file) {
            return res
                .status(400)
                .json({ success: false, message: "Message or file is required" });
        }

        // Validate thread existence
        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res
                .status(404)
                .json({ success: false, message: "Thread not found" });
        }

        // ✅ Generate full public file URL (with BACKEND_URL)
        const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
        const fileUrl = file ? `${backendUrl}/uploads/${file.filename}` : null;

        // Create new message
        const message = new Message({
            thread: threadId,
            sender: req.user.email,
            text: text || "",
            fileUrl,
            fileType: file ? file.mimetype : null,
        });

        await message.save();

        // Update thread's latest message
        thread.latestMessage = message._id;
        await thread.save();

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: message,
        });
    } catch (err) {
        console.error("Error sending message:", err);
        res
            .status(500)
            .json({ success: false, message: "Internal Server Error", error: err.message });
    }
};

// 💬 Get All Messages of a Thread
export const getMessages = async (req, res) => {
    try {
        const { threadId } = req.params;

        const messages = await Message.find({ thread: threadId })
            .sort({ createdAt: 1 })
            .lean();

        res.status(200).json({
            success: true,
            count: messages.length,
            messages,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            error: error.message,
        });
    }
};
