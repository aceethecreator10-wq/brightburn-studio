"use client";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { QRCard } from "@/components/ui/QRCard";
import { InsightCard } from "@/components/ui/InsightCard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getSession, getStudent, getAttendance, getBatches,
  setAttendance, getNotifications, setNotifications,
} from "@/lib/storage";
import { useToast } from "@/components/Toast";
import { Camera, Smartphone, Check, AlertCircle, ChevronLeft, Clock, Calendar } from "lucide-react";
import type { AttendanceRecord, Notification } from "@/lib/types";

export default function StudentScanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [session] = useState(() => getSession());
  const [student] = useState(() => {
    const s = getSession();
    return s?.studentId ? getStudent(s.studentId) : null;
  });
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [timestamp, setTimestamp] = useState("");
  const [scanning, setScanning] = useState(false);
  const [batches] = useState(() => getBatches());

  const today = new Date().toISOString().split("T")[0];
  const qrToken = `BRIGHTBURN_ATTENDANCE_${today}`;
  const batch = student ? batches.find((b) => b.id === student.batchId) : null;

  useEffect(() => {
    if (!session?.studentId) return;
    const records = getAttendance();
    const existing = records.find(a => a.studentId === session.studentId && a.date === today);
    if (existing) {
      setTimeout(() => {
        setTodayRecord(existing);
        setTimestamp(new Date(existing.timestamp).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }));
      }, 0);
    }
  }, [today, session?.studentId]);

  const handleDemoScan = () => {
    if (!session?.studentId || todayRecord) return;
    setScanning(true);
    setTimeout(() => {
      const isLate = new Date().getHours() >= 9 && new Date().getMinutes() > 15;
      const status: AttendanceRecord["status"] = isLate ? "late" : "present";
      const record: AttendanceRecord = {
        id: `att-${Date.now()}`,
        studentId: session.studentId!,
        date: today,
        status,
        timestamp: new Date().toISOString(),
        method: "qr",
      };
      const allAtt = getAttendance();
      setAttendance([...allAtt, record]);

      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: "u-parent",
        type: "attendance",
        title: `${student?.name ?? "Student"} marked ${status}`,
        message: `${student?.name ?? "Student"} was marked ${status} today at ${new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })} via QR scan.`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      const allNotif = getNotifications();
      setNotifications([notif, ...allNotif]);

      setTodayRecord(record);
      setTimestamp(new Date(record.timestamp).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }));
      setScanning(false);
      toast("success", `Attendance marked as ${status}`);
    }, 1500);
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto space-y-5">
        <button onClick={() => router.push("/student")} className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
          <ChevronLeft size={16} /> Back to Dashboard
        </button>

        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: "rgba(74,124,255,0.12)", border: "1px solid rgba(74,124,255,0.25)" }}>
            <Camera size={24} className="text-[#4A7CFF]" />
          </div>
          <h1 className="text-xl font-bold text-[#FAFAFA]">Scan Attendance</h1>
          <p className="text-sm text-[#A1A1AA]">Students scan the daily QR when they arrive. If they don&apos;t scan, they are counted absent.</p>
        </div>

        {student && (
          <InsightCard>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4A7CFF] to-[#FF6B6B] flex items-center justify-center text-base font-bold text-white">
                {student.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-base font-semibold text-[#FAFAFA]">{student.name}</p>
                <p className="text-xs text-[#A1A1AA]">{student.batchName}</p>
              </div>
            </div>
            {batch && (
              <div className="flex items-center justify-center gap-3 mt-3 text-xs text-[#71717A]">
                <span className="flex items-center gap-1"><Clock size={11} /> {batch.startTime}</span>
                <span className="flex items-center gap-1"><Calendar size={11} /> {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
              </div>
            )}
          </InsightCard>
        )}

        {!session?.studentId ? (
          <div className="rounded-xl p-6 text-center border" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.08)" }}>
            <AlertCircle size={24} className="mx-auto mb-2 text-[#EF4444]" />
            <p className="text-sm text-[#FAFAFA]">No student session found</p>
            <p className="text-xs text-[#A1A1AA] mt-1">Please log in as a student first</p>
            <Button size="sm" className="mt-3" onClick={() => router.push("/")}>Go to Login</Button>
          </div>
        ) : (
          <>
            <QRCard value={qrToken} label="Today&apos;s QR Code" status="Scan at studio" statusColor="#FFD93D" />

            {todayRecord ? (
              <div className="rounded-xl p-6 text-center animate-scale-in border" style={{ borderColor: todayRecord.status === "late" ? "rgba(245,158,11,0.3)" : "rgba(34,197,94,0.3)", background: todayRecord.status === "late" ? "rgba(245,158,11,0.08)" : "rgba(34,197,94,0.08)" }}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${todayRecord.status === "late" ? "bg-[#F59E0B]/20" : "bg-[#22C55E]/20"}`}>
                  <Check size={32} className={todayRecord.status === "late" ? "text-[#F59E0B]" : "text-[#22C55E]"} />
                </div>
                <h2 className={`text-lg font-bold ${todayRecord.status === "late" ? "text-[#F59E0B]" : "text-[#22C55E]"}`}>
                  {todayRecord.status === "late" ? "Marked Late" : "Attendance Marked!"}
                </h2>
                <p className="text-sm text-[#A1A1AA] mt-1">
                  {todayRecord.status === "late" ? "You arrived after 9:15 AM today." : "You&apos;re marked present for today."}
                </p>
                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-[#71717A]">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(todayRecord.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  {timestamp && <span className="flex items-center gap-1"><Clock size={11} /> Scanned at {timestamp}</span>}
                </div>
              </div>
            ) : (
              <>
                <Button size="lg" className="w-full" onClick={handleDemoScan} disabled={scanning}>
                  {scanning ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Scanning...</>
                  ) : (
                    <><Smartphone size={20} /> Demo Scan Attendance</>
                  )}
                </Button>
                <div className="rounded-xl p-4 border text-center" style={{ borderColor: "rgba(255,217,61,0.2)", background: "rgba(255,217,61,0.05)" }}>
                  <p className="text-xs text-[#FFD93D] mb-1"><AlertCircle size={12} className="inline mr-1" />Demo Mode</p>
                  <p className="text-[10px] text-[#71717A]">Click to simulate QR scan. In production, you&apos;d scan the studio QR at the entrance.</p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
