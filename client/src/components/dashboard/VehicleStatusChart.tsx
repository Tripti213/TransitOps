import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell
} from "recharts";

interface Props{
    fleet:any;
}

export default function VehicleStatusChart({fleet}:Props){

    const data=[
        {
            status:"Available",
            value:fleet.available
        },
        {
            status:"On Trip",
            value:fleet.onTrip
        },
        {
            status:"In Shop",
            value:fleet.inShop
        },
        {
            status:"Retired",
            value:fleet.retired
        }
    ];

    const colors=[
        "#22c55e",
        "#3b82f6",
        "#f59e0b",
        "#ef4444"
    ];

    return(

        <div className="bg-[var(--bg)] border border-[var(--accent)]/20 rounded-lg shadow-sm p-5">

            <h3 className="text-lg font-semibold mb-4">
                Vehicle Status
            </h3>

            <ResponsiveContainer
                width="100%"
                height={230}
            >

                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{
                        left:10,
                        right:20
                    }}
                >

                    <XAxis
                        type="number"
                        hide
                    />

                    <YAxis
                        type="category"
                        dataKey="status"
                        width={80}
                    />

                    <Tooltip/>

                    <Bar
                        dataKey="value"
                        radius={[8,8,8,8]}
                    >

                        {data.map((_,index)=>(

                            <Cell
                                key={index}
                                fill={colors[index]}
                            />

                        ))}

                    </Bar>

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}