import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table, type Column } from "../../components/common/Table";
import { StatusBadge, type StatusVariant } from "../../components/common/StatusBadge";
import { Modal } from "../../components/common/Modal";
import { Button } from "../../components/common/Button";
import MaintenanceForm from "../../components/forms/MaintenanceForm";
import { getMaintenances, completeMaintenance } from "../../services/maintenanceService";
import type { Maintenance } from "../../types/maintenance";
import type { Vehicle } from "../../types/vehicle";

const statusConfig: Record<Maintenance["status"], { label: string; variant: StatusVariant }> = {
  Active: { label: "Ongoing", variant: "warning" },
  Closed: { label: "Completed", variant: "available" },
};

type FilterValue = "all" | "Active" | "Closed";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Active", label: "Ongoing" },
  { value: "Closed", label: "Completed" },
];

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString() : "—");

const vehicleLabel = (vehicle: Maintenance["vehicle"]) => {
  if (typeof vehicle === "string") return vehicle;
  const v = vehicle as Vehicle;
  return `${v.registrationNumber} (${v.name})`;
};

const errorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return fallback;
};

export default function MaintenancePage() {
  const [records, setRecords] = useState<Maintenance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    getMaintenances()
      .then(setRecords)
      .catch(() => setError("Failed to load maintenance records."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreated = (record: Maintenance) => {
    setRecords((prev) => [record, ...prev]);
    setIsFormOpen(false);
  };

  const handleComplete = async (id: string) => {
    setCompletingId(id);
    try {
      const updated = await completeMaintenance(id);
      setRecords((prev) =>
        prev.map((r) => (r._id === id ? { ...updated, vehicle: r.vehicle } : r))
      );
    } catch (err) {
      toast.error(errorMessage(err, "Failed to complete maintenance."));
    } finally {
      setCompletingId(null);
    }
  };

  const visibleRecords = records
    .filter((r) => filter === "all" || r.status === filter)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const columns: Column<Maintenance>[] = [
    { header: "Vehicle", accessor: (row) => vehicleLabel(row.vehicle) },
    { header: "Service Type", accessor: "type" },
    { header: "Cost", accessor: (row) => row.cost.toLocaleString(), isNumeric: true },
    { header: "Start Date", accessor: (row) => formatDate(row.startDate) },
    { header: "End Date", accessor: (row) => formatDate(row.endDate) },
    {
      header: "Status",
      accessor: (row) => {
        const config = statusConfig[row.status];
        return <StatusBadge label={config.label} variant={config.variant} />;
      },
    },
    {
      header: "Actions",
      accessor: (row) =>
        row.status === "Active" ? (
          <Button
            variant="primary"
            className="px-3 py-1.5 text-xs font-semibold"
            disabled={completingId === row._id}
            onClick={() => handleComplete(row._id)}
          >
            {completingId === row._id ? "Completing..." : "Complete"}
          </Button>
        ) : (
          <span className="text-xs text-[var(--text)]/40">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[var(--text-h)]">Maintenance</h2>
          <p className="mt-1 text-sm text-[var(--text)]/70">
            Send vehicles for service and track ongoing and completed work.
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>+ Log Maintenance</Button>
      </div>

      <div className="flex gap-2">
        {FILTERS.map(({ value, label }) => (
          <Button
            key={value}
            variant={filter === value ? "primary" : "secondary"}
            className="px-3 py-1.5 text-xs"
            onClick={() => setFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-[var(--text)]/60">Loading maintenance records...</div>
      ) : error ? (
        <div className="py-12 text-center text-[var(--status-danger)]">Error: {error}</div>
      ) : (
        <Table data={visibleRecords} columns={columns} />
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Log Maintenance">
        <MaintenanceForm onSuccess={handleCreated} onCancel={() => setIsFormOpen(false)} />
      </Modal>
    </div>
  );
}
