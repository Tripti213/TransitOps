import express from "express";
import {
    create_maintenance,
    get_maintenances,
    get_maintenance,
    close_maintenance
} from "../controllers/maintenanceController.js";

const router=express.Router();

router.route("/").get(get_maintenances).post(create_maintenance);

router.get("/:id",get_maintenance);

router.patch("/:id/close",close_maintenance);

export default router;