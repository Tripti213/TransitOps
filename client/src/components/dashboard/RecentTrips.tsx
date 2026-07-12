import { useEffect, useState } from "react";

interface Props{
    search:string;
}

export default function RecentTrips({
    search
}:Props) {

    const [trips,setTrips]=useState<any[]>([]);

    useEffect(()=>{

        fetch("/api/trips?limit=5")
            .then(res=>res.json())
            .then(data=>setTrips(data.trips||[]));

    },[]);
    const filteredTrips=trips.filter((trip:any)=>{

    const q=search.toLowerCase();

    return(
        trip.vehicle?.name?.toLowerCase().includes(q)||
        trip.driver?.name?.toLowerCase().includes(q)||
        trip.destination?.toLowerCase().includes(q)||
        trip.status?.toLowerCase().includes(q)
    );

});

    return(

        <div className="bg-[var(--bg)] rounded-xl border border-[var(--accent)]/20 p-5 shadow-sm">

            <h2 className="text-lg font-semibold mb-4 text-[var(--text-h)]">
                Recent Trips
            </h2>

            <table className="w-full text-sm">

                <thead>

                    <tr className="border-b">

                        <th className="text-left py-3">Vehicle</th>
                        <th className="text-left py-3">Driver</th>
                        <th className="text-left py-3">Status</th>
                        <th className="text-left py-3">Destination</th>

                    </tr>

                </thead>

                <tbody>

                    {filteredTrips.map((trip:any)=>(

                        <tr
                            key={trip._id}
                            className="border-b last:border-none"
                        >

                            <td className="py-3">
                                {trip.vehicle?.name || "-"}
                            </td>

                            <td>
                                {trip.driver?.name || "-"}
                            </td>

                            <td>

                                <span
                                    className={`px-2 py-1 rounded text-xs ${
                                        trip.status==="Completed"
                                            ?"bg-green-100 text-green-700"
                                            :trip.status==="Dispatched"
                                            ?"bg-blue-100 text-blue-700"
                                            :trip.status==="Cancelled"
                                            ?"bg-red-100 text-red-700"
                                            :"bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {trip.status}
                                </span>

                            </td>

                            <td>
                                {trip.destination}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}