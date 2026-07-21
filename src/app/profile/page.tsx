"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { getSession, setSession, clearSession } from "@/lib/storage";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  User, Mail, Shield, Calendar, Clock, LogOut,
} from "lucide-react";
import type { AuthSession } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSessionState] = useState<AuthSession | null>(() => {
    const s = getSession();
    if (!s) return null;
    return s;
  });
  const [name, setName] = useState(() => session?.userName ?? "");
  const [email, setEmail] = useState(() => session?.email ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!session) { router.push("/"); }
  }, [session, router]);

  const handleSave = () => {
    if (!session) return;
    const updated: AuthSession = { ...session, userName: name };
    setSession(updated);
    setSessionState(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  if (!session) return null;

  const roleColors: Record<string, string> = {
    admin: "#4A7CFF", developer: "#3B82F6", parent: "#FFD93D", student: "#22C55E"
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="My Profile"
          description="Manage your account settings and preferences"
          icon={<User size={22} className="text-[#3B82F6]" />}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl p-6 text-center glass-card"
            >
              <div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${roleColors[session.role] || "#4A7CFF"}, ${roleColors[session.role] || "#FF6B6B"})` }}
              >
                {session.userName.charAt(0)}
              </div>
              <h2 className="text-lg font-bold text-[#FAFAFA]">{session.userName}</h2>
              <p
                className="text-xs font-medium uppercase tracking-wider mt-1"
                style={{ color: roleColors[session.role] || "#4A7CFF" }}
              >
                {session.role}
              </p>

              <div className="mt-6 space-y-3 text-left">
                <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                  <Mail size={14} className="text-[#71717A]" />
                  {session.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                  <Shield size={14} className="text-[#71717A]" />
                  Role: {session.role}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                  <Calendar size={14} className="text-[#71717A]" />
                  Logged in: {new Date(session.loginTime).toLocaleDateString("en-IN")}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                  <Clock size={14} className="text-[#71717A]" />
                  Session expires: {new Date(session.expiresAt).toLocaleDateString("en-IN")}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-[#EF4444] transition-all"
                style={{ background: "rgba(239,68,68,0.08)" }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-6 glass-card"
            >
              <h3 className="text-base font-semibold text-[#FAFAFA] mb-5">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Full Name</label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Email</label>
                  <Input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={handleSave} variant={saved ? "success" : "primary"}>
                    {saved ? "Saved!" : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-6 mt-6 glass-card"
            >
              <h3 className="text-base font-semibold text-[#FAFAFA] mb-4">Account Activity</h3>
              <div className="space-y-3">
                {[
                  { action: "Logged in", time: session.loginTime, icon: LogOut },
                  { action: "Account created", time: "2026-01-01T00:00:00Z", icon: User },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="p-1.5 rounded-lg mt-0.5"
                      style={{ background: "rgba(59,130,246,0.1)" }}
                    >
                      <item.icon size={14} style={{ color: "#3B82F6" }} />
                    </div>
                    <div>
                      <p className="text-sm text-[#FAFAFA]">{item.action}</p>
                      <p className="text-xs text-[#71717A]">{new Date(item.time).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
