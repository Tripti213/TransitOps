const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    destination: { type: String, required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    cargoWeight: { type: Number, required: true }, // kg
    plannedDistance: { type: Number, required: true }, // km
    actualDistance: { type: Number },
    startOdometer: { type: Number },
    endOdometer: { type: Number },
    fuelConsumed: { type: Number }, // liters, filled on completion
    status: {
      type: String,
      enum: ["Draft", "Dispatched", "Completed", "Cancelled"],
      default: "Draft",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dispatchedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
