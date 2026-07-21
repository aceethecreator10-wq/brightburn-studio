"use client";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { StatusBadge, FeeStatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { InsightCard } from "@/components/ui/InsightCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getStudents, saveStudents, getBatches } from "@/lib/storage";
import { Student, Batch } from "@/lib/types";
import { Search, UserPlus, Users, Trash2, Edit3 } from "lucide-react";

export default function StudentManagement() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>(() => getStudents());
  const [batches] = useState<Batch[]>(() => getBatches());
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [feeFilter, setFeeFilter] = useState("all");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  const [form, setForm] = useState({
    name: "", age: "", parentName: "", parentPhone: "", batchId: "", monthlyFee: "",
  });

  const filterChips = [
    { value: "all", label: "All" },
    { value: "paid", label: "Paid" },
    { value: "due", label: "Due" },
    { value: "overdue", label: "Overdue" },
    { value: "first_payment_pending", label: "Payment Due" },
  ];

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchBatch = batchFilter === "all" || s.batchId === batchFilter;
    const matchFee = feeFilter === "all" || s.feeStatus === feeFilter;
    return matchSearch && matchBatch && matchFee;
  });

  const handleAdd = () => {
    const batch = batches.find((b) => b.id === form.batchId);
    if (!form.name || !form.batchId) return;
    const newStudent: Student = {
      id: `s${Date.now()}`,
      name: form.name,
      age: parseInt(form.age) || 0,
      photoPlaceholder: form.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
      parentName: form.parentName || "Self",
      parentPhone: form.parentPhone || "",
      batchId: form.batchId,
      batchName: batch?.name ?? "",
      joiningDate: new Date().toISOString().split("T")[0],
      monthlyFee: parseInt(form.monthlyFee) || (batch?.monthlyFee ?? 0),
      firstPaymentStatus: "pending",
      autopayStatus: "inactive",
      feeStatus: "first_payment_pending",
      nextDueDate: new Date().toISOString().split("T")[0],
      active: true,
    };
    const updated = [...students, newStudent];
    setStudents(updated);
    saveStudents(updated);
    setAddModal(false);
    setForm({ name: "", age: "", parentName: "", parentPhone: "", batchId: "", monthlyFee: "" });
  };

  const handleEdit = (student: Student) => {
    setCurrentStudent({ ...student });
    setEditModal(true);
  };

  const handleEditSave = () => {
    if (!currentStudent) return;
    const batch = batches.find((b) => b.id === currentStudent.batchId);
    const updated = students.map((s) =>
      s.id === currentStudent.id
        ? { ...currentStudent, batchName: batch?.name ?? s.batchName, monthlyFee: batch?.monthlyFee ?? currentStudent.monthlyFee }
        : s
    );
    setStudents(updated);
    saveStudents(updated);
    setEditModal(false);
    setCurrentStudent(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    saveStudents(updated);
  };

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeader
          icon={<Users size={22} className="text-[#4A7CFF]" />}
          title="Students"
          description={`${students.length} total students${students.length !== filtered.length ? ` · ${filtered.length} shown` : ""}`}
          actions={
            <Button onClick={() => setAddModal(true)}><UserPlus size={14} /> Add Student</Button>
          }
        />

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              className="w-full rounded-lg bg-[#16161D] border pl-9 pr-3 py-2.5 text-sm text-[#FAFAFA] placeholder-[#71717A] transition-all"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            options={[{ value: "all", label: "All Batches" }, ...batches.map((b) => ({ value: b.id, label: b.name }))]}
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filterChips.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setFeeFilter(feeFilter === chip.value ? "all" : chip.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                feeFilter === chip.value
                  ? "bg-[#4A7CFF]/10 text-[#4A7CFF] border-[#4A7CFF]/20"
                  : "text-[#A1A1AA] border-[rgba(255,255,255,0.08)] hover:bg-[#16161D]"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="lg:hidden space-y-3">
          {filtered.length === 0 ? (
            <EmptyState title="No students found" description="Try different filters" />
          ) : (
            filtered.map((s) => (
              <InsightCard key={s.id}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A7CFF] to-[#7C6BFF] flex items-center justify-center text-sm font-bold text-white cursor-pointer flex-shrink-0"
                    onClick={() => router.push(`/admin/students/${s.id}`)}
                  >
                    {s.photoPlaceholder}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#FAFAFA] truncate cursor-pointer"
                      onClick={() => router.push(`/admin/students/${s.id}`)}
                    >{s.name}</p>
                    <p className="text-xs text-[#71717A]">{s.batchName} &middot; ₹{s.monthlyFee}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <FeeStatusBadge status={s.feeStatus} />
                      <span className="text-[10px] text-[#71717A]">Autopay: {s.autopayStatus}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(s)}
                      className="p-1.5 rounded-lg transition-colors text-[#71717A] hover:text-[#FFD93D]"
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                    ><Edit3 size={14} /></button>
                    <button onClick={() => handleDelete(s.id)}
                      className="p-1.5 rounded-lg transition-colors text-[#71717A] hover:text-[#EF4444]"
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                    ><Trash2 size={14} /></button>
                  </div>
                </div>
              </InsightCard>
            ))
          )}
        </div>

        <div className="hidden lg:block">
          <InsightCard padding={false}>
            <DataTable
              columns={[
                { key: "name", header: "Student", render: (s: Student) => (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A7CFF] to-[#7C6BFF] flex items-center justify-center text-xs font-bold text-white">
                      {s.photoPlaceholder}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#FAFAFA]">{s.name}</p>
                      <p className="text-xs text-[#71717A]">{s.parentName}</p>
                    </div>
                  </div>
                )},
                { key: "age", header: "Age" },
                { key: "batchName", header: "Batch" },
                { key: "monthlyFee", header: "Fee", render: (s: Student) => `₹${s.monthlyFee}` },
                { key: "feeStatus", header: "Status", render: (s: Student) => <FeeStatusBadge status={s.feeStatus} /> },
                { key: "autopayStatus", header: "Autopay", render: (s: Student) => (
                  <StatusBadge variant={s.autopayStatus === "active" ? "success" : s.autopayStatus === "failed" ? "danger" : "neutral"}>
                    {s.autopayStatus}
                  </StatusBadge>
                )},
                { key: "actions", header: "Actions", render: (s: Student) => (
                  <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(s); }}
                      className="p-1.5 rounded-lg transition-colors text-[#71717A] hover:text-[#FFD93D]"
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                      title="Edit"
                    ><Edit3 size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                      className="p-1.5 rounded-lg transition-colors text-[#71717A] hover:text-[#EF4444]"
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                      title="Delete"
                    ><Trash2 size={14} /></button>
                  </div>
                )},
              ]}
              data={filtered}
              keyExtractor={(s: Student) => s.id}
              onRowClick={(s: Student) => router.push(`/admin/students/${s.id}`)}
              emptyMessage="No students match your filters"
            />
          </InsightCard>
        </div>

        <Modal open={addModal} onClose={() => setAddModal(false)} title="Add New Student">
          <div className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Aarav Sharma" />
            <Input label="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            <Input label="Parent Name" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} placeholder="Leave blank if self" />
            <Input label="Parent Phone" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} />
            <Select
              label="Batch"
              options={batches.map((b) => ({ value: b.id, label: `${b.name} (₹${b.monthlyFee})` }))}
              value={form.batchId}
              onChange={(e) => setForm({ ...form, batchId: e.target.value })}
            />
            <Input label="Monthly Fee (₹)" type="number" value={form.monthlyFee} onChange={(e) => setForm({ ...form, monthlyFee: e.target.value })} />
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setAddModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleAdd}>Add Student</Button>
            </div>
          </div>
        </Modal>

        <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Student">
          {currentStudent && (
            <div className="space-y-4">
              <Input label="Full Name" value={currentStudent.name} onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })} />
              <Input label="Age" type="number" value={String(currentStudent.age)} onChange={(e) => setCurrentStudent({ ...currentStudent, age: parseInt(e.target.value) || 0 })} />
              <Select
                label="Batch"
                options={batches.map((b) => ({ value: b.id, label: b.name }))}
                value={currentStudent.batchId}
                onChange={(e) => setCurrentStudent({ ...currentStudent, batchId: e.target.value })}
              />
              <Input label="Parent Name" value={currentStudent.parentName} onChange={(e) => setCurrentStudent({ ...currentStudent, parentName: e.target.value })} />
              <Input label="Parent Phone" value={currentStudent.parentPhone} onChange={(e) => setCurrentStudent({ ...currentStudent, parentPhone: e.target.value })} />
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditModal(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleEditSave}>Save Changes</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppShell>
  );
}
