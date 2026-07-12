import jwt from "jsonwebtoken";

export const COOKIE_NAME = "token";

export const sign_token = (payload) =>
    jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

export const verify_token = (token) => jwt.verify(token, process.env.JWT_SECRET);

export const cookie_options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
