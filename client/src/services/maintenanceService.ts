import api from "./api";
import type { Maintenance, CreateMaintenancePayload } from "../types/maintenance";

interface MaintenancesResponse {
  success: boolean;
  count: number;
  maintenances: Maintenance[];
}

interface MaintenanceResponse {
  success: boolean;
  message?: string;
  maintenance: Maintenance;
}

export const getMaintenances = () =>
  api.get<MaintenancesResponse>("/maintenance").then((res) => res.data.maintenances);

export const createMaintenance = (payload: CreateMaintenancePayload) =>
  api.post<MaintenanceResponse>("/maintenance", payload).then((res) => res.data.maintenance);

export const completeMaintenance = (id: string) =>
  api.patch<MaintenanceResponse>(`/maintenance/${id}/complete`).then((res) => res.data.maintenance);
