"use client";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { InsightCard } from "@/components/ui/InsightCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { useState } from "react";
import {
  Settings, CreditCard, Shield, GitBranch, Bell, Smartphone, Database, Lock, Save, CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [studioName, setStudioName] = useState("Brightburn Dance & Fitness Studio");
  const [contact, setContact] = useState("+91 98765 43200");
  const [address, setAddress] = useState("123, Dance Avenue, Fitness Nagar, Mumbai - 400001");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeader
          icon={<Settings size={22} className="text-[#A1A1AA]" />}
          title="Settings"
          description="Studio configuration, QR token preferences, payment settings, and system preferences"
        />

        {saved && (
          <div className="rounded-xl p-4 border animate-fade-in flex items-center gap-3" style={{ borderColor: "rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)" }}>
            <CheckCircle2 size={18} className="text-[#22C55E]" />
            <span className="text-sm text-[#22C55E]">Settings saved successfully!</span>
          </div>
        )}

        <InsightCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Studio Profile</h3>
          </div>
          <div className="space-y-4 max-w-md">
            <Input label="Studio Name" value={studioName} onChange={(e) => setStudioName(e.target.value)} />
            <Input label="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} />
            <TextArea label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <Button size="sm" onClick={handleSave}><Save size={14} /> Save Changes</Button>
          </div>
        </InsightCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">QR Attendance</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-[#A1A1AA]">QR Change Frequency</span>
                <span className="text-[#FAFAFA] font-medium">Daily</span>
              </div>
              <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-[#A1A1AA]">Scans Per Day Per Student</span>
                <span className="text-[#FAFAFA] font-medium">1</span>
              </div>
              <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-[#A1A1AA]">Manual Override</span>
                <StatusBadge variant="success">Allowed</StatusBadge>
              </div>
              <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-[#A1A1AA]">QR Token Format</span>
                <code className="text-[10px] text-[#71717A] bg-[#08080B] px-2 py-0.5 rounded">BRIGHTBURN_ATTENDANCE_YYYY-MM-DD</code>
              </div>
            </div>
          </InsightCard>

          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Branch Setup</h3>
              <StatusBadge variant="info">Future</StatusBadge>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", color: "#71717A" }}>
                <GitBranch size={18} />
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Multi-branch support will be available in production. Branches can be added once Supabase is connected.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-[#71717A]">
              <Database size={12} /> Production feature
            </div>
          </InsightCard>

          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Payment Settings</h3>
              <StatusBadge variant="warning">Not Configured</StatusBadge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-[#71717A]" />
                  <span className="text-sm text-[#A1A1AA]">Autopay Gateway</span>
                </div>
                <StatusBadge variant="warning">Not Connected</StatusBadge>
              </div>
              <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-[#71717A]" />
                  <span className="text-sm text-[#A1A1AA]">Razorpay Integration</span>
                </div>
                <StatusBadge variant="warning">Not Connected</StatusBadge>
              </div>
              <p className="text-xs text-[#71717A] mt-2">
                Connect Razorpay in production for autopay and fee collection.
              </p>
            </div>
          </InsightCard>

          <InsightCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Notifications</h3>
              <StatusBadge variant="info">Future</StatusBadge>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", color: "#71717A" }}>
                <Bell size={18} />
              </div>
              <div>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  WhatsApp, SMS, and email notifications will be configured in production for fee reminders, attendance alerts, and studio announcements.
                </p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-[#71717A]">
                  <Smartphone size={10} /> Twilio / WhatsApp API
                </div>
              </div>
            </div>
          </InsightCard>
        </div>

        <InsightCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Future Upgrades</h3>
            <StatusBadge variant="info">Coming Soon</StatusBadge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: Lock, label: "OTP-based login", desc: "For parents and students" },
              { icon: Bell, label: "WhatsApp automation", desc: "Fee reminders & alerts" },
              { icon: Smartphone, label: "Mobile app", desc: "Android / iOS native" },
              { icon: GitBranch, label: "Multi-branch", desc: "Manage multiple studios" },
              { icon: Database, label: "Supabase backend", desc: "Production database" },
              { icon: CreditCard, label: "Razorpay autopay", desc: "Online fee collection" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl p-4 text-center" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                <div className="p-2 rounded-lg inline-flex mb-2" style={{ background: "rgba(255,255,255,0.05)", color: "#4A7CFF" }}>
                  <item.icon size={16} />
                </div>
                <p className="text-sm font-medium text-[#FAFAFA]">{item.label}</p>
                <p className="text-xs text-[#71717A] mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </InsightCard>
      </div>
    </AppShell>
  );
}
