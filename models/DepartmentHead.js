import mongoose from "mongoose";

const departmentHeadSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true,
    },
    departmentHeadName: {
        type: String,
        required: true,
    },
    departmentHeadEmail: {
        type: String,
        required: true,
        unique: true,
    },
    departmentHeadPassword: {
        type: String,
        required: true,
    },
});

export default mongoose.model("DepartmentHead", departmentHeadSchema);
