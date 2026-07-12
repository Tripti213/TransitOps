import express from "express";
import{
    get_maintenances,
    get_maintenance,
    create_maintenance,
    complete_maintenance
}from "../controllers/maintenanceController.js";

const router=express.Router();

router.route("/")
.get(get_maintenances)
.post(create_maintenance);

router.route("/:id")
.get(get_maintenance);

router.patch("/:id/complete",complete_maintenance);

export default router;