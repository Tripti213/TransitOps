import FuelLog from "../models/FuelLog.js";
import Vehicle from "../models/Vehicle.js";
import Trip from "../models/Trip.js";

export const get_fuel_logs=async(req,res)=>{
    try{
        const fuel_logs=await FuelLog.find()
        .populate("vehicle")
        .populate("trip")
        .sort({createdAt:-1});

        return res.status(200).json({
            success:true,
            count:fuel_logs.length,
            fuel_logs
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const get_fuel_log=async(req,res)=>{
    try{
        const fuel_log=await FuelLog.findById(req.params.id)
        .populate("vehicle")
        .populate("trip");

        if(!fuel_log){
            return res.status(404).json({
                success:false,
                message:"Fuel log not found."
            });
        }

        return res.status(200).json({
            success:true,
            fuel_log
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const create_fuel_log=async(req,res)=>{
    try{
        const{
            vehicle,
            trip,
            liters,
            cost,
            date
        }=req.body;

        if(!vehicle||!liters||!cost||!date){
            return res.status(400).json({
                success:false,
                message:"Please fill all required fields."
            });
        }

        if(liters<=0){
            return res.status(400).json({
                success:false,
                message:"Fuel quantity must be greater than zero."
            });
        }

        if(cost<=0){
            return res.status(400).json({
                success:false,
                message:"Fuel cost must be greater than zero."
            });
        }

        const vehicle_doc=await Vehicle.findById(vehicle);

        if(!vehicle_doc){
            return res.status(404).json({
                success:false,
                message:"Vehicle not found."
            });
        }

        if(trip){
            const trip_doc=await Trip.findById(trip);

            if(!trip_doc){
                return res.status(404).json({
                    success:false,
                    message:"Trip not found."
                });
            }
        }

        const fuel_log=await FuelLog.create({
            vehicle,
            trip,
            liters,
            cost,
            date
        });

        return res.status(201).json({
            success:true,
            message:"Fuel log created successfully.",
            fuel_log
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};