import { useState, useEffect } from "react";
import { Table } from "../../components/common/Table";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import type { Trip } from "../../types/trip";

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);

useEffect(() => {
  fetch("/api/trips")
    .then((res) => res.json())
    .then((data) => {
      console.log("API Response:", data); 
      setTrips(Array.isArray(data) ? data : (data.vehicles || data.trips || []));
    })
    .catch(console.error);
}, []);

  const handleTripAction = async (id: string, action: 'dispatch' | 'complete' | 'cancel') => {
    await fetch(`/api/trips/${id}/${action}`, { method: 'PATCH' });
    window.location.reload(); // Refresh to see updated status
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-[var(--text-h)]">Trip Management</h2>
      <Table 
        data={trips} 
        columns={[
          { header: "Vehicle", accessor: "vehicleId" },
          { header: "Driver", accessor: "driverId" },
          { 
            header: "Status", 
            accessor: (row) => <StatusBadge label={row.status} variant={row.status === 'Pending' ? 'neutral' : 'warning'} /> 
          },
          { 
            header: "Actions", 
            accessor: (row) => (
              <div className="flex gap-2">
                {row.status === 'Pending' && <Button onClick={() => handleTripAction(row._id, 'dispatch')}>Dispatch</Button>}
                {row.status === 'In-Transit' && <Button onClick={() => handleTripAction(row._id, 'complete')}>Complete</Button>}
                {row.status === 'Pending' && <Button onClick={() => handleTripAction(row._id, 'cancel')}>Cancel</Button>}
              </div>
            ) 
          }
        ]} 
      />
    </div>
  );
}