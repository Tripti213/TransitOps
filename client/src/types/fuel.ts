import type { Vehicle } from "./vehicle";

export interface FuelLog {
  _id: string;
  vehicle: Vehicle | string;
  trip?: string;
  liters: number;
  cost: number;
  date: string;
  createdAt: string;
}

export interface CreateFuelLogPayload {
  vehicle: string;
  liters: number;
  cost: number;
  date: string;
}
