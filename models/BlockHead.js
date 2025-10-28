import mongoose from "mongoose";

const blockHeadSchema = new mongoose.Schema({
    blockName: {
        type: String,
        required: true,
    },
    blockHeadName: {
        type: String,
        required: true,
    },
    blockHeadEmail: {
        type: String,
        required: true,
        unique: true,
    },
});

export default mongoose.model("BlockHead", blockHeadSchema);
