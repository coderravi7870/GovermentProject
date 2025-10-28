// import Department from "../models/Department.js";
import DepartmentHead from "../models/DepartmentHead.js";

// Assign Department Head
export const assignDepartmentHead = async (req, res) => {
    try {
        const {
            departmentName,
            departmentHeadName,
            departmentHeadEmail,
            departmentHeadPassword,
        } = req.body;

        if (!departmentName)
            return res
                .status(400)
                .json({ success: false, message: "Department name required" });

        //  Check if department head already exists for this department
        let department = await DepartmentHead.findOne({ departmentName });

        if (department) {
            // Update existing one
            department.departmentHeadName = departmentHeadName;
            department.departmentHeadEmail = departmentHeadEmail;
            department.departmentHeadPassword = departmentHeadPassword;
            await department.save();
            return res
                .status(200)
                .json({ success: true, message: "Department Head updated", data: department });
        } else {
            // Create new department head
            const newDepartment = await DepartmentHead.create({
                departmentName,
                departmentHeadName,
                departmentHeadEmail,
                departmentHeadPassword,
            });
            return res
                .status(201)
                .json({ success: true, message: "Department Head created", data: newDepartment });
        }
    } catch (error) {
        console.error("Error creating/updating department head:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDeartmentHead = async (req, res) => {
    try {
        const DepaHead = await DepartmentHead.find();
        res.status(200).json({ success: true, data: DepaHead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};