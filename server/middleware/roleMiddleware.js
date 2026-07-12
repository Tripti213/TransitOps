export const authorize = (...roleNames) => (req, res, next) => {
    if (!req.user || !roleNames.includes(req.user.role?.name)) {
        return res.status(403).json({
            success: false,
            message: "You do not have permission to perform this action."
        });
    }
    next();
};
