import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sign_token, cookie_options, COOKIE_NAME } from "../config/jwt.js";

const to_public_user = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role.name
});

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Email, password and role are required."
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).populate("role");

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const matches = await bcrypt.compare(password, user.password);

        if (!matches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        if (user.role.name !== role) {
            return res.status(403).json({
                success: false,
                message: "This account is not registered under the selected role."
            });
        }

        const token = sign_token({ id: user._id });
        res.cookie(COOKIE_NAME, token, cookie_options);

        return res.status(200).json({
            success: true,
            user: to_public_user(user)
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const logout = (req, res) => {
    res.clearCookie(COOKIE_NAME, cookie_options);

    return res.status(200).json({
        success: true,
        message: "Logged out."
    });
};

export const get_me = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: to_public_user(req.user)
    });
};
