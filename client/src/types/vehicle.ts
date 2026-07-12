export interface Vehicle {
  _id: string;
  registrationNumber: string;
  name: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  region: string;
  status: "Available" | "On Trip" | "In Shop" | "Retired";
  createdAt: string;
}