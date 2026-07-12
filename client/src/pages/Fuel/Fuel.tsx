import { useEffect, useState } from "react";
import { Table, type Column } from "../../components/common/Table";
import { Modal } from "../../components/common/Modal";
import { Button } from "../../components/common/Button";
import FuelForm from "../../components/forms/FuelForm";
import { getFuelLogs } from "../../services/fuelService";
import type { FuelLog } from "../../types/fuel";
import type { Vehicle } from "../../types/vehicle";

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString() : "—");

const vehicleLabel = (vehicle: FuelLog["vehicle"]) => {
  if (typeof vehicle === "string") return vehicle;
  const v = vehicle as Vehicle;
  return `${v.registrationNumber} (${v.name})`;
};

export default function Fuel() {
  const [logs, setLogs] = useState<FuelLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    getFuelLogs()
      .then(setLogs)
      .catch(() => setError("Failed to load fuel logs."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreated = (log: FuelLog) => {
    setLogs((prev) => [log, ...prev]);
    setIsFormOpen(false);
  };

  const totalCost = logs.reduce((sum, log) => sum + log.cost, 0);

  const columns: Column<FuelLog>[] = [
    { header: "Vehicle", accessor: (row) => vehicleLabel(row.vehicle) },
    { header: "Date", accessor: (row) => formatDate(row.date) },
    { header: "Liters", accessor: (row) => `${row.liters} L`, isNumeric: true },
    { header: "Fuel Cost", accessor: (row) => row.cost.toLocaleString(), isNumeric: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[var(--text-h)]">Fuel Logs</h2>
          <p className="mt-1 text-sm text-[var(--text)]/70">Track fuel fill-ups across the fleet.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>+ Log Fuel</Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-[var(--text)]/60">Loading fuel logs...</div>
      ) : error ? (
        <div className="py-12 text-center text-[var(--status-danger)]">Error: {error}</div>
      ) : (
        <>
          <Table data={logs} columns={columns} />
          <div className="flex justify-end border-t border-[var(--border)] pt-4 text-sm">
            <span className="text-[var(--text)]/70">Total Fuel Cost:&nbsp;</span>
            <span className="font-semibold text-[var(--text-h)]">₹{totalCost.toLocaleString()}</span>
          </div>
        </>
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Log Fuel">
        <FuelForm onSuccess={handleCreated} onCancel={() => setIsFormOpen(false)} />
      </Modal>
    </div>
  );
}
