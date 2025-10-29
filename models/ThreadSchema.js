import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Thread title is required"],
            minlength: [3, "Title must be at least 3 characters long"],
            trim: true,
        },
        state: {
            type: String,
            default: "Chhattisgarh",
            required: true,
            trim: true,
        },
        district: [
            {
                name: { type: String, required: true },
                email: { type: String, required: true },
            }
        ],
        block: {
            type: [String], // array of block names
            default: [],
        },
        department: {
            type: [String], // array of department names
            default: [],
        },
        departmentHead: [
            {
                name: { type: String, required: true },
                email: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

// Virtual field for member count
ThreadSchema.virtual("memberCount").get(function () {
    return this.departmentHead.length;
});

ThreadSchema.virtual("memberNames").get(function () {
    return this.departmentHead; // array of names
});

ThreadSchema.set("toJSON", { virtuals: true });
ThreadSchema.set("toObject", { virtuals: true });

// ThreadSchema.virtual("unseenCount") ... add ye kar do

ThreadSchema.virtual("unseenCount", {
    ref: "Message",
    localField: "_id",
    foreignField: "thread",
    count: true,
    match: { isSeen: false }, // sirf unseen messages count karega
});



export default mongoose.model("Thread", ThreadSchema);


// import mongoose from "mongoose";

// const ThreadSchema = new mongoose.Schema(
//     {
//         title: {
//             type: String,
//             required: [true, "Thread title is required"],
//             minlength: [3, "Title must be at least 3 characters long"],
//             trim: true,
//         },
//         state: {
//             type: String,
//             default: "Chhattisgarh",
//             required: true,
//             trim: true,
//         },
//         district: {
//             type: [String],
//             default: [],
//         },
//         block: {
//             type: [String],
//             default: [],
//         },
//         department: {
//             type: [String],
//             default: [],
//         },

//         //  Admin reference field (better than name or email)
//         departmentHeads: [
//             {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Admin", // reference to Admin model
//             },
//         ],
//     },
//     { timestamps: true }
// );

// // Virtual field for member count
// ThreadSchema.virtual("memberCount").get(function () {
//     return this.departmentHead.length;
// });

// ThreadSchema.virtual("memberNames").get(function () {
//     return this.departmentHead; // array of names
// });

// ThreadSchema.set("toJSON", { virtuals: true });
// ThreadSchema.set("toObject", { virtuals: true });

// ThreadSchema.set("toJSON", { virtuals: true });
// ThreadSchema.set("toObject", { virtuals: true });

// export default mongoose.model("Thread", ThreadSchema);
