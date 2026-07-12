import express from "express";
import {
    get_dashboard,
    get_reports
} from "../controllers/reportController.js";

const router=express.Router();

router.get("/dashboard",get_dashboard);

router.get("/",get_reports);

export default router;