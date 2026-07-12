import express from "express";
import {
    create_vehicle,
    get_vehicles,
    get_vehicle,
    update_vehicle,
    retire_vehicle,
    get_available_vehicles,
    get_vehicle_history
} from "../controllers/vehicleController.js";

const router=express.Router();

router.route("/").get(get_vehicles).post(create_vehicle);

router.get("/available",get_available_vehicles);

router.get("/:id/history",get_vehicle_history);


router.route("/:id").get(get_vehicle).put(update_vehicle);

router.patch("/:id/retire",retire_vehicle);




export default router;