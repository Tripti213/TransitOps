import { useState, useEffect, type FormEvent } from "react";
import { Button } from "../common/Button";

interface VehicleOption {
  _id: string;
  registrationNumber: string;
  name: string;
  maxLoadCapacity: number;
}

interface DriverOption {
  _id: string;
  name: string;
  licenseCategory: string;
}

interface CreateTripFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const fieldClasses =
  "w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text-h)] outline-none focus:border-[var(--accent)]";

const INITIAL_FORM = {
  vehicle: "",
  driver: "",
  source: "",
  destination: "",
  plannedDate: "",
  cargoWeight: "",
  plannedDistance: "",
};

export default function CreateTripForm({ onSuccess, onCancel }: CreateTripFormProps) {
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/trips/dispatch-data")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVehicles(data.vehicles || []);
          setDrivers(data.drivers || []);
        }
      })
      .catch(() => setError("Failed to load available vehicles/drivers."))
      .finally(() => setLoadingOptions(false));
  }, []);

  const selectedVehicle = vehicles.find((v) => v._id === formData.vehicle);
  const cargoExceedsCapacity =
    selectedVehicle && formData.cargoWeight
      ? Number(formData.cargoWeight) > selectedVehicle.maxLoadCapacity
      : false;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cargoExceedsCapacity) {
      setError(
        `Cargo weight exceeds this vehicle's max load capacity (${selectedVehicle?.maxLoadCapacity} kg).`
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle: formData.vehicle,
          driver: formData.driver,
          source: formData.source,
          destination: formData.destination,
          plannedDate: formData.plannedDate || undefined,
          cargoWeight: Number(formData.cargoWeight),
          plannedDistance: Number(formData.plannedDistance),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to create trip.");
        return;
      }
      onSuccess();
    } catch {
      setError("Failed to create trip.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-[var(--text)]">Vehicle</label>
        <select
          required
          value={formData.vehicle}
          onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
          className={fieldClasses}
          disabled={loadingOptions || vehicles.length === 0}
        >
          <option value="" disabled>
            Select...
          </option>
          {vehicles.map((v) => (
            <option key={v._id} value={v._id}>
              {v.registrationNumber} — {v.name} (max {v.maxLoadCapacity} kg)
            </option>
          ))}
        </select>
        {!loadingOptions && vehicles.length === 0 && (
          <p className="mt-1 text-xs text-[var(--text)]/60">No available vehicles right now.</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm text-[var(--text)]">Driver</label>
        <select
          required
          value={formData.driver}
          onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
          className={fieldClasses}
          disabled={loadingOptions || drivers.length === 0}
        >
          <option value="" disabled>
            Select...
          </option>
          {drivers.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name} ({d.licenseCategory})
            </option>
          ))}
        </select>
        {!loadingOptions && drivers.length === 0 && (
          <p className="mt-1 text-xs text-[var(--text)]/60">No available drivers right now.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-[var(--text)]">Source</label>
          <input
            required
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className={fieldClasses}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[var(--text)]">Destination</label>
          <input
            required
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            className={fieldClasses}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-[var(--text)]">Date</label>
        <input
          type="date"
          required
          value={formData.plannedDate}
          onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
          className={fieldClasses}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-[var(--text)]">Cargo Weight (kg)</label>
          <input
            type="number"
            min={1}
            required
            value={formData.cargoWeight}
            onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
            className={fieldClasses}
          />
          {cargoExceedsCapacity && (
            <p className="mt-1 text-xs text-[var(--status-danger)]">
              Exceeds this vehicle's max load capacity ({selectedVehicle?.maxLoadCapacity} kg).
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm text-[var(--text)]">Planned Distance (km)</label>
          <input
            type="number"
            min={1}
            required
            value={formData.plannedDistance}
            onChange={(e) => setFormData({ ...formData, plannedDistance: e.target.value })}
            className={fieldClasses}
          />
        </div>
      </div>

      {error && <p className="text-sm text-[var(--status-danger)]">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting || cargoExceedsCapacity}>
          {submitting ? "Creating..." : "Create Trip"}
        </Button>
      </div>
    </form>
  );
}
