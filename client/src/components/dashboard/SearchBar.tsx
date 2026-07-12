interface Props{
    search:string;
    setSearch:React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchBar({
    search,
    setSearch
}:Props){

    return(

        <div className="flex items-center">

            <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search vehicle, driver or destination..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-transparent outline-none"
            />

        </div>

    );

}