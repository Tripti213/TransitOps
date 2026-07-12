import {
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    PolarAngleAxis
} from "recharts";

interface Props{
    utilization:number;
}

export default function FleetUtilizationChart({
    utilization
}:Props){

    return(

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)] p-5">

            <h3 className="text-lg font-semibold text-[var(--text-h)] mb-4">
                Fleet Utilization
            </h3>

            <ResponsiveContainer
                width="100%"
                height={230}
            >

                <RadialBarChart
                    data={[
                        {
                            value:utilization
                        }
                    ]}
                    innerRadius="65%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                >

                    <PolarAngleAxis
                        type="number"
                        domain={[0,100]}
                        tick={false}
                    />

                    <RadialBar
    dataKey="value"
    fill="var(--accent)"
    background={{
        fill:"var(--border)"
    }}
    cornerRadius={12}
/>

                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-3xl font-bold"
                        style={{ fill: "var(--text-h)" }}
                    >
                        {utilization}%
                    </text>

                </RadialBarChart>

            </ResponsiveContainer>

        </div>

    );

}