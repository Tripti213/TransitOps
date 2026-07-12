import { useState, useEffect } from 'react';
import { Table, type Column } from '../../components/common/Table';
import { StatusBadge, type StatusVariant } from '../../components/common/StatusBadge';

// Updated interface to match your teammate's Mongoose model exactly
interface Vehicle {
  _id: string;
  registrationNumber: string;
  name: string;      // Matches her model
  type: string;      // Matches her model
  status: 'Available' | 'On Trip' | 'In Shop' | 'Retired';
  odometer: number;
  maxLoadCapacity: number;
  createdAt: string;
}

const statusConfig: Record<Vehicle['status'], { label: string; variant: StatusVariant }> = {
  'Available': { label: 'Available', variant: 'available' },
  'On Trip': { label: 'On Trip', variant: 'neutral' },
  'In Shop': { label: 'In Shop', variant: 'warning' },
  'Retired': { label: 'Retired', variant: 'danger' },
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/vehicles');
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle data');
        }
        const json = await response.json();
        
        // Log to verify the array structure
        console.log('API Response:', json); 
        
        // Set state: ensure we always pass an array to the Table[cite: 1]
        setVehicles(Array.isArray(json) ? json : (json.data || []));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const columns: Column<Vehicle>[] = [
    { header: 'Registration', accessor: 'registrationNumber' },
    { header: 'Vehicle Name', accessor: 'name' },
    { header: 'Type', accessor: 'type' },
    {
      header: 'Status',
      accessor: (row) => {
        const config = statusConfig[row.status] || { label: row.status, variant: 'neutral' };
        return <StatusBadge label={config.label} variant={config.variant} />;
      },
    },
    { 
      header: 'Odometer', 
      accessor: (row) => `${row.odometer?.toLocaleString() || 0} km`,
      isNumeric: true 
    },
    { 
      header: 'Load Capacity', 
      accessor: (row) => `${row.maxLoadCapacity?.toLocaleString() || 0} kg`,
      isNumeric: true 
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[var(--text-h)]">Vehicle Registry</h2>
          <p className="text-[var(--text)]/70 text-sm mt-1">Manage fleet assets and maintenance schedules.</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="py-12 text-center text-[var(--text)]/60">Loading vehicles...</div>
      ) : error ? (
        <div className="py-12 text-center text-[var(--status-danger)]">Error: {error}</div>
      ) : (
        <Table 
          data={vehicles} 
          columns={columns} 
        />
      )}
    </div>
  );
}