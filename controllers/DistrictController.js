import District from "../models/District.js";

// ✅ Create District
export const createDistrict = async (req, res) => {
    try {
        const { departmentName, districtName } = req.body;
        if (!departmentName || !districtName)
            return res.status(400).json({ success: false, message: "Department and District name required" });

        const exist = await District.findOne({ districtName });
        if (exist)
            return res.status(400).json({ success: false, message: "District already exists" });

        const district = await District.create({ departmentName, districtName });
        res.status(201).json({ success: true, data: district });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get All Districts
export const getDistricts = async (req, res) => {
    try {
        const districts = await District.find();
        res.status(200).json({ success: true, data: districts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
