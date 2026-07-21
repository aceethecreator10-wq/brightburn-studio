"use client";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { StatusBadge, AttendanceStatusBadge, FeeStatusBadge } from "@/components/ui/StatusBadge";
import { InsightCard } from "@/components/ui/InsightCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getStudent, getStudentAttendance, getAnnouncements,
  getSession, getBatches,
} from "@/lib/storage";
import { getAttendanceStats, calculateMemberSince, calculateAttendancePercentage } from "@/lib/calculations";
import type { Announcement, AttendanceRecord, Student, Batch } from "@/lib/types";
import { QrCode, Calendar, Clock, Bell, TrendingUp, IndianRupee, Award } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function StudentDashboard() {
  const router = useRouter();
  const session = getSession();
  const studentId = session?.studentId ?? "s2";
  const [student] = useState<Student | undefined>(() => getStudent(studentId || "s1"));
  const [attendance, setAttendanceData] = useState<AttendanceRecord[]>(() => studentId ? getStudentAttendance(studentId) : []);
  const [announcements] = useState<Announcement[]>(() => getAnnouncements().filter((a) => a.target === "all" || a.target === "students"));
  const [batches] = useState<Batch[]>(() => getBatches());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRefreshKey(k => k + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const s = getSession();
    const currentId = s?.studentId;
    if (currentId) {
      setTimeout(() => setAttendanceData(getStudentAttendance(currentId)), 0);
    }
  }, [refreshKey]);

  if (!student) return <AppShell><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#4A7CFF] border-t-transparent rounded-full animate-spin" /></div></AppShell>;

  const stats = getAttendanceStats(attendance);
  const memberSince = calculateMemberSince(student.joiningDate);
  const monthlyPct = calculateAttendancePercentage(attendance);
  const batch = batches.find((b) => b.id === student.batchId);
  const todayAtt = attendance.filter(a => a.date === new Date().toISOString().split("T")[0]);
  const todayPresent = todayAtt.some(a => a.status === "present" || a.status === "late");
  const streak = calculateStreak(attendance);

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto">
        <motion.div variants={item}>
          <h1 className="text-xl font-bold text-[#FAFAFA]">Welcome back, {student.name}!</h1>
          <p className="text-sm text-[#B6B6C2]">{student.batchName}</p>
        </motion.div>

        <motion.div variants={item}>
          <InsightCard>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4A7CFF] to-[#FF6B6B] flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-[#4A7CFF]/30">
                {student.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-[#FAFAFA]">{student.name}</h2>
                <p className="text-sm text-[#B6B6C2]">Age {student.age} &middot; {student.batchName}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <FeeStatusBadge status={student.feeStatus} />
                  <StatusBadge variant={student.autopayStatus === "active" ? "success" : "neutral"}>
                    Autopay: {student.autopayStatus}
                  </StatusBadge>
                </div>
              </div>
              <div className="text-center flex-shrink-0">
                <p className={`text-3xl font-bold ${stats.percentage >= 75 ? "text-[#22C55E]" : stats.percentage >= 50 ? "text-[#FFD93D]" : "text-[#EF4444]"}`}>
                  {stats.percentage}%
                </p>
                <p className="text-xs text-[#B6B6C2]">Overall</p>
              </div>
            </div>
          </InsightCard>
        </motion.div>

        <motion.div variants={item} className="liquid-glass rounded-2xl p-5 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-50%] left-[-50%] w-full h-full rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #FFD93D 0%, transparent 70%)" }} />
          </div>
          <Calendar size={20} className="mx-auto mb-2 text-[#FFD93D]" />
          <p className="text-sm text-[#B6B6C2]">Member since Brightburn</p>
          <p className="text-xl font-bold text-[#FAFAFA] mt-1">{memberSince}</p>
          <p className="text-xs text-[#737380] mt-1">
            Joined {new Date(student.joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Clock, label: "Batch Time", value: batch ? `${batch.startTime}` : "N/A", color: "#4A7CFF" },
            { icon: TrendingUp, label: "This Month", value: `${monthlyPct}%`, color: "#FFD93D" },
            { icon: IndianRupee, label: "Fee", value: `₹${student.monthlyFee}`, color: "#22C55E" },
            { icon: Award, label: "Streak", value: `${streak} days`, color: "#FFD93D" },
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
              <p className="text-sm font-semibold text-[#FAFAFA]">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {batch && (
          <motion.div variants={item} className="liquid-glass rounded-xl p-4 text-sm flex items-center gap-2">
            <Calendar size={16} className="text-[#FFD93D]" />
            <span className="text-[#B6B6C2]">Schedule:</span>
            <span className="text-[#FAFAFA] font-medium">{batch.days}</span>
            <span className="text-[#737380]">|</span>
            <span className="text-[#B6B6C2]">{batch.startTime} - {batch.endTime}</span>
          </motion.div>
        )}

        <motion.div variants={item}>
          <Button className="w-full" size="lg" variant="primary" onClick={() => router.push("/student/scan")}>
            <QrCode size={20} /> {todayPresent ? "View Today's Scan" : "Scan Attendance QR"}
          </Button>
        </motion.div>

        <motion.div variants={item}>
          <InsightCard>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">This Month&apos;s Progress</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(stats.total > 0 ? (stats.present / stats.total) * 100 : 0, 100)}%`,
                    background: `linear-gradient(90deg, #4A7CFF, ${stats.percentage >= 75 ? "#22C55E" : stats.percentage >= 50 ? "#FFD93D" : "#EF4444"})`,
                  }}
                />
              </div>
              <span className="text-xs text-[#B6B6C2] font-medium">
                {stats.present}/{stats.total} sessions
              </span>
            </div>
            <p className="text-xs text-[#737380] mt-1">
              You&apos;ve attended {stats.present} out of {stats.total} sessions this month
            </p>
          </InsightCard>
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
              {attendance.slice(-20).reverse().map((a) => (
                <div key={a.id} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-sm text-[#B6B6C2]">
                    {new Date(a.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                  <div className="flex items-center gap-2">
                    {a.method === "qr" && <span className="text-[10px] text-[#737380]">QR</span>}
                    <AttendanceStatusBadge status={a.status} />
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

function calculateStreak(records: AttendanceRecord[]): number {
  const sorted = [...records]
    .filter(r => r.status === "present" || r.status === "late")
    .sort((a, b) => b.date.localeCompare(a.date));
  if (sorted.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < sorted.length; i++) {
    const d = new Date(sorted[i].date);
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    if (d.toDateString() === expected.toDateString()) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
