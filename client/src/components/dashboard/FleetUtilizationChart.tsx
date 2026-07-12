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

        <div className="bg-[var(--bg)] border border-[var(--accent)]/20 rounded-lg shadow-sm p-5">

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
    fill="#C58A2C"
    background={{
        fill:"#CFC7BA"
    }}
    cornerRadius={12}
/>

                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-current text-3xl font-bold"
                    >
                        {utilization}%
                    </text>

                </RadialBarChart>

            </ResponsiveContainer>

        </div>

    );

}