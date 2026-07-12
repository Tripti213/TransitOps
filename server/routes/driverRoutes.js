import express from "express";
import {
    create_driver,
    get_drivers,
    get_driver,
    update_driver,
    suspend_driver
} from "../controllers/driverController.js";

const router=express.Router();

router.route("/").get(get_drivers).post(create_driver);

router.route("/:id").get(get_driver).put(update_driver);

router.patch("/:id/suspend",suspend_driver);

export default router;