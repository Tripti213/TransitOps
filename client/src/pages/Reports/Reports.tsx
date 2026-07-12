import { useState, useEffect, useMemo } from "react";
import { Button } from "../../components/common/Button";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Reports() {
  const [data, setData] = useState<any>(null);
  const [fuelData, setFuelData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Corrected to match your backend route: /api/reports/fuel
    Promise.all([
      fetch("/api/reports/analytics").then((res) => res.json()),
      fetch("/api/reports/fuel").then((res) => res.json()),
    ]).then(([analytics, fuel]) => {
      setData(analytics);
      setFuelData(fuel);
      setIsLoading(false);
    });
  }, []);

  const metrics = useMemo(() => {
    if (!data || !fuelData) return null;
    return {
      efficiency: fuelData.report?.averageMileage || 0,
      utilization: data.vehicles?.total > 0 ? ((data.vehicles.onTrip / data.vehicles.total) * 100).toFixed(1) : 0,
      totalOpCost: data.finance?.totalCost || 0,
      roi: 14.2 // Placeholder as ROI needs revenue source
    };
  }, [data, fuelData]);

const exportPDF = async () => {
  const input = document.getElementById("report-content");
  if (!input) return;

  const clone = input.cloneNode(true) as HTMLElement;
  clone.style.backgroundColor = "#ffffff";
  clone.style.color = "#000000";
  clone.style.width = `${input.offsetWidth}px`;
  clone.style.maxWidth = "100%";
  clone.style.position = "absolute";
  clone.style.top = "0";
  clone.style.left = "-9999px";
  clone.style.zIndex = "9999";
  clone.style.visibility = "visible";
  clone.style.pointerEvents = "none";

  const sanitizeElement = (el: HTMLElement) => {
    el.style.setProperty("color", "#000000", "important");
    el.style.setProperty("background-color", "#ffffff", "important");
    el.style.setProperty("border-color", "#d1d5db", "important");
    el.style.setProperty("box-shadow", "none", "important");
    el.style.setProperty("text-shadow", "none", "important");
    el.style.setProperty("filter", "none", "important");
    el.style.setProperty("background-image", "none", "important");
    el.style.setProperty("outline", "none", "important");
    el.style.setProperty("transition", "none", "important");
  };

  sanitizeElement(clone);
  clone.querySelectorAll<HTMLElement>("*").forEach(sanitizeElement);
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("fleet-report.pdf");
  } catch (error) {
    console.error("PDF Export failed:", error);
  } finally {
    document.body.removeChild(clone);
  }
};

  if (isLoading) return <div className="text-[var(--text)] p-4">Loading reports...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="report-content">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-[var(--text-h)]">Reports & Analytics</h2>
<div className="flex gap-2">
  <Button onClick={() => window.location.href = "/api/reports/operational-cost/export"}>
    Export CSV
  </Button>
  
  {/* Ensure this is calling the function directly */}
  <Button 
    variant="secondary" 
    onClick={() => {
      console.log("PDF Export Clicked!"); // Debugging
      exportPDF(); 
    }}
  >
    Export PDF
  </Button>
</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="FUEL EFFICIENCY" value={`${metrics?.efficiency} km/l`} />
        <MetricCard title="FLEET UTILIZATION" value={`${metrics?.utilization}%`} />
        <MetricCard title="OPERATIONAL COST" value={metrics?.totalOpCost.toLocaleString()} />
        <MetricCard title="VEHICLE ROI" value={`${metrics?.roi}%`} />
      </div>

      {/* Analytics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-[var(--card-bg)] rounded-xl border border-[var(--border)]">
          <h3 className="mb-4 text-[var(--text-h)]">MONTHLY REVENUE</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[{ m: 'Jan', r: 4000 }, { m: 'Feb', r: 6000 }, { m: 'Mar', r: 5000 }, { m: 'Apr', r: 8000 }, { m: 'May', r: 7000 }]}>
              <XAxis
                dataKey="m"
                stroke="var(--text)"
                tick={{ fill: 'black' }}
              />
              <YAxis
                tick={{ fill: 'black' }}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  backgroundColor: 'white',
                  borderColor: 'black',
                  color: 'black'
                }}
                itemStyle={{ color: 'black' }}
              />
              <Bar
                dataKey="r"
                fill="#60a5fa"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-[var(--card-bg)] rounded-xl border border-[var(--border)]">
          <h3 className="mb-4 text-[var(--text-h)]">TOP COSTLIEST VEHICLES</h3>
          <div className="space-y-4">
            <VehicleBar name="TRUCK-11" value={85} color="bg-red-400" />
            <VehicleBar name="MINI-03" value={60} color="bg-orange-600" />
            <VehicleBar name="VAN-05" value={30} color="bg-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

const MetricCard = ({ title, value }: any) => (
  <div className="p-6 bg-[var(--card-bg)] rounded-xl border border-[var(--border)]">
    <p className="text-xs text-[var(--text)]/70 uppercase tracking-wider">{title}</p>
    <p className="text-3xl font-bold mt-2 text-[var(--text-h)]">{value}</p>
  </div>
);

const VehicleBar = ({ name, value, color }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm text-[var(--text)]"><span>{name}</span></div>
    <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);