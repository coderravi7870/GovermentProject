import Thread from "../models/ThreadSchema.js";
import Admin from "../models/Admin.js";

// ✅ Create new thread
// import Thread from "../models/Thread.js";
// import Admin from "../models/Admin.js";

// import Thread from "../models/Thread.js";
// import Admin from "../models/Admin.js";

export const createThread = async (req, res) => {
    try {
        const { title, state, block, department, departmentHead, districtHead } = req.body;

        // ✅ Validation
        if (!departmentHead || departmentHead.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one department head.",
            });
        }

        if (!districtHead || districtHead.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one district head.",
            });
        }

        // ✅ Extract head names
        const departmentHeadNames = departmentHead.map((d) => d.name);
        const districtHeadNames = districtHead.map((d) => d.name);

        // ✅ Fetch matching Admins from DB
        const admins = await Admin.find({
            $or: [
                { departmentHeadName: { $in: departmentHeadNames } },
                { districtHeadName: { $in: districtHeadNames } },
            ],
        });

        // ✅ Department Heads (name + email)
        const departmentHeadWithEmail = departmentHeadNames.map((name) => {
            const admin = admins.find((a) => a.departmentHeadName === name);
            return {
                name,
                email: admin ? admin.departmentHeadEmail : "N/A",
            };
        });

        // ✅ District Heads (name + email)
        const districtHeadWithEmail = districtHeadNames.map((name) => {
            const admin = admins.find((a) => a.districtHeadName === name);
            return {
                name,
                email: admin ? admin.districtHeadEmail : "N/A",
            };
        });

        // ✅ Create new thread
        const newThread = await Thread.create({
            title,
            state,
            block,
            department,
            departmentHead: departmentHeadWithEmail, // [{ name, email }]
            districtHead: districtHeadWithEmail,     // [{ name, email }]
        });

        res.status(201).json({
            success: true,
            message: "Thread created successfully!",
            data: newThread,
        });
    } catch (error) {
        console.error("Error creating thread:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error while creating thread.",
        });
    }
};






// Get all threads
export const getThreads = async (req, res) => {
    try {
        const threads = await Thread.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: threads });
    } catch (error) {
        console.error("Error fetching threads:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single thread by ID

export const getThreadById = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id);
        if (!thread) {
            return res.status(404).json({ success: false, message: "Thread not found" });
        }
        res.status(200).json({ success: true, data: thread });
    } catch (error) {
        console.error("Error fetching thread:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update thread

export const updateThread = async (req, res) => {
    try {
        const updatedThread = await Thread.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedThread) {
            return res.status(404).json({ success: false, message: "Thread not found" });
        }

        res.status(200).json({
            success: true,
            message: "Thread updated successfully",
            data: updatedThread,
        });
    } catch (error) {
        console.error("Error updating thread:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete thread
export const deleteThread = async (req, res) => {
    try {
        const deletedThread = await Thread.findByIdAndDelete(req.params.id);

        if (!deletedThread) {
            return res.status(404).json({ success: false, message: "Thread not found" });
        }

        res.status(200).json({
            success: true,
            message: "Thread deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting thread:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
