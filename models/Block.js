import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true,
    },
    districtName: {
        type: String,
        required: true,
    },
    blockName: {
        type: String,
        required: true,
        unique: true,
    },
});

export default mongoose.model("Block", blockSchema);
