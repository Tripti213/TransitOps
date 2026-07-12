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


export const fleet_utilization_report=async(req,res)=>{
    try{

        const totalVehicles=await Vehicle.countDocuments();

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

        const activeFleet=totalVehicles-retired;

        const fleetUtilization=
            activeFleet===0
            ?0
            :Number(((onTrip/activeFleet)*100).toFixed(2));

        return res.status(200).json({
            success:true,
            totalVehicles,
            available,
            onTrip,
            inShop,
            retired,
            fleetUtilization
        });

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

export const analytics_report=async(req,res)=>{
    try{

        const[
            totalVehicles,
            availableVehicles,
            onTripVehicles,
            inShopVehicles,
            retiredVehicles,

            totalDrivers,
            availableDrivers,
            onTripDrivers,
            suspendedDrivers,

            activeTrips,
            completedTrips,
            cancelledTrips,

            activeMaintenance,

            fuelLogs,
            maintenanceLogs,
            expenses

        ]=await Promise.all([

            Vehicle.countDocuments(),
            Vehicle.countDocuments({status:"Available"}),
            Vehicle.countDocuments({status:"On Trip"}),
            Vehicle.countDocuments({status:"In Shop"}),
            Vehicle.countDocuments({status:"Retired"}),

            Driver.countDocuments(),
            Driver.countDocuments({status:"Available"}),
            Driver.countDocuments({status:"On Trip"}),
            Driver.countDocuments({status:"Suspended"}),

            Trip.countDocuments({status:"Dispatched"}),
            Trip.countDocuments({status:"Completed"}),
            Trip.countDocuments({status:"Cancelled"}),

            Maintenance.countDocuments({status:"Active"}),

            FuelLog.find(),
            Maintenance.find(),
            Expense.find()

        ]);

        const fuelCost=fuelLogs.reduce(
            (sum,log)=>sum+log.cost,
            0
        );

        const maintenanceCost=maintenanceLogs.reduce(
            (sum,log)=>sum+log.cost,
            0
        );

        const expenseCost=expenses.reduce(
            (sum,expense)=>sum+expense.amount,
            0
        );

        return res.status(200).json({
            success:true,

            vehicles:{
                total:totalVehicles,
                available:availableVehicles,
                onTrip:onTripVehicles,
                inShop:inShopVehicles,
                retired:retiredVehicles
            },

            drivers:{
                total:totalDrivers,
                available:availableDrivers,
                onTrip:onTripDrivers,
                suspended:suspendedDrivers
            },

            trips:{
                active:activeTrips,
                completed:completedTrips,
                cancelled:cancelledTrips
            },

            maintenance:{
                active:activeMaintenance
            },

            finance:{
                fuelCost,
                maintenanceCost,
                expenseCost,
                totalCost:
                    fuelCost+
                    maintenanceCost+
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