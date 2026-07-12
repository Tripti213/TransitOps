import { useEffect, useState } from 'react';
import { KPICard } from '../../components/dashboard/KPICard';
import { FiTruck, FiUsers, FiClipboard, FiDollarSign } from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    maintenanceCount: 0,
    totalOperationalCost: 0,
    completedTrips: 0
  });

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [fleetRes, costRes, fuelRes] = await Promise.all([
          fetch('/api/reports/fleet'),
          fetch('/api/reports/cost'),
          fetch('/api/reports/fuel')
        ]);

        const fleet = await fleetRes.json();
        const cost = await costRes.json();
        const fuel = await fuelRes.json();

        if (fleet.success && cost.success && fuel.success) {
          setStats({
            totalVehicles: fleet.report.available + fleet.report.onTrip + fleet.report.inShop,
            maintenanceCount: fleet.report.inShop,
            totalOperationalCost: cost.report.totalOperationalCost,
            completedTrips: fuel.report.completedTrips
          });
        }
      } catch (e) {
        console.error('Failed to load dashboard stats', e);
      }
    };
    fetchAllStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-[var(--text-h)]">Fleet Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Vehicles" value={stats.totalVehicles} icon={<FiTruck />} />
        <KPICard title="Vehicles in Shop" value={stats.maintenanceCount} icon={<FiUsers />} />
        <KPICard title="Completed Trips" value={stats.completedTrips} icon={<FiClipboard />} />
        <KPICard title="Total Ops Cost" value={`$${stats.totalOperationalCost.toLocaleString()}`} icon={<FiDollarSign />} />
      </div>
    </div>
  );
}