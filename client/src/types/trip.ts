export interface Trip {
  _id: string;
  vehicleId: string;
  driverId: string;
  status: "Pending" | "In-Transit" | "Completed" | "Cancelled";
  plannedDistance: number;
  actualDistance?: number;
}