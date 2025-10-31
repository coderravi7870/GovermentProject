import Thread from "../models/ThreadSchema.js";
import Admin from "../models/Admin.js";

// ✅ Create new thread
// import Thread from "../models/Thread.js";
// import Admin from "../models/Admin.js";

// import Thread from "../models/Thread.js";
// import Admin from "../models/Admin.js";

export const createThread = async (req, res) => {
    try {
        const { title, state, block, department, departmentHead, district, districtHead } = req.body;

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

        // ✅ Extract head names for lookup
        const departmentHeadNames = departmentHead.map((d) => d.name);
        const districtHeadNames = districtHead.map((d) => d.name);

        // ✅ Fetch matching Admins
        const admins = await Admin.find({
            $or: [
                { departmentHeadName: { $in: departmentHeadNames } },
                { districtHeadName: { $in: districtHeadNames } },
            ],
        });

        // ✅ Department Heads (with email)
        const departmentHeadWithEmail = departmentHeadNames.map((name) => {
            const admin = admins.find((a) => a.departmentHeadName === name);
            return {
                name,
                email: admin ? admin.departmentHeadEmail : "N/A",
            };
        });

        // ✅ District Heads (with email fix)
        const districtHeadWithEmail = districtHead.map((d) => {
            // check if district head exists in Admin table
            const admin = admins.find(
                (a) =>
                    a.districtHeadName === d.name ||
                    a.districtHeadEmail === d.email // 👈 also check by email
            );
            return {
                name: d.name,
                email: admin ? admin.districtHeadEmail : d.email, // 👈 if admin found, use db email else frontend email
            };
        });


        // ✅ Create new Thread
        const newThread = await Thread.create({
            title,
            state,
            block,
            department,
            district,
            departmentHead: departmentHeadWithEmail,
            districtHead: districtHeadWithEmail,
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
