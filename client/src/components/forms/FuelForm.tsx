import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { createFuelLog } from "../../services/fuelService";
import { getAllVehicles } from "../../services/vehicleService";
import type { FuelLog, CreateFuelLogPayload } from "../../types/fuel";
import type { Vehicle } from "../../types/vehicle";

interface FuelFormProps {
  onSuccess: (log: FuelLog) => void;
  onCancel: () => void;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const INITIAL_FORM = {
  vehicle: "",
  liters: "",
  cost: "",
  date: todayISO(),
};

const errorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return fallback;
};

export default function FuelForm({ onSuccess, onCancel }: FuelFormProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAllVehicles()
      .then(setVehicles)
      .catch(() => setError("Failed to load vehicles."))
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
      const payload: CreateFuelLogPayload = {
        vehicle: form.vehicle,
        liters: Number(form.liters),
        cost: Number(form.cost),
        date: form.date,
      };
      const log = await createFuelLog(payload);
      const selectedVehicle = vehicles.find((v) => v._id === form.vehicle);
      onSuccess(selectedVehicle ? { ...log, vehicle: selectedVehicle } : log);
    } catch (err) {
      setError(errorMessage(err, "Failed to log fuel entry."));
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

      <div className="grid grid-cols-2 gap-4">
        <Input label="Liters" type="number" min={0.1} step="0.1" required value={form.liters} onChange={update("liters")} />
        <Input label="Cost" type="number" min={1} required value={form.cost} onChange={update("cost")} />
      </div>

      <Input label="Date" type="date" required value={form.date} onChange={update("date")} />

      {error && <p className="text-sm text-[var(--status-danger)]">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Log Fuel"}
        </Button>
      </div>
    </form>
  );
}
