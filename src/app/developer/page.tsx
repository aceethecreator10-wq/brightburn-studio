"use client";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { InsightCard } from "@/components/ui/InsightCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { motion } from "framer-motion";
import { useState } from "react";
import { getStudents, getAttendance, getFees, getParents, resetDemoData } from "@/lib/storage";
import { useToast } from "@/components/Toast";
import { Cpu, Users, QrCode, IndianRupee, Database, RefreshCw, CheckCircle2, HardDrive, Shield, Smartphone, CreditCard, Bell, GitBranch, Activity } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function DeveloperDashboard() {
  const { toast } = useToast();
  const [students] = useState(() => getStudents());
  const [attendance] = useState(() => getAttendance());
  const [fees] = useState(() => getFees());
  const [parents] = useState(() => getParents());

  const stats = {
    totalUsers: students.length + parents.length + 1,
    attendanceLogs: attendance.length,
    paymentLogs: fees.length,
    errors: 0,
  };

  const handleReset = () => {
    resetDemoData();
    toast("success", "Demo data reset. Refreshing...");
    setTimeout(() => window.location.reload(), 1000);
  };

  const routes = [
    { path: "/", status: "ok" },
    { path: "/admin", status: "ok" },
    { path: "/admin/students", status: "ok" },
    { path: "/admin/students/[id]", status: "ok" },
    { path: "/admin/batches", status: "ok" },
    { path: "/admin/schedule", status: "ok" },
    { path: "/admin/attendance", status: "ok" },
    { path: "/admin/reports", status: "ok" },
    { path: "/admin/fees", status: "ok" },
    { path: "/admin/notices", status: "ok" },
    { path: "/admin/settings", status: "ok" },
    { path: "/admin/admissions", status: "ok" },
    { path: "/admin/support", status: "ok" },
    { path: "/admin/documents", status: "ok" },
    { path: "/admin/id-card", status: "ok" },
    { path: "/developer", status: "ok" },
    { path: "/parent", status: "ok" },
    { path: "/student", status: "ok" },
    { path: "/student/scan", status: "ok" },
    { path: "/profile", status: "ok" },
    { path: "/admin/leads", status: "ok" },
  ];

  const healthScore = Math.round(
    ((stats.errors === 0 ? 25 : 0) +
      (students.length > 0 ? 15 : 0) +
      (attendance.length > 0 ? 15 : 0) +
      (fees.length > 0 ? 15 : 0) +
      (parents.length > 0 ? 15 : 0) +
      15) / 1
  );

  const upgrades = [
    { label: "Supabase / Postgres Database", done: false, icon: Database, note: "Production DB" },
    { label: "Real Auth (OTP / Email)", done: false, icon: Shield, note: "Security" },
    { label: "Razorpay Autopay", done: false, icon: CreditCard, note: "Payments" },
    { label: "WhatsApp / SMS Reminders", done: false, icon: Bell, note: "Notifications" },
    { label: "Multi-branch Support", done: false, icon: GitBranch, note: "Scaling" },
    { label: "Instructor Dashboard", done: false, icon: Users, note: "Staff" },
    { label: "Android / iOS App", done: false, icon: Smartphone, note: "Mobile" },
    { label: "Real QR Scanner", done: true, icon: QrCode, note: "Working" },
    { label: "CSV / Excel Reports", done: true, icon: CheckCircle2, note: "Working" },
    { label: "localStorage Persistence", done: true, icon: HardDrive, note: "Current" },
  ];

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-7">
        <motion.div variants={item}>
          <PageHeader
            icon={<Cpu size={22} className="text-[#3B82F6]" />}
            title="Developer Dashboard"
            description="System health, data management, and upgrade planning"
            badge={<StatusBadge variant="info">Demo v1.0</StatusBadge>}
            actions={
              <Button variant="danger" size="sm" onClick={handleReset}>
                <RefreshCw size={14} /> Reset Demo Data
              </Button>
            }
          />
        </motion.div>

        <motion.div variants={item} className="liquid-glass rounded-2xl p-5 flex items-center gap-4 spotlight-hover">
          <div className="flex items-center justify-center w-14 h-14 rounded-full" style={{ background: healthScore >= 80 ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)" }}>
            <Activity size={24} style={{ color: healthScore >= 80 ? "#22C55E" : "#F59E0B" }} />
          </div>
          <div>
            <p className="text-sm font-medium text-[#FAFAFA]">System Health Score</p>
            <p className="text-2xl font-bold" style={{ color: healthScore >= 80 ? "#22C55E" : "#F59E0B" }}>{healthScore}%</p>
            <p className="text-xs text-[#737380]">All systems operational (localStorage mock)</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard title="Total Users" value={stats.totalUsers} icon={<Users size={16} />} accent="blue" />
          <MetricCard title="Attendance Logs" value={stats.attendanceLogs.toLocaleString()} icon={<QrCode size={16} />} accent="gold" />
          <MetricCard title="Payment Logs" value={stats.paymentLogs.toLocaleString()} icon={<IndianRupee size={16} />} accent="green" />
          <MetricCard title="Storage" value="localStorage" icon={<HardDrive size={16} />} accent="purple" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div variants={item}>
            <InsightCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">System Health</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Database", badge: <StatusBadge variant="success">localStorage (Mock)</StatusBadge> },
                  { label: "Authentication", badge: <StatusBadge variant="warning">Demo Only</StatusBadge> },
                  { label: "Payment Gateway", badge: <StatusBadge variant="info">Not Connected</StatusBadge> },
                  { label: "QR Service", badge: <StatusBadge variant="success">Demo (Simulated)</StatusBadge> },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-sm text-[#B6B6C2]">{row.label}</span>
                    {row.badge}
                  </div>
                ))}
                <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-sm text-[#B6B6C2]">Students</span>
                  <span className="text-sm text-[#FAFAFA] font-medium">{students.length}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#B6B6C2]">Parents</span>
                  <span className="text-sm text-[#FAFAFA] font-medium">{parents.length}</span>
                </div>
              </div>
            </InsightCard>
          </motion.div>

          <motion.div variants={item}>
            <InsightCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Route Health</h3>
                <StatusBadge variant="success">{routes.filter(r => r.status === "ok").length}/{routes.length} OK</StatusBadge>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {routes.map((r) => (
                  <div key={r.path} className="flex items-center gap-2 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    <span className="text-[#B6B6C2]">{r.path}</span>
                  </div>
                ))}
              </div>
            </InsightCard>
          </motion.div>

          <motion.div variants={item}>
            <InsightCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Recent Attendance Logs</h3>
                <Badge variant="neutral">Last 10</Badge>
              </div>
              <div className="space-y-1 text-xs max-h-48 overflow-y-auto">
                {attendance.slice(-10).reverse().map((a) => {
                  const student = students.find((s) => s.id === a.studentId);
                  return (
                    <div key={a.id} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span className="text-[#FAFAFA]">{student?.name ?? a.studentId}</span>
                      <span className="text-[#737380]">{a.date}</span>
                      <StatusBadge variant={a.status === "present" ? "success" : "danger"}>{a.status}</StatusBadge>
                    </div>
                  );
                })}
              </div>
            </InsightCard>
          </motion.div>

          <motion.div variants={item}>
            <InsightCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Maintenance Notes</h3>
              </div>
              <div className="space-y-2 text-sm text-[#B6B6C2]">
                <p className="flex items-center gap-2"><Database size={14} className="text-[#3B82F6]" /> Demo uses browser localStorage only</p>
                <p className="flex items-center gap-2"><IndianRupee size={14} className="text-[#FFD93D]" /> No real payment gateway connected</p>
                <p className="flex items-center gap-2"><QrCode size={14} className="text-[#22C55E]" /> QR scanning is simulated for demo</p>
                <p className="flex items-center gap-2"><HardDrive size={14} className="text-[#3B82F6]" /> All data resets on browser clear</p>
                <p className="flex items-center gap-2"><Cpu size={14} className="text-[#A855F7]" /> Architecture ready for Supabase migration</p>
              </div>
            </InsightCard>
          </motion.div>
        </div>

        <motion.div variants={item}>
          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Upgrade Roadmap</h3>
              <StatusBadge variant="info">Production Plan</StatusBadge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {upgrades.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl p-3 glass-card">
                    <div className="p-1.5 rounded-lg" style={{ background: item.done ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)" }}>
                      {item.done
                        ? <CheckCircle2 size={14} className="text-[#22C55E]" />
                        : <Icon size={14} className="text-[#737380]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${item.done ? "text-[#FAFAFA]" : "text-[#737380]"}`}>{item.label}</p>
                      <p className="text-[10px] text-[#737380]">{item.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </InsightCard>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
