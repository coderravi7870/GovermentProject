import mongoose from "mongoose";

const districtSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true,
    },
    districtName: {
        type: String,
        required: true,
        unique: true,
    },
});

export default mongoose.model("District", districtSchema);
