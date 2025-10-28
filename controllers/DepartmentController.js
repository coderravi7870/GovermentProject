import Department from "../models/Department.js";

// ✅ Create Department
export const createDepartment = async (req, res) => {
    try {
        const { departmentName } = req.body;
        if (!departmentName)
            return res.status(400).json({ success: false, message: "Department name is required" });

        const exist = await Department.findOne({ departmentName });
        if (exist)
            return res.status(400).json({ success: false, message: "Department already exists" });

        const department = await Department.create({ departmentName });
        res.status(201).json({ success: true, data: department });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get all Departments
export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json({ success: true, data: departments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
