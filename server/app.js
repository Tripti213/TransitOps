import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {not_found,error_handler} from "./middleware/errorMiddleware.js";

import auth_routes from "./routes/authRoutes.js";
import vehicle_routes from "./routes/vehicleRoutes.js";
import driver_routes from "./routes/driverRoutes.js";
import trip_routes from "./routes/tripRoutes.js";
import maintenance_routes from "./routes/maintenanceRoutes.js";
import fuel_routes from "./routes/fuelRoutes.js";
import expense_routes from "./routes/expenseRoutes.js";
import report_routes from "./routes/reportRoutes.js";

const app=express();

app.use(cors({
    origin:process.env.CLIENT_URL||"http://localhost:5173"||"https://transit-ops-mauve.vercel.app",
    credentials:true
}));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.json({
        success:true,
        message:"TransitOps server working.."
    });
});

app.use("/api/auth",auth_routes);

app.use("/api/vehicles",vehicle_routes);

app.use("/api/drivers",driver_routes);

app.use("/api/trips",trip_routes);

app.use("/api/maintenance",maintenance_routes);

app.use("/api/fuel",fuel_routes);

app.use("/api/expenses",expense_routes);

app.use("/api/reports",report_routes);

app.use(not_found);

app.use(error_handler);

export default app;