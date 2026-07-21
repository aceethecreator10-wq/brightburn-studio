"use client";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getSupportTickets, setSupportTickets } from "@/lib/storage";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/Toast";
import {
  MessageSquare, CheckCircle2, Clock, User, Tag,
  ChevronDown
} from "lucide-react";
import type { SupportTicket } from "@/lib/types";

const categoryColors: Record<string, string> = {
  attendance: "#7C6BFF", payment: "#F59E0B", schedule: "#3B82F6", other: "#71717A",
};

export default function SupportPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>(() => getSupportTickets());
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const resolveTicket = (id: string, note: string) => {
    const updated = tickets.map(t =>
      t.id === id ? { ...t, status: "resolved" as const, resolvedAt: new Date().toISOString(), adminNote: note } : t
    );
    setSupportTickets(updated);
    setTickets(updated);
    toast("success", "Ticket marked as resolved");
  };

  const filtered = tickets.filter(t => filter === "all" || t.status === filter);

  return (
    <AppShell>
    <div className="space-y-6">
      <PageHeader
        title="Support Tickets"
        description="Manage user inquiries and support requests"
        icon={<MessageSquare size={22} className="text-[#7C6BFF]" />}
      />

      <div className="flex gap-2">
        {(["all", "open", "resolved"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
            style={{
              background: filter === f ? "rgba(124,107,255,0.15)" : "rgba(255,255,255,0.04)",
              color: filter === f ? "#7C6BFF" : "#A1A1AA",
            }}
          >
            {f} ({f === "all" ? tickets.length : tickets.filter(t => t.status === f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<MessageSquare size={48} />} title="No tickets yet" description="All support requests will appear here" />
      ) : (
        <div className="space-y-2">
          {filtered.map(t => (
            <div
              key={t.id}
              className="rounded-xl overflow-hidden transition-all glass-card"
            >
              <button
                onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ background: `${categoryColors[t.category]}15` }}
                  >
                    <Tag size={16} style={{ color: categoryColors[t.category] }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#FAFAFA] truncate">{t.subject}</span>
                      {t.status === "open" ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>Open</span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}>Resolved</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#71717A]">
                      <User size={10} /> {t.userName} &middot;
                      <Clock size={10} /> {new Date(t.createdAt).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                </div>
                <ChevronDown size={16} className={`text-[#71717A] transition-transform ${expanded === t.id ? "rotate-180" : ""}`} />
              </button>

              {expanded === t.id && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="text-[10px] font-medium text-[#71717A] uppercase tracking-wider mb-1">Message</p>
                      <p className="text-sm text-[#A1A1AA]">{t.message}</p>
                    </div>
                    {t.adminNote && (
                      <div>
                        <p className="text-[10px] font-medium text-[#71717A] uppercase tracking-wider mb-1">Admin Note</p>
                        <p className="text-sm text-[#22C55E]">{t.adminNote}</p>
                      </div>
                    )}
                    {t.status === "open" && (
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => {
                            const note = prompt("Resolution note (optional):");
                            resolveTicket(t.id, note || "Resolved via admin panel");
                          }}
                        >
                          <CheckCircle2 size={14} /> Mark Resolved
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </AppShell>
  );
}
