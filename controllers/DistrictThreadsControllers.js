import Thread from "../models/ThreadSchema.js";
import Message from "../models/message.js";

export const getDistrictThreads = async (req, res) => {
    try {
        const districtEmail = req.districtHead.districtHeadEmail;

        if (!districtEmail) {
            return res.status(400).json({
                success: false,
                message: "District email missing in token",
            });
        }

        // 🧠 Fetch threads where this admin is departmentHead
        const threads = await Thread.find({
            "districtHead.email": districtEmail,
        });

        // 🧩 Map threads to include unseen message count
        const threadsWithUnseen = await Promise.all(
            threads.map(async (t) => {
                const unseenCount = await Message.countDocuments({
                    thread: t._id,
                    sender: { $ne: districtEmail }, // message admin ne nahi bheja
                    seenBy: { $ne: districtEmail }, // admin ne abhi tak nahi dekha
                });

                return {
                    ...t.toObject({ virtuals: true }), // memberCount etc include
                    unseenCount,
                };
            })
        );

        res.status(200).json({
            success: true,
            threads: threadsWithUnseen,
        });
    } catch (error) {
        console.error("Error fetching district threads:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};