"use client";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input, Select, TextArea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { InsightCard } from "@/components/ui/InsightCard";
import { useState } from "react";
import { getAnnouncements, saveAnnouncements, getBatches } from "@/lib/storage";
import type { Announcement } from "@/lib/types";
import { useToast } from "@/components/Toast";
import { Megaphone, Plus, Trash2, Bell } from "lucide-react";

export default function NoticesPage() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getAnnouncements());
  const [batches] = useState(() => getBatches());
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", target: "all", batchId: "", priority: "info" });

  const handleCreate = () => {
    if (!form.title || !form.content) return;
    const newAnn: Announcement = {
      id: `n${Date.now()}`,
      title: form.title,
      content: form.content,
      target: form.target as Announcement["target"],
      batchId: form.batchId || undefined,
      createdAt: new Date().toISOString(),
      createdBy: "Admin",
    };
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    saveAnnouncements(updated);
    setModal(false);
    setForm({ title: "", content: "", target: "all", batchId: "", priority: "info" });
    toast("success", "Notice published");
  };

  const handleDelete = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    saveAnnouncements(updated);
  };

  const targetBadge = (target: string) => {
    const map: Record<string, { variant: "success" | "info" | "warning" | "neutral"; label: string }> = {
      all: { variant: "info", label: "All" },
      batch: { variant: "warning", label: "Batch" },
      parents: { variant: "success", label: "Parents" },
      students: { variant: "neutral", label: "Students" },
    };
    const config = map[target] ?? { variant: "neutral" as const, label: target };
    return <StatusBadge variant={config.variant}>{config.label}</StatusBadge>;
  };

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeader
          icon={<Megaphone size={22} className="text-[#4A7CFF]" />}
          title="Announcements"
          description="Create targeted announcements for students, parents, or batches"
          actions={
            <Button onClick={() => setModal(true)}><Plus size={14} /> Create Notice</Button>
          }
        />

        {announcements.length === 0 ? (
          <EmptyState
            title="No announcements"
            description="Create your first studio notice"
            action={<Button onClick={() => setModal(true)}><Plus size={16} className="mr-1" /> Create Notice</Button>}
          />
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <InsightCard key={a.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-base font-semibold text-[#FAFAFA]">{a.title}</h3>
                      {targetBadge(a.target)}
                      {a.batchId && <StatusBadge variant="neutral">{batches.find((b) => b.id === a.batchId)?.name ?? a.batchId}</StatusBadge>}
                    </div>
                    <p className="text-sm text-[#A1A1AA] leading-relaxed">{a.content}</p>
                    <div className="flex items-center gap-2 mt-3 text-[10px] text-[#71717A]">
                      <Bell size={10} />
                      <span>{new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                      <span className="w-1 h-1 rounded-full bg-[#71717A]" />
                      <span>by {a.createdBy}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="p-2 rounded-lg transition-colors flex-shrink-0 ml-3"
                    style={{ color: "#71717A" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#EF4444"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#71717A"; }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </InsightCard>
            ))}
          </div>
        )}

        <Modal open={modal} onClose={() => setModal(false)} title="Create Notice">
          <div className="space-y-4">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Studio Closed This Sunday" />
            <TextArea label="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your notice here..." />
            <Select
              label="Target Audience"
              options={[
                { value: "all", label: "Everyone" },
                { value: "parents", label: "Parents Only" },
                { value: "students", label: "Students Only" },
                { value: "batch", label: "Specific Batch" },
              ]}
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
            />
            {form.target === "batch" && (
              <Select
                label="Select Batch"
                options={batches.map((b) => ({ value: b.id, label: b.name }))}
                value={form.batchId}
                onChange={(e) => setForm({ ...form, batchId: e.target.value })}
              />
            )}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleCreate}>Publish Notice</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
