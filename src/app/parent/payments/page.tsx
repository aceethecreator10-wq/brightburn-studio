"use client";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge, FeeStatusBadge } from "@/components/ui/StatusBadge";
import { InsightCard } from "@/components/ui/InsightCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  getStudents, getFees, getSession, getParents,
} from "@/lib/storage";
import type { Student, FeeRecord } from "@/lib/types";
import {
  IndianRupee, CreditCard, Clock, AlertTriangle,
  TrendingUp, Wallet, Receipt, Ban,
  BarChart3, Calendar, ChevronDown,
  CheckCircle2, XCircle, Info, FileText,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ParentPaymentsPage() {
  const [session] = useState(() => getSession());
  const [allStudents] = useState<Student[]>(() => getStudents());
  const [feeRecords] = useState<FeeRecord[]>(() => getFees());
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const parentUser = getParents().find((p) => session?.parentId ? p.id === session.parentId : false);
  const childrenIds = parentUser?.children ?? [];
  const children = allStudents.filter((s) => childrenIds.includes(s.id));
  const currentChild = children.find((c) => c.id === selectedChild) || children[0];

  const childFees = useMemo(() => {
    if (!currentChild) return [];
    return feeRecords
      .filter((f) => f.studentId === currentChild.id)
      .sort((a, b) => {
        const ma = monthNames.indexOf(a.month);
        const mb = monthNames.indexOf(b.month);
        return a.year !== b.year ? b.year - a.year : mb - ma;
      });
  }, [currentChild, feeRecords]);

  const totalPaid = useMemo(() =>
    childFees.filter((f) => f.status === "paid").reduce((s, f) => s + f.amount, 0),
    [childFees]
  );
  const totalDue = useMemo(() =>
    childFees.filter((f) => f.status === "due" || f.status === "overdue" || f.status === "first_payment_pending").reduce((s, f) => s + f.amount, 0),
    [childFees]
  );

  const chartData = useMemo(() => {
    const grouped: Record<string, { month: string; paid: number; due: number }> = {};
    for (const f of childFees) {
      const key = `${f.month} ${f.year}`;
      if (!grouped[key]) grouped[key] = { month: f.month, paid: 0, due: 0 };
      if (f.status === "paid") grouped[key].paid += f.amount;
      else grouped[key].due += f.amount;
    }
    return Object.values(grouped).reverse();
  }, [childFees]);

  if (!parentUser || !currentChild) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#4A7CFF] border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  const displayFees = showAllHistory ? childFees : childFees.slice(0, 8);

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <PageHeader
            icon={<IndianRupee size={22} className="text-[#4A7CFF]" />}
            title="Payments"
            description="View fee history, dues, and manage payments for your children"
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
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4A7CFF] to-[#7C6BFF] flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-[#4A7CFF]/30">
                {currentChild.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-[#FAFAFA]">{currentChild.name}</h2>
                <p className="text-sm text-[#B6B6C2]">
                  {currentChild.batchName} &middot; ₹{currentChild.monthlyFee}/mo
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <FeeStatusBadge status={currentChild.feeStatus} />
                  <StatusBadge variant={currentChild.autopayStatus === "active" ? "success" : "neutral"}>
                    {currentChild.autopayStatus === "active" ? "Autopay Active" : currentChild.autopayStatus === "failed" ? "Autopay Failed" : "Autopay Off"}
                  </StatusBadge>
                </div>
              </div>
              <div className="text-center flex-shrink-0">
                <p className="text-2xl font-bold text-[#22C55E]">₹{totalPaid.toLocaleString()}</p>
                <p className="text-xs text-[#B6B6C2]">Total Paid</p>
              </div>
            </div>
          </InsightCard>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            title="Monthly Fee"
            value={`₹${currentChild.monthlyFee}`}
            icon={<IndianRupee size={16} />}
            accent="blue"
            subtitle={`${currentChild.batchName}`}
          />
          <MetricCard
            title="Total Paid"
            value={`₹${totalPaid.toLocaleString()}`}
            icon={<TrendingUp size={16} />}
            accent="green"
          />
          <MetricCard
            title="Total Due"
            value={`₹${totalDue.toLocaleString()}`}
            icon={<AlertTriangle size={16} />}
            accent={totalDue > 0 ? "red" : "green"}
          />
          <MetricCard
            title="Autopay"
            value={currentChild.autopayStatus === "active" ? "Active" : currentChild.autopayStatus === "failed" ? "Failed" : "Inactive"}
            icon={<CreditCard size={16} />}
            accent={currentChild.autopayStatus === "active" ? "green" : currentChild.autopayStatus === "failed" ? "red" : "gold"}
          />
        </motion.div>

        {currentChild.autopayStatus === "failed" && (
          <motion.div variants={item} className="rounded-xl p-4 border flex items-start gap-3"
            style={{ borderColor: "rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)" }}
          >
            <div className="p-2 rounded-lg flex-shrink-0" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>
              <Ban size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#EF4444]">Autopay Payment Failed</p>
              <p className="text-xs text-[#B6B6C2] mt-1">Your last autopay attempt failed. Please update your payment method or contact the studio to avoid service disruption.</p>
            </div>
          </motion.div>
        )}

        <motion.div variants={item}>
          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider flex items-center gap-2">
                <BarChart3 size={14} className="text-[#4A7CFF]" />
                Monthly Payment History
              </h3>
              <span className="text-xs text-[#737380]">{chartData.length} months</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#737380" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#737380" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#1C1C2A",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      fontSize: 12,
                      color: "#F2F2F7",
                    }}
                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, undefined]}
                  />
                  <Bar dataKey="paid" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="due" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </InsightCard>
        </motion.div>

        <motion.div variants={item}>
          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider flex items-center gap-2">
                <Receipt size={14} className="text-[#4A7CFF]" />
                Payment History
              </h3>
              <span className="text-xs text-[#737380]">{childFees.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <th className="text-left py-3 px-3 text-xs font-medium text-[#A1A1AA] uppercase">Month</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-[#A1A1AA] uppercase">Amount</th>
                    <th className="text-center py-3 px-3 text-xs font-medium text-[#A1A1AA] uppercase">Method</th>
                    <th className="text-center py-3 px-3 text-xs font-medium text-[#A1A1AA] uppercase">Status</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-[#A1A1AA] uppercase">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {displayFees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-[#737380]">No fee records found</td>
                    </tr>
                  ) : (
                    displayFees.map((fee) => (
                      <tr
                        key={fee.id}
                        className="transition-colors cursor-pointer"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                        onClick={() => setSelectedFee(fee)}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <Calendar size={13} className="text-[#737380]" />
                            <span className="text-[#FAFAFA] font-medium">{fee.month} {fee.year}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-[#FAFAFA]">₹{fee.amount.toLocaleString()}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`text-xs flex items-center justify-center gap-1.5`}>
                            {fee.method === "autopay" ? (
                              <><CreditCard size={12} className="text-[#4A7CFF]" /><span className="text-[#B6B6C2]">Autopay</span></>
                            ) : (
                              <><IndianRupee size={12} className="text-[#FFD93D]" /><span className="text-[#B6B6C2]">Offline</span></>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <FeeStatusBadge status={fee.status} />
                        </td>
                        <td className="py-3 px-3 text-right">
                          {fee.receiptNumber ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedFee(fee); }}
                              className="text-[#4A7CFF] hover:text-[#7C6BFF] transition-colors text-xs font-medium flex items-center justify-end gap-1"
                            >
                              <FileText size={12} />
                              View
                            </button>
                          ) : (
                            <span className="text-[#737380] text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {childFees.length > 8 && (
              <button
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="w-full mt-3 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: "rgba(74,124,255,0.08)",
                  color: "#4A7CFF",
                  border: "1px solid rgba(74,124,255,0.15)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(74,124,255,0.14)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(74,124,255,0.08)"; }}
              >
                {showAllHistory ? "Show Less" : `Show All (${childFees.length} records)`}
              </button>
            )}
          </InsightCard>
        </motion.div>

        <motion.div variants={item}>
          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider flex items-center gap-2">
                <Wallet size={14} className="text-[#4A7CFF]" />
                Autopay Settings
              </h3>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl"
              style={{
                background: currentChild.autopayStatus === "active" ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${
                  currentChild.autopayStatus === "active" ? "rgba(34,197,94,0.2)" :
                  currentChild.autopayStatus === "failed" ? "rgba(239,68,68,0.2)" :
                  "rgba(255,255,255,0.06)"
                }`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  currentChild.autopayStatus === "active" ? "bg-[rgba(34,197,94,0.12)] text-[#22C55E]" :
                  currentChild.autopayStatus === "failed" ? "bg-[rgba(239,68,68,0.12)] text-[#EF4444]" :
                  "bg-[rgba(255,255,255,0.06)] text-[#737380]"
                }`}>
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#FAFAFA]">
                    {currentChild.autopayStatus === "active" ? "Autopay is Active" :
                     currentChild.autopayStatus === "failed" ? "Autopay Failed" : "Autopay Not Enabled"}
                  </p>
                  <p className="text-xs text-[#B6B6C2] mt-0.5">
                    {currentChild.autopayStatus === "active"
                      ? `Fees will be auto-debited on the 5th of each month`
                      : currentChild.autopayStatus === "failed"
                      ? "Last payment attempt failed. Contact studio to resolve."
                      : "Enable autopay for hassle-free monthly payments"}
                  </p>
                </div>
              </div>
              {currentChild.autopayStatus === "active" && (
                <div className="p-2 rounded-lg" style={{ background: "rgba(34,197,94,0.1)" }}>
                  <CheckCircle2 size={20} className="text-[#22C55E]" />
                </div>
              )}
              {currentChild.autopayStatus === "inactive" && (
                <Button variant="primary" size="sm" className="flex-shrink-0">
                  Enable Autopay
                </Button>
              )}
              {currentChild.autopayStatus === "failed" && (
                <Button variant="danger" size="sm" className="flex-shrink-0">
                  Retry Payment
                </Button>
              )}
            </div>
          </InsightCard>
        </motion.div>

        <motion.div variants={item}>
          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider flex items-center gap-2">
                <Info size={14} className="text-[#FFD93D]" />
                Studio Fee Policy
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {[
                { title: "Due Date", desc: "Fees are due by the 5th of every month", icon: Calendar, color: "#4A7CFF" },
                { title: "Payment Methods", desc: "Offline cash/UPI at studio or Autopay via Razorpay", icon: CreditCard, color: "#22C55E" },
                { title: "Late Payment", desc: "A late fee applies for payments after the 10th", icon: AlertTriangle, color: "#FF6B6B" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${item.color}15`, color: item.color }}>
                    <item.icon size={15} />
                  </div>
                  <div>
                    <p className="font-medium text-[#FAFAFA] text-xs">{item.title}</p>
                    <p className="text-xs text-[#B6B6C2] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </InsightCard>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selectedFee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="fixed inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setSelectedFee(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden"
              style={{ background: "#1C1C2A", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#FAFAFA]">Payment Details</h3>
                  <button
                    onClick={() => setSelectedFee(null)}
                    className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#737380] hover:text-[#FAFAFA] transition-all"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-[#B6B6C2]">Student</span>
                    <span className="text-[#FAFAFA] font-medium">{currentChild.name}</span>
                  </div>
                  <div className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-[#B6B6C2]">Month</span>
                    <span className="text-[#FAFAFA] font-medium">{selectedFee.month} {selectedFee.year}</span>
                  </div>
                  <div className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-[#B6B6C2]">Amount</span>
                    <span className="text-[#FAFAFA] font-bold">₹{selectedFee.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-[#B6B6C2]">Payment Method</span>
                    <span className="text-[#FAFAFA] font-medium capitalize">{selectedFee.method}</span>
                  </div>
                  <div className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-[#B6B6C2]">Status</span>
                    <FeeStatusBadge status={selectedFee.status} />
                  </div>
                  {selectedFee.paidDate && (
                    <div className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span className="text-[#B6B6C2]">Paid On</span>
                      <span className="text-[#FAFAFA] font-medium">
                        {new Date(selectedFee.paidDate).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  )}
                  {selectedFee.receiptNumber && (
                    <div className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span className="text-[#B6B6C2]">Receipt #</span>
                      <span className="text-[#4A7CFF] font-medium">{selectedFee.receiptNumber}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setSelectedFee(null)}
                    className="flex-1 rounded-xl py-2.5 text-xs font-medium transition-all"
                    style={{ background: "rgba(255,255,255,0.06)", color: "#B6B6C2", border: "1px solid rgba(255,255,255,0.08)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
