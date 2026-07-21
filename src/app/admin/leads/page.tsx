"use client";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { InsightCard } from "@/components/ui/InsightCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";
import { getLeads, setLeads, getBatches } from "@/lib/storage";
import {
  Users, TrendingUp, Target, Phone, Mail, Calendar, Plus,
  ChevronRight, Search, Flame, Thermometer, MessageSquare,
  Sparkles, X, Filter,
} from "lucide-react";
import type { Lead, LeadStage } from "@/lib/types";

const stageFlow: LeadStage[] = ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"];
const stageColors: Record<LeadStage, string> = {
  new: "#737380", contacted: "#3B82F6", qualified: "#FFD93D",
  proposal: "#7C6BFF", negotiation: "#4A7CFF", won: "#22C55E", lost: "#EF4444",
};
const tempColors = { hot: "#EF4444", warm: "#F59E0B", cold: "#737380" };
const sourceLabels: Record<string, string> = {
  walk_in: "Walk-in", referral: "Referral", social_media: "Social Media",
  website: "Website", call: "Call", other: "Other",
};

export default function LeadsPage() {
  const [leads, setLeadsState] = useState(() => getLeads());
  const [batches] = useState(() => getBatches());
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<LeadStage | "all">("all");
  const [addModal, setAddModal] = useState(false);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);

  const filtered = leads.filter(l => {
    if (filterStage !== "all" && l.stage !== filterStage) return false;
    if (search) {
      const s = search.toLowerCase();
      return l.name.toLowerCase().includes(s) || l.parentName.toLowerCase().includes(s) || l.parentPhone.includes(s);
    }
    return true;
  });

  const funnelData = stageFlow.filter(s => s !== "lost").map(s => ({
    stage: s, count: leads.filter(l => l.stage === s).length, color: stageColors[s],
  }));
  const maxFunnel = Math.max(...funnelData.map(f => f.count), 1);

  const hotCount = leads.filter(l => l.temperature === "hot").length;
  const warmCount = leads.filter(l => l.temperature === "warm").length;
  const coldCount = leads.filter(l => l.temperature === "cold").length;
  const wonCount = leads.filter(l => l.stage === "won").length;
  const conversionRate = leads.length > 0 ? Math.round((wonCount / leads.length) * 100) : 0;

  const updateLead = (id: string, updates: Partial<Lead>) => {
    const next = leads.map(l => l.id === id ? { ...l, ...updates } : l);
    setLeads(next); setLeadsState(next);
  };

  const deleteLead = (id: string) => {
    const next = leads.filter(l => l.id !== id);
    setLeads(next); setLeadsState(next);
    setDetailLead(null);
  };

  const addLead = (data: { name: string; parentName: string; parentPhone: string; parentEmail: string; interestedBatch: string; age: number; notes: string }) => {
    const urgency = Math.floor(Math.random() * 3) + 2;
    const budgetFit = Math.floor(Math.random() * 3) + 2;
    const batchSeats = Math.floor(Math.random() * 3) + 2;
    const sourceQuality = 3;
    const followUpRecency = 1;
    const parentContact = 3;
    const paymentIntent = 2;
    const score = Math.min(100, Math.max(0, Math.round(
      (urgency * 20) + (budgetFit * 15) + (batchSeats * 15) +
      (sourceQuality * 10) + (followUpRecency * 15) + (parentContact * 10) + (paymentIntent * 15)
    )));
    const temperature = score >= 75 ? "hot" as const : score >= 45 ? "warm" as const : "cold" as const;
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      name: data.name,
      age: data.age,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      parentEmail: data.parentEmail,
      interestedBatch: data.interestedBatch,
      stage: "new",
      source: "walk_in",
      notes: data.notes,
      urgency, budgetFit, batchSeats, sourceQuality, followUpRecency, parentContact, paymentIntent,
      score, temperature,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const next = [...leads, lead];
    setLeads(next); setLeadsState(next); setAddModal(false);
  };

  const getStageIndex = (s: LeadStage) => stageFlow.indexOf(s);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#7C6BFF]/15 to-[#4A7CFF]/10 border border-[#7C6BFF]/20 shadow-lg shadow-[#7C6BFF]/5 backdrop-blur-sm">
              <TrendingUp size={20} className="text-[#7C6BFF]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#FAFAFA] tracking-tight">Smart Leads</h1>
              <p className="text-sm text-[#B6B6C2]">Score, track, and convert leads with AI-powered insights</p>
            </div>
          </div>
          <Button onClick={() => setAddModal(true)}>
            <Plus size={14} /> Add Lead
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Leads", value: leads.length, icon: Users, color: "#7C6BFF" },
            { label: "Hot", value: hotCount, icon: Flame, color: "#EF4444" },
            { label: "Warm", value: warmCount, icon: Thermometer, color: "#F59E0B" },
            { label: "Conversion", value: `${conversionRate}%`, icon: Target, color: "#22C55E" },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl" style={{ background: `${m.color}15` }}>
                    <Icon size={16} style={{ color: m.color }} />
                  </div>
                  <p className="text-xs text-[#B6B6C2]">{m.label}</p>
                </div>
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.12, type: "spring", damping: 15 }}
                  className="text-2xl font-bold" style={{ color: m.color }}
                >
                  {m.value}
                </motion.p>
              </motion.div>
            );
          })}
        </div>

        <InsightCard>
          <div className="flex items-center gap-2 mb-4">
            <Target size={14} className="text-[#4A7CFF]" />
            <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">Lead Funnel</h3>
          </div>
          <div className="space-y-2">
            {funnelData.map((f, i) => (
              <motion.div
                key={f.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3"
              >
                <span className="text-xs font-medium text-[#B6B6C2] w-20 text-right capitalize">{f.stage}</span>
                <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(f.count / maxFunnel) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
                    className="h-full rounded-lg flex items-center justify-end px-2"
                    style={{ background: `linear-gradient(135deg, ${f.color}40, ${f.color}20)` }}
                  >
                    <span className="text-xs font-semibold" style={{ color: f.color }}>{f.count}</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </InsightCard>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737380]" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search leads..." className="w-full rounded-xl py-2 pl-9 pr-3 text-xs text-[#FAFAFA] placeholder:text-[#737380] outline-none transition-all duration-200"
              style={{ background: "rgba(22,22,29,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(74,124,255,0.4)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(["all", ...stageFlow] as const).map(s => (
              <button
                key={s} onClick={() => setFilterStage(s)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all capitalize"
                style={{
                  background: filterStage === s ? `${stageColors[s === "all" ? "new" : s]}20` : "rgba(255,255,255,0.04)",
                  color: filterStage === s ? stageColors[s === "all" ? "new" : s] : "#737380",
                  border: filterStage === s ? `1px solid ${stageColors[s === "all" ? "new" : s]}30` : "1px solid transparent",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-[#737380]">No leads found</p>
            </div>
          ) : (
            filtered.map((lead, i) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card rounded-2xl p-4 cursor-pointer spotlight-hover"
                onClick={() => setDetailLead(lead)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C6BFF] to-[#4A7CFF] flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-lg">
                      {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#FAFAFA] truncate">{lead.name}</p>
                        <span
                          className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                          style={{ background: `${tempColors[lead.temperature]}20`, color: tempColors[lead.temperature] }}
                        >
                          {lead.temperature}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[#737380] mt-0.5">
                        <span>{lead.parentName}</span>
                        <span>{lead.interestedBatch}</span>
                        <span className="capitalize">{sourceLabels[lead.source]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-lg font-bold" style={{ color: tempColors[lead.temperature] }}>{lead.score}</p>
                      <p className="text-[9px] text-[#737380]">Score</p>
                    </div>
                    <Badge variant={lead.stage === "won" ? "success" : lead.stage === "lost" ? "danger" : "neutral"}>
                      {lead.stage}
                    </Badge>
                    <ChevronRight size={14} className="text-[#737380]" />
                  </div>
                </div>
                <div className="mt-2 relative h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lead.score}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: lead.score >= 75 ? "#EF4444" : lead.score >= 45 ? "#F59E0B" : "#737380" }}
                  />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {addModal && (
          <AddLeadModal
            onClose={() => setAddModal(false)}
            onSubmit={addLead}
            batches={batches.map(b => b.name)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailLead && (
          <LeadDetailModal
            lead={detailLead}
            onClose={() => setDetailLead(null)}
            onUpdate={updateLead}
            onDelete={deleteLead}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}

function AddLeadModal({ onClose, onSubmit, batches }: {
  onClose: () => void;
  onSubmit: (d: { name: string; parentName: string; parentPhone: string; parentEmail: string; interestedBatch: string; age: number; notes: string }) => void;
  batches: string[];
}) {
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [age, setAge] = useState("");
  const [interestedBatch, setInterestedBatch] = useState(batches[0] ?? "");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !parentName.trim() || !parentPhone.trim()) return;
    onSubmit({ name: name.trim(), parentName: parentName.trim(), parentPhone: parentPhone.trim(), parentEmail: parentEmail.trim(), interestedBatch, age: parseInt(age) || 0, notes: notes.trim() });
  };

  return (
    <Modal open onClose={onClose} title="Add New Lead" size="md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Student Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Aarav Sharma" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Age" value={age} onChange={e => setAge(e.target.value)} type="number" placeholder="12" />
          <div>
            <label className="block text-xs font-medium text-[#B6B6C2] mb-1.5">Interested Batch</label>
            <select
              value={interestedBatch} onChange={e => setInterestedBatch(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm text-[#FAFAFA] outline-none"
              style={{ background: "rgba(22,22,29,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {batches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <Input label="Parent Name" value={parentName} onChange={e => setParentName(e.target.value)} placeholder="e.g. Priya Sharma" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Parent Phone" value={parentPhone} onChange={e => setParentPhone(e.target.value)} placeholder="9876543210" />
          <Input label="Parent Email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} type="email" placeholder="parent@email.com" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#B6B6C2] mb-1.5">Notes</label>
          <textarea
            value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Any additional info..."
            className="w-full rounded-xl px-3 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#737380] outline-none resize-none"
            style={{ background: "rgba(22,22,29,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1"><Plus size={14} /> Add Lead</Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}

function LeadDetailModal({ lead, onClose, onUpdate, onDelete }: {
  lead: Lead;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Lead>) => void;
  onDelete: (id: string) => void;
}) {
  const nextStageIdx = stageFlow.indexOf(lead.stage) + 1;
  const canAdvance = nextStageIdx < stageFlow.length;

  return (
    <Modal open onClose={onClose} title="Lead Details" size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C6BFF] to-[#4A7CFF] flex items-center justify-center text-sm font-bold text-white shadow-lg">
            {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#FAFAFA]">{lead.name}</h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style={{ background: `${tempColors[lead.temperature]}20`, color: tempColors[lead.temperature] }}>
                {lead.temperature}
              </span>
            </div>
            <p className="text-xs text-[#B6B6C2]">{lead.parentName} &middot; Age {lead.age} &middot; {lead.interestedBatch}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: tempColors[lead.temperature] }}>{lead.score}</p>
            <p className="text-[9px] text-[#737380]">Lead Score</p>
          </div>
        </div>

        <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${lead.score}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: lead.score >= 75 ? "#EF4444" : lead.score >= 45 ? "#F59E0B" : "#737380" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Urgency", value: lead.urgency, max: 5 },
            { label: "Budget Fit", value: lead.budgetFit, max: 5 },
            { label: "Batch Seats", value: lead.batchSeats, max: 5 },
            { label: "Source Quality", value: lead.sourceQuality, max: 5 },
            { label: "Follow-up", value: lead.followUpRecency, max: 5 },
            { label: "Contact", value: lead.parentContact, max: 5 },
            { label: "Payment Intent", value: lead.paymentIntent, max: 5 },
          ].map((m) => (
            <div key={m.label} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#737380]">{m.label}</span>
                <span className="text-[10px] font-medium text-[#B6B6C2]">{m.value}/{m.max}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(m.value / m.max) * 100}%` }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  className="h-full rounded-full"
                  style={{ background: m.value >= 4 ? "#22C55E" : m.value >= 3 ? "#F59E0B" : "#EF4444" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#B6B6C2]">
          <Phone size={12} /> {lead.parentPhone}
          <Mail size={12} className="ml-2" /> {lead.parentEmail}
        </div>
        <div className="flex items-center gap-2 text-xs text-[#B6B6C2]">
          <Calendar size={12} /> Created: {lead.createdAt}
        </div>

        {lead.notes && (
          <div className="p-3 rounded-xl text-xs text-[#B6B6C2]" style={{ background: "rgba(255,255,255,0.04)" }}>
            <MessageSquare size={12} className="inline mr-1" />
            {lead.notes}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Badge variant={lead.stage === "won" ? "success" : lead.stage === "lost" ? "danger" : "neutral"}>
            Stage: {lead.stage}
          </Badge>
          <Badge variant="info">Source: {sourceLabels[lead.source]}</Badge>
        </div>

        <div className="flex gap-2 pt-2">
          {canAdvance && lead.stage !== "won" && lead.stage !== "lost" && (
            <Button
              variant="primary"
              onClick={() => {
                const nextStage = stageFlow[nextStageIdx];
                onUpdate(lead.id, { stage: nextStage, lastContactedAt: new Date().toISOString() });
              }}
            >
              <ChevronRight size={14} /> Move to {stageFlow[nextStageIdx]}
            </Button>
          )}
          {lead.stage !== "won" && (
            <Button
              variant="outline"
              onClick={() => onUpdate(lead.id, { stage: "won", lastContactedAt: new Date().toISOString() })}
            >
              <Sparkles size={14} /> Mark Won
            </Button>
          )}
          {lead.stage !== "lost" && (
            <Button
              variant="outline"
              onClick={() => onUpdate(lead.id, { stage: "lost", lastContactedAt: new Date().toISOString() })}
            >
              <X size={14} /> Mark Lost
            </Button>
          )}
          <Button variant="outline" onClick={() => onDelete(lead.id)}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
