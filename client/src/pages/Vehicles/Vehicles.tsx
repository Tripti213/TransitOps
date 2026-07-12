import { useState, useEffect } from "react";
import { Table, type Column } from "../../components/common/Table";
import { StatusBadge, type StatusVariant } from "../../components/common/StatusBadge";
import { Modal } from "../../components/common/Modal";
import { Button } from "../../components/common/Button";
import VehicleForm from "../../components/forms/VehicleForm"; // Update path if needed
import { getVehicles } from "../../services/vehicleService"; // Ensure this service exists
import type { Vehicle } from "../../types/vehicle"; // Ensure this type exists

const statusConfig: Record<string, { label: string; variant: StatusVariant }> = {
  Available: { label: "Available", variant: "available" },
  "On Trip": { label: "On Trip", variant: "neutral" },
  "In Shop": { label: "In Shop", variant: "warning" },
  Retired: { label: "Retired", variant: "danger" },
};

interface VehicleFilters {
  search: string;
  status: string;
  page: number;
  sort: string;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState<VehicleFilters>({
    search: "",
    status: "",
    page: 1,
    sort: "createdAt",
  });

  useEffect(() => {
    setIsLoading(true);
    getVehicles(filters)
      .then((data) => {
        setVehicles(data.vehicles || data);
      })
      .catch(() => setError("Failed to load vehicles."))
      .finally(() => setIsLoading(false));
  }, [filters]);

  const handleCreated = (vehicle: Vehicle) => {
    setVehicles((prev) => [vehicle, ...prev]);
    setIsFormOpen(false);
  };

  const columns: Column<Vehicle>[] = [
    { header: "Reg Number", accessor: "registrationNumber" },
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    {
      header: "Status",
      accessor: (row) => {
        const config = statusConfig[row.status] ?? { label: row.status, variant: "neutral" as StatusVariant };
        return <StatusBadge label={config.label} variant={config.variant} />;
      },
    },
    { header: "Load Capacity", accessor: (row) => `${row.maxLoadCapacity} tons`, isNumeric: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[var(--text-h)]">Vehicles</h2>
          <p className="mt-1 text-sm text-[var(--text)]/70">Manage your fleet registry and status.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>+ Register Vehicle</Button>
      </div>

      <div className="flex gap-4">
        <input
          placeholder="Search by name or Reg No..."
          className="border p-2 rounded"
          onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
        />
        <select
          className="border p-2 rounded"
          onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value, page: 1 }))}
        >
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="On Trip">On Trip</option>
          <option value="In Shop">In Shop</option>
        </select>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-[var(--text)]/60">Loading vehicles...</div>
      ) : error ? (
        <div className="py-12 text-center text-[var(--status-danger)]">Error: {error}</div>
      ) : (
        <Table data={vehicles} columns={columns} />
      )}

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

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Register Vehicle">
        <VehicleForm onSuccess={handleCreated} onCancel={() => setIsFormOpen(false)} />
      </Modal>
    </div>
  );
}