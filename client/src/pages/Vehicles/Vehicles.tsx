import React, { useState } from 'react';
import { Table, type Column } from '../../components/common/Table';
import { StatusBadge, type StatusVariant } from '../../components/common/StatusBadge';

// Temporary type matching your seeded DB schema
interface Vehicle {
  _id: string;
  registrationNumber: string;
  make: string;
  model: string;
  status: 'active' | 'maintenance' | 'out_of_service';
  odometer: number;
  lastServiceDate: string;
}

// Mocking the seed data until the backend API is connected
const MOCK_VEHICLES: Vehicle[] = [
  { _id: 'v1', registrationNumber: 'TR-1024', make: 'Ford', model: 'Transit 250', status: 'active', odometer: 45200, lastServiceDate: '2026-06-15' },
  { _id: 'v2', registrationNumber: 'TR-1025', make: 'Mercedes', model: 'Sprinter', status: 'maintenance', odometer: 89000, lastServiceDate: '2026-07-10' },
  { _id: 'v3', registrationNumber: 'TR-1026', make: 'Ford', model: 'Transit 250', status: 'active', odometer: 12450, lastServiceDate: '2026-05-20' },
  { _id: 'v4', registrationNumber: 'TR-1027', make: 'Ram', model: 'ProMaster', status: 'out_of_service', odometer: 112000, lastServiceDate: '2026-01-10' },
];

const statusConfig: Record<Vehicle['status'], { label: string; variant: StatusVariant }> = {
  active: { label: 'Available', variant: 'available' },
  maintenance: { label: 'In Maintenance', variant: 'warning' },
  out_of_service: { label: 'Out of Service', variant: 'danger' },
};

export default function Vehicles() {
  const [vehicles] = useState<Vehicle[]>(MOCK_VEHICLES); // TODO: Replace with useFetch/SWR once backend is ready

  const columns: Column<Vehicle>[] = [
    { 
      header: 'Registration', 
      accessor: 'registrationNumber' 
    },
    { 
      header: 'Vehicle', 
      accessor: (row) => `${row.make} ${row.model}` 
    },
    {
      header: 'Status',
      accessor: (row) => {
        const config = statusConfig[row.status];
        return <StatusBadge label={config.label} variant={config.variant} />;
      },
    },
    { 
      header: 'Odometer', 
      accessor: (row) => `${row.odometer.toLocaleString()} mi`,
      isNumeric: true 
    },
    { 
      header: 'Last Service', 
      accessor: 'lastServiceDate' 
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[var(--text-h)]">Vehicle Registry</h2>
          <p className="text-[var(--text)]/70 text-sm mt-1">Manage fleet assets, status, and maintenance schedules.</p>
        </div>
        <button className="bg-[var(--accent)] text-[var(--bg)] px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
          + Add Vehicle
        </button>
      </div>
      
      <Table 
        data={vehicles} 
        columns={columns} 
        onRowClick={(row) => console.log('TODO: Open vehicle details for', row.registrationNumber)} 
      />
    </div>
  );
}