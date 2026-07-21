"use client";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { InsightCard } from "@/components/ui/InsightCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { useState } from "react";
import { getBatches, saveBatches, getStudents } from "@/lib/storage";
import type { Batch } from "@/lib/types";
import { Layers, Plus, Edit3, Users, Clock, IndianRupee } from "lucide-react";

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>(() => getBatches());
  const [studentCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    getStudents().forEach((s) => { counts[s.batchId] = (counts[s.batchId] || 0) + 1; });
    return counts;
  });
  const [modal, setModal] = useState(false);
  const [editBatch, setEditBatch] = useState<Batch | null>(null);
  const [form, setForm] = useState({
    name: "", style: "", days: "", startTime: "", endTime: "", maxStudents: "20", monthlyFee: "2500",
  });

  const openAdd = () => {
    setEditBatch(null);
    setForm({ name: "", style: "", days: "", startTime: "", endTime: "", maxStudents: "20", monthlyFee: "2500" });
    setModal(true);
  };

  const openEdit = (b: Batch) => {
    setEditBatch(b);
    setForm({
      name: b.name, style: b.style, days: b.days,
      startTime: b.startTime, endTime: b.endTime,
      maxStudents: String(b.maxStudents), monthlyFee: String(b.monthlyFee),
    });
    setModal(true);
  };

  const handleSave = () => {
    const updated = editBatch
      ? batches.map((b) => b.id === editBatch.id ? { ...b, ...form, maxStudents: parseInt(form.maxStudents) || 20, monthlyFee: parseInt(form.monthlyFee) || 0 } : b)
      : [...batches, {
          id: `b${Date.now()}`,
          ...form,
          maxStudents: parseInt(form.maxStudents) || 20,
          currentStudents: 0,
          monthlyFee: parseInt(form.monthlyFee) || 0,
          active: true,
        } as Batch];
    setBatches(updated);
    saveBatches(updated);
    setModal(false);
  };

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeader
          icon={<Layers size={22} className="text-[#4A7CFF]" />}
          title="Batches"
          description={`${batches.length} batches configured`}
          actions={
            <Button onClick={openAdd}><Plus size={14} /> Add Batch</Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {batches.map((b) => {
            const count = studentCounts[b.id] || b.currentStudents;
            return (
              <InsightCard key={b.id}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-[#FAFAFA]">{b.name}</h3>
                    <p className="text-sm text-[#A1A1AA]">{b.style}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge variant={b.active ? "success" : "danger"}>{b.active ? "Active" : "Inactive"}</StatusBadge>
                    <button onClick={() => openEdit(b)}
                      className="p-1.5 rounded-lg transition-colors text-[#71717A] hover:text-[#4A7CFF]"
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                    ><Edit3 size={14} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#FFD93D]" />
                      <span className="text-[#71717A] text-xs">Time</span>
                    </div>
                    <p className="text-[#FAFAFA] font-medium mt-0.5">{b.startTime} - {b.endTime}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-[#4A7CFF]" />
                      <span className="text-[#71717A] text-xs">Students</span>
                    </div>
                    <p className="text-[#FAFAFA] font-medium mt-0.5">{count}/{b.maxStudents}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <IndianRupee size={14} className="text-[#22C55E]" />
                      <span className="text-[#71717A] text-xs">Fee</span>
                    </div>
                    <p className="text-[#FAFAFA] font-medium mt-0.5">₹{b.monthlyFee}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <StatusBadge variant="neutral">{b.days}</StatusBadge>
                </div>
              </InsightCard>
            );
          })}
        </div>

        <Modal open={modal} onClose={() => setModal(false)} title={editBatch ? "Edit Batch" : "Add Batch"}>
          <div className="space-y-4">
            <Input label="Batch Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Dance/Fitness Style" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} />
            <Input label="Days (e.g. Mon / Wed / Fri)" value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Start Time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
              <Input label="End Time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Max Students" type="number" value={form.maxStudents} onChange={(e) => setForm({ ...form, maxStudents: e.target.value })} />
              <Input label="Monthly Fee (₹)" type="number" value={form.monthlyFee} onChange={(e) => setForm({ ...form, monthlyFee: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave}>{editBatch ? "Save Changes" : "Add Batch"}</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
