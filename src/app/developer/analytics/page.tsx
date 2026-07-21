"use client";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge, FeeStatusBadge, AttendanceStatusBadge } from "@/components/ui/StatusBadge";
import { InsightCard } from "@/components/ui/InsightCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import {
  getStudents, getBatches, getParents, getAttendance,
  getFees, getLeads, getNotifications, getSupportTickets,
  getSchedules,
} from "@/lib/storage";
import { getAttendanceStats } from "@/lib/calculations";
import type { Student, Batch, FeeRecord, AttendanceRecord, Lead, Notification } from "@/lib/types";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import {
  Users, Layers, UserCheck, IndianRupee, TrendingUp, Clock,
  AlertTriangle, CreditCard, Activity, Download, FileText,
  BarChart3, PieChart as PieChartIcon, Target, QrCode,
  Bell, Bug, ChevronDown, ChevronUp, CheckCircle2, XCircle,
  Calendar, Percent, Smartphone, LogIn, Zap, Database,
  ArrowUpRight, ExternalLink, Search, Filter,
} from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CHART_COLORS = ["#4A7CFF", "#7C6BFF", "#22C55E", "#FFD93D", "#FF6B6B", "#3B82F6", "#A855F7", "#F59E0B"];

type ReportTab = "growth" | "batches" | "payments" | "leads" | "qr-logs";

const tooltipStyle = {
  background: "#1C1C2A",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  fontSize: 12,
  color: "#F2F2F7",
};

export default function DeveloperAnalytics() {
  const [reportTab, setReportTab] = useState<ReportTab>("growth");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true, reports: true, system: true,
  });
  const [notifFilter, setNotifFilter] = useState<"all" | "unread">("all");
  const [qrSearch, setQrSearch] = useState("");

  const students = useMemo(() => getStudents(), []);
  const batches = useMemo(() => getBatches(), []);
  const parents = useMemo(() => getParents(), []);
  const attendance = useMemo(() => getAttendance(), []);
  const fees = useMemo(() => getFees(), []);
  const leads = useMemo(() => getLeads(), []);
  const notifications = useMemo(() => getNotifications(), []);
  const tickets = useMemo(() => getSupportTickets(), []);
  const schedules = useMemo(() => getSchedules(), []);

  const activeStudents = useMemo(() => students.filter(s => s.active), [students]);
  const activeBatches = useMemo(() => batches.filter(b => b.active), [batches]);

  const attendanceStats = useMemo(() => getAttendanceStats(attendance), [attendance]);

  const monthlyFeeTotal = useMemo(() =>
    activeStudents.reduce((s, st) => s + st.monthlyFee, 0),
    [activeStudents]
  );
  const totalCollected = useMemo(() =>
    fees.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0),
    [fees]
  );
  const totalPending = useMemo(() =>
    fees.filter(f => f.status === "due" || f.status === "first_payment_pending").reduce((s, f) => s + f.amount, 0),
    [fees]
  );
  const totalOverdue = useMemo(() =>
    fees.filter(f => f.status === "overdue").reduce((s, f) => s + f.amount, 0),
    [fees]
  );
  const autopayActive = useMemo(() =>
    activeStudents.filter(s => s.autopayStatus === "active").length,
    [activeStudents]
  );
  const autopayAdoption = activeStudents.length > 0 ? Math.round((autopayActive / activeStudents.length) * 100) : 0;

  const newLeadsThisMonth = useMemo(() => {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return leads.filter(l => l.createdAt.startsWith(ym)).length;
  }, [leads]);
  const wonLeads = useMemo(() => leads.filter(l => l.stage === "won").length, [leads]);
  const leadConversion = leads.length > 0 ? Math.round((wonLeads / leads.length) * 100) : 0;

  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  const handleExport = (label: string) => {
    const blob = new Blob([`${label} export triggered — mock download at ${new Date().toISOString()}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${label.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const studentGrowthData = useMemo(() => {
    const now = new Date();
    const months: { month: string; enrollments: number; dropouts: number; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const enrolled = students.filter(s => s.joiningDate.startsWith(ym)).length;
      months.push({ month: key, enrollments: enrolled, dropouts: 0, total: students.filter(s => s.joiningDate <= `${ym}-31`).length });
    }
    return months;
  }, [students]);

  const batchPerformance = useMemo(() =>
    activeBatches.map(b => {
      const batchStudents = activeStudents.filter(s => s.batchId === b.id);
      const ids = batchStudents.map(s => s.id);
      const batchAtt = attendance.filter(a => ids.includes(a.studentId));
      const attStats = getAttendanceStats(batchAtt);
      const batchFees = fees.filter(f => ids.includes(f.studentId));
      const totalBatchFees = batchFees.reduce((s, f) => s + f.amount, 0);
      const collectedBatchFees = batchFees.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0);
      return {
        name: b.name,
        attendancePct: attStats.percentage,
        feeCollectionPct: totalBatchFees > 0 ? Math.round((collectedBatchFees / totalBatchFees) * 100) : 100,
        capacity: b.maxStudents > 0 ? Math.round((b.currentStudents / b.maxStudents) * 100) : 0,
        students: b.currentStudents,
        maxStudents: b.maxStudents,
      };
    }), [activeBatches, activeStudents, attendance, fees]);

  const paymentMethodData = useMemo(() => {
    const offline = fees.filter(f => f.method === "offline").reduce((s, f) => s + f.amount, 0);
    const autopay = fees.filter(f => f.method === "autopay").reduce((s, f) => s + f.amount, 0);
    return [
      { name: "Offline (Cash/UPI)", value: offline, color: "#FFD93D" },
      { name: "Autopay", value: autopay, color: "#4A7CFF" },
    ];
  }, [fees]);

  const paymentStatusData = useMemo(() => {
    const paid = fees.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0);
    const due = fees.filter(f => f.status === "due").reduce((s, f) => s + f.amount, 0);
    const overdue = fees.filter(f => f.status === "overdue").reduce((s, f) => s + f.amount, 0);
    return [
      { name: "Paid On-Time", value: paid, color: "#22C55E" },
      { name: "Due", value: due, color: "#F59E0B" },
      { name: "Overdue", value: overdue, color: "#EF4444" },
    ];
  }, [fees]);

  const leadFunnelData = useMemo(() => {
    const stages: Lead["stage"][] = ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"];
    return stages.map(stage => ({
      name: stage.charAt(0).toUpperCase() + stage.slice(1),
      count: leads.filter(l => l.stage === stage).length,
    }));
  }, [leads]);

  const qrLogs = useMemo(() => {
    return attendance
      .filter(a => a.method === "qr")
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);
  }, [attendance]);

  const filteredQrLogs = useMemo(() => {
    if (!qrSearch) return qrLogs;
    const q = qrSearch.toLowerCase();
    return qrLogs.filter(a => {
      const student = students.find(s => s.id === a.studentId);
      return student?.name.toLowerCase().includes(q) || a.date.includes(q);
    });
  }, [qrLogs, qrSearch, students]);

  const filteredNotifs = useMemo(() => {
    if (notifFilter === "unread") return notifications.filter(n => !n.read);
    return notifications;
  }, [notifications, notifFilter]);

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <PageHeader
            icon={<BarChart3 size={22} className="text-[#7C6BFF]" />}
            title="Analytics Dashboard"
            description="Deep visibility across students, batches, payments, leads, and system"
            badge={<StatusBadge variant="info">Dev Analytics v1.0</StatusBadge>}
            actions={
              <Button variant="outline" size="sm" onClick={() => handleExport("All Reports")}>
                <Download size={14} /> Export All
              </Button>
            }
          />
        </motion.div>

        <motion.div variants={item}>
          <button onClick={() => toggleSection("overview")} className="w-full flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#B6B6C2] uppercase tracking-wider flex items-center gap-2">
              <Activity size={15} className="text-[#4A7CFF]" /> Overview
            </h2>
            {expandedSections.overview ? <ChevronUp size={14} className="text-[#737380]" /> : <ChevronDown size={14} className="text-[#737380]" />}
          </button>
          {expandedSections.overview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard title="Total Students" value={students.length} icon={<Users size={16} />} accent="blue" subtitle={`${activeStudents.length} active`} />
                <MetricCard title="Active Batches" value={activeBatches.length} icon={<Layers size={16} />} accent="gold" subtitle={`${batches.length} total`} />
                <MetricCard title="Active Parents" value={parents.length} icon={<UserCheck size={16} />} accent="green" />
                <MetricCard title="Total Users" value={students.length + parents.length + 2} icon={<Users size={16} />} accent="purple" subtitle="Incl. admin + dev" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard title="Monthly Revenue" value={`₹${monthlyFeeTotal.toLocaleString()}`} icon={<IndianRupee size={16} />} accent="blue" subtitle="Expected" />
                <MetricCard title="Collected (All Time)" value={`₹${totalCollected.toLocaleString()}`} icon={<TrendingUp size={16} />} accent="green" />
                <MetricCard title="Pending" value={`₹${totalPending.toLocaleString()}`} icon={<Clock size={16} />} accent="gold" />
                <MetricCard title="Overdue" value={`₹${totalOverdue.toLocaleString()}`} icon={<AlertTriangle size={16} />} accent="red" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard title="Attendance Rate" value={`${attendanceStats.percentage}%`} icon={<Activity size={16} />} accent={attendanceStats.percentage >= 75 ? "green" : "gold"} subtitle={`${attendanceStats.present}/${attendanceStats.total} days`} />
                <MetricCard title="Autopay Adoption" value={`${autopayAdoption}%`} icon={<CreditCard size={16} />} accent={autopayAdoption >= 50 ? "green" : "gold"} subtitle={`${autopayActive}/${activeStudents.length} students`} />
                <MetricCard title="New Leads (Month)" value={newLeadsThisMonth} icon={<Target size={16} />} accent="blue" />
                <MetricCard title="Lead Conversion" value={`${leadConversion}%`} icon={<TrendingUp size={16} />} accent={leadConversion >= 30 ? "green" : "gold"} subtitle={`${wonLeads}/${leads.length} won`} />
              </div>
            </div>
          )}
        </motion.div>

        <motion.div variants={item}>
          <button onClick={() => toggleSection("reports")} className="w-full flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#B6B6C2] uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={15} className="text-[#7C6BFF]" /> Reports
            </h2>
            {expandedSections.reports ? <ChevronUp size={14} className="text-[#737380]" /> : <ChevronDown size={14} className="text-[#737380]" />}
          </button>
          {expandedSections.reports && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {([
                  { key: "growth", label: "Student Growth", icon: TrendingUp },
                  { key: "batches", label: "Batch Performance", icon: Layers },
                  { key: "payments", label: "Payment Analytics", icon: IndianRupee },
                  { key: "leads", label: "Lead Funnel", icon: Target },
                  { key: "qr-logs", label: "QR Attendance Logs", icon: QrCode },
                ] as { key: ReportTab; label: string; icon: any }[]).map(tab => {
                  const Icon = tab.icon;
                  const active = reportTab === tab.key;
                  return (
                    <button key={tab.key} onClick={() => setReportTab(tab.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        active ? "text-white shadow-sm" : "text-[#737380] hover:text-[#B6B6C2]"
                      }`}
                      style={{ background: active ? "linear-gradient(135deg, #4A7CFF, #7C6BFF)" : "transparent" }}
                    >
                      <Icon size={13} /> {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="min-h-[300px]">
                {reportTab === "growth" && (
                  <InsightCard>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Student Enrollment Growth</h3>
                      <Button variant="ghost" size="sm" onClick={() => handleExport("Student Growth")}>
                        <Download size={12} /> CSV
                      </Button>
                    </div>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={studentGrowthData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#737380" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#737380" }} axisLine={false} tickLine={false} allowDecimals={false} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Line type="monotone" dataKey="enrollments" stroke="#22C55E" strokeWidth={2} dot={{ r: 3, fill: "#22C55E" }} />
                          <Line type="monotone" dataKey="total" stroke="#4A7CFF" strokeWidth={2} dot={{ r: 3, fill: "#4A7CFF" }} strokeDasharray="4 3" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-[#B6B6C2]">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-[#22C55E]" /> New Enrollments</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-[#4A7CFF]" /> Total Students</span>
                    </div>
                  </InsightCard>
                )}

                {reportTab === "batches" && (
                  <InsightCard>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Batch Performance</h3>
                      <Button variant="ghost" size="sm" onClick={() => handleExport("Batch Performance")}>
                        <Download size={12} /> CSV
                      </Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <th className="text-left py-2.5 px-3 text-xs font-medium text-[#A1A1AA] uppercase">Batch</th>
                            <th className="text-center py-2.5 px-3 text-xs font-medium text-[#A1A1AA] uppercase">Attendance</th>
                            <th className="text-center py-2.5 px-3 text-xs font-medium text-[#A1A1AA] uppercase">Fee Collection</th>
                            <th className="text-center py-2.5 px-3 text-xs font-medium text-[#A1A1AA] uppercase">Capacity</th>
                            <th className="text-center py-2.5 px-3 text-xs font-medium text-[#A1A1AA] uppercase">Students</th>
                          </tr>
                        </thead>
                        <tbody>
                          {batchPerformance.map((bp) => (
                            <tr key={bp.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                              <td className="py-2.5 px-3 font-medium text-[#FAFAFA]">{bp.name}</td>
                              <td className="py-2.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-20 h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                                    <div className="h-full rounded-full transition-all" style={{ width: `${bp.attendancePct}%`, background: bp.attendancePct >= 75 ? "#22C55E" : bp.attendancePct >= 50 ? "#FFD93D" : "#EF4444" }} />
                                  </div>
                                  <span className={`text-xs font-medium ${bp.attendancePct >= 75 ? "text-[#22C55E]" : bp.attendancePct >= 50 ? "text-[#FFD93D]" : "text-[#EF4444]"}`}>{bp.attendancePct}%</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-20 h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                                    <div className="h-full rounded-full transition-all" style={{ width: `${bp.feeCollectionPct}%`, background: bp.feeCollectionPct >= 80 ? "#22C55E" : bp.feeCollectionPct >= 60 ? "#FFD93D" : "#EF4444" }} />
                                  </div>
                                  <span className="text-xs font-medium text-[#B6B6C2]">{bp.feeCollectionPct}%</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-20 h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                                    <div className="h-full rounded-full transition-all" style={{ width: `${bp.capacity}%`, background: bp.capacity >= 80 ? "#22C55E" : bp.capacity >= 50 ? "#FFD93D" : "#4A7CFF" }} />
                                  </div>
                                  <span className="text-xs font-medium text-[#B6B6C2]">{bp.capacity}%</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-center text-[#B6B6C2] text-xs">{bp.students}/{bp.maxStudents}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </InsightCard>
                )}

                {reportTab === "payments" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <InsightCard>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Revenue by Method</h3>
                        <Button variant="ghost" size="sm" onClick={() => handleExport("Payment Methods")}>
                          <Download size={12} /> CSV
                        </Button>
                      </div>
                      <div className="h-52 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ percent }: any) => `${(Number(percent) * 100).toFixed(0)}%`}>
                              {paymentMethodData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`₹${Number(value).toLocaleString()}`]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center gap-4 mt-2 text-xs text-[#B6B6C2]">
                        {paymentMethodData.map((d, i) => (
                          <span key={i} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} /> {d.name}</span>
                        ))}
                      </div>
                    </InsightCard>
                    <InsightCard>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Payment Status</h3>
                        <Button variant="ghost" size="sm" onClick={() => handleExport("Payment Status")}>
                          <Download size={12} /> CSV
                        </Button>
                      </div>
                      <div className="h-52 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={paymentStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ percent }: any) => `${(Number(percent) * 100).toFixed(0)}%`}>
                              {paymentStatusData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`₹${Number(value).toLocaleString()}`]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center gap-4 mt-2 text-xs text-[#B6B6C2]">
                        {paymentStatusData.map((d, i) => (
                          <span key={i} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} /> {d.name}</span>
                        ))}
                      </div>
                    </InsightCard>
                  </div>
                )}

                {reportTab === "leads" && (
                  <InsightCard>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Lead Funnel</h3>
                      <Button variant="ghost" size="sm" onClick={() => handleExport("Lead Funnel")}>
                        <Download size={12} /> CSV
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {leadFunnelData.map((stage, i) => {
                        const maxCount = Math.max(...leadFunnelData.map(s => s.count), 1);
                        const pct = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
                        return (
                          <div key={stage.name} className="flex items-center gap-3">
                            <span className="w-24 text-xs text-[#B6B6C2] text-right">{stage.name}</span>
                            <div className="flex-1 h-7 rounded-lg overflow-hidden relative" style={{ background: "rgba(255,255,255,0.04)" }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, delay: i * 0.08 }}
                                className="h-full rounded-lg flex items-center justify-end px-2"
                                style={{ background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}40, ${CHART_COLORS[i % CHART_COLORS.length]})` }}
                              >
                                <span className="text-xs font-bold text-white">{stage.count}</span>
                              </motion.div>
                            </div>
                            <span className="w-16 text-xs text-[#737380]">
                              {i > 0 && leadFunnelData[i - 1].count > 0
                                ? `${Math.round((stage.count / leadFunnelData[i - 1].count) * 100)}%`
                                : "—"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-[#737380] mt-4 text-center">Conversion rate: {leadConversion}% (Won / Total)</p>
                  </InsightCard>
                )}

                {reportTab === "qr-logs" && (
                  <InsightCard>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">QR Attendance Logs</h3>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#737380]" />
                          <input
                            value={qrSearch}
                            onChange={e => setQrSearch(e.target.value)}
                            placeholder="Search student or date..."
                            className="w-40 rounded-lg py-1.5 pl-7 pr-2 text-xs outline-none"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#FAFAFA" }}
                          />
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleExport("QR Attendance Logs")}>
                          <Download size={12} /> CSV
                        </Button>
                      </div>
                    </div>
                    <div className="overflow-x-auto max-h-72 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <th className="text-left py-2 px-3 text-xs font-medium text-[#A1A1AA] uppercase">Student</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-[#A1A1AA] uppercase">Date</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-[#A1A1AA] uppercase">Time</th>
                            <th className="text-center py-2 px-3 text-xs font-medium text-[#A1A1AA] uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredQrLogs.length === 0 ? (
                            <tr><td colSpan={4} className="py-6 text-center text-xs text-[#737380]">No QR scan logs found</td></tr>
                          ) : (
                            filteredQrLogs.map(a => {
                              const student = students.find(s => s.id === a.studentId);
                              const time = new Date(a.timestamp);
                              const timeStr = time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
                              const isLate = time.getHours() > 9 || (time.getHours() === 9 && time.getMinutes() > 15);
                              return (
                                <tr key={a.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                  <td className="py-2 px-3">
                                    <span className="text-[#FAFAFA] font-medium text-xs">{student?.name ?? a.studentId}</span>
                                  </td>
                                  <td className="py-2 px-3 text-xs text-[#B6B6C2]">{new Date(a.date).toLocaleDateString("en-IN")}</td>
                                  <td className="py-2 px-3 text-xs text-[#B6B6C2]">{timeStr}{isLate && <span className="ml-1.5 text-[#F59E0B]">Late</span>}</td>
                                  <td className="py-2 px-3 text-center"><AttendanceStatusBadge status={a.status} /></td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-[#737380] mt-2">{filteredQrLogs.length} of {qrLogs.length} records shown</p>
                  </InsightCard>
                )}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div variants={item}>
          <button onClick={() => toggleSection("system")} className="w-full flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#B6B6C2] uppercase tracking-wider flex items-center gap-2">
              <Database size={15} className="text-[#22C55E]" /> System Analytics
            </h2>
            {expandedSections.system ? <ChevronUp size={14} className="text-[#737380]" /> : <ChevronDown size={14} className="text-[#737380]" />}
          </button>
          {expandedSections.system && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard title="App Users" value={students.length + parents.length + 2} icon={<Users size={16} />} accent="blue" subtitle="Total registered" />
                <MetricCard title="Sessions" value={4} icon={<LogIn size={16} />} accent="gold" subtitle="Demo accounts" />
                <MetricCard title="Notifications" value={notifications.length} icon={<Bell size={16} />} accent="purple" subtitle={`${notifications.filter(n => !n.read).length} unread`} />
                <MetricCard title="Support Tickets" value={tickets.length} icon={<Bug size={16} />} accent="red" subtitle={`${tickets.filter(t => t.status === "open").length} open`} />
              </div>

              <InsightCard>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Most-Used Features (Mock)</h3>
                  <Button variant="ghost" size="sm" onClick={() => handleExport("Feature Usage")}>
                    <Download size={12} /> CSV
                  </Button>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "QR Attendance Scan", pct: 85, color: "#4A7CFF" },
                    { name: "Student Management", pct: 72, color: "#22C55E" },
                    { name: "Fee Dashboard", pct: 68, color: "#FFD93D" },
                    { name: "Batch Schedule", pct: 55, color: "#7C6BFF" },
                    { name: "Lead Tracking", pct: 42, color: "#FF6B6B" },
                    { name: "Reports & Analytics", pct: 31, color: "#3B82F6" },
                  ].map((f, i) => (
                    <div key={f.name} className="flex items-center gap-3">
                      <span className="w-36 text-xs text-[#B6B6C2]">{f.name}</span>
                      <div className="flex-1 h-5 rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${f.pct}%` }}
                          transition={{ duration: 0.5, delay: i * 0.06 }}
                          className="h-full rounded-lg"
                          style={{ background: f.color }}
                        />
                      </div>
                      <span className="w-8 text-xs font-medium text-[#B6B6C2] text-right">{f.pct}%</span>
                    </div>
                  ))}
                </div>
              </InsightCard>

              <InsightCard>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Notification Log</h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setNotifFilter("all")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${notifFilter === "all" ? "text-white" : "text-[#737380]"}`}
                      style={{ background: notifFilter === "all" ? "rgba(74,124,255,0.2)" : "rgba(255,255,255,0.04)" }}
                    >All</button>
                    <button onClick={() => setNotifFilter("unread")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${notifFilter === "unread" ? "text-white" : "text-[#737380]"}`}
                      style={{ background: notifFilter === "unread" ? "rgba(74,124,255,0.2)" : "rgba(255,255,255,0.04)" }}
                    >Unread</button>
                  </div>
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {filteredNotifs.length === 0 ? (
                    <p className="text-xs text-[#737380] text-center py-4">No notifications</p>
                  ) : (
                    filteredNotifs.map(n => (
                      <div key={n.id} className="flex items-start gap-2.5 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <div className={`p-1.5 rounded-lg mt-0.5 ${n.read ? "bg-[rgba(255,255,255,0.04)]" : "bg-[rgba(74,124,255,0.12)]"}`}>
                          {n.type === "attendance" && <QrCode size={12} className={n.read ? "text-[#737380]" : "text-[#4A7CFF]"} />}
                          {n.type === "fees" && <IndianRupee size={12} className={n.read ? "text-[#737380]" : "text-[#22C55E]"} />}
                          {n.type === "schedule" && <Calendar size={12} className={n.read ? "text-[#737380]" : "text-[#FFD93D]"} />}
                          {n.type === "announcement" && <Bell size={12} className={n.read ? "text-[#737380]" : "text-[#7C6BFF]"} />}
                          {n.type === "system" && <Activity size={12} className={n.read ? "text-[#737380]" : "text-[#3B82F6]"} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-xs ${n.read ? "text-[#B6B6C2]" : "text-[#FAFAFA] font-medium"}`}>{n.title}</p>
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#4A7CFF]" />}
                          </div>
                          <p className="text-[10px] text-[#737380] mt-0.5">{n.message}</p>
                        </div>
                        <span className="text-[10px] text-[#737380] flex-shrink-0">
                          {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </InsightCard>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
