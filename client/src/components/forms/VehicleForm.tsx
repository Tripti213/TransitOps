import { useState } from "react";
import { Button } from "../common/Button";

interface Props {
  onSuccess: (vehicle: any) => void;
  onCancel: () => void;
}

export default function VehicleForm({ onSuccess, onCancel }: Props) {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    name: "",
    type: "",
    maxLoadCapacity: "",
    odometer: "",
    acquisitionCost: "",
    region: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (json.success) onSuccess(json.vehicle);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        placeholder="Reg Number" 
        className="w-full border p-2"
        onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
      />
      <input 
        placeholder="Vehicle Name" 
        className="w-full border p-2"
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <div className="flex gap-2 justify-end">
        <Button type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Register</Button>
      </div>
    </form>
  );
}