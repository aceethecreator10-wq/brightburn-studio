"use client";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge, AttendanceStatusBadge, FeeStatusBadge } from "@/components/ui/StatusBadge";
import { InsightCard } from "@/components/ui/InsightCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  getStudents, getStudentAttendance, getFees, getAnnouncements,
  getSession, getParents,
} from "@/lib/storage";
import { getAttendanceStats, calculateMemberSince, calculateAttendancePercentage } from "@/lib/calculations";
import type { Announcement, Student, FeeRecord, AttendanceRecord } from "@/lib/types";
import { User, Calendar, IndianRupee, Bell, Phone, TrendingUp, ChevronDown } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ParentDashboard() {
  const [session] = useState(() => getSession());
  const [allStudents] = useState<Student[]>(() => getStudents());
  const [announcements] = useState<Announcement[]>(() => getAnnouncements().filter((a) => a.target === "all" || a.target === "parents"));
  const [attendance, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [childFees, setChildFees] = useState<FeeRecord[]>([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRefreshKey(k => k + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const parentUser = getParents().find((p) => {
    return session?.parentId ? p.id === session.parentId : false;
  });

  const childrenIds = parentUser?.children ?? [];
  const children = allStudents.filter((s) => childrenIds.includes(s.id));
  const currentChild = children.find((c) => c.id === selectedChild) || children[0];

  useEffect(() => {
    if (currentChild) {
      const a = getStudentAttendance(currentChild.id);
      const f = [...getFees().filter((f) => f.studentId === currentChild.id)].reverse();
      setTimeout(() => { setAttendanceData(a); setChildFees(f); }, 0);
    }
  }, [currentChild, refreshKey]);

  const stats = getAttendanceStats(attendance);
  const memberSince = currentChild ? calculateMemberSince(currentChild.joiningDate) : "";
  const monthlyPct = currentChild ? calculateAttendancePercentage(attendance) : 0;

  if (!parentUser || !currentChild) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#4A7CFF] border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <PageHeader
            icon={<User size={22} className="text-[#FFD93D]" />}
            title="Parent Dashboard"
            description="Track your child's attendance, fees, and studio updates"
          />
        </motion.div>

        {children.length > 1 && (
          <motion.div variants={item} className="relative">
            <select
              value={selectedChild || currentChild.id}
              onChange={e => setSelectedChild(e.target.value)}
              className="w-full rounded-xl py-2.5 px-3 text-sm text-[#FAFAFA] appearance-none outline-none"
              style={{ background: "rgba(22,22,29,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(74,124,255,0.4)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            >
              {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737380] pointer-events-none" />
          </motion.div>
        )}

        <motion.div variants={item}>
          <InsightCard>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD93D] to-[#F59E0B] flex items-center justify-center text-xl font-bold text-[#08080B] shadow-lg shadow-[#FFD93D]/30">
                {currentChild.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-[#FAFAFA]">{currentChild.name}</h2>
                <p className="text-sm text-[#B6B6C2]">
                  Age {currentChild.age} &middot; {currentChild.batchName}
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <FeeStatusBadge status={currentChild.feeStatus} />
                  <StatusBadge variant={currentChild.autopayStatus === "active" ? "success" : "neutral"}>
                    {currentChild.autopayStatus === "active" ? "Autopay Active" : "Autopay Off"}
                  </StatusBadge>
                </div>
              </div>
              <div className="text-center flex-shrink-0">
                <p className={`text-3xl font-bold ${stats.percentage >= 75 ? "text-[#22C55E]" : stats.percentage >= 50 ? "text-[#FFD93D]" : "text-[#EF4444]"}`}>
                  {stats.percentage}%
                </p>
                <p className="text-xs text-[#B6B6C2]">Attendance</p>
              </div>
            </div>
          </InsightCard>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Calendar, label: "Member Since", value: memberSince, color: "#FFD93D" },
            { icon: TrendingUp, label: "Monthly", value: `${monthlyPct}%`, color: "#22C55E" },
            { icon: IndianRupee, label: "Fee", value: `₹${currentChild.monthlyFee}`, color: "#4A7CFF" },
            { icon: Phone, label: "Parent", value: parentUser.phone, color: "#3B82F6" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="glass-card rounded-xl p-4 text-center"
            >
              <item.icon size={18} className="mx-auto mb-1" style={{ color: item.color }} />
              <p className="text-xs text-[#B6B6C2]">{item.label}</p>
              <p className="text-sm font-semibold text-[#FAFAFA] truncate">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={item}>
          <InsightCard>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Recent Attendance</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#22C55E]">{stats.present}</span>
                <span className="text-[#737380]">/</span>
                <span className="text-[#EF4444]">{stats.absent}</span>
              </div>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {attendance.slice(-15).reverse().map((a) => (
                <div key={a.id} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-sm text-[#B6B6C2]">
                    {new Date(a.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                  <AttendanceStatusBadge status={a.status} />
                </div>
              ))}
            </div>
          </InsightCard>
        </motion.div>

        <motion.div variants={item}>
          <InsightCard>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Fee History</h3>
              <span className={`text-xs font-medium ${currentChild.feeStatus === "paid" ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                {currentChild.feeStatus}
              </span>
            </div>
            <div className="space-y-2">
              {childFees.slice(0, 6).map((fee) => (
                <div key={fee.id} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <p className="text-sm text-[#FAFAFA]">{fee.month} {fee.year}</p>
                    <p className="text-[10px] text-[#737380]">{fee.receiptNumber ? `Receipt: ${fee.receiptNumber}` : fee.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#FAFAFA]">₹{fee.amount}</p>
                    <FeeStatusBadge status={fee.status} />
                  </div>
                </div>
              ))}
            </div>
          </InsightCard>
        </motion.div>

        <motion.div variants={item}>
          <InsightCard>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Studio Notices</h3>
            </div>
            <div className="space-y-3">
              {announcements.length === 0 ? (
                <p className="text-sm text-[#737380] text-center py-4">No notices</p>
              ) : (
                announcements.slice(0, 3).map((a) => (
                  <div key={a.id} className="border-b pb-3 last:border-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Bell size={14} className="text-[#FFD93D]" />
                      <p className="text-sm font-medium text-[#FAFAFA]">{a.title}</p>
                    </div>
                    <p className="text-xs text-[#B6B6C2] ml-6">{a.content}</p>
                  </div>
                ))
              )}
            </div>
          </InsightCard>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
