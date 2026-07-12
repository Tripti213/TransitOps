import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import Trip from "../models/Trip.js";
import Maintenance from "../models/Maintenance.js";
import FuelLog from "../models/FuelLog.js";
import Expense from "../models/Expense.js";

export const fuel_report=async(req,res)=>{
    try{

        const trips=await Trip.find({
            status:"Completed"
        });

        let totalDistance=0;
        let totalFuel=0;

        trips.forEach(trip=>{
            totalDistance+=trip.actualDistance||0;
            totalFuel+=trip.fuelConsumed||0;
        });

        const fuelLogs=await FuelLog.find();

        const totalFuelCost=fuelLogs.reduce(
            (sum,log)=>sum+log.cost,
            0
        );

        return res.status(200).json({
            success:true,
            report:{
                completedTrips:trips.length,
                totalDistance,
                totalFuel,
                averageMileage:
                totalFuel===0
                ?0
                :Number((totalDistance/totalFuel).toFixed(2)),
                totalFuelCost
            }
        });

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const fleet_report=async(req,res)=>{
    try{

        const available=await Vehicle.countDocuments({
            status:"Available"
        });

        const onTrip=await Vehicle.countDocuments({
            status:"On Trip"
        });

        const inShop=await Vehicle.countDocuments({
            status:"In Shop"
        });

        const retired=await Vehicle.countDocuments({
            status:"Retired"
        });

        return res.status(200).json({
            success:true,
            report:{
                available,
                onTrip,
                inShop,
                retired
            }
        });

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const cost_report=async(req,res)=>{
    try{

        const maintenance=await Maintenance.find();

        const fuel=await FuelLog.find();

        const expenses=await Expense.find();

        const maintenanceCost=maintenance.reduce(
            (sum,item)=>sum+item.cost,
            0
        );

        const fuelCost=fuel.reduce(
            (sum,item)=>sum+item.cost,
            0
        );

        const expenseCost=expenses.reduce(
            (sum,item)=>sum+item.amount,
            0
        );

        return res.status(200).json({
            success:true,
            report:{
                maintenanceCost,
                fuelCost,
                expenseCost,
                totalOperationalCost:
                maintenanceCost+
                fuelCost+
                expenseCost
            }
        });

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};