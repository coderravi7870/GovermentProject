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
        district: {
            type: [String], // only district names
            default: [],
        },
        districtHead: [
            {
                name: { type: String, required: true },
                email: { type: String, required: true },
            },
        ],
        block: {
            type: [String],
            default: [],
        },
        department: {
            type: [String],
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

// ✅ Virtuals
// ✅ Virtuals
ThreadSchema.virtual("memberCount").get(function () {
    // total heads count (district + department)
    return this.departmentHead.length + this.districtHead.length;
});

ThreadSchema.virtual("memberNames").get(function () {
    const deptNames = this.departmentHead.map(
        (head) => `${head.name} - dept`
    );
    const distNames = this.districtHead.map(
        (head) => `${head.name} - dist`
    );

    return [...deptNames, ...distNames];
});



ThreadSchema.set("toJSON", { virtuals: true });
ThreadSchema.set("toObject", { virtuals: true });

// ✅ Unseen Message Count Virtual
ThreadSchema.virtual("unseenCount", {
    ref: "Message",
    localField: "_id",
    foreignField: "thread",
    count: true,
    match: { isSeen: false },
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
