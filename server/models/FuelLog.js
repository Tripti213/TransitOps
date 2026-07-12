import mongoose from "mongoose";

const fuelLogSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" }, // optional link
    liters: { type: Number, required: true },
    cost: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);



const FuelLog = mongoose.model("FuelLog", fuelLogSchema);

export default FuelLog;
