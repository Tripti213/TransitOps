import api from "./api";
import type { Driver, CreateDriverPayload, UpdateDriverPayload } from "../types/driver";

interface DriversResponse {
  success: boolean;
  count: number;
  drivers: Driver[];
}

interface DriverResponse {
  success: boolean;
  message?: string;
  driver: Driver;
}

export const getDrivers = () => api.get<DriversResponse>("/drivers").then((res) => res.data.drivers);

export const createDriver = (payload: CreateDriverPayload) =>
  api.post<DriverResponse>("/drivers", payload).then((res) => res.data.driver);

export const updateDriver = (id: string, payload: UpdateDriverPayload) =>
  api.put<DriverResponse>(`/drivers/${id}`, payload).then((res) => res.data.driver);

export const deleteDriver = (id: string) => api.delete(`/drivers/${id}`);

export const suspendDriver = (id: string) =>
  api.patch<DriverResponse>(`/drivers/${id}/suspend`).then((res) => res.data.driver);
