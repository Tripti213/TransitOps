import { useState, useEffect } from 'react';
import { Table, type Column } from '../../components/common/Table';
import { StatusBadge, type StatusVariant } from '../../components/common/StatusBadge';

interface Trip {
  _id: string;
  vehicleId: string;
  driverId: string;
  status: string; // Changed to string to handle case variations
  plannedDistance: number;
  actualDistance?: number;
}

// Map both capitalized and lowercase/varied statuses to handle API inconsistencies
const statusConfig: Record<string, { label: string; variant: StatusVariant }> = {
  'Pending': { label: 'Pending', variant: 'neutral' },
  'pending': { label: 'Pending', variant: 'neutral' },
  'In-Transit': { label: 'In-Transit', variant: 'warning' },
  'in-transit': { label: 'In-Transit', variant: 'warning' },
  'Completed': { label: 'Completed', variant: 'available' },
  'completed': { label: 'Completed', variant: 'available' },
  'Cancelled': { label: 'Cancelled', variant: 'danger' },
  'cancelled': { label: 'Cancelled', variant: 'danger' },
};

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch('/api/trips');
        const json = await res.json();
        
        // Safely extract the array. Adjust 'data' to 'trips' if that's what your backend uses
        const tripArray = Array.isArray(json) ? json : (json.data || json.trips || []);
        setTrips(tripArray);
      } catch (err) {
        console.error('Error fetching trips:', err);
      }
    };
    fetchTrips();
  }, []);

  const handleAction = async (id: string, action: 'dispatch' | 'complete' | 'cancel') => {
    await fetch(`/api/trips/${id}/${action}`, { method: 'PATCH' });
    window.location.reload(); 
  };

  const columns: Column<Trip>[] = [
    { header: 'Vehicle', accessor: (row) => row.vehicleId || 'N/A' },
    { header: 'Driver', accessor: (row) => row.driverId || 'N/A' },
    { 
      header: 'Status', 
      accessor: (row) => {
        // Safe access: defaults to a neutral badge if the status is unknown
        const config = statusConfig[row.status] || { label: row.status, variant: 'neutral' };
        return <StatusBadge label={config.label} variant={config.variant} />;
      } 
    },
    { 
      header: 'Actions', 
      accessor: (row) => (
        <div className="flex gap-2">
          {['Pending', 'pending'].includes(row.status) && (
            <button onClick={() => handleAction(row._id, 'dispatch')} className="text-xs px-2 py-1 bg-amber-100 rounded">Dispatch</button>
          )}
          {['In-Transit', 'in-transit'].includes(row.status) && (
            <button onClick={() => handleAction(row._id, 'complete')} className="text-xs px-2 py-1 bg-emerald-100 rounded">Complete</button>
          )}
          {row.status !== 'Completed' && row.status !== 'completed' && row.status !== 'Cancelled' && (
            <button onClick={() => handleAction(row._id, 'cancel')} className="text-xs px-2 py-1 bg-red-100 rounded">Cancel</button>
          )}
        </div>
      ) 
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-[var(--text-h)]">Trip Management</h2>
      <Table data={trips} columns={columns} />
    </div>
  );
}