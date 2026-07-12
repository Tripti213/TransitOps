import type { Vehicle } from "./vehicle";

export type MaintenanceStatus = "Active" | "Closed";

export interface Maintenance {
  _id: string;
  vehicle: Vehicle | string;
  type: string;
  description?: string;
  cost: number;
  startDate: string;
  endDate?: string;
  status: MaintenanceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaintenancePayload {
  vehicle: string;
  type: string;
  description?: string;
  cost: number;
  startDate: string;
}
