"use client";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge, AttendanceStatusBadge, FeeStatusBadge } from "@/components/ui/StatusBadge";
import { InsightCard } from "@/components/ui/InsightCard";
import { Button } from "@/components/ui/Button";
import { useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStudent, getStudentAttendance, getFees, getBatches } from "@/lib/storage";
import { getAttendanceStats, calculateMemberSince, calculateAttendancePercentage } from "@/lib/calculations";
import { ArrowLeft, Calendar, IndianRupee, User, QrCode, TrendingUp } from "lucide-react";

export default function StudentProfile() {
  const params = useParams();
  const router = useRouter();

  const data = useMemo(() => {
    const id = params?.id as string;
    const s = getStudent(id);
    if (!s) return null;
    return {
      student: s,
      attendance: getStudentAttendance(id),
      feeRecords: getFees().filter((f) => f.studentId === id),
      batch: getBatches().find((b) => b.id === s.batchId),
    };
  }, [params]);

  useEffect(() => {
    if (!data) {
      router.push("/admin/students");
    }
  }, [data, router]);

  if (!data) return <AppShell><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#4A7CFF] border-t-transparent rounded-full animate-spin" /></div></AppShell>;

  const { student, attendance, feeRecords, batch } = data;
  const stats = getAttendanceStats(attendance);
  const monthlyPct = calculateAttendancePercentage(attendance);
  const reversedAttendance = [...attendance].reverse().slice(0, 20);
  const reversedFees = [...feeRecords].reverse();

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <button onClick={() => router.push("/admin/students")} className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
          <ArrowLeft size={16} /> Back to Students
        </button>

        <InsightCard>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4A7CFF] to-[#7C6BFF] flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {student.photoPlaceholder}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-[#FAFAFA]">{student.name}</h1>
              <p className="text-sm text-[#A1A1AA]">{student.batchName} &middot; Age {student.age}</p>
              {batch && (
                <p className="text-xs text-[#71717A] mt-0.5">{batch.days} &middot; {batch.startTime} - {batch.endTime}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <FeeStatusBadge status={student.feeStatus} />
                <StatusBadge variant={student.autopayStatus === "active" ? "success" : "neutral"}>Autopay: {student.autopayStatus}</StatusBadge>
                <StatusBadge variant={student.active ? "success" : "danger"}>{student.active ? "Active" : "Inactive"}</StatusBadge>
              </div>
            </div>
            <div className="text-center">
              <p className={`text-3xl font-bold ${stats.percentage >= 75 ? "text-[#22C55E]" : stats.percentage >= 50 ? "text-[#FFD93D]" : "text-[#EF4444]"}`}>
                {stats.percentage}%
              </p>
              <p className="text-xs text-[#A1A1AA]">Attendance</p>
            </div>
          </div>
        </InsightCard>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#16161D] rounded-xl p-4 text-center border card-hover" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <Calendar size={18} className="text-[#4A7CFF] mx-auto mb-1" />
            <p className="text-xs text-[#A1A1AA]">Joined</p>
            <p className="text-sm font-semibold text-[#FAFAFA]">{new Date(student.joiningDate).toLocaleDateString("en-IN")}</p>
          </div>
          <div className="bg-[#16161D] rounded-xl p-4 text-center border card-hover" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <User size={18} className="text-[#FFD93D] mx-auto mb-1" />
            <p className="text-xs text-[#A1A1AA]">Member Since</p>
            <p className="text-sm font-semibold text-[#FAFAFA]">{calculateMemberSince(student.joiningDate)}</p>
          </div>
          <div className="bg-[#16161D] rounded-xl p-4 text-center border card-hover" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <TrendingUp size={18} className="text-[#FFD93D] mx-auto mb-1" />
            <p className="text-xs text-[#A1A1AA]">This Month</p>
            <p className="text-sm font-semibold text-[#FAFAFA]">{monthlyPct}%</p>
          </div>
          <div className="bg-[#16161D] rounded-xl p-4 text-center border card-hover" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <IndianRupee size={18} className="text-[#22C55E] mx-auto mb-1" />
            <p className="text-xs text-[#A1A1AA]">Monthly Fee</p>
            <p className="text-sm font-semibold text-[#FAFAFA]">₹{student.monthlyFee}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={() => router.push("/admin/attendance")}>
            <QrCode size={14} /> Mark Attendance
          </Button>
          <Button size="sm" variant="secondary" onClick={() => router.push("/admin/fees")}>
            <IndianRupee size={14} /> Manage Fees
          </Button>
        </div>

        <InsightCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Parent Details</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#A1A1AA] text-xs">Name</p>
              <p className="text-[#FAFAFA] font-medium">{student.parentName}</p>
            </div>
            <div>
              <p className="text-[#A1A1AA] text-xs">Phone</p>
              <p className="text-[#FAFAFA] font-medium">{student.parentPhone}</p>
            </div>
            <div>
              <p className="text-[#A1A1AA] text-xs">First Payment</p>
              <StatusBadge variant={student.firstPaymentStatus === "received" ? "success" : "orange"}>
                {student.firstPaymentStatus === "received" ? "Received Offline" : "Pending"}
              </StatusBadge>
            </div>
            <div>
              <p className="text-[#A1A1AA] text-xs">Next Due</p>
              <p className="text-[#FAFAFA] font-medium">{student.nextDueDate}</p>
            </div>
          </div>
        </InsightCard>

        <InsightCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Attendance History</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22C55E]" /> {stats.present}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#EF4444]" /> {stats.absent}</span>
              <span className="text-[#71717A]">Total: {stats.total}</span>
            </div>
          </div>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {reversedAttendance.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span className="text-sm text-[#A1A1AA]">
                  {new Date(a.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                </span>
                <div className="flex items-center gap-2">
                  {a.method === "qr" && <span className="text-[10px] text-[#71717A]">QR</span>}
                  <AttendanceStatusBadge status={a.status} />
                </div>
              </div>
            ))}
          </div>
        </InsightCard>

        <InsightCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Payment History</h3>
          </div>
          <div className="space-y-2">
            {reversedFees.length === 0 ? (
              <p className="text-sm text-[#71717A] text-center py-4">No payment records</p>
            ) : (
              reversedFees.slice(0, 10).map((f) => (
                <div key={f.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <span className="text-sm text-[#FAFAFA]">{f.month} {f.year}</span>
                    <span className="text-xs text-[#71717A] ml-2">&middot; {f.method}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#FAFAFA]">₹{f.amount}</span>
                    <FeeStatusBadge status={f.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </InsightCard>
      </div>
    </AppShell>
  );
}
