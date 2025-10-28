import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const loginSuperAdmin = (req, res) => {
    const { email, password } = req.body;

    if (
        email === process.env.SUPER_ADMIN_EMAIL &&
        password === process.env.SUPER_ADMIN_PASSWORD
    ) {
        // JWT generate kar
        const token = jwt.sign(
            { email, role: "super-admin" }, // email + role save
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({ success: true, token });
    }

    return res.status(401).json({ success: false, message: "Invalid credentials" });
};
