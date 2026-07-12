import express from "express";

import{
    fuel_report,
    fleet_utilization_report,
    analytics_report,
    export_operational_cost_csv
}from "../controllers/reportController.js";

const router=express.Router();

router.get("/fuel",fuel_report);

router.get("/fleet-utilization",fleet_utilization_report);

router.get("/analytics",analytics_report);

router.get(
    "/operational-cost/export",
    export_operational_cost_csv
);

export default router;