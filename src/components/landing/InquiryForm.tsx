"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, TextArea } from "@/components/ui/Input";

const PROGRAMS = [
  "Kids Beginner Dance",
  "Hip Hop Teens",
  "Fitness & Zumba",
  "Advanced Dance Crew",
  "Personal Training",
  "Not sure yet",
];

interface FormData {
  studentName: string;
  parentName: string;
  phone: string;
  age: string;
  program: string;
  timing: string;
  message: string;
}

export function InquiryForm() {
  const [form, setForm] = useState<FormData>({
    studentName: "",
    parentName: "",
    phone: "",
    age: "",
    program: "",
    timing: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const inquiryId = `inq-${Date.now()}`;
      const createdAt = new Date().toISOString();

      const existingAdmissions = JSON.parse(localStorage.getItem("brightburn_admissions") || "[]");
      if (Array.isArray(existingAdmissions)) {
        existingAdmissions.push({
          id: inquiryId,
          name: form.studentName,
          age: parseInt(form.age) || 0,
          parentName: form.parentName,
          parentPhone: form.phone,
          interestedBatch: form.program,
          stage: "inquiry",
          notes: `Timing: ${form.timing}. Message: ${form.message}`,
          createdAt,
        });
        localStorage.setItem("brightburn_admissions", JSON.stringify(existingAdmissions));
      }

      const existingLeads = JSON.parse(localStorage.getItem("brightburn_leads") || "[]");
      if (Array.isArray(existingLeads)) {
        existingLeads.push({
          id: inquiryId,
          name: form.studentName,
          age: parseInt(form.age) || 0,
          parentName: form.parentName,
          parentPhone: form.phone,
          parentEmail: "",
          interestedBatch: form.program,
          stage: "new",
          source: "website",
          notes: `Timing: ${form.timing}. Message: ${form.message}`,
          urgency: 3,
          budgetFit: 3,
          batchSeats: 3,
          sourceQuality: 3,
          followUpRecency: 1,
          parentContact: 3,
          paymentIntent: 2,
          score: 0,
          temperature: "warm",
          createdAt,
        });
        localStorage.setItem("brightburn_leads", JSON.stringify(existingLeads));
      }
    } catch {
      const existing = JSON.parse(localStorage.getItem("brightburn_landing_inquiries") || "[]");
      existing.push({ id: `inq-${Date.now()}`, ...form, createdAt: new Date().toISOString() });
      localStorage.setItem("brightburn_landing_inquiries", JSON.stringify(existing));
    }

    setSubmitted(true);
    setForm({ studentName: "", parentName: "", phone: "", age: "", program: "", timing: "", message: "" });
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-8 text-center space-y-4 border-accent"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto">
          <Send size={24} className="text-[#22C55E]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Thanks! Your inquiry has been saved for demo.</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          This is a demo form. In production, inquiries can be connected to WhatsApp, CRM, or the admin lead pipeline.
        </p>
        <Button variant="glass" onClick={() => setSubmitted(false)}>
          Submit Another
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Student Name" placeholder="Enter student name" value={form.studentName} onChange={(e) => update("studentName", e.target.value)} required />
        <Input label="Parent Name" placeholder="Enter parent name" value={form.parentName} onChange={(e) => update("parentName", e.target.value)} required />
        <Input label="Phone Number" type="tel" placeholder="Enter phone number" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
        <Input label="Age" type="number" placeholder="Enter age" value={form.age} onChange={(e) => update("age", e.target.value)} required />
        <Select
          label="Interested Program"
          options={PROGRAMS.map((p) => ({ value: p, label: p }))}
          value={form.program}
          onChange={(e) => update("program", e.target.value)}
          required
        />
        <Input label="Preferred Timing" placeholder="e.g. Evening 5-6 PM" value={form.timing} onChange={(e) => update("timing", e.target.value)} />
      </div>
      <TextArea label="Message" placeholder="Any questions or notes..." value={form.message} onChange={(e) => update("message", e.target.value)} />
      <Button type="submit" className="w-full">
        <Send size={16} /> Submit Inquiry
      </Button>
    </form>
  );
}