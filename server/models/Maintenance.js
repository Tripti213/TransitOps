import mongoose from "mongoose";
const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    type: { type: String, required: true }, // e.g. Oil Change, Tire Replacement
    description: { type: String },
    cost: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, // null while active
    status: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active",
    },
  },
  { timestamps: true }
);


const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

export default Maintenance;
