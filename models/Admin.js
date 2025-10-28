// import mongoose from 'mongoose';

// const adminSchema = new mongoose.Schema({
//     departmentName: { type: String, required: true },
//     departmentHeadName: { type: String, required: true },
//     departmentHeadEmail: { type: String, required: true },
//     departmentHeadPassword: { type: String, required: true },
//     state: { type: String, default: "Chhattisgarh", required: true },
// }, { timestamps: true })

// const Admin = mongoose.model("Admin", adminSchema)

// export default Admin;


import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    departmentName: { type: String, required: true },
    departmentHeadName: { type: String, required: true },
    departmentHeadEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
    departmentHeadPassword: { type: String, required: true },
    state: { type: String, default: "Chhattisgarh", required: true },
}, { timestamps: true });

// Hash password before saving (only when modified/new)
adminSchema.pre("save", async function (next) {
    if (!this.isModified("departmentHeadPassword")) return next();
    const salt = await bcrypt.genSalt(10);
    this.departmentHeadPassword = await bcrypt.hash(this.departmentHeadPassword, salt);
    next();
});

// Compare password
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.departmentHeadPassword);
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
