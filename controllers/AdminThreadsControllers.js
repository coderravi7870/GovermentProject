// import Thread from "../models/ThreadSchema.js";

// export const getAdminThreads = async (req, res) => {
//     try {
//         const adminEmail = req.admin.departmentHeadEmail;
//         // console.log("Fetching threads for admin:", adminEmail);

//         if (!adminEmail) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Admin email missing in token",
//             });
//         }

//         // 🧠 Fetch threads where this admin is in departmentHead
//         const threads = await Thread.find({
//             "departmentHead.email": adminEmail,
//         });

//         // 🧩 Convert each thread to an object with virtuals (so memberCount is included)
//         const threadsWithVirtuals = threads.map((t) =>
//             t.toObject({ virtuals: true })
//         );

//         res.status(200).json({
//             success: true,
//             threads: threadsWithVirtuals,
//         });
//     } catch (error) {
//         console.error("Error fetching admin threads:", error);
//         res
//             .status(500)
//             .json({ success: false, message: error.message });
//     }
// };


import Thread from "../models/ThreadSchema.js";
import Message from "../models/message.js";

export const getAdminThreads = async (req, res) => {
    try {
        const adminEmail = req.admin.departmentHeadEmail;

        if (!adminEmail) {
            return res.status(400).json({
                success: false,
                message: "Admin email missing in token",
            });
        }

        // 🧠 Fetch threads where this admin is departmentHead
        const threads = await Thread.find({
            "departmentHead.email": adminEmail,
        });

        // 🧩 Map threads to include unseen message count
        const threadsWithUnseen = await Promise.all(
            threads.map(async (t) => {
                const unseenCount = await Message.countDocuments({
                    thread: t._id,
                    sender: { $ne: adminEmail }, // message admin ne nahi bheja
                    seenBy: { $ne: adminEmail }, // admin ne abhi tak nahi dekha
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
        console.error("Error fetching admin threads:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

