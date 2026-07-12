import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table, type Column } from "../../components/common/Table";
import { StatusBadge, type StatusVariant } from "../../components/common/StatusBadge";
import { Modal } from "../../components/common/Modal";
import { Button } from "../../components/common/Button";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import DriverForm from "../../components/forms/DriverForm";
import { getDrivers, deleteDriver } from "../../services/driverService";
import type { Driver } from "../../types/driver";

const statusConfig: Record<Driver["status"], { label: string; variant: StatusVariant }> = {
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
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getDrivers()
      .then(setDrivers)
      .catch(() => setError("Failed to load drivers."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreated = (driver: Driver) => {
    setDrivers((prev) => [driver, ...prev]);
    setIsFormOpen(false);
  };

  const handleUpdated = (driver: Driver) => {
    setDrivers((prev) => prev.map((d) => (d._id === driver._id ? driver : d)));
    setEditingDriver(null);
  };

  const handleDelete = async () => {
    if (!deletingDriver) return;
    setDeleting(true);
    try {
      await deleteDriver(deletingDriver._id);
      setDrivers((prev) => prev.filter((d) => d._id !== deletingDriver._id));
      setDeletingDriver(null);
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || "Failed to delete driver.");
    } finally {
      setDeleting(false);
    }
  };

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
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => setEditingDriver(row)}>
            Edit
          </Button>
          <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => setDeletingDriver(row)}>
            Delete
          </Button>
        </div>
      ),
    },
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

      {isLoading ? (
        <div className="py-12 text-center text-[var(--text)]/60">Loading drivers...</div>
      ) : error ? (
        <div className="py-12 text-center text-[var(--status-danger)]">Error: {error}</div>
      ) : (
        <Table data={drivers} columns={columns} />
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add Driver">
        <DriverForm onSuccess={handleCreated} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <Modal isOpen={editingDriver !== null} onClose={() => setEditingDriver(null)} title="Edit Driver">
        {editingDriver && (
          <DriverForm driver={editingDriver} onSuccess={handleUpdated} onCancel={() => setEditingDriver(null)} />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deletingDriver !== null}
        title="Delete Driver"
        message={`Are you sure you want to delete ${deletingDriver?.name}? This also removes their login access. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        submitting={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingDriver(null)}
      />
    </div>
  );
}
