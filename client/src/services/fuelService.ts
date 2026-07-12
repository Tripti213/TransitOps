import api from "./api";
import type { FuelLog, CreateFuelLogPayload } from "../types/fuel";

interface FuelLogsResponse {
  success: boolean;
  count: number;
  fuel_logs: FuelLog[];
}

interface FuelLogResponse {
  success: boolean;
  message?: string;
  fuel_log: FuelLog;
}

export const getFuelLogs = () => api.get<FuelLogsResponse>("/fuel").then((res) => res.data.fuel_logs);

export const createFuelLog = (payload: CreateFuelLogPayload) =>
  api.post<FuelLogResponse>("/fuel", payload).then((res) => res.data.fuel_log);
