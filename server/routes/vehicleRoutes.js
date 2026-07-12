import express from "express";
import {
    create_vehicle,
    get_vehicles,
    get_vehicle,
    update_vehicle,
    delete_vehicle
} from "../controllers/vehicleController.js";

const router=express.Router();

router.route("/").get(get_vehicles).post(create_vehicle);

router.route("/:id").get(get_vehicle).put(update_vehicle).delete(delete_vehicle);

export default router;