"use client";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { InsightCard } from "@/components/ui/InsightCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { Select } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { useState } from "react";
import { getStudents, getAttendance, getBatches } from "@/lib/storage";
import { getAttendanceStats } from "@/lib/calculations";
import { downloadCSV } from "@/lib/csv";
import { BarChart3, Download, FileText, TrendingUp, Users, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ReportsPage() {
  const [students] = useState(() => getStudents());
  const [attendance] = useState(() => getAttendance());
  const [batches] = useState(() => getBatches());
  const [batchFilter, setBatchFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth().toString());

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const filtered = attendance.filter((a) => {
    const d = new Date(a.date);
    const matchMonth = monthFilter === "all" || d.getMonth() === parseInt(monthFilter);
    if (!matchMonth) return false;
    if (batchFilter !== "all") {
      const s = students.find((st) => st.id === a.studentId);
      if (s?.batchId !== batchFilter) return false;
    }
    return true;
  });

  const stats = getAttendanceStats(filtered);

  const studentWise = students.map((s) => {
    const recs = filtered.filter((a) => a.studentId === s.id);
    const sStats = getAttendanceStats(recs);
    return { id: s.id, name: s.name, batch: s.batchName, present: sStats.present, absent: sStats.absent, percentage: sStats.percentage };
  }).sort((a, b) => a.percentage - b.percentage);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyTrend = monthNames.map((name, idx) => {
    const recs = attendance.filter((a) => {
      const d = new Date(a.date);
      return d.getMonth() === idx && d.getFullYear() === new Date().getFullYear();
    });
    const s = getAttendanceStats(recs);
    return { month: name, Present: s.present, Absent: s.absent, Rate: s.percentage };
  });

  const batchComparison = batches.filter(b => b.active).map((b) => {
    const recs = filtered.filter((a) => {
      const s = students.find((st) => st.id === a.studentId);
      return s?.batchId === b.id;
    });
    const s = getAttendanceStats(recs);
    return { name: b.name.split(" ").slice(0, 2).join(" "), rate: s.percentage };
  });

  const lowAttendance = studentWise.filter(s => s.percentage < 70 && s.present + s.absent > 0);
  const bestBatch = batchComparison.length > 0 ? batchComparison.reduce((a, b) => a.rate > b.rate ? a : b) : null;

  const handleExport = () => {
    const exportData = studentWise.map((s) => ({
      Name: s.name,
      Batch: s.batch,
      Present: s.present,
      Absent: s.absent,
      "Percentage (%)": s.percentage,
    }));
    downloadCSV(exportData, `attendance_report_${new Date().toISOString().split("T")[0]}.csv`);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          icon={<BarChart3 size={22} className="text-[#FFD93D]" />}
          title="Attendance Reports"
          description="Attendance analytics, trends, and batch comparison — export data to CSV"
          actions={
            <Button variant="secondary" onClick={handleExport}>
              <Download size={14} /> CSV Export
            </Button>
          }
        />

        <div className="flex flex-wrap gap-3">
          <Select
            options={[{ value: "all", label: "All Batches" }, ...batches.map((b) => ({ value: b.id, label: b.name }))]}
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
          />
          <Select
            options={[{ value: "all", label: "All Months" }, ...months.map((m, i) => ({ value: String(i), label: m }))]}
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <MetricCard title="Total Records" value={stats.total.toLocaleString()} icon={<FileText size={16} />} accent="gold" />
          <MetricCard title="Present" value={stats.present.toLocaleString()} icon={<Users size={16} />} accent="green" />
          <MetricCard title="Absent" value={stats.absent.toLocaleString()} icon={<Users size={16} />} accent="red" />
          <MetricCard title="Avg Attendance" value={`${stats.percentage}%`} icon={<TrendingUp size={16} />} accent="blue" />
          <MetricCard
            title="Best Batch"
            value={bestBatch ? `${bestBatch.rate}%` : "N/A"}
            icon={<BarChart3 size={16} />}
            accent="orange"
            subtitle={bestBatch ? `${bestBatch.name}` : undefined}
          />
        </div>

        {lowAttendance.length > 0 && (
          <div className="rounded-xl p-4 border" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
            <div className="flex items-center gap-2 text-sm text-[#EF4444] font-medium mb-2">
              <Search size={14} /> {lowAttendance.length} student{lowAttendance.length > 1 ? "s" : ""} below 70% attendance
            </div>
            <div className="flex flex-wrap gap-2">
              {lowAttendance.map(s => (
                <StatusBadge key={s.id} variant="danger">{s.name} ({s.percentage}%)</StatusBadge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Monthly Trend</h3>
              <Badge variant="neutral">Present vs Absent</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "rgba(22,22,29,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#FAFAFA", fontSize: 12 }}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Legend />
                  <Bar dataKey="Present" fill="#22C55E" radius={[3, 3, 0, 0]} maxBarSize={12} />
                  <Bar dataKey="Absent" fill="#EF4444" radius={[3, 3, 0, 0]} maxBarSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </InsightCard>

          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Batch Comparison</h3>
              <Badge variant="neutral">Attendance %</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batchComparison} layout="vertical" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" stroke="#71717A" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="#71717A" fontSize={11} tickLine={false} width={100} />
                  <Tooltip
                    contentStyle={{ background: "rgba(22,22,29,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#FAFAFA", fontSize: 12 }}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar dataKey="rate" fill="#4A7CFF" radius={[0, 3, 3, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </InsightCard>
        </div>

        <InsightCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Student-wise Report</h3>
            <span className="text-xs text-[#71717A]">{students.length} students</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase">Student</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase">Batch</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase">Present</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase">Absent</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase">%</th>
                </tr>
              </thead>
              <tbody>
                {studentWise.map((s) => (
                  <tr key={s.id} className="transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                  >
                    <td className="py-3 px-4 text-[#FAFAFA] font-medium">{s.name}</td>
                    <td className="py-3 px-4 text-[#A1A1AA]">{s.batch}</td>
                    <td className="py-3 px-4 text-center text-[#22C55E]">{s.present}</td>
                    <td className="py-3 px-4 text-center text-[#EF4444]">{s.absent}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge variant={s.percentage >= 75 ? "success" : s.percentage >= 50 ? "warning" : "danger"}>
                        {s.percentage}%
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InsightCard>
      </div>
    </AppShell>
  );
}
