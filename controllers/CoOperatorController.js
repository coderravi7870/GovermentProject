import CoOperator from "../models/CoOperator.js";

// ✅ Create Co-Operator
export const createCoOperator = async (req, res) => {
    try {
        const {
            departmentName,
            districtName,
            blockName,
            coOperatorName,
            coOperatorEmail,
            coOperatorPassword,
        } = req.body;

        // 🧠 Validation: coOperatorName is always required
        if (!coOperatorName?.trim()) {
            return res
                .status(400)
                .json({ success: false, message: "Co-operator name is required" });
        }

        // ✅ Require at least one of department/district/block
        if (
            !departmentName?.trim() &&
            !districtName?.trim() &&
            !blockName?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "At least one of Department, District, or Block must be selected",
            });
        }

        // Optional: validate email and password
        if (!coOperatorEmail?.trim() || !coOperatorPassword?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required",
            });
        }

        // 🧱 Create co-operator
        const coOp = await CoOperator.create({
            departmentName,
            districtName,
            blockName,
            coOperatorName,
            coOperatorEmail,
            coOperatorPassword,
        });

        res.status(201).json({ success: true, data: coOp });
    } catch (error) {
        console.error("Error creating co-operator:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get All CoOperators
export const getCoOperators = async (req, res) => {
    try {
        const coOps = await CoOperator.find();
        res.status(200).json({ success: true, data: coOps });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
