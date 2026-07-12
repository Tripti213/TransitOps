import { useState, useEffect } from "react";
import { Table, type Column } from "../../components/common/Table";
import { StatusBadge, type StatusVariant } from "../../components/common/StatusBadge";
import { Modal } from "../../components/common/Modal";
import { Button } from "../../components/common/Button";
import DriverForm from "../../components/forms/DriverForm";
import { getDrivers } from "../../services/driverService";
import type { Driver } from "../../types/driver";

const statusConfig: Record<string, { label: string; variant: StatusVariant }> = {
  Available: { label: "Available", variant: "available" },
  "On Trip": { label: "On Trip", variant: "neutral" },
  "Off Duty": { label: "Off Duty", variant: "warning" },
  Suspended: { label: "Suspended", variant: "danger" },
};

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [filters, setFilters] = useState({ search: "", status: "", page: 1, sort: "createdAt" });

  useEffect(() => {
    setIsLoading(true);
    getDrivers(filters)
      .then((data) => {
        setDrivers(data.drivers || data);
      })
      .catch(() => setError("Failed to load drivers."))
      .finally(() => setIsLoading(false));
  }, [filters]);

  const columns: Column<Driver>[] = [
    { header: "Name", accessor: "name" },
    { header: "License", accessor: (row) => `${row.licenseNumber} (${row.licenseCategory})` },
    { header: "Contact", accessor: "contactNumber" },
    {
      header: "Status",
      accessor: (row) => {
        const config = statusConfig[row.status] ?? { label: row.status, variant: "neutral" as StatusVariant };
        return <StatusBadge label={config.label} variant={config.variant} />;
      },
    },
    { header: "Safety Score", accessor: (row) => row.safetyScore, isNumeric: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[var(--text-h)]">Drivers</h2>
          <p className="mt-1 text-sm text-[var(--text)]/70">Manage driver records and login access.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>+ Add Driver</Button>
      </div>

      {/* SEARCH AND FILTER CONTROLS */}
      <div className="flex gap-4">
        <input
          placeholder="Search by name or license..."
          className="border p-2 rounded"
          onChange={(e) => setFilters(p => ({ ...p, search: e.target.value, page: 1 }))}
        />
        <select
          className="border p-2 rounded"
          onChange={(e) => setFilters(p => ({ ...p, status: e.target.value, page: 1 }))}
        >
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-[var(--text)]/60">Loading drivers...</div>
      ) : error ? (
        <div className="py-12 text-center text-[var(--status-danger)]">Error: {error}</div>
      ) : (
        <Table data={drivers} columns={columns} />
      )}

      {/* PAGINATION CONTROLS */}
      <div className="flex gap-4 items-center justify-center mt-4">
        <Button
          disabled={filters.page === 1}
          onClick={() => setFilters(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
        >
          Prev
        </Button>

        <span className="text-sm font-medium">
          Page {filters.page}
        </span>

        <Button
          onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
        >
          Next
        </Button>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add Driver">
        <DriverForm onSuccess={(d) => { setDrivers(prev => [d, ...prev]); setIsFormOpen(false); }} onCancel={() => setIsFormOpen(false)} />
      </Modal>
    </div>
  );
}