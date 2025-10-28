import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "change_this_secret");

        // ✅ Ab req.admin ke andar properly set karo
        req.admin = {
            id: decoded.id,
            departmentHeadEmail: decoded.departmentHeadEmail, // ensure token contains this field
        };

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
};
