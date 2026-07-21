"use client";
import { useState, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getStudents, getBatches } from "@/lib/storage";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CreditCard, Printer, Flame, Users, QrCode
} from "lucide-react";
import type { Student, Batch } from "@/lib/types";

export default function IdCardPage() {
  const [students] = useState<Student[]>(() => getStudents());
  const [batches] = useState<Batch[]>(() => getBatches());
  const [selectedId, setSelectedId] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const student = students.find(s => s.id === selectedId);
  const batch = student ? batches.find(b => b.id === student.batchId) : null;

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win || !cardRef.current) return;
    const content = cardRef.current.innerHTML;
    win.document.write(`
      <html><head><title>ID Card - ${student?.name}</title>
      <style>
        body { margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#fff; font-family:Arial,sans-serif; }
        .card { width:340px; border-radius:16px; overflow:hidden; box-shadow:0 8px 32px rgba(0,0,0,0.15); }
        .header { background:linear-gradient(135deg,#4A7CFF,#FF6B6B); padding:24px; text-align:center; color:#fff; }
        .avatar { width:80px; height:80px; border-radius:50%; background:rgba(255,255,255,0.2); margin:0 auto 12px; display:flex; align-items:center; justify-content:center; font-size:32px; font-weight:bold; }
        .body { padding:20px; background:#fff; }
        .row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee; font-size:13px; }
      </style></head><body>
      <div class="card">${content}</div>
      <script>window.print();window.close();</script></body></html>
    `);
    win.document.close();
  };

  return (
    <AppShell>
    <div className="space-y-6">
      <PageHeader
        title="Student ID Cards"
        description="Generate and print student identification cards"
        icon={<CreditCard size={22} className="text-[#4A7CFF]" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Select
            label="Select Student"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            options={[
              { value: "", label: "Choose a student..." },
              ...students.map(s => ({ value: s.id, label: `${s.name} - ${s.batchName}` })),
            ]}
          />

          {selectedId && student && (
            <div className="mt-4 space-y-4">
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={handlePrint}>
                  <Printer size={14} /> Print Card
                </Button>
              </div>

              <div className="text-xs text-[#71717A] p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <p className="font-medium text-[#FAFAFA] mb-1">Studio Info</p>
                <p>Card template includes studio branding, student photo placeholder, batch, and QR token. Print on premium paper (250+ GSM) for best results.</p>
              </div>
            </div>
          )}

          {selectedId && !student && (
            <EmptyState icon={<Users size={48} />} title="Student not found" description="The selected student no longer exists" />
          )}
        </div>

        <div className="flex items-start justify-center">
          {student ? (
            <div
              ref={cardRef}
              className="w-full max-w-[340px] rounded-2xl overflow-hidden shadow-2xl"
              style={{ border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <div className="p-6 text-center text-white" style={{ background: "linear-gradient(135deg, #4A7CFF, #FF6B6B)" }}>
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  {student.name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold">{student.name}</h3>
                <p className="text-sm opacity-80">{batch?.name || student.batchName}</p>
                <p className="text-[10px] opacity-60 mt-1">{batch?.style || ""}</p>
              </div>

              <div className="p-5" style={{ background: "#fff" }}>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Age</span>
                    <span className="font-medium text-gray-800">{student.age} years</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-500">Parent</span>
                    <span className="font-medium text-gray-800">{student.parentName}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-500">Joining Date</span>
                    <span className="font-medium text-gray-800">{new Date(student.joiningDate).toLocaleDateString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-500">Batch Time</span>
                    <span className="font-medium text-gray-800">{batch ? `${batch.days} ${batch.startTime}-${batch.endTime}` : "—"}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-500">Fee</span>
                    <span className="font-medium text-gray-800">₹{student.monthlyFee}/mo</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame size={14} style={{ color: "#4A7CFF" }} />
                    <span className="text-[10px] font-bold" style={{ color: "#4A7CFF" }}>BRIGHTBURN</span>
                  </div>
                  <div className="flex items-center gap-1 text-[8px] text-gray-400">
                    <QrCode size={12} />
                    Student ID
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="w-full max-w-[340px] rounded-2xl p-8 text-center glass-card"
            >
              <CreditCard size={40} className="mx-auto mb-3" style={{ color: "#71717A" }} />
              <p className="text-sm text-[#71717A]">Select a student to preview their ID card</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </AppShell>
  );
}
