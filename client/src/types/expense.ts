import type { Vehicle } from "./vehicle";

export type ExpenseType = "Toll" | "Fine" | "Parking" | "Other";

export interface Expense {
  _id: string;
  vehicle: Vehicle | string;
  type: ExpenseType | "Maintenance";
  amount: number;
  date: string;
  description?: string;
  createdAt: string;
}

export interface CreateExpensePayload {
  vehicle: string;
  type: ExpenseType;
  amount: number;
  date: string;
  description?: string;
}
