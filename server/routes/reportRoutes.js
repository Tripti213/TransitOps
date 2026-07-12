import express from "express";

import{
    fuel_report,
    fleet_report,
    cost_report
}from "../controllers/reportController.js";

const router=express.Router();

router.get("/fuel",fuel_report);

router.get("/fleet",fleet_report);

router.get("/cost",cost_report);

export default router;