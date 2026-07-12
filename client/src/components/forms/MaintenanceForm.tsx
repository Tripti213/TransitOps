import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { createMaintenance } from "../../services/maintenanceService";
import { getAvailableVehicles } from "../../services/vehicleService";
import type { Maintenance, CreateMaintenancePayload } from "../../types/maintenance";
import type { Vehicle } from "../../types/vehicle";

interface MaintenanceFormProps {
  onSuccess: (record: Maintenance) => void;
  onCancel: () => void;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const INITIAL_FORM = {
  vehicle: "",
  type: "",
  description: "",
  cost: "",
  startDate: todayISO(),
};

const errorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return fallback;
};

export default function MaintenanceForm({ onSuccess, onCancel }: MaintenanceFormProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAvailableVehicles()
      .then(setVehicles)
      .catch(() => setError("Failed to load available vehicles."))
      .finally(() => setLoadingVehicles(false));
  }, []);

  const update =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const vehicleOptions = vehicles.map((v) => ({
    value: v._id,
    label: `${v.registrationNumber} — ${v.name}`,
  }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload: CreateMaintenancePayload = {
        vehicle: form.vehicle,
        type: form.type,
        cost: Number(form.cost),
        startDate: form.startDate,
        ...(form.description ? { description: form.description } : {}),
      };
      const record = await createMaintenance(payload);
      const selectedVehicle = vehicles.find((v) => v._id === form.vehicle);
      onSuccess(selectedVehicle ? { ...record, vehicle: selectedVehicle } : record);
    } catch (err) {
      setError(errorMessage(err, "Failed to log maintenance record."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        as="select"
        label="Vehicle"
        required
        value={form.vehicle}
        onChange={update("vehicle")}
        options={vehicleOptions}
        disabled={loadingVehicles || vehicleOptions.length === 0}
      />
      {!loadingVehicles && vehicleOptions.length === 0 && (
        <p className="text-xs text-[var(--text)]/60">
          No available vehicles right now — only Available vehicles can be sent for maintenance.
        </p>
      )}

      <Input
        label="Service Type"
        required
        placeholder="e.g. Oil Change"
        value={form.type}
        onChange={update("type")}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Cost" type="number" min={1} required value={form.cost} onChange={update("cost")} />
        <Input label="Date" type="date" required value={form.startDate} onChange={update("startDate")} />
      </div>

      <Input
        label="Description (optional)"
        value={form.description}
        onChange={update("description")}
      />

      {error && <p className="text-sm text-[var(--status-danger)]">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting || vehicleOptions.length === 0}>
          {submitting ? "Saving..." : "Log Maintenance"}
        </Button>
      </div>
    </form>
  );
}
