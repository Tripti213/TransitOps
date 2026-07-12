import express from "express";
import{
    get_maintenances,
    get_maintenance,
    create_maintenance,
    get_active_maintenance,
    complete_maintenance,
    get_maintenance_history
}from "../controllers/maintenanceController.js";

const router=express.Router();

router.route("/")
.get(get_maintenances)
.post(create_maintenance);

router.get("/active",get_active_maintenance);

router.get("/history",get_maintenance_history);

router.route("/:id")
.get(get_maintenance);

router.patch("/:id/complete",complete_maintenance);

export default router;