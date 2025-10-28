import jwt from "jsonwebtoken";

export const districtProtect = (req, res, next) => {
    try {
        let token;

        // ✅ Check for Bearer Token
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // ❌ No token found
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token missing",
            });
        }

        // ✅ Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "change_this_secret");

        // ✅ Attach district head info to request
        req.districtHead = {
            id: decoded.id,
            districtHeadEmail: decoded.districtHeadEmail, // must match what you put in token
            districtName: decoded.districtName,
        };

        next();
    } catch (error) {
        console.error("District Auth middleware error:", error);
        res.status(401).json({
            success: false,
            message: "Not authorized, token invalid or expired",
        });
    }
};
