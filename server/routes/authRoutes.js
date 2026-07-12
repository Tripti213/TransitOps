import express from "express";
import { login, logout, get_me } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", protect, get_me);

export default router;
