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
        "var(--status-available)",
        "var(--status-info)",
        "var(--status-warning)",
        "var(--status-neutral)"
    ];

    return(

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)] p-5">

            <h3 className="text-lg font-semibold mb-4 text-[var(--text-h)]">
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
                        tick={{ fill: "var(--text)", fontSize: 13 }}
                        axisLine={{ stroke: "var(--border)" }}
                        tickLine={false}
                    />

                    <Tooltip
                        cursor={{ fill: "var(--accent-bg)" }}
                        contentStyle={{
                            background: "var(--bg)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            color: "var(--text-h)",
                            fontSize: 13,
                        }}
                        labelStyle={{ color: "var(--text-h)" }}
                    />

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