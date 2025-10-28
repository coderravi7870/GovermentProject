// import Message from "../models/message.js";
// import Thread from "../models/ThreadSchema.js";
// import dotenv from "dotenv";

// dotenv.config();

// // Send Message
// export const sendAdminMessage = async (req, res) => {
//     try {
//         const { threadId, text } = req.body;
//         const file = req.file;

//         if (!text && !file) {
//             return res
//                 .status(400)
//                 .json({ success: false, message: "Message or file is required" });
//         }

//         // Validate thread existence
//         const thread = await Thread.findById(threadId);
//         if (!thread) {
//             return res
//                 .status(404)
//                 .json({ success: false, message: "Thread not found" });
//         }

//         // ✅ Use admin from middleware
//         const senderEmail = req.admin?.departmentHeadEmail;
//         if (!senderEmail) {
//             return res
//                 .status(400)
//                 .json({ success: false, message: "Admin email missing in token" });
//         }

//         // Generate full public file URL
//         const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
//         const fileUrl = file ? `${backendUrl}/uploads/${file.filename}` : null;

//         // Create new message
//         const message = new Message({
//             thread: threadId,
//             sender: senderEmail, // ✅ updated
//             text: text || "",
//             fileUrl,
//             fileType: file ? file.mimetype : null,
//             // readBy: [{ email: sender }],
//         });

//         await message.save();

//         // Update thread's latest message
//         thread.latestMessage = message._id;
//         await thread.save();

//         res.status(201).json({
//             success: true,
//             message: "Message sent successfully",
//             data: message,
//         });
//     } catch (err) {
//         console.error("Error sending message:", err);
//         res
//             .status(500)
//             .json({ success: false, message: "Internal Server Error", error: err.message });
//     }
// };


// // 💬 Get All Messages of a Thread
// export const getAdminMessages = async (req, res) => {
//     try {
//         const { threadId } = req.params;

//         const messages = await Message.find({ thread: threadId })
//             .sort({ createdAt: 1 })
//             .lean();

//         res.status(200).json({
//             success: true,
//             count: messages.length,
//             messages,
//         });
//     } catch (error) {
//         console.error("Error fetching messages:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch messages",
//             error: error.message,
//         });
//     }
// };




import Message from "../models/message.js";
import Thread from "../models/ThreadSchema.js";
import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

// 📨 Send Message
export const sendAdminMessage = async (req, res) => {
    try {
        const { threadId, text } = req.body;
        const file = req.file;

        if (!text && !file) {
            return res
                .status(400)
                .json({ success: false, message: "Message or file is required" });
        }

        // ✅ Validate thread
        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res
                .status(404)
                .json({ success: false, message: "Thread not found" });
        }

        // ✅ Get sender (admin)
        const senderEmail = req.admin?.departmentHeadEmail;
        if (!senderEmail) {
            return res
                .status(400)
                .json({ success: false, message: "Admin email missing in token" });
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
            seenBy: [senderEmail], // 👈 sender ne apna msg to dekha hi hoga
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
        console.error("Error sending message:", err);
        res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: err.message,
            });
    }
};

// 💬 Get All Messages of a Thread
export const getAdminMessages = async (req, res) => {
    try {
        const { threadId } = req.params;
        const adminEmail = req.admin?.departmentHeadEmail;

        if (!adminEmail) {
            return res.status(400).json({
                success: false,
                message: "Admin email missing in token",
            });
        }

        // 🧠 Fetch messages
        const messages = await Message.find({ thread: threadId })
            .sort({ createdAt: 1 })
            .lean();

        // 👁️ Mark unseen messages as seen by admin
        await Message.updateMany(
            { thread: threadId, seenBy: { $ne: adminEmail } },
            { $addToSet: { seenBy: adminEmail } }
        );

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

// ✅ Mark all unseen messages as seen (based only on seenBy)
export const markMessagesAsSeen = async (req, res) => {
    try {
        const { threadId } = req.params;
        const adminEmail =
            req.admin?.departmentHeadEmail || req.user?.departmentHeadEmail;

        console.log("Thread ID received:", threadId);
        console.log("Admin Email:", adminEmail);

        if (!adminEmail) {
            return res.status(400).json({
                success: false,
                message: "Admin email missing in token",
            });
        }

        // 🔍 Step 1: Find messages not yet seen by this admin
        const unseenMessages = await Message.find({
            thread: threadId,
            seenBy: { $ne: adminEmail },
        });

        console.log("Unseen messages found:", unseenMessages.length);

        if (unseenMessages.length === 0) {
            return res.status(200).json({
                success: true,
                message: "All messages already seen by this admin",
                updated: 0,
            });
        }

        // 🧩 Step 2: Update messages - add adminEmail to seenBy
        const result = await Message.updateMany(
            { thread: threadId, seenBy: { $ne: adminEmail } },
            { $addToSet: { seenBy: adminEmail } }
        );

        console.log("Updated messages count:", result.modifiedCount);

        res.status(200).json({
            success: true,
            message: "Messages marked as seen (seenBy updated)",
            updated: result.modifiedCount,
        });
    } catch (error) {
        console.error("Error marking messages as seen:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark as seen",
            error: error.message,
        });
    }
};
