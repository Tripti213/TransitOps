import express from "express";

import{
    fuel_report,
    fleet_utilization_report,
    analytics_report
}from "../controllers/reportController.js";

const router=express.Router();

router.get("/fuel",fuel_report);

router.get("/fleet-utilization",fleet_utilization_report);

router.get("/analytics",analytics_report);

export default router;