import mongoose from "mongoose";
import Maintenance from "../models/Maintenance.js";
import Vehicle from "../models/Vehicle.js";

export const get_maintenances=async(req,res)=>{
    try{
        const maintenances=await Maintenance.find()
        .populate("vehicle")
        .sort({createdAt:-1});

        return res.status(200).json({
            success:true,
            count:maintenances.length,
            maintenances
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const get_maintenance=async(req,res)=>{
    try{
        const maintenance=await Maintenance.findById(req.params.id)
        .populate("vehicle");

        if(!maintenance){
            return res.status(404).json({
                success:false,
                message:"Maintenance record not found."
            });
        }

        return res.status(200).json({
            success:true,
            maintenance
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const create_maintenance=async(req,res)=>{
    const session=await mongoose.startSession();

    try{
        session.startTransaction();

        const{
            vehicle,
            type,
            description,
            cost,
            startDate
        }=req.body;

        if(!vehicle||!type||!cost||!startDate){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Please fill all required fields."
            });
        }

        if(cost<=0){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Cost must be greater than zero."
            });
        }

        const vehicle_doc=await Vehicle.findById(vehicle).session(session);

        if(!vehicle_doc){
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success:false,
                message:"Vehicle not found."
            });
        }

        if(vehicle_doc.status==="Retired"){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Vehicle is retired."
            });
        }

        if(vehicle_doc.status==="On Trip"){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Vehicle is currently on a trip."
            });
        }

        if(vehicle_doc.status==="In Shop"){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Vehicle is already under maintenance."
            });
        }

        const maintenance=await Maintenance.create([{
            vehicle,
            type,
            description,
            cost,
            startDate
        }],{session});

        vehicle_doc.status="In Shop";

        await vehicle_doc.save({session});

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success:true,
            message:"Maintenance started successfully.",
            maintenance:maintenance[0]
        });
    }
    catch(err){
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const complete_maintenance=async(req,res)=>{
    const session=await mongoose.startSession();

    try{
        session.startTransaction();

        const maintenance=await Maintenance.findById(req.params.id).session(session);

        if(!maintenance){
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success:false,
                message:"Maintenance record not found."
            });
        }

        if(maintenance.status==="Closed"){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Maintenance is already closed."
            });
        }

        const vehicle=await Vehicle.findById(maintenance.vehicle).session(session);

        if(!vehicle){
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success:false,
                message:"Vehicle not found."
            });
        }

        maintenance.status="Closed";
        maintenance.endDate=new Date();

        if(vehicle.status!=="Retired"){
            vehicle.status="Available";
        }

        await maintenance.save({session});
        await vehicle.save({session});

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success:true,
            message:"Maintenance completed successfully.",
            maintenance
        });
    }
    catch(err){
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};