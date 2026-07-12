import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { createExpense } from "../../services/expenseService";
import { getAllVehicles } from "../../services/vehicleService";
import type { Expense, CreateExpensePayload, ExpenseType } from "../../types/expense";
import type { Vehicle } from "../../types/vehicle";

interface ExpenseFormProps {
  onSuccess: (expense: Expense) => void;
  onCancel: () => void;
}

const EXPENSE_TYPES = [
  { value: "Toll", label: "Toll" },
  { value: "Fine", label: "Fine" },
  { value: "Parking", label: "Parking" },
  { value: "Other", label: "Other" },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

const INITIAL_FORM = {
  vehicle: "",
  type: "",
  amount: "",
  date: todayISO(),
  description: "",
};

const errorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return fallback;
};

export default function ExpenseForm({ onSuccess, onCancel }: ExpenseFormProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAllVehicles()
      .then((all) => setVehicles(all.filter((v) => v.status !== "Retired")))
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
      const payload: CreateExpensePayload = {
        vehicle: form.vehicle,
        type: form.type as ExpenseType,
        amount: Number(form.amount),
        date: form.date,
        ...(form.description ? { description: form.description } : {}),
      };
      const expense = await createExpense(payload);
      const selectedVehicle = vehicles.find((v) => v._id === form.vehicle);
      onSuccess(selectedVehicle ? { ...expense, vehicle: selectedVehicle } : expense);
    } catch (err) {
      setError(errorMessage(err, "Failed to add expense."));
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
        <Input
          as="select"
          label="Type"
          required
          value={form.type}
          onChange={update("type")}
          options={EXPENSE_TYPES}
        />
        <Input label="Amount" type="number" min={1} required value={form.amount} onChange={update("amount")} />
      </div>

      <Input label="Date" type="date" required value={form.date} onChange={update("date")} />

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
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Add Expense"}
        </Button>
      </div>
    </form>
  );
}
