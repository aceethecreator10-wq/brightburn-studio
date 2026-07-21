"use client";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { InsightCard } from "@/components/ui/InsightCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal, StaggerGrid, staggerItem } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";
import { useState } from "react";
import { getStudents, getAttendance, getBatches, getTodayAttendance, getFees, getAnnouncements } from "@/lib/storage";
import { getAttendanceStats } from "@/lib/calculations";
import {
  Users, UserCheck, IndianRupee, Clock, CreditCard, Layers, Plus, QrCode, FileText,
  TrendingUp, Calendar, Bell, Activity, ChevronRight, Sparkles, Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const CHART_TOOLTIP_STYLE = {
  background: "rgba(15,15,24,0.96)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  color: "#F2F2F7",
  fontSize: 12,
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [students] = useState(() => getStudents());
  const [attendance] = useState(() => getAttendance());
  const [fees] = useState(() => getFees());
  const [announcements] = useState(() => getAnnouncements().slice(0, 3));
  const [batches] = useState(() => getBatches());
  const todayAttRecs = getTodayAttendance();

  const activeStudents = students.filter((s) => s.active);
  const todayPresent = todayAttRecs.filter((a) => a.status === "present").length;
  const todayAbsent = todayAttRecs.filter((a) => a.status === "absent").length;
  const todayPending = activeStudents.length - todayAttRecs.length;
  const allStats = getAttendanceStats(attendance);

  const pendingFees = activeStudents.filter((s) => s.feeStatus === "due" || s.feeStatus === "overdue" || s.feeStatus === "first_payment_pending").length;
  const autopayActive = activeStudents.filter((s) => s.autopayStatus === "active").length;
  const overdueCount = activeStudents.filter((s) => s.feeStatus === "overdue").length;
  const totalExpected = activeStudents.reduce((sum, s) => sum + s.monthlyFee, 0);
  const collected = fees.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyTrend = monthNames.map((name, idx) => {
    const recs = attendance.filter((a) => {
      const d = new Date(a.date);
      return d.getMonth() === idx && d.getFullYear() === new Date().getFullYear();
    });
    const s = getAttendanceStats(recs);
    return { month: name, Present: s.present, Absent: s.absent };
  });

  const feeData = [
    { name: "Collected", value: collected, color: "#22C55E" },
    { name: "Pending", value: totalExpected - collected, color: "#F59E0B" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const leadMetrics = [
    { label: "Hot Leads", value: 4, color: "#EF4444" },
    { label: "Warm Leads", value: 7, color: "#F59E0B" },
    { label: "Cold Leads", value: 5, color: "#737380" },
    { label: "Conv. Rate", value: "68%", color: "#22C55E" },
  ];

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-7">
        <motion.div variants={itemAnim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[1.25rem] font-bold text-[#F2F2F7] tracking-tight" aria-label={`${greeting}, Brightburn Admin`}>
              {greeting},{" "}
              {["Brightburn", "Admin"].map((word, i) => (
                <motion.span
                  key={word}
                  className="inline-block mr-[0.2em]"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  aria-hidden="true"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <p className="text-[12.5px] text-[#9898AE] flex items-center gap-2 mt-0.5">
              <Calendar size={13} />
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge variant="success" dot>Studio Open Today</StatusBadge>
            <StatusBadge variant="orange" dot>QR Active</StatusBadge>
          </div>
        </motion.div>

        <motion.div variants={itemAnim} className="flex flex-wrap gap-2">
          <Button size="sm" variant="primary" onClick={() => router.push("/admin/attendance")}>
            <QrCode size={14} /> Generate QR
          </Button>
          <Button size="sm" variant="secondary" onClick={() => router.push("/admin/students?add=true")}>
            <Plus size={14} /> Add Student
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push("/admin/reports")}>
            <FileText size={14} /> View Reports
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push("/admin/notices")}>
            <Bell size={14} /> Send Notice
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push("/admin/fees")}>
            <IndianRupee size={14} /> Mark Payment
          </Button>
          <Button size="sm" variant="glass" onClick={() => router.push("/admin/leads")}>
            <Sparkles size={14} /> View Leads
          </Button>
        </motion.div>

        <motion.div variants={itemAnim} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Total Students" value={activeStudents.length} icon={<Users size={18} />} accent="orange" subtitle="Active enrolled" delay={0.1} />
          <MetricCard title="Present Today" value={todayPresent} icon={<UserCheck size={18} />} accent="green" trend={`${todayAbsent} absent, ${todayPending} pending`} trendUp={todayPresent >= todayAbsent} delay={0.15} />
          <MetricCard title="Monthly Collection" value={`₹${collected.toLocaleString()}`} icon={<IndianRupee size={18} />} accent="gold" subtitle={`of ₹${totalExpected.toLocaleString()} expected`} delay={0.2} />
          <MetricCard title="Attendance Rate" value={`${allStats.percentage}%`} icon={<TrendingUp size={18} />} accent="blue" trend={`${batches.filter(b => b.active).length} active batches`} trendUp={allStats.percentage >= 75} delay={0.25} />
          <MetricCard title="Pending Fees" value={pendingFees} icon={<Clock size={18} />} accent="red" trend={pendingFees > 0 ? `${overdueCount} overdue` : "All clear"} trendUp={pendingFees === 0} delay={0.3} />
          <MetricCard title="Autopay Active" value={autopayActive} icon={<CreditCard size={18} />} accent="gold" subtitle={`${activeStudents.length > 0 ? Math.round((autopayActive / activeStudents.length) * 100) : 0}% of students`} delay={0.35} />
          <MetricCard title="Active Batches" value={batches.filter((b) => b.active).length} icon={<Layers size={18} />} accent="purple" subtitle={`${activeStudents.length} students across batches`} delay={0.4} />
          <MetricCard title="Recovery Rate" value={`${activeStudents.length > 0 ? Math.round(((activeStudents.length - pendingFees) / activeStudents.length) * 100) : 0}%`} icon={<Activity size={18} />} accent="green" trend={pendingFees === 0 ? "Excellent" : "Needs attention"} trendUp={pendingFees === 0} delay={0.45} />
        </motion.div>

        <motion.div variants={itemAnim} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Monthly Attendance Trend</h3>
              <Badge variant="neutral">This Year</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend} barGap={3} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="#5F5F75" fontSize={10.5} tickLine={false} axisLine={false} />
                  <YAxis stroke="#5F5F75" fontSize={10.5} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
                  <Bar dataKey="Present" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={14}
                    animationDuration={900} animationEasing="ease-out" />
                  <Bar dataKey="Absent" fill="#FF4F7A" radius={[4, 4, 0, 0]} maxBarSize={14}
                    animationDuration={900} animationEasing="ease-out" animationBegin={100} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </InsightCard>

          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Fee Collection Split</h3>
              <Badge variant="neutral">This Month</Badge>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feeData}
                    cx="50%" cy="50%"
                    innerRadius={58} outerRadius={88}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={900}
                    animationEasing="ease-out"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {feeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />))}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-3 ml-4">
                {feeData.map((d, i) => (
                  <motion.div
                    key={d.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-[#9898AE]">{d.name}</span>
                    <span className="text-[#F2F2F7] font-semibold">₹{d.value.toLocaleString()}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </InsightCard>
        </motion.div>

        <motion.div variants={itemAnim} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Today&apos;s Attendance</h3>
              <Badge variant="info">{new Date().toLocaleDateString("en-IN")}</Badge>
            </div>
            <div className="space-y-2">
              {todayAttRecs.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-[#737380]">No attendance recorded yet today</p>
                  <Button size="sm" className="mt-3" onClick={() => router.push("/admin/attendance")}>Mark Attendance</Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 pb-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <span className="text-xs text-[#22C55E]">Present: {todayPresent}</span>
                    <span className="text-xs text-[#EF4444]">Absent: {todayAbsent}</span>
                    <span className="text-xs text-[#737380]">Pending: {todayPending}</span>
                  </div>
                  {todayAttRecs.slice(0, 5).map((a) => {
                    const student = students.find((s) => s.id === a.studentId);
                    return (
                      <div key={a.id} className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4A7CFF] to-[#7C6BFF] flex items-center justify-center text-[8px] font-bold text-white">{student?.photoPlaceholder ?? "?"}</div>
                          <span className="text-sm text-[#FAFAFA]">{student?.name ?? "Unknown"}</span>
                        </div>
                        <Badge variant={a.status === "present" ? "success" : "danger"} dot>{a.status === "present" ? "Present" : "Absent"}</Badge>
                      </div>
                    );
                  })}
                  {todayAttRecs.length > 5 && (
                    <button onClick={() => router.push("/admin/attendance")} className="flex items-center justify-center gap-1 w-full py-2 text-xs text-[#4A7CFF] hover:text-[#e65e00] transition-colors">
                      View all {todayAttRecs.length} records <ChevronRight size={12} />
                    </button>
                  )}
                </>
              )}
            </div>
          </InsightCard>

          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Fee Reminders</h3>
              <Badge variant="gold">This Month</Badge>
            </div>
            <div className="space-y-2">
              {activeStudents.filter(s => s.feeStatus === "due" || s.feeStatus === "overdue").slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4A7CFF] to-[#7C6BFF] flex items-center justify-center text-[8px] font-bold text-white">{s.photoPlaceholder}</div>
                    <span className="text-sm text-[#FAFAFA]">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#737380]">₹{s.monthlyFee}</span>
                    <Badge variant={s.feeStatus === "overdue" ? "danger" : "warning"}>{s.feeStatus}</Badge>
                  </div>
                </div>
              ))}
              {activeStudents.filter(s => s.feeStatus === "due" || s.feeStatus === "overdue").length === 0 && (
                <div className="text-center py-6"><p className="text-sm text-[#22C55E]">All fees are up to date</p></div>
              )}
              <button onClick={() => router.push("/admin/fees")} className="flex items-center justify-center gap-1 w-full py-2 text-xs text-[#4A7CFF] hover:text-[#e65e00] transition-colors">
                Manage all fees <ChevronRight size={12} />
              </button>
            </div>
          </InsightCard>

          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Recent Notices</h3>
              <Button size="sm" variant="ghost" onClick={() => router.push("/admin/notices")}>Manage</Button>
            </div>
            <div className="space-y-3">
              {announcements.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-[#737380]">No notices posted</p>
                  <Button size="sm" className="mt-3" onClick={() => router.push("/admin/notices")}>Create Notice</Button>
                </div>
              ) : (
                announcements.map((a) => (
                  <div key={a.id} className="border-b pb-3 last:border-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Bell size={12} className="text-[#FFD93D]" />
                      <p className="text-sm font-medium text-[#FAFAFA]">{a.title}</p>
                    </div>
                    <p className="text-xs text-[#B6B6C2] ml-5 line-clamp-2">{a.content}</p>
                    <p className="text-[10px] text-[#737380] mt-1 ml-5">{new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </div>
                ))
              )}
            </div>
          </InsightCard>
        </motion.div>

        <motion.div variants={itemAnim}>
          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target size={14} className="text-[#4A7CFF]" />
                <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Lead Pipeline Preview</h3>
              </div>
              <Button size="sm" variant="ghost" onClick={() => router.push("/admin/leads")}>
                Full Dashboard <ChevronRight size={12} />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {leadMetrics.map((m, i) => (
                <div key={m.label} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, type: "spring", damping: 15 }}
                    className="text-2xl font-bold" style={{ color: m.color }}
                  >
                    {m.value}
                  </motion.p>
                  <p className="text-[10px] text-[#737380] mt-1 uppercase tracking-wider">{m.label}</p>
                </div>
              ))}
            </div>
            <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(leadMetrics[0].value as number / 16) * 100}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#EF4444] via-[#F59E0B] to-[#22C55E]"
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-[#737380]">
              <span>0</span>
              <span>16 total leads in pipeline</span>
            </div>
          </InsightCard>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
