import Vehicle from "../models/Vehicle.js";
import Trip from "../models/Trip.js";
import FuelLog from "../models/FuelLog.js";
import Maintenance from "../models/Maintenance.js";
import Expense from "../models/Expense.js";

export const create_vehicle=async(req,res)=>{
    try{
        const{
            registrationNumber,
            name,
            type,
            maxLoadCapacity,
            odometer,
            acquisitionCost,
            region
        }=req.body;

        if(!registrationNumber||!name||!type||!maxLoadCapacity||!acquisitionCost){
            return res.status(400).json({
                success:false,
                message:"Please fill all required fields."
            });
        }

        const vehicle_exists=await Vehicle.findOne({registrationNumber});

        if(vehicle_exists){
            return res.status(409).json({
                success:false,
                message:"Vehicle already exists."
            });
        }

        const vehicle=await Vehicle.create({
            registrationNumber,
            name,
            type,
            maxLoadCapacity,
            odometer,
            acquisitionCost,
            region
        });

        return res.status(201).json({
            success:true,
            message:"Vehicle registered successfully.",
            vehicle
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

export const get_vehicles=async(req,res)=>{
    try{

        const{
            status,
            type,
            region,
            search,
            sort,
            page=1,
            limit=10
        }=req.query;

        const filter={};

        if(status){
            filter.status=status;
        }

        if(type){
            filter.type=type;
        }

        if(region){
            filter.region=region;
        }

        if(search){
            filter.$or=[
                {
                    name:{
                        $regex:search,
                        $options:"i"
                    }
                },
                {
                    registrationNumber:{
                        $regex:search,
                        $options:"i"
                    }
                }
            ];
        }

        const skip=(page-1)*limit;

        let query=Vehicle.find(filter);

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

        const vehicles=await query;

        const total=await Vehicle.countDocuments(filter);

        return res.status(200).json({
            success:true,
            total,
            page:Number(page),
            pages:Math.ceil(total/limit),
            count:vehicles.length,
            vehicles
        });

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

export const get_vehicle=async(req,res)=>{
    try{
        const vehicle=await Vehicle.findById(req.params.id);

        if(!vehicle){
            return res.status(404).json({
                success:false,
                message:"Vehicle not found."
            });
        }

        return res.status(200).json({
            success:true,
            vehicle
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

export const update_vehicle=async(req,res)=>{
    try{
        const vehicle=await Vehicle.findById(req.params.id);

        if(!vehicle){
            return res.status(404).json({
                success:false,
                message:"Vehicle not found."
            });
        }
        if(vehicle.status==="Retired"){
    return res.status(400).json({
        success:false,
        message:"Retired vehicles cannot be updated."
    });
}

        if(req.body.registrationNumber){
            const exists=await Vehicle.findOne({
                registrationNumber:req.body.registrationNumber,
                _id:{$ne:req.params.id}
            });

            if(exists){
                return res.status(409).json({
                    success:false,
                    message:"Registration number already exists."
                });
            }
        }

        if(req.body.odometer&&req.body.odometer<vehicle.odometer){
    return res.status(400).json({
        success:false,
        message:"Odometer cannot decrease."
    });
}

        vehicle.registrationNumber=req.body.registrationNumber??vehicle.registrationNumber;
        vehicle.name=req.body.name??vehicle.name;
        vehicle.type=req.body.type??vehicle.type;
        vehicle.maxLoadCapacity=req.body.maxLoadCapacity??vehicle.maxLoadCapacity;
        vehicle.odometer=req.body.odometer??vehicle.odometer;
        vehicle.acquisitionCost=req.body.acquisitionCost??vehicle.acquisitionCost;
        vehicle.region=req.body.region??vehicle.region;

        await vehicle.save();

        return res.status(200).json({
            success:true,
            message:"Vehicle updated successfully.",
            vehicle
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

export const retire_vehicle=async(req,res)=>{
    try{
        const vehicle=await Vehicle.findById(req.params.id);

        if(!vehicle){
            return res.status(404).json({
                success:false,
                message:"Vehicle not found."
            });
        }

        if(vehicle.status==="Retired"){
    return res.status(400).json({
        success:false,
        message:"Vehicle is already retired."
    });
}


        if(vehicle.status==="On Trip"){
            return res.status(400).json({
                success:false,
                message:"Vehicle is currently on a trip."
            });
        }

        if(vehicle.status==="In Shop"){
    return res.status(400).json({
        success:false,
        message:"Vehicle is currently under maintenance."
    });
}
        

        vehicle.status="Retired";

        await vehicle.save();

        return res.status(200).json({
            success:true,
            message:"Vehicle retired successfully.",
            vehicle
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const get_available_vehicles=async(req,res)=>{
    try{

        const vehicles=await Vehicle.find({
            status:"Available"
        }).sort({
            registrationNumber:1
        });

        return res.status(200).json({
            success:true,
            count:vehicles.length,
            vehicles
        });

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const get_vehicle_history=async(req,res)=>{
    try{

        const vehicle=await Vehicle.findById(req.params.id);

        if(!vehicle){
            return res.status(404).json({
                success:false,
                message:"Vehicle not found."
            });
        }

        const[
            trips,
            fuelLogs,
            maintenanceLogs,
            expenses
        ]=await Promise.all([

            Trip.find({
                vehicle:req.params.id
            }).populate("driver"),

            FuelLog.find({
                vehicle:req.params.id
            }).sort({
                date:-1
            }),

            Maintenance.find({
                vehicle:req.params.id
            }).sort({
                startDate:-1
            }),

            Expense.find({
                vehicle:req.params.id
            }).sort({
                date:-1
            })

        ]);

        return res.status(200).json({
            success:true,
            vehicle,
            trips,
            fuelLogs,
            maintenanceLogs,
            expenses
        });

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};