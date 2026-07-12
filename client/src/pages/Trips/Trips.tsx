import { useState, useEffect } from "react";
import { Table } from "../../components/common/Table";
import { StatusBadge, type StatusVariant } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import CompleteTripForm from "../../components/forms/TripForm"; // Ensure path is corrected to lowercase 'components'
import type { Trip } from "../../types/trip";

const getStatusVariant = (status: string): StatusVariant => {
  const map: Record<string, StatusVariant> = {
    'Draft': 'neutral',
    'Dispatched': 'warning',
    'Completed': 'available',
    'Cancelled': 'danger'
  };
  return map[status] || 'neutral';
};

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // 1. Add Filter State
  const [filters, setFilters] = useState({ search: "", status: "", page: 1 });

  useEffect(() => {
    setIsLoading(true);
    // 2. Pass filters as query params
    const query = new URLSearchParams({ ...filters, page: filters.page.toString() }).toString();

    fetch(`/api/trips?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setTrips(data.trips || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [filters]); // Refetches whenever filters change

  const handleTripAction = async (id: string, action: 'dispatch' | 'complete' | 'cancel') => {
    await fetch(`/api/trips/${id}/${action}`, { method: 'PATCH' });
    // Instead of reload, just toggle a state to force a re-fetch if desired
    setFilters(p => ({ ...p }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl text-[var(--text-h)]">Trip Management</h2>

      {/* 3. Search and Filter Controls */}
      <div className="flex gap-4">
        <input
          placeholder="Search source/destination..."
          className="border p-2 rounded"
          onChange={(e) => setFilters(p => ({ ...p, search: e.target.value, page: 1 }))}
        />
        <select
          className="border p-2 rounded"
          onChange={(e) => setFilters(p => ({ ...p, status: e.target.value, page: 1 }))}
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-[var(--text)]/60">Loading trips...</div>
      ) : (
        <Table
          data={trips}
          columns={[
            { header: "Vehicle", accessor: (row: any) => row.vehicle?.registrationNumber || "N/A" },
            { header: "Driver", accessor: (row: any) => row.driver?.name || "N/A" },
            {
              header: "Status",
              accessor: (row) => <StatusBadge label={row.status} variant={getStatusVariant(row.status)} />
            },
            {
              header: "Actions",
              accessor: (row: any) => (
                <div className="flex gap-2">
                  {row.status === 'Draft' && (
                    <>
                      <Button onClick={() => handleTripAction(row._id, 'dispatch')}>Dispatch</Button>
                      <Button variant="secondary" onClick={() => handleTripAction(row._id, 'cancel')}>Cancel</Button>
                    </>
                  )}
                  {row.status === 'Dispatched' && (
                    <Button onClick={() => { setSelectedTripId(row._id); setIsCompleteOpen(true); }}>
                      Complete
                    </Button>
                  )}
                </div>
              )
            }
          ]}
        />
      )}

      {/* 4. Pagination */}
      <div className="flex gap-4 items-center justify-center mt-4">
        <Button
          disabled={filters.page === 1}
          onClick={() => setFilters(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
        >
          Prev
        </Button>

        <span className="text-sm font-medium">
          Page {filters.page}
        </span>

        <Button
          onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
        >
          Next
        </Button>
      </div>

      {selectedTripId && (
        <Modal isOpen={isCompleteOpen} onClose={() => setIsCompleteOpen(false)} title="Complete Trip">
          <CompleteTripForm
            tripId={selectedTripId}
            onSuccess={() => { setIsCompleteOpen(false); setFilters(p => ({ ...p })); }}
            onCancel={() => setIsCompleteOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}