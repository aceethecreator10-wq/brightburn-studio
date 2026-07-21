"use client";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge, FeeStatusBadge } from "@/components/ui/StatusBadge";
import { InsightCard } from "@/components/ui/InsightCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { useState } from "react";
import { getStudents, getFees, setStudents as saveStudents, setFees } from "@/lib/storage";
import type { Student, FeeRecord } from "@/lib/types";
import { useToast } from "@/components/Toast";
import { IndianRupee, CreditCard, Clock, AlertTriangle, Check, X, RotateCcw, DollarSign, TrendingUp, Users, Printer } from "lucide-react";

export default function FeesPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>(() => getStudents());
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(() => getFees());
  const [receiptStudent, setReceiptStudent] = useState<{ student: Student; feeAmount: number; date: string } | null>(null);

  const activeStudents = students.filter((s) => s.active);
  const totalExpected = activeStudents.reduce((sum, s) => sum + s.monthlyFee, 0);
  const collected = feeRecords.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);
  const pendingCount = activeStudents.filter((s) => s.feeStatus === "due" || s.feeStatus === "first_payment_pending").length;
  const overdueCount = activeStudents.filter((s) => s.feeStatus === "overdue").length;
  const autopayCount = activeStudents.filter((s) => s.autopayStatus === "active").length;
  const firstPaymentPending = activeStudents.filter((s) => s.firstPaymentStatus === "pending").length;

  const currentMonth = new Date().toLocaleString("en-IN", { month: "long" });
  const currentYear = new Date().getFullYear();

  const handleMarkPaid = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    const updatedStudents = students.map((s) => {
      if (s.id === studentId) return { ...s, feeStatus: "paid" as const, firstPaymentStatus: "received" as const };
      return s;
    });
    setStudents(updatedStudents);
    saveStudents(updatedStudents);
    const existingFees = feeRecords.filter((f) => !(f.studentId === studentId && f.month === currentMonth && f.year === currentYear));
    const newFee: FeeRecord = {
      id: `fee_${studentId}_${currentMonth}_${currentYear}_${Date.now()}`,
      studentId, month: currentMonth, year: currentYear,
      amount: student?.monthlyFee ?? 0, status: "paid",
      paidDate: new Date().toISOString().split("T")[0], method: "offline",
    };
    const allFees = [...existingFees, newFee];
    setFeeRecords(allFees);
    setFees(allFees);
    setReceiptStudent({ student, feeAmount: student.monthlyFee, date: new Date().toISOString().split("T")[0] });
    toast("success", `${student.name} marked paid`);
  };

  const handlePrintReceipt = () => {
    if (!receiptStudent) return;
    const s = receiptStudent.student;
    const receiptHtml = `
      <html><head><title>Receipt - ${s.name}</title>
      <style>
        body { margin:0; display:flex; justify-content:center; padding:40px 20px; font-family:Arial,sans-serif; }
        .receipt { width:340px; }
        .header { text-align:center; margin-bottom:20px; }
        .header h1 { font-size:18px; margin:0; color:#333; }
        .header p { font-size:11px; color:#666; margin:2px 0; }
        .divider { border:0; border-top:2px dashed #ccc; margin:16px 0; }
        .row { display:flex; justify-content:space-between; padding:8px 0; font-size:13px; border-bottom:1px solid #eee; }
        .total { font-size:16px; font-weight:bold; color:#4A7CFF; text-align:right; margin-top:12px; }
        .footer { text-align:center; font-size:10px; color:#999; margin-top:20px; }
      </style></head><body>
      <div class="receipt">
        <div class="header">
          <h1>BRIGHTBURN</h1>
          <p>Dance & Fitness Studio</p>
          <p style="font-size:10px;color:#999;">Payment Receipt</p>
        </div>
        <hr class="divider" />
        <div class="row"><span>Receipt #</span><span>RCP-${s.id}-${new Date().getTime()}</span></div>
        <div class="row"><span>Date</span><span>${new Date(receiptStudent.date).toLocaleDateString("en-IN")}</span></div>
        <div class="row"><span>Student</span><span>${s.name}</span></div>
        <div class="row"><span>Parent</span><span>${s.parentName}</span></div>
        <div class="row"><span>Batch</span><span>${s.batchName}</span></div>
        <div class="row"><span>Month</span><span>${currentMonth} ${currentYear}</span></div>
        <div class="row"><span>Payment Method</span><span>Offline</span></div>
        <hr class="divider" />
        <div class="total">Amount Paid: ₹${receiptStudent.feeAmount.toLocaleString()}</div>
        <div class="footer">This is a computer-generated receipt. No signature required.</div>
      </div>
      <script>window.print();window.close();</script></body></html>
    `;
    const win = window.open("", "_blank");
    if (win) { win.document.write(receiptHtml); win.document.close(); }
  };

  const handleToggleAutopay = (studentId: string) => {
    const updated = students.map((s) => {
      if (s.id === studentId) {
        return { ...s, autopayStatus: (s.autopayStatus === "active" ? "inactive" : "active") as "active" | "inactive" | "failed" };
      }
      return s;
    });
    setStudents(updated);
    saveStudents(updated);
    toast("info", `Autopay toggled for ${studentId}`);
  };

  const handleMarkOverdue = (studentId: string) => {
    const updated = students.map((s) => {
      if (s.id === studentId) return { ...s, feeStatus: "overdue" as const };
      return s;
    });
    setStudents(updated);
    saveStudents(updated);
    toast("error", `Marked overdue`);
  };

  const handleResetStatus = (studentId: string) => {
    const s = students.find((st) => st.id === studentId);
    if (!s) return;
    const newStatus = s.firstPaymentStatus === "pending" ? "first_payment_pending" as const : "due" as const;
    const updated = students.map((st) => {
      if (st.id === studentId) return { ...st, feeStatus: newStatus };
      return st;
    });
    setStudents(updated);
    saveStudents(updated);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          icon={<IndianRupee size={22} className="text-[#22C55E]" />}
          title="Fee Management"
          description={`${currentMonth} ${currentYear} — First payment is recorded offline. Autopay starts from the next monthly cycle.`}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard title="Expected Revenue" value={`₹${totalExpected.toLocaleString()}`} icon={<TrendingUp size={16} />} accent="gold" />
          <MetricCard title="Collected" value={`₹${collected.toLocaleString()}`} icon={<Check size={16} />} accent="green" />
          <MetricCard title="Pending" value={pendingCount} icon={<Clock size={16} />} accent="blue" />
          <MetricCard title="Overdue" value={overdueCount} icon={<AlertTriangle size={16} />} accent="red" />
          <MetricCard title="Autopay Active" value={autopayCount} icon={<CreditCard size={16} />} accent="gold" />
          <MetricCard title="1st Payment Due" value={firstPaymentPending} icon={<Users size={16} />} accent="blue" />
        </div>

        <div className="rounded-xl p-5 border" style={{ borderColor: "rgba(255,217,61,0.2)", background: "rgba(255,217,61,0.05)" }}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg" style={{ background: "rgba(255,217,61,0.15)", color: "#FFD93D" }}>
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#FFD93D]">Studio Fee Policy</p>
              <p className="text-xs text-[#A1A1AA] mt-1">
                First payment is always collected offline. Autopay (Razorpay) begins from the next monthly cycle after first payment is received. All fees are due by the 5th of each month.
              </p>
            </div>
          </div>
        </div>

        <InsightCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Student Fee Status</h3>
            <span className="text-xs text-[#71717A]">{activeStudents.length} students</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase">Student</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase">Batch</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase">Fee</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase">First Payment</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase">Autopay</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase">Status</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeStudents.map((s) => (
                  <tr key={s.id} className="transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4A7CFF] to-[#7C6BFF] flex items-center justify-center text-[10px] font-bold text-white">
                          {s.photoPlaceholder}
                        </div>
                        <span className="text-[#FAFAFA] font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#A1A1AA]">{s.batchName}</td>
                    <td className="py-3 px-4 text-center font-medium text-[#FAFAFA]">₹{s.monthlyFee}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge variant={s.firstPaymentStatus === "received" ? "success" : "orange"}>
                        {s.firstPaymentStatus === "received" ? "Received" : "Pending"}
                      </StatusBadge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleAutopay(s.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          s.autopayStatus === "active"
                            ? "text-[#22C55E]" : s.autopayStatus === "failed"
                            ? "text-[#EF4444]" : "text-[#71717A]"
                        }`}
                        style={{
                          background: s.autopayStatus === "active" ? "rgba(34,197,94,0.12)" :
                            s.autopayStatus === "failed" ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)",
                          border: s.autopayStatus === "active" ? "1px solid rgba(34,197,94,0.25)" :
                            s.autopayStatus === "failed" ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {s.autopayStatus === "active" ? "Active" : s.autopayStatus === "failed" ? "Failed" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <FeeStatusBadge status={s.feeStatus} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {s.feeStatus === "paid" && (
                          <button onClick={() => setReceiptStudent({ student: s, feeAmount: s.monthlyFee, date: new Date().toISOString().split("T")[0] })}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ background: "rgba(74,124,255,0.1)", color: "#4A7CFF" }}
                            title="Print Receipt"
                          ><Printer size={14} /></button>
                        )}
                        {(s.feeStatus !== "paid" || s.firstPaymentStatus === "pending") && (
                          <button onClick={() => handleMarkPaid(s.id)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ background: "rgba(34,197,94,0.1)", color: "#22C55E" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(34,197,94,0.2)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(34,197,94,0.1)"; }}
                            title="Mark Paid"
                          ><Check size={14} /></button>
                        )}
                        {s.feeStatus !== "overdue" && s.feeStatus !== "paid" && (
                          <button onClick={() => handleMarkOverdue(s.id)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                            title="Mark Overdue"
                          ><X size={14} /></button>
                        )}
                        {s.feeStatus !== "first_payment_pending" && s.feeStatus !== "due" && (
                          <button onClick={() => handleResetStatus(s.id)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ background: "rgba(255,255,255,0.05)", color: "#71717A" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#FFD93D"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#71717A"; }}
                            title="Reset to Due"
                          ><RotateCcw size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InsightCard>
      </div>

      {receiptStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setReceiptStudent(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden" style={{ background: "#fff", borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="p-6 text-gray-900">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold" style={{ color: "#4A7CFF" }}>BRIGHTBURN</h2>
                <p className="text-xs text-gray-500">Dance & Fitness Studio</p>
                <p className="text-[10px] text-gray-400 mt-1">Payment Receipt</p>
              </div>
              <hr className="border-dashed border-gray-300 my-3" />
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Receipt #</span><span className="font-medium">RCP-{receiptStudent.student.id}-{new Date().getTime()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{new Date(receiptStudent.date).toLocaleDateString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Student</span><span className="font-medium">{receiptStudent.student.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Parent</span><span className="font-medium">{receiptStudent.student.parentName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Batch</span><span className="font-medium">{receiptStudent.student.batchName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Month</span><span className="font-medium">{currentMonth} {currentYear}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-medium">Offline</span></div>
              </div>
              <hr className="border-dashed border-gray-300 my-3" />
              <p className="text-right text-base font-bold" style={{ color: "#4A7CFF" }}>₹{receiptStudent.feeAmount.toLocaleString()}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={handlePrintReceipt} className="flex-1 rounded-xl py-2 text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #4A7CFF, #FF6B6B)" }}><Printer size={14} className="inline mr-1" />Print</button>
                <button onClick={() => setReceiptStudent(null)} className="flex-1 rounded-xl py-2 text-xs font-medium text-gray-600" style={{ background: "#f0f0f0" }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
