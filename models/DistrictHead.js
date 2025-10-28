import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const districtHeadSchema = new mongoose.Schema(
    {
        districtName: {
            type: String,
            required: true,
        },
        districtHeadName: {
            type: String,
            required: true,
        },
        districtHeadEmail: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        districtHeadPassword: {
            type: String,
            required: true,
        },
        // state: {
        //     type: String,
        //     default: "Chhattisgarh",
        //     required: true,
        // },
    },
    { timestamps: true }
);

// 🔐 Hash password before saving (only if modified/new)
districtHeadSchema.pre("save", async function (next) {
    if (!this.isModified("districtHeadPassword")) return next();
    const salt = await bcrypt.genSalt(10);
    this.districtHeadPassword = await bcrypt.hash(this.districtHeadPassword, salt);
    next();
});

// 🔑 Compare password for login
districtHeadSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.districtHeadPassword);
};

const DistrictHead = mongoose.model("DistrictHead", districtHeadSchema);
export default DistrictHead;
