import { verify_token, COOKIE_NAME } from "../config/jwt.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.[COOKIE_NAME];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated."
            });
        }

        const decoded = verify_token(token);
        const user = await User.findById(decoded.id).populate("role");

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated."
            });
        }

        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session."
        });
    }
};
