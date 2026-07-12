import api from "./api";
import type { Expense, CreateExpensePayload } from "../types/expense";

interface ExpensesResponse {
  success: boolean;
  count: number;
  expenses: Expense[];
}

interface ExpenseResponse {
  success: boolean;
  message?: string;
  expense: Expense;
}

export const getExpenses = () => api.get<ExpensesResponse>("/expenses").then((res) => res.data.expenses);

export const createExpense = (payload: CreateExpensePayload) =>
  api.post<ExpenseResponse>("/expenses", payload).then((res) => res.data.expense);
