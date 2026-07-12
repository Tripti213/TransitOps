import mongoose from "mongoose";
const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true }, // Model/Name
    type: {
      type: String,
      enum: ["Truck", "Van", "Mini-Truck", "Trailer", "Pickup"],
      required: true,
    },
    maxLoadCapacity: { type: Number, required: true }, // kg
    odometer: { type: Number, default: 0 },
    acquisitionCost: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Available", "On Trip", "In Shop", "Retired"],
      default: "Available",
    },
    region: { type: String, default: "Unassigned" },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
