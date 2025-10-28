import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// Create new Admin
export const createAdmin = async (req, res) => {
  try {
    // console.log("Incoming body:", req.body);
    const { departmentName, departmentHeadName, departmentHeadEmail, departmentHeadPassword, state } = req.body;

    const newAdmin = new Admin({
      departmentName,
      departmentHeadName,
      departmentHeadEmail,
      departmentHeadPassword,
      state
    });

    await newAdmin.save();
    res.status(201).json({ success: true, message: "Admin created successfully", data: newAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating admin", error: error.message });
  }
};



// Get all Admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching admins", error: error.message });
  }
};

// Get single Admin by ID
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching admin", error: error.message });
  }
};

// Update Admin
export const updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAdmin) return res.status(404).json({ success: false, message: "Admin not found" });

    res.status(200).json({ success: true, message: "Admin updated successfully", data: updatedAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating admin", error: error.message });
  }
};

// Delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) return res.status(404).json({ success: false, message: "Admin not found" });

    res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting admin", error: error.message });
  }
};


// Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { departmentHeadEmail, departmentHeadPassword } = req.body;

    if (!departmentHeadEmail || !departmentHeadPassword) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ departmentHeadEmail: departmentHeadEmail.toLowerCase().trim() });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isMatch = await admin.comparePassword(departmentHeadPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, departmentHeadEmail: admin.departmentHeadEmail },
      process.env.JWT_SECRET || "change_this_secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: admin._id,
        departmentName: admin.departmentName,
        departmentHeadName: admin.departmentHeadName,
        departmentHeadEmail: admin.departmentHeadEmail,
        state: admin.state,
      },
      token,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
