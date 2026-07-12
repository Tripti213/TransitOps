import mongoose from "mongoose";
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

const Role = mongoose.model("Role", roleSchema);

export default Role;