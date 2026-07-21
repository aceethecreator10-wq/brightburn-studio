"use client";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { InsightCard } from "@/components/ui/InsightCard";
import { AttendanceStatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { QRCard } from "@/components/ui/QRCard";
import { Select } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { useState, useCallback } from "react";
import { getStudents, getAttendance, getTodayAttendance, markAttendance, getBatches, saveAttendance } from "@/lib/storage";
import type { Student } from "@/lib/types";
import { RefreshCw, Check, X, QrCode, UserCheck, UserX, Copy, Download, Clock } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function AttendancePage() {
  const { toast } = useToast();
  const [students] = useState<Student[]>(() => getStudents());
  const [todayAtt, setTodayAtt] = useState(() => getTodayAttendance());
  const [batches] = useState(() => getBatches());
  const [batchFilter, setBatchFilter] = useState("all");

  const today = new Date().toISOString().split("T")[0];
  const qrToken = `BRIGHTBURN_ATTENDANCE_${today}`;

  const refresh = useCallback(() => {
    setTodayAtt(getTodayAttendance());
  }, []);

  const filteredStudents = students.filter((s) => s.active && (batchFilter === "all" || s.batchId === batchFilter));

  const isMarked = (studentId: string) => todayAtt.some((a) => a.studentId === studentId);
  const getMarkedStatus = (studentId: string) => todayAtt.find((a) => a.studentId === studentId)?.status;

  const handleMark = (studentId: string, status: "present" | "absent") => {
    const rec = markAttendance(studentId, today, status, "manual");
    refresh();
    const s = students.find((st) => st.id === studentId);
    toast(status === "present" ? "success" : "error", `${s?.name ?? "Student"} marked ${rec.status}`);
  };

  const handleMarkAllPresent = () => {
    const unmarked = filteredStudents.filter((s) => !isMarked(s.id));
    for (const s of unmarked) markAttendance(s.id, today, "present", "manual");
    refresh();
    toast("success", `${unmarked.length} students marked present`);
  };

  const handleMarkAllAbsent = () => {
    const unmarked = filteredStudents.filter((s) => !isMarked(s.id));
    for (const s of unmarked) markAttendance(s.id, today, "absent", "manual");
    refresh();
    toast("error", `${unmarked.length} students marked absent`);
  };

  const handleUndo = (studentId: string) => {
    const records = getAttendance();
    const filtered = records.filter((a) => !(a.studentId === studentId && a.date === today));
    saveAttendance(filtered);
    refresh();
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(qrToken);
    toast("success", "Token copied to clipboard");
  };

  const presentCount = todayAtt.filter(a => a.status === "present").length;
  const absentCount = todayAtt.filter(a => a.status === "absent").length;
  const pendingCount = filteredStudents.length - todayAtt.length;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          icon={<QrCode size={22} className="text-[#4A7CFF]" />}
          title="QR Attendance"
            description={"Students scan the daily QR when they arrive. If they don't scan, they are counted absent. — " + new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          actions={
            <Button onClick={refresh}><RefreshCw size={14} /> Refresh</Button>
          }
        />

        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card rounded-xl p-4 text-center" style={{ borderColor: "rgba(34,197,94,0.25)" }}>
            <p className="text-2xl font-bold text-[#22C55E]">{presentCount}</p>
            <p className="text-xs text-[#B6B6C2] mt-1">Present</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center" style={{ borderColor: "rgba(239,68,68,0.25)" }}>
            <p className="text-2xl font-bold text-[#EF4444]">{absentCount}</p>
            <p className="text-xs text-[#B6B6C2] mt-1">Absent</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center" style={{ borderColor: "rgba(255,217,61,0.25)" }}>
            <p className="text-2xl font-bold text-[#FFD93D]">{pendingCount}</p>
            <p className="text-xs text-[#B6B6C2] mt-1">Pending Scan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="space-y-4">
            <QRCard
              value={qrToken}
              label="Today's Attendance QR"
              status="Active until 11:59 PM"
              statusColor="#22C55E"
            />
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={handleCopyToken}>
                <Copy size={12} /> Copy Token
              </Button>
              <Button size="sm" variant="outline">
                <Download size={12} /> Download
              </Button>
            </div>
            <div className="rounded-xl p-4 border" style={{ borderColor: "rgba(74,124,255,0.2)", background: "rgba(74,124,255,0.05)" }}>
              <p className="text-xs font-medium text-[#4A7CFF] mb-1">How it works</p>
              <p className="text-[10px] text-[#A1A1AA] leading-relaxed">
                Students scan this daily QR when they arrive at the studio. If they don&apos;t scan, they&apos;re counted absent. Manual override available below.
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="primary" onClick={handleMarkAllPresent}>
                <UserCheck size={12} /> All Present
              </Button>
              <Button size="sm" variant="danger" onClick={handleMarkAllAbsent}>
                <UserX size={12} /> All Absent
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <InsightCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Today&apos;s Attendance</h3>
                <Select
                  options={[{ value: "all", label: "All Batches" }, ...batches.map((b) => ({ value: b.id, label: b.name }))]}
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                />
              </div>
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {filteredStudents.map((s) => {
                  const marked = isMarked(s.id);
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg transition-colors"
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A7CFF] to-[#7C6BFF] flex items-center justify-center text-xs font-bold text-white">
                          {s.photoPlaceholder}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#FAFAFA]">{s.name}</p>
                          <p className="text-xs text-[#71717A]">{s.batchName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {marked ? (
                          <div className="flex items-center gap-2">
                            <AttendanceStatusBadge status={getMarkedStatus(s.id) ?? "present"} />
                            <button
                              onClick={() => handleUndo(s.id)}
                              className="text-[10px] text-[#71717A] hover:text-[#EF4444] underline transition-colors"
                            >
                              Undo
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleMark(s.id, "present")}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ background: "rgba(34,197,94,0.1)", color: "#22C55E" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(34,197,94,0.2)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(34,197,94,0.1)"; }}
                              title="Mark Present"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleMark(s.id, "absent")}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                              title="Mark Absent"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </InsightCard>

            <div className="mt-5">
              <InsightCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Recent Scans</h3>
                  <Badge variant="neutral">Today</Badge>
                </div>
                <div className="space-y-2">
                  {todayAtt.filter(a => a.status === "present" && a.method === "qr").slice(0, 5).map((a) => {
                    const student = students.find((s) => s.id === a.studentId);
                    return (
                      <div key={a.id} className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center text-[8px] font-bold text-white">
                            {student?.photoPlaceholder ?? "?"}
                          </div>
                          <span className="text-sm text-[#FAFAFA]">{student?.name ?? "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#71717A]">
                          <Clock size={11} />
                          {new Date(a.timestamp).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                        </div>
                      </div>
                    );
                  })}
                  {todayAtt.filter(a => a.status === "present" && a.method === "qr").length === 0 && (
                    <p className="text-sm text-[#71717A] text-center py-4">No QR scans yet today</p>
                  )}
                </div>
              </InsightCard>
            </div>
          </div>
        </div>

        
      </div>
    </AppShell>
  );
}
