
import Thread from "../models/ThreadSchema.js";

// Create new thread

import Admin from "../models/Admin.js";

export const createThread = async (req, res) => {
    try {
        const { title, state, district, block, department, departmentHeadNames } = req.body;

        if (!departmentHeadNames || departmentHeadNames.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one department head.",
            });
        }

        // Find Admins with matching names
        const admins = await Admin.find({
            departmentHeadName: { $in: departmentHeadNames },
        });

        if (admins.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No matching department heads found.",
            });
        }

        // Build departmentHead array (name + email)
        const departmentHead = admins.map((admin) => ({
            name: admin.departmentHeadName,
            email: admin.departmentHeadEmail,
        }));

        const newThread = await Thread.create({
            title,
            state,
            district,
            block,
            department,
            departmentHead, // automatically includes name + email
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
