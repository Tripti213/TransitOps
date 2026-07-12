/**
 * Seed script for TransitOps
 * Populates Roles, Users, Vehicles, Drivers, Trips, Maintenance, Fuel Logs, Expenses.
 * Deliberately covers every status value from the spec so the UI/business rules
 * can be exercised immediately (dispatch validation, In Shop hiding, expired
 * license blocking, ROI calc inputs, etc).
 *
 * Run: node seed/seed.js   (from the server/ directory, with MONGO_URI set)
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

const Role = require("../models/Role");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const Maintenance = require("../models/Maintenance");
const FuelLog = require("../models/FuelLog");
const Expense = require("../models/Expense");

const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);
const daysAgo = (n) => daysFromNow(-n);

async function seed() {
  await connectDB();
  console.log("Connected. Clearing existing data...");

  await Promise.all([
    Role.deleteMany({}),
    User.deleteMany({}),
    Vehicle.deleteMany({}),
    Driver.deleteMany({}),
    Trip.deleteMany({}),
    Maintenance.deleteMany({}),
    FuelLog.deleteMany({}),
    Expense.deleteMany({}),
  ]);

  // ---------- Roles ----------
  const roleDocs = await Role.insertMany([
    { name: "FleetManager", description: "Oversees fleet assets, maintenance, and vehicle lifecycle" },
    { name: "Driver", description: "Creates trips, assigns vehicles and drivers, monitors deliveries" },
    { name: "SafetyOfficer", description: "Ensures driver compliance and safety scores" },
    { name: "FinancialAnalyst", description: "Reviews expenses, fuel, maintenance costs, profitability" },
  ]);
  const roleId = Object.fromEntries(roleDocs.map((r) => [r.name, r._id]));

  // ---------- Users (one per role, password: Passw0rd!) ----------
  const passwordHash = await bcrypt.hash("Passw0rd!", 10);
  const userDocs = await User.insertMany([
    { name: "Priya Sharma", email: "fleetmanager@transitops.com", password: passwordHash, role: roleId.FleetManager, phone: "9810000001" },
    { name: "Alex Menon", email: "driver@transitops.com", password: passwordHash, role: roleId.Driver, phone: "9810000002" },
    { name: "Ritu Kapoor", email: "safety@transitops.com", password: passwordHash, role: roleId.SafetyOfficer, phone: "9810000003" },
    { name: "Sameer Verma", email: "finance@transitops.com", password: passwordHash, role: roleId.FinancialAnalyst, phone: "9810000004" },
  ]);
  const dispatcherUser = userDocs[1]._id;

  // ---------- Vehicles ----------
  // Covers all 4 statuses + varied regions/types for dashboard filters.
  const vehicleDocs = await Vehicle.insertMany([
    { registrationNumber: "UP16-AB-1001", name: "Tata Ace", type: "Mini-Truck", maxLoadCapacity: 750, odometer: 18450, acquisitionCost: 650000, status: "Available", region: "North" },
    { registrationNumber: "UP16-AB-1002", name: "Van-05", type: "Van", maxLoadCapacity: 500, odometer: 22310, acquisitionCost: 850000, status: "Available", region: "North" },
    { registrationNumber: "DL05-CD-2003", name: "Ashok Leyland Dost", type: "Truck", maxLoadCapacity: 1500, odometer: 41200, acquisitionCost: 1450000, status: "On Trip", region: "West" },
    { registrationNumber: "DL05-CD-2004", name: "Mahindra Bolero Pickup", type: "Pickup", maxLoadCapacity: 900, odometer: 30890, acquisitionCost: 950000, status: "On Trip", region: "West" },
    { registrationNumber: "HR26-EF-3005", name: "Eicher Pro 3015", type: "Truck", maxLoadCapacity: 3000, odometer: 55020, acquisitionCost: 2200000, status: "In Shop", region: "South" },
    { registrationNumber: "MH12-GH-4006", name: "Tata 407 Trailer", type: "Trailer", maxLoadCapacity: 5000, odometer: 89210, acquisitionCost: 3100000, status: "Retired", region: "East" },
  ]);
  const [vAce, vVan05, vDost, vBolero, vEicher, vTrailer] = vehicleDocs;

  // ---------- Drivers ----------
  // Covers all 4 statuses, plus one with an expired license to exercise the rule.
  const driverDocs = await Driver.insertMany([
    { name: "Alex Menon", licenseNumber: "DL-LMV-98231", licenseCategory: "LMV", licenseExpiryDate: daysFromNow(220), contactNumber: "9810000002", safetyScore: 92, status: "Available" },
    { name: "Ravi Kumar", licenseNumber: "DL-HMV-77120", licenseCategory: "HMV", licenseExpiryDate: daysFromNow(365), contactNumber: "9810000005", safetyScore: 88, status: "On Trip" },
    { name: "Sunil Yadav", licenseNumber: "DL-HTV-55410", licenseCategory: "HTV", licenseExpiryDate: daysFromNow(180), contactNumber: "9810000006", safetyScore: 95, status: "On Trip" },
    { name: "Manoj Tiwari", licenseNumber: "DL-LMV-10233", licenseCategory: "LMV", licenseExpiryDate: daysAgo(15), contactNumber: "9810000007", safetyScore: 70, status: "Available" }, // expired license
    { name: "Deepak Rana", licenseNumber: "DL-HMV-33210", licenseCategory: "HMV", licenseExpiryDate: daysFromNow(300), contactNumber: "9810000008", safetyScore: 40, status: "Suspended" },
    { name: "Vikram Singh", licenseNumber: "DL-LMV-66789", licenseCategory: "LMV", licenseExpiryDate: daysFromNow(400), contactNumber: "9810000009", safetyScore: 90, status: "Off Duty" },
  ]);
  const [dAlex, dRavi, dSunil, dManoj, , dVikram] = driverDocs;

  // ---------- Trips ----------
  // Draft, Dispatched (x2, matching the "On Trip" vehicles/drivers above), Completed, Cancelled
  const tripDocs = await Trip.insertMany([
    {
      source: "Khurja, UP",
      destination: "Meerut, UP",
      vehicle: vAce._id,
      driver: dVikram._id, // Off Duty in this seed; still a valid Draft reference
      cargoWeight: 400,
      plannedDistance: 90,
      status: "Draft",
      createdBy: dispatcherUser,
    },
    {
      source: "Delhi",
      destination: "Jaipur",
      vehicle: vDost._id,
      driver: dRavi._id,
      cargoWeight: 1200,
      plannedDistance: 280,
      startOdometer: 41200,
      status: "Dispatched",
      createdBy: dispatcherUser,
      dispatchedAt: daysAgo(1),
    },
    {
      source: "Gurugram",
      destination: "Chandigarh",
      vehicle: vBolero._id,
      driver: dSunil._id,
      cargoWeight: 750,
      plannedDistance: 245,
      startOdometer: 30890,
      status: "Dispatched",
      createdBy: dispatcherUser,
      dispatchedAt: daysAgo(2),
    },
    {
      source: "Khurja, UP",
      destination: "Agra, UP",
      vehicle: vVan05._id,
      driver: dAlex._id,
      cargoWeight: 450,
      plannedDistance: 210,
      actualDistance: 215,
      startOdometer: 22095,
      endOdometer: 22310,
      fuelConsumed: 24,
      status: "Completed",
      createdBy: dispatcherUser,
      dispatchedAt: daysAgo(6),
      completedAt: daysAgo(5),
    },
    {
      source: "Noida",
      destination: "Lucknow",
      vehicle: vAce._id,
      driver: dManoj._id,
      cargoWeight: 300,
      plannedDistance: 500,
      status: "Cancelled",
      createdBy: dispatcherUser,
      cancelledAt: daysAgo(3),
    },
  ]);
  const [, , , completedTrip] = tripDocs;

  // ---------- Maintenance ----------
  // One Active record (matches vEicher's "In Shop" status) + one historical Closed record.
  await Maintenance.insertMany([
    {
      vehicle: vEicher._id,
      type: "Engine Overhaul",
      description: "Reported loss of power on highway runs; engine inspection and rebuild",
      cost: 45000,
      startDate: daysAgo(4),
      status: "Active",
    },
    {
      vehicle: vDost._id,
      type: "Oil Change",
      description: "Routine 10,000 km service",
      cost: 3500,
      startDate: daysAgo(40),
      endDate: daysAgo(39),
      status: "Closed",
    },
    {
      vehicle: vVan05._id,
      type: "Tire Replacement",
      description: "Replaced 2 rear tires",
      cost: 8200,
      startDate: daysAgo(20),
      endDate: daysAgo(19),
      status: "Closed",
    },
  ]);

  // ---------- Fuel Logs ----------
  await FuelLog.insertMany([
    { vehicle: vVan05._id, trip: completedTrip._id, liters: 24, cost: 2280, date: daysAgo(5) },
    { vehicle: vDost._id, liters: 60, cost: 5700, date: daysAgo(1) },
    { vehicle: vBolero._id, liters: 40, cost: 3800, date: daysAgo(2) },
    { vehicle: vAce._id, liters: 15, cost: 1425, date: daysAgo(10) },
  ]);

  // ---------- Expenses ----------
  await Expense.insertMany([
    { vehicle: vDost._id, type: "Toll", amount: 850, date: daysAgo(1), description: "Delhi-Jaipur expressway tolls" },
    { vehicle: vBolero._id, type: "Toll", amount: 620, date: daysAgo(2), description: "Gurugram-Chandigarh tolls" },
    { vehicle: vEicher._id, type: "Maintenance", amount: 45000, date: daysAgo(4), description: "Engine overhaul" },
    { vehicle: vVan05._id, type: "Fine", amount: 500, date: daysAgo(6), description: "Overspeeding challan" },
    { vehicle: vAce._id, type: "Parking", amount: 150, date: daysAgo(10), description: "Overnight parking, Khurja depot" },
  ]);

  console.log("Seed complete.");
  console.log("Login accounts (password for all: Passw0rd!):");
  userDocs.forEach((u) => console.log(`  ${u.email}`));

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
