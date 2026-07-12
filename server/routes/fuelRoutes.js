import express from "express";
import {
    create_fuel_log,
    get_fuel_logs,
    get_fuel_log,
    update_fuel_log,
    delete_fuel_log
} from "../controllers/fuelController.js";

const router=express.Router();

router.route("/").get(get_fuel_logs).post(create_fuel_log);

router.route("/:id").get(get_fuel_log).put(update_fuel_log).delete(delete_fuel_log);

export default router;