import type { Vehicle } from "./vehicle";
import type { Driver } from "./driver";

export type TripStatus = "Draft" | "Dispatched" | "Completed" | "Cancelled";

export interface Trip {
  _id: string;
  source: string;
  destination: string;
  vehicle: Vehicle | string;
  driver: Driver | string;
  cargoWeight: number;
  plannedDistance: number;
  plannedDate?: string;
  actualDistance?: number;
  startOdometer?: number;
  endOdometer?: number;
  fuelConsumed?: number;
  status: TripStatus;
  dispatchedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
}

export interface CreateTripPayload {
  vehicle: string;
  driver: string;
  source: string;
  destination: string;
  cargoWeight: number;
  plannedDistance: number;
  plannedDate?: string;
}
