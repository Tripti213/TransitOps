const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    licenseCategory: { type: String, required: true }, // e.g. LMV, HMV, HTV
    licenseExpiryDate: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    safetyScore: { type: Number, default: 100, min: 0, max: 100 },
    status: {
      type: String,
      enum: ["Available", "On Trip", "Off Duty", "Suspended"],
      default: "Available",
    },
    // Optional link if a driver also logs in as a user
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
