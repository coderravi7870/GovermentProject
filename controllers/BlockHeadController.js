import BlockHead from "../models/BlockHead.js";

// Assign Block Head
import Block from "../models/Block.js";

export const assignBlockHead = async (req, res) => {
    try {
        const { blockName, blockHeadName, blockHeadEmail, blockHeadPassword } = req.body;

        // check if block exists in Block collection
        const blockExist = await Block.findOne({ blockName });
        if (!blockExist)
            return res.status(404).json({ success: false, message: "Block not found in Block collection" });

        // create or update BlockHead
        let blockHead = await BlockHead.findOne({ blockName });
        if (!blockHead) {
            blockHead = await BlockHead.create({
                blockName,
                blockHeadName,
                blockHeadEmail,
                blockHeadPassword,
            });
        } else {
            blockHead.blockHeadName = blockHeadName;
            blockHead.blockHeadEmail = blockHeadEmail;
            blockHead.blockHeadPassword = blockHeadPassword;
            await blockHead.save();
        }

        res.status(200).json({ success: true, data: blockHead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//  Get Block Head by Block Name
export const getBlockHead = async (req, res) => {
    try {
        const BlocHead = await BlockHead.find();
        res.status(200).json({ success: true, data: BlocHead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
