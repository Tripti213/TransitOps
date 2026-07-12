import mongoose from "mongoose";
import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import FuelLog from "../models/FuelLog.js";

export const get_trips=async(req,res)=>{
    try{

        const{
            status,
            vehicle,
            driver,
            source,
            destination,
            search,
            sort,
            page=1,
            limit=10
        }=req.query;

        const filter={};

        if(status){
            filter.status=status;
        }

        if(vehicle){
            filter.vehicle=vehicle;
        }

        if(driver){
            filter.driver=driver;
        }

        if(source){
            filter.source={
                $regex:source,
                $options:"i"
            };
        }

        if(destination){
            filter.destination={
                $regex:destination,
                $options:"i"
            };
        }

        if(search){
            filter.$or=[
                {
                    source:{
                        $regex:search,
                        $options:"i"
                    }
                },
                {
                    destination:{
                        $regex:search,
                        $options:"i"
                    }
                }
            ];
        }

        const skip=(page-1)*Number(limit);

        let query=Trip.find(filter)
        .populate("vehicle")
        .populate("driver");

        if(sort){
            query=query.sort({
                [sort]:1
            });
        }
        else{
            query=query.sort({
                createdAt:-1
            });
        }

        query=query.skip(skip).limit(Number(limit));

        const trips=await query;

        const total=await Trip.countDocuments(filter);

        return res.status(200).json({
            success:true,
            total,
            page:Number(page),
            pages:Math.ceil(total/Number(limit)),
            count:trips.length,
            trips
        });

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

export const get_trip=async(req,res)=>{
    try{
        const trip=await Trip.findById(req.params.id)
        .populate("vehicle")
        .populate("driver");

        if(!trip){
            return res.status(404).json({
                success:false,
                message:"Trip not found."
            });
        }

        return res.status(200).json({
            success:true,
            trip
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const create_trip=async(req,res)=>{
    try{
        const{
            source,
            destination,
            vehicle,
            driver,
            cargoWeight,
            plannedDistance,
            plannedDate,
            startOdometer
        }=req.body;

        if(!source||!destination||!vehicle||!driver||!cargoWeight||!plannedDistance){
            return res.status(400).json({
                success:false,
                message:"Please fill all required fields."
            });
        }

        const vehicle_doc=await Vehicle.findById(vehicle);

        if(!vehicle_doc){
            return res.status(404).json({
                success:false,
                message:"Vehicle not found."
            });
        }

        const driver_doc=await Driver.findById(driver);

        if(!driver_doc){
            return res.status(404).json({
                success:false,
                message:"Driver not found."
            });
        }

        if(vehicle_doc.status==="Retired"){
            return res.status(400).json({
                success:false,
                message:"Vehicle is retired."
            });
        }

        if(vehicle_doc.status==="In Shop"){
            return res.status(400).json({
                success:false,
                message:"Vehicle is under maintenance."
            });
        }

        if(vehicle_doc.status==="On Trip"){
            return res.status(400).json({
                success:false,
                message:"Vehicle is already on a trip."
            });
        }

        if(driver_doc.status==="Suspended"){
            return res.status(400).json({
                success:false,
                message:"Driver is suspended."
            });
        }

        if(driver_doc.status==="On Trip"){
            return res.status(400).json({
                success:false,
                message:"Driver is already on a trip."
            });
        }

        if(new Date(driver_doc.licenseExpiryDate)<new Date()){
            return res.status(400).json({
                success:false,
                message:"Driver license has expired."
            });
        }

        if(cargoWeight>vehicle_doc.maxLoadCapacity){
            return res.status(400).json({
                success:false,
                message:"Cargo exceeds vehicle capacity."
            });
        }

        const trip=await Trip.create({
            source,
            destination,
            vehicle,
            driver,
            cargoWeight,
            plannedDistance,
            plannedDate,
            startOdometer:startOdometer??vehicle_doc.odometer,
            status:"Draft"
        });

        return res.status(201).json({
            success:true,
            message:"Trip created successfully.",
            trip
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

export const update_trip=async(req,res)=>{
    try{
        const trip=await Trip.findById(req.params.id);

        if(!trip){
            return res.status(404).json({
                success:false,
                message:"Trip not found."
            });
        }

        if(trip.status!=="Draft"){
            return res.status(400).json({
                success:false,
                message:"Only draft trips can be updated."
            });
        }

        const{
            source,
            destination,
            vehicle,
            driver,
            cargoWeight,
            plannedDistance
        }=req.body;

        if(vehicle){
            const vehicle_doc=await Vehicle.findById(vehicle);

            if(!vehicle_doc){
                return res.status(404).json({
                    success:false,
                    message:"Vehicle not found."
                });
            }

            if(vehicle_doc.status==="Retired"){
                return res.status(400).json({
                    success:false,
                    message:"Vehicle is retired."
                });
            }

            if(vehicle_doc.status==="In Shop"){
                return res.status(400).json({
                    success:false,
                    message:"Vehicle is under maintenance."
                });
            }

            if(vehicle_doc.status==="On Trip"){
                return res.status(400).json({
                    success:false,
                    message:"Vehicle is already on a trip."
                });
            }

            if((cargoWeight??trip.cargoWeight)>vehicle_doc.maxLoadCapacity){
                return res.status(400).json({
                    success:false,
                    message:"Cargo exceeds vehicle capacity."
                });
            }

            trip.vehicle=vehicle;
        }

        if(driver){
            const driver_doc=await Driver.findById(driver);

            if(!driver_doc){
                return res.status(404).json({
                    success:false,
                    message:"Driver not found."
                });
            }

            if(driver_doc.status==="Suspended"){
                return res.status(400).json({
                    success:false,
                    message:"Driver is suspended."
                });
            }

            if(driver_doc.status==="On Trip"){
                return res.status(400).json({
                    success:false,
                    message:"Driver is already on a trip."
                });
            }

            if(new Date(driver_doc.licenseExpiryDate)<new Date()){
                return res.status(400).json({
                    success:false,
                    message:"Driver license has expired."
                });
            }

            trip.driver=driver;
        }

        trip.source=source??trip.source;
        trip.destination=destination??trip.destination;
        trip.cargoWeight=cargoWeight??trip.cargoWeight;
        trip.plannedDistance=plannedDistance??trip.plannedDistance;

        await trip.save();

        return res.status(200).json({
            success:true,
            message:"Trip updated successfully.",
            trip
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

export const dispatch_trip=async(req,res)=>{
    const session=await mongoose.startSession();

    try{
        session.startTransaction();

        const trip=await Trip.findById(req.params.id).session(session);

        if(!trip){
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success:false,
                message:"Trip not found."
            });
        }

        if(trip.status!=="Draft"){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Only draft trips can be dispatched."
            });
        }

        const vehicle=await Vehicle.findById(trip.vehicle).session(session);

        if(!vehicle){
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success:false,
                message:"Vehicle not found."
            });
        }

        const driver=await Driver.findById(trip.driver).session(session);

        if(!driver){
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success:false,
                message:"Driver not found."
            });
        }

        if(vehicle.status==="Retired"){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Vehicle is retired."
            });
        }

        if(vehicle.status==="In Shop"){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Vehicle is under maintenance."
            });
        }

        if(vehicle.status==="On Trip"){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Vehicle is already on a trip."
            });
        }

        if(driver.status==="Suspended"){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Driver is suspended."
            });
        }

        if(driver.status==="On Trip"){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Driver is already on a trip."
            });
        }

        if(new Date(driver.licenseExpiryDate)<new Date()){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Driver license has expired."
            });
        }

        if(trip.cargoWeight>vehicle.maxLoadCapacity){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Cargo exceeds vehicle capacity."
            });
        }

        trip.status="Dispatched";
        trip.dispatchedAt=new Date();

        vehicle.status="On Trip";

        driver.status="On Trip";

        await trip.save({session});
        await vehicle.save({session});
        await driver.save({session});

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success:true,
            message:"Trip dispatched successfully.",
            trip
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

export const complete_trip=async(req,res)=>{
    const session=await mongoose.startSession();

    try{
        session.startTransaction();

        const{
            actualDistance,
            fuelConsumed,
            endOdometer,
            fuelCost,
            fuelDate
        }=req.body;

        const trip=await Trip.findById(req.params.id).session(session);

        if(!trip){
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success:false,
                message:"Trip not found."
            });
        }

        if(trip.status!=="Dispatched"){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Only dispatched trips can be completed."
            });
        }

        if(!actualDistance||!fuelConsumed||!endOdometer||!fuelCost){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Please fill all required fields."
            });
        }

        const vehicle=await Vehicle.findById(trip.vehicle).session(session);

        const driver=await Driver.findById(trip.driver).session(session);

        if(!vehicle||!driver){
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success:false,
                message:"Vehicle or Driver not found."
            });
        }

        if(endOdometer<vehicle.odometer){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Invalid odometer reading."
            });
        }

        trip.actualDistance=actualDistance;
        trip.endOdometer=endOdometer;
        trip.fuelConsumed=fuelConsumed;
        trip.completedAt=new Date();
        trip.status="Completed";

        vehicle.odometer=endOdometer;
        vehicle.status="Available";

        driver.status="Available";

        await FuelLog.create([{
            vehicle:vehicle._id,
            trip:trip._id,
            liters:fuelConsumed,
            cost:fuelCost,
            date:fuelDate||new Date()
        }],{session});

        await trip.save({session});
        await vehicle.save({session});
        await driver.save({session});

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success:true,
            message:"Trip completed successfully.",
            trip
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


export const cancel_trip=async(req,res)=>{
    const session=await mongoose.startSession();

    try{
        session.startTransaction();

        const trip=await Trip.findById(req.params.id).session(session);

        if(!trip){
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success:false,
                message:"Trip not found."
            });
        }

        if(trip.status!=="Draft"&&trip.status!=="Dispatched"){
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"Only draft or dispatched trips can be cancelled."
            });
        }

        const wasDispatched=trip.status==="Dispatched";

        trip.status="Cancelled";
        trip.cancelledAt=new Date();

        await trip.save({session});

        // A draft trip never marked its vehicle/driver busy, so only a
        // dispatched trip needs to free them back up on cancellation.
        if(wasDispatched){
            const vehicle=await Vehicle.findById(trip.vehicle).session(session);

            const driver=await Driver.findById(trip.driver).session(session);

            if(!vehicle||!driver){
                await session.abortTransaction();
                session.endSession();

                return res.status(404).json({
                    success:false,
                    message:"Vehicle or Driver not found."
                });
            }

            vehicle.status="Available";

            driver.status="Available";

            await vehicle.save({session});
            await driver.save({session});
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success:true,
            message:"Trip cancelled successfully.",
            trip
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


export const get_dispatch_data=async(req,res)=>{
    try{

        const today=new Date();

        const [vehicles,drivers]=await Promise.all([

            Vehicle.find({
                status:"Available"
            }).sort({
                registrationNumber:1
            }),

            Driver.find({
                status:"Available",
                licenseExpiryDate:{
                    $gte:today
                }
            }).sort({
                name:1
            })

        ]);

        return res.status(200).json({
            success:true,
            vehicles,
            drivers
        });

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};