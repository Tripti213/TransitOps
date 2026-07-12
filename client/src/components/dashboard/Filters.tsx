interface Props{
    filters:{
        type:string;
        status:string;
        region:string;
    };
    setFilters:React.Dispatch<React.SetStateAction<any>>;
}

export default function Filters({
    filters,
    setFilters
}:Props){

    return(

        <div className="flex gap-4 flex-wrap">

            <select
                value={filters.type}
                onChange={(e)=>
                    setFilters(prev=>({
                        ...prev,
                        type:e.target.value
                    }))
                }
                className="border rounded-lg px-3 py-2 bg-transparent"
            >
                <option value="">Vehicle Type</option>
                <option>Truck</option>
                <option>Van</option>
                <option>Pickup</option>
                <option>Trailer</option>
                <option>Mini-Truck</option>
            </select>

            <select
                value={filters.status}
                onChange={(e)=>
                    setFilters(prev=>({
                        ...prev,
                        status:e.target.value
                    }))
                }
                className="border rounded-lg px-3 py-2 bg-transparent"
            >
                <option value="">Status</option>
                <option>Available</option>
                <option>On Trip</option>
                <option>In Shop</option>
                <option>Retired</option>
            </select>

            <select
                value={filters.region}
                onChange={(e)=>
                    setFilters(prev=>({
                        ...prev,
                        region:e.target.value
                    }))
                }
                className="border rounded-lg px-3 py-2 bg-transparent"
            >
                <option value="">Region</option>
                <option>North</option>
                <option>South</option>
                <option>East</option>
                <option>West</option>
            </select>

        </div>

    );

}