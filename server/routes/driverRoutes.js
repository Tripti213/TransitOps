import express from "express";
import {
    create_driver,
    get_drivers,
    get_driver,
    update_driver,
    suspend_driver
} from "../controllers/driverController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router=express.Router();

router.route("/")
    .get(protect,get_drivers)
    .post(protect,authorize("FleetManager"),create_driver);

router.route("/:id")
    .get(protect,get_driver)
    .put(protect,authorize("FleetManager"),update_driver);

router.patch("/:id/suspend",protect,authorize("FleetManager"),suspend_driver);

export default router;