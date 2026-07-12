import express from "express";
import {
    create_trip,
    get_trips,
    get_trip,
    update_trip,
    dispatch_trip,
    complete_trip,
    cancel_trip,
    get_dispatch_data
} from "../controllers/tripController.js";

const router=express.Router();

router.route("/").get(get_trips).post(create_trip);

router.get("/dispatch-data",get_dispatch_data);

router.route("/:id").get(get_trip).put(update_trip)

router.patch("/:id/dispatch",dispatch_trip);

router.patch("/:id/complete",complete_trip);

router.patch("/:id/cancel",cancel_trip);

export default router;