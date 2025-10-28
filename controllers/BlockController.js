import Block from "../models/Block.js";

// ✅ Create Block
export const createBlock = async (req, res) => {
    try {
        const { departmentName, districtName, blockName } = req.body;
        if (!departmentName || !districtName || !blockName)
            return res.status(400).json({ success: false, message: "All fields required" });

        const exist = await Block.findOne({ blockName });
        if (exist)
            return res.status(400).json({ success: false, message: "Block already exists" });

        const block = await Block.create({ departmentName, districtName, blockName });
        res.status(201).json({ success: true, data: block });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get All Blocks
export const getBlocks = async (req, res) => {
    try {
        const blocks = await Block.find();
        res.status(200).json({ success: true, data: blocks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
