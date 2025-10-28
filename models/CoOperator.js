import mongoose from "mongoose";

const coOperatorSchema = new mongoose.Schema({
    departmentName: {
        type: String,
    },
    districtName: {
        type: String,
    },
    blockName: {
        type: String,
    },
    coOperatorName: {
        type: String,
        required: true,
    },
    coOperatorEmail: {
        type: String,
        required: true,
        unique: true,
    },
    coOperatorPassword: {
        type: String,
        required: true,
    },
});

export default mongoose.model("CoOperator", coOperatorSchema);
