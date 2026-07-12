import { useEffect, useState } from "react";
import { Table, type Column } from "../../components/common/Table";
import { Modal } from "../../components/common/Modal";
import { Button } from "../../components/common/Button";
import ExpenseForm from "../../components/forms/ExpenseForm";
import { getExpenses } from "../../services/expenseService";
import { getMaintenances } from "../../services/maintenanceService";
import type { Expense } from "../../types/expense";
import type { Maintenance } from "../../types/maintenance";
import type { Vehicle } from "../../types/vehicle";

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString() : "—");

const vehicleLabel = (vehicle: Expense["vehicle"] | Maintenance["vehicle"]) => {
  if (typeof vehicle === "string") return vehicle;
  const v = vehicle as Vehicle;
  return `${v.registrationNumber} (${v.name})`;
};

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    Promise.all([getExpenses(), getMaintenances()])
      .then(([expenseData, maintenanceData]) => {
        // Maintenance costs are already shown via the Maintenance collection below;
        // exclude any Expense records typed "Maintenance" to avoid double-counting.
        setExpenses(expenseData.filter((e) => e.type !== "Maintenance"));
        setMaintenances(maintenanceData);
      })
      .catch(() => setError("Failed to load expenses."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreated = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
    setIsFormOpen(false);
  };

  const maintenanceTotal = maintenances.reduce((sum, m) => sum + m.cost, 0);
  const otherTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const grandTotal = maintenanceTotal + otherTotal;

  const maintenanceColumns: Column<Maintenance>[] = [
    { header: "Vehicle", accessor: (row) => vehicleLabel(row.vehicle) },
    { header: "Service Type", accessor: "type" },
    { header: "Date", accessor: (row) => formatDate(row.startDate) },
    { header: "Cost", accessor: (row) => row.cost.toLocaleString(), isNumeric: true },
  ];

  const expenseColumns: Column<Expense>[] = [
    { header: "Vehicle", accessor: (row) => vehicleLabel(row.vehicle) },
    { header: "Type", accessor: "type" },
    { header: "Date", accessor: (row) => formatDate(row.date) },
    { header: "Amount", accessor: (row) => row.amount.toLocaleString(), isNumeric: true },
    { header: "Description", accessor: (row) => row.description || "—" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[var(--text-h)]">Expenses</h2>
          <p className="mt-1 text-sm text-[var(--text)]/70">
            Maintenance costs plus tolls, fines, and other extra expenses.
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>+ Add Expense</Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-[var(--text)]/60">Loading expenses...</div>
      ) : error ? (
        <div className="py-12 text-center text-[var(--status-danger)]">Error: {error}</div>
      ) : (
        <>
          <div className="space-y-3">
            <h3 className="text-lg text-[var(--text-h)]">Maintenance Expenses</h3>
            <Table data={maintenances} columns={maintenanceColumns} />
            <div className="flex justify-end text-sm">
              <span className="text-[var(--text)]/70">Maintenance Total:&nbsp;</span>
              <span className="font-semibold text-[var(--text-h)]">₹{maintenanceTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg text-[var(--text-h)]">Other Expenses</h3>
            <Table data={expenses} columns={expenseColumns} />
            <div className="flex justify-end text-sm">
              <span className="text-[var(--text)]/70">Other Expenses Total:&nbsp;</span>
              <span className="font-semibold text-[var(--text-h)]">₹{otherTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end border-t border-[var(--border)] pt-4">
            <span className="text-[var(--text)]/70">Total Expenses:&nbsp;</span>
            <span className="text-lg font-semibold text-[var(--accent)]">₹{grandTotal.toLocaleString()}</span>
          </div>
        </>
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add Expense">
        <ExpenseForm onSuccess={handleCreated} onCancel={() => setIsFormOpen(false)} />
      </Modal>
    </div>
  );
}
