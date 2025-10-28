import jwt from "jsonwebtoken";
import DistrictHead from "../models/DistrictHead.js";

// ✅ Assign District Head
import District from "../models/District.js";

export const assignDistrictHead = async (req, res) => {
    try {
        const { districtName, districtHeadName, districtHeadEmail, districtHeadPassword } = req.body;

        // ✅ Step 1: Find district in District collection
        const district = await District.findOne({ districtName });
        if (!district) {
            return res.status(404).json({ success: false, message: "District not found" });
        }

        // ✅ Step 2: Check if this district already has a head
        let districtHead = await DistrictHead.findOne({ districtName });
        if (districtHead) {
            // Update existing district head info
            districtHead.districtHeadName = districtHeadName;
            districtHead.districtHeadEmail = districtHeadEmail;
            districtHead.districtHeadPassword = districtHeadPassword;
            await districtHead.save();
        } else {
            // Create new district head entry
            districtHead = await DistrictHead.create({
                districtName,
                districtHeadName,
                districtHeadEmail,
                districtHeadPassword,
            });
        }

        res.status(200).json({
            success: true,
            message: "District Head assigned successfully",
            data: districtHead,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// ✅ Get All CoOperators
export const getDistrHead = async (req, res) => {
    try {
        const distHead = await DistrictHead.find();
        res.status(200).json({ success: true, data: distHead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 🟢 Login District Head
export const loginDistrictHead = async (req, res) => {
    try {
        const { districtHeadEmail, districtHeadPassword } = req.body;

        // ✅ Check required fields
        if (!districtHeadEmail || !districtHeadPassword) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // ✅ Find District Head by Email
        const districtHead = await DistrictHead.findOne({
            districtHeadEmail: districtHeadEmail.toLowerCase().trim(),
        });

        if (!districtHead) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // ✅ Compare Password
        const isMatch = await districtHead.comparePassword(districtHeadPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            {
                id: districtHead._id,
                districtHeadEmail: districtHead.districtHeadEmail,
                districtName: districtHead.districtName,
            },
            process.env.JWT_SECRET || "change_this_secret",
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        // ✅ Send Response
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: districtHead._id,
                districtName: districtHead.districtName,
                districtHeadName: districtHead.districtHeadName,
                districtHeadEmail: districtHead.districtHeadEmail,
                state: districtHead.state,
            },
            token,
        });
    } catch (error) {
        console.error("Error in district head login:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


