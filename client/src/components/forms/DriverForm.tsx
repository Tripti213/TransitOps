import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { createDriver, updateDriver } from "../../services/driverService";
import type { Driver, CreateDriverPayload, UpdateDriverPayload, LicenseCategory } from "../../types/driver";

interface DriverFormProps {
  driver?: Driver;
  onSuccess: (driver: Driver) => void;
  onCancel: () => void;
}

const LICENSE_CATEGORIES = [
  { value: "LMV", label: "LMV" },
  { value: "HMV", label: "HMV" },
  { value: "HTV", label: "HTV" },
];

const toFormState = (driver?: Driver) => ({
  name: driver?.name ?? "",
  licenseNumber: driver?.licenseNumber ?? "",
  licenseCategory: driver?.licenseCategory ?? "",
  licenseExpiryDate: driver?.licenseExpiryDate?.slice(0, 10) ?? "",
  contactNumber: driver?.contactNumber ?? "",
  safetyScore: driver?.safetyScore != null ? String(driver.safetyScore) : "",
  email: "",
  password: "",
});

const errorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return fallback;
};

export default function DriverForm({ driver, onSuccess, onCancel }: DriverFormProps) {
  const isEditing = Boolean(driver);
  const [form, setForm] = useState(() => toFormState(driver));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isEditing && driver) {
        const payload: UpdateDriverPayload = {
          name: form.name,
          licenseNumber: form.licenseNumber,
          licenseCategory: form.licenseCategory as LicenseCategory,
          licenseExpiryDate: form.licenseExpiryDate,
          contactNumber: form.contactNumber,
          ...(form.safetyScore ? { safetyScore: Number(form.safetyScore) } : {}),
        };
        const updated = await updateDriver(driver._id, payload);
        onSuccess(updated);
      } else {
        const payload: CreateDriverPayload = {
          name: form.name,
          licenseNumber: form.licenseNumber,
          licenseCategory: form.licenseCategory as LicenseCategory,
          licenseExpiryDate: form.licenseExpiryDate,
          contactNumber: form.contactNumber,
          email: form.email,
          password: form.password,
          ...(form.safetyScore ? { safetyScore: Number(form.safetyScore) } : {}),
        };
        const created = await createDriver(payload);
        onSuccess(created);
      }
    } catch (err) {
      setError(errorMessage(err, `Failed to ${isEditing ? "update" : "create"} driver.`));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Full Name" required value={form.name} onChange={update("name")} />

      <div className="grid grid-cols-2 gap-4">
        <Input label="License Number" required value={form.licenseNumber} onChange={update("licenseNumber")} />
        <Input
          as="select"
          label="License Category"
          required
          value={form.licenseCategory}
          onChange={update("licenseCategory")}
          options={LICENSE_CATEGORIES}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="License Expiry"
          type="date"
          required
          value={form.licenseExpiryDate}
          onChange={update("licenseExpiryDate")}
        />
        <Input label="Contact Number" required value={form.contactNumber} onChange={update("contactNumber")} />
      </div>

      <Input
        label="Safety Score (optional, default 100)"
        type="number"
        min={0}
        max={100}
        value={form.safetyScore}
        onChange={update("safetyScore")}
      />

      {!isEditing && (
        <div className="border-t border-[var(--border)] pt-4">
          <p className="mb-3 text-sm text-[var(--text)]/70">
            Login credentials — the driver signs in with these.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" required value={form.email} onChange={update("email")} />
            <Input
              label="Password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={update("password")}
            />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-[var(--status-danger)]">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Add Driver"}
        </Button>
      </div>
    </form>
  );
}
