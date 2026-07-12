import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import Trip from "../models/Trip.js";
import Expense from "../models/Expense.js";

export const getStats = async () => {
  const [totalVehicles, activeDrivers, pendingTrips, totalExpenses] = await Promise.all([
    Vehicle.countDocuments(),
    Driver.countDocuments({ status: "Active" }),
    Trip.countDocuments({ status: "Pending" }),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
  ]);

  return {
    totalVehicles,
    activeDrivers,
    pendingTrips,
    monthlyExpenses: totalExpenses[0]?.total || 0
  };
};