import api from "./api";
import type { Vehicle } from "../types/vehicle";

export const getVehicles = async (filters: any) => {
  const query = new URLSearchParams({ ...filters, page: filters.page.toString() }).toString();
  const res = await fetch(`/api/vehicles?${query}`);
  if (!res.ok) throw new Error("Failed to fetch vehicles");
  return res.json();
};

export const getAvailableVehicles = () =>
  api
    .get<{ success: boolean; count: number; vehicles: Vehicle[] }>("/vehicles/available")
    .then((res) => res.data.vehicles);