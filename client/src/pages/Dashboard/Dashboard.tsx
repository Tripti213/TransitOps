import { useEffect, useState } from "react";
import { FiTruck, FiUsers, FiClipboard, FiTool, FiActivity, FiCheckCircle, FiBarChart2 } from "react-icons/fi";
import { KPICard } from "../../components/dashboard/KPICard";
import SearchBar from "../../components/dashboard/SearchBar";
import RecentTrips from "../../components/dashboard/RecentTrips";
import VehicleStatus from "../../components/dashboard/VehicleStatusChart";
import FleetUtilizationChart from "../../components/dashboard/FleetUtilizationChart";
import api from "../../services/api";
export default function Dashboard() {

    const [analytics,setAnalytics]=useState<any>(null);

    const [fleet,setFleet]=useState<any>(null);
    const [search,setSearch]=useState("");
    useEffect(()=>{

        const load=async()=>{

            try{

                const [analyticsRes, fleetRes] = await Promise.all([
    api.get("/reports/analytics"),
    api.get("/reports/fleet-utilization")
]);

const analyticsData = analyticsRes.data;
const fleetData = fleetRes.data;

                setAnalytics(analyticsData);

                setFleet(fleetData);

            }
            catch(err){
                console.log(err);
            }

        };

        load();

    },[]);

    if(!analytics||!fleet){

        return(
            <div className="p-8">
                Loading Dashboard...
            </div>
        );

    }

    return(

        <div className="space-y-8">

           <SearchBar
    search={search}
    setSearch={setSearch}
/>


          

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">



                <KPICard
                    title="Active Vehicles"
                    value={fleet.totalVehicles-fleet.retired}
                    icon={<FiTruck size={24}/>}
                />

                <KPICard
                    title="Available Vehicles"
                    value={fleet.available}
                    icon={<FiCheckCircle size={24}/>}
                />


                <KPICard
                    title="Vehicles In Shop"
                    value={fleet.inShop}
                    icon={<FiTool size={24}/>}
                />

                <KPICard
                    title="Active Trips"
                    value={analytics.trips.active}
                    icon={<FiClipboard size={24}/>}
                />

                <KPICard
                    title="Completed Trips"
                    value={analytics.trips.completed}
                    icon={<FiActivity size={24}/>}
                />
                <KPICard
                    title="Drivers Available"
                    value={analytics.drivers.available}
                    icon={<FiActivity size={24}/>}
                />

                <KPICard
                    title="Drivers On Duty"
                    value={analytics.drivers.onTrip}
                    icon={<FiUsers size={24}/>}
                />

                <KPICard
                    title="Fleet Utilization"
                    value={`${fleet.fleetUtilization}%`}
                    icon={<FiBarChart2 size={24}/>}
                />

                <KPICard
                    title="Operational Cost"
                    value={`₹${analytics.finance.totalCost.toLocaleString()}`}
                    icon={<FiTruck size={24}/>}
                />

            </div>

            <div className="grid grid-cols-12 gap-6">

    <div className="col-span-12 xl:col-span-8">

        <RecentTrips search={search}/>

    </div>

    <div className="col-span-12 xl:col-span-4 space-y-6">

        <FleetUtilizationChart
            utilization={fleet.fleetUtilization}
        />

        <VehicleStatus fleet={fleet}/>

    </div>

</div>

        </div>

    );

}