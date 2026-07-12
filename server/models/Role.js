const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["FleetManager", "Driver", "SafetyOfficer", "FinancialAnalyst"],
      required: true,
      unique: true,
    },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
