"use client";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getAdmissions, setAdmissions, getBatches } from "@/lib/storage";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  UserPlus, Phone, ArrowRight
} from "lucide-react";
import type { AdmissionLead, Batch } from "@/lib/types";

const stageLabels: Record<string, string> = {
  inquiry: "Inquiry", first_payment_pending: "Payment Pending",
  first_payment_received: "Payment Received", batch_assigned: "Batch Assigned",
  parent_linked: "Parent Linked", active: "Active",
};

const stageColors: Record<string, string> = {
  inquiry: "#3B82F6", first_payment_pending: "#F59E0B",
  first_payment_received: "#22C55E", batch_assigned: "#7C6BFF",
  parent_linked: "#FFD93D", active: "#22C55E",
};

export default function AdmissionsPage() {
  const [leads, setLeads] = useState<AdmissionLead[]>(() => getAdmissions());
  const [batches] = useState<Batch[]>(() => getBatches());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", parentName: "", parentPhone: "", interestedBatch: "", notes: "" });

  const handleAdd = () => {
    const newLead: AdmissionLead = {
      id: `al-${Date.now()}`,
      name: form.name,
      age: parseInt(form.age) || 0,
      parentName: form.parentName,
      parentPhone: form.parentPhone,
      interestedBatch: form.interestedBatch,
      stage: "inquiry",
      notes: form.notes,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [...leads, newLead];
    setAdmissions(updated);
    setLeads(updated);
    setShowModal(false);
    setForm({ name: "", age: "", parentName: "", parentPhone: "", interestedBatch: "", notes: "" });
  };

  const advanceStage = (id: string) => {
    const stages: AdmissionLead["stage"][] = [
      "inquiry", "first_payment_pending", "first_payment_received",
      "batch_assigned", "parent_linked", "active"
    ];
    const updated = leads.map(l => {
      if (l.id === id) {
        const idx = stages.indexOf(l.stage);
        return { ...l, stage: stages[Math.min(idx + 1, stages.length - 1)] };
      }
      return l;
    });
    setAdmissions(updated);
    setLeads(updated);
  };

  const stageOrder: AdmissionLead["stage"][] = [
    "inquiry", "first_payment_pending", "first_payment_received",
    "batch_assigned", "parent_linked", "active"
  ];

  const pipelineLeads = stageOrder.map(stage => leads.filter(l => l.stage === stage));

  return (
    <AppShell>
    <div className="space-y-6">
      <PageHeader
        title="Admissions Pipeline"
        description="Track new student onboarding from inquiry to active"
        icon={<UserPlus size={22} className="text-[#22C55E]" />}
        actions={
          <Button onClick={() => setShowModal(true)} variant="primary" size="sm">
            <UserPlus size={16} /> New Lead
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {pipelineLeads.map((stageLeads, idx) => {
          const stage = stageOrder[idx];
          return (
            <div key={stage} className="rounded-xl min-h-[200px] glass-card">
              <div
                className="flex items-center justify-between px-3 py-2.5 rounded-t-xl text-xs font-semibold"
                style={{ background: `${stageColors[stage]}15`, color: stageColors[stage], borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span>{stageLabels[stage]}</span>
                <span className="text-[10px] opacity-70">{stageLeads.length}</span>
              </div>
              <div className="p-2 space-y-1.5">
                {stageLeads.length === 0 ? (
                  <p className="text-[10px] text-[#71717A] text-center py-4">No leads</p>
                ) : (
                  stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      className="rounded-lg p-2.5 text-xs cursor-pointer transition-all hover:translate-y-[-1px]"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${stageColors[lead.stage]}, ${stageColors[lead.stage]}cc)` }}
                        >
                          {lead.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#FAFAFA] truncate">{lead.name}</p>
                          <p className="text-[10px] text-[#71717A]">{lead.age} yrs</p>
                        </div>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 text-[10px] text-[#71717A]">
                        <Phone size={10} />
                        {lead.parentPhone}
                      </div>
                      {lead.interestedBatch && (
                        <div className="mt-0.5 text-[10px] text-[#7C6BFF]">{lead.interestedBatch}</div>
                      )}
                      {idx < stageOrder.length - 1 && (
                        <button
                          onClick={() => advanceStage(lead.id)}
                          className="w-full mt-1.5 flex items-center justify-center gap-1 py-1 rounded-md text-[10px] font-medium transition-all"
                          style={{ background: "rgba(255,255,255,0.06)", color: "#A1A1AA" }}
                        >
                          Move to {stageLabels[stageOrder[idx + 1]]} <ArrowRight size={10} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal title="New Admission Lead" open={showModal} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <Input label="Student Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" />
            <Input label="Age" type="number" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} placeholder="Age" />
            <Input label="Parent Name" value={form.parentName} onChange={e => setForm(p => ({ ...p, parentName: e.target.value }))} placeholder="Parent name" />
            <Input label="Parent Phone" value={form.parentPhone} onChange={e => setForm(p => ({ ...p, parentPhone: e.target.value }))} placeholder="Phone number" />
            <Select
              label="Interested Batch"
              value={form.interestedBatch}
              onChange={e => setForm(p => ({ ...p, interestedBatch: e.target.value }))}
              options={[
                { value: "", label: "Select batch" },
                ...batches.map(b => ({ value: b.name, label: `${b.name} - ${b.style}` })),
              ]}
            />
            <Input label="Notes (optional)" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any additional notes" />
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAdd} variant="primary"><UserPlus size={16} /> Add Lead</Button>
              <Button onClick={() => setShowModal(false)} variant="ghost">Cancel</Button>
            </div>
          </div>
        </Modal>
    </div>
    </AppShell>
  );
}
