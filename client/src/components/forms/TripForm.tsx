import { useState } from "react";
import { Button } from "../common/Button";

export default function CompleteTripForm({ tripId, onSuccess, onCancel }: any) {
  const [formData, setFormData] = useState({
    actualDistance: "",
    fuelConsumed: "",
    endOdometer: "",
    fuelCost: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/trips/${tripId}/complete`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    if (res.ok) onSuccess();
    else alert("Failed to complete trip: Check odometer/input values.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="number" placeholder="Actual Distance (km)" className="w-full border p-2" onChange={(e) => setFormData({...formData, actualDistance: e.target.value})} required />
      <input type="number" placeholder="Fuel Consumed (Liters)" className="w-full border p-2" onChange={(e) => setFormData({...formData, fuelConsumed: e.target.value})} required />
      <input type="number" placeholder="End Odometer Reading" className="w-full border p-2" onChange={(e) => setFormData({...formData, endOdometer: e.target.value})} required />
      <input type="number" placeholder="Total Fuel Cost" className="w-full border p-2" onChange={(e) => setFormData({...formData, fuelCost: e.target.value})} required />
      <div className="flex justify-end gap-2">
        <Button type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Complete Trip</Button>
      </div>
    </form>
  );
}