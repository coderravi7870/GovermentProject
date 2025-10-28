// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//     {
//         thread: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Thread",
//             required: true,
//         },
//         sender: {
//             type: String,
//             ref: "User",
//             required: true,
//         },
//         text: {
//             type: String,
//             trim: true,
//         },
//         fileUrl: {
//             type: String, // Cloudinary or local path
//         },
//         fileType: {
//             type: String, // pdf, excel, image, etc.
//         },
//         time: {
//             type: Date,
//             default: Date.now,
//         },
//     },
//     { timestamps: true }
// );

// export default mongoose.model("Message", messageSchema);

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        thread: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread",
            required: true,
        },
        sender: {
            type: String,
            required: true,
            trim: true,
        },
        text: {
            type: String,
            trim: true,
        },
        fileUrl: {
            type: String,
            default: null,
        },
        fileType: {
            type: String,
            default: null,
        },
        time: {
            type: Date,
            default: Date.now,
        },

        // 🔔 Notification fields
        seenBy: {
            type: [String], // emails of users who saw this message
            default: [],
        },
    },
    { timestamps: true }
);

// 🧠 Auto-update isSeen based on seenBy array
messageSchema.pre("save", function (next) {
    this.isSeen = this.seenBy.length > 0;
    next();
});

export default mongoose.model("Message", messageSchema);

