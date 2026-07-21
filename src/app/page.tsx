"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Mail, Lock, Eye, EyeOff, LogIn, Shield, Code, UserCheck, GraduationCap, AlertCircle, CheckCircle2, ArrowRight, Sparkles, Zap } from "lucide-react";
import { setSession, getDemoUsers } from "@/lib/storage";
import { useToast } from "@/components/Toast";
import type { DemoUser, AuthSession } from "@/lib/types";

const roleIcons: Record<string, typeof Shield> = { admin: Shield, developer: Code, parent: UserCheck, student: GraduationCap };
const roleColors: Record<string, string> = { admin: "#4A7CFF", developer: "#7C6BFF", parent: "#FFD93D", student: "#22C55E" };

const stagger = (i: number) => ({ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const });

const features = [
  "Student & batch management",
  "QR attendance check-in",
  "Fee tracking & receipts",
  "Parent & student dashboards",
  "Smart lead scoring",
];

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<DemoUser[]>([]);

  useEffect(() => {
    setTimeout(() => setUsers(getDemoUsers()), 0);
  }, []);

  const doLogin = (user: DemoUser) => {
    const now = new Date();
    const duration = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const expiresAt = new Date(now.getTime() + duration);
    const session: AuthSession = {
      userId: user.userId, userName: user.userName, email: user.email, role: user.role,
      loginTime: now.toISOString(), expiresAt: expiresAt.toISOString(),
      parentId: user.parentId, studentId: user.studentId,
    };
    setSession(session);
    toast("success", `Signed in as ${user.userName}`);
    const routes: Record<string, string> = { admin: "/admin", developer: "/developer", parent: "/parent", student: "/student" };
    router.push(routes[user.role]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please enter email and password"); return; }
    const user = users.find(u => u.email === email.trim().toLowerCase() && u.password === password);
    if (!user) { setError("Invalid email or password. Try demo credentials on the right."); return; }
    setLoading(true);
    setTimeout(() => { doLogin(user); }, 800);
  };

  const quickFill = (user: DemoUser) => {
    setEmail(user.email); setPassword(user.password); setRememberMe(true); setError("");
  };

  const formItems = [
    { key: "email", label: "Email", icon: Mail, type: "email", placeholder: "you@example.com", value: email, onChange: (v: string) => setEmail(v) },
    { key: "password", label: "Password", icon: Lock, type: showPw ? "text" : "password", placeholder: "Enter your password", value: password, onChange: (v: string) => setPassword(v) },
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A7CFF]/10 via-[#7C6BFF]/5 to-transparent" />
        <div className="floating-orb w-[500px] h-[500px] bg-[#4A7CFF]/10 top-[-10%] left-[-10%]" />
        <div className="floating-orb w-[400px] h-[400px] bg-[#7C6BFF]/8 bottom-[-10%] right-[-5%]" />
        <div className="floating-orb w-[300px] h-[300px] bg-[#FF6B6B]/5 top-[40%] right-[20%]" />

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#4A7CFF] to-[#7C6BFF] shadow-lg shadow-[#4A7CFF]/25">
                <Flame size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl tracking-tight">Brightburn</h1>
                <p className="text-sm text-[var(--text-muted)]">Dance & Fitness Studio</p>
              </div>
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl leading-[1.05] tracking-[-0.02em]">
                Manage your studio
                <br />
                <span className="text-gradient-primary">from one place</span>
              </h2>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                Track attendance, manage fees, communicate with parents, and grow your studio — all in one dashboard.
              </p>
            </div>

            <div className="space-y-3">
              {features.map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#4A7CFF]/10 flex items-center justify-center flex-shrink-0">
                    <Zap size={10} className="text-[#4A7CFF]" />
                  </div>
                  {f}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex items-center gap-3 text-xs text-[var(--text-muted)] pt-2"
            >
              <div className="flex -space-x-2">
                {["#4A7CFF", "#FF6B6B", "#FFD93D", "#22C55E"].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-[var(--bg-base)]" style={{ background: c }} />
                ))}
              </div>
              <span>Trusted by studio owners</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-[#4A7CFF]/5 via-transparent to-[#FF6B6B]/3 lg:hidden" />
        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden flex items-center gap-3 mb-8"
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#4A7CFF] to-[#7C6BFF] shadow-lg shadow-[#4A7CFF]/20">
              <Flame size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg tracking-tight">Brightburn</h1>
              <p className="text-[10px] text-[var(--text-muted)]">Dance & Fitness Studio</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-8 lg:p-10 depth-shadow border-accent"
            style={{ background: "rgba(18,18,26,0.9)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <h2 className="text-2xl mb-1">Welcome back</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-7">Sign in to your account to continue</p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-4">
              {formItems.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={stagger(i)}
                >
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">{item.label}</label>
                  <div className="relative group">
                    <item.icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[#4A7CFF] transition-colors" />
                    <input
                      type={item.type}
                      value={item.value}
                      onChange={e => item.onChange(e.target.value)}
                      placeholder={item.placeholder}
                      className="w-full rounded-xl py-3 pl-10 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all duration-200 border border-[rgba(255,255,255,0.08)] focus:border-[#4A7CFF]/50 focus:shadow-[0_0_0_3px_rgba(74,124,255,0.08)]"
                      style={{ background: "rgba(28,28,42,0.8)" }}
                    />
                    {item.key === "password" && (
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.46, duration: 0.5 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    className="w-4 h-4 rounded border border-[rgba(255,255,255,0.12)] flex items-center justify-center transition-all group-hover:border-[#4A7CFF]"
                    style={{ background: rememberMe ? "#4A7CFF" : "transparent" }}
                  >
                    {rememberMe && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="hidden" />
                  <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">Remember me (7 days)</span>
                </label>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-xs text-[#EF4444] p-3 rounded-xl overflow-hidden" style={{ background: "rgba(239,68,68,0.08)" }}
                  >
                    <AlertCircle size={14} className="flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="motion-button relative w-full rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #4A7CFF, #7C6BFF)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin block mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2"><LogIn size={16} /> Sign In</span>
                )}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] justify-center mt-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse-soft" />
              Demo mode &middot; No real auth
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={12} className="text-[#FFD93D]" />
                <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Quick Fill</p>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] mb-3">Select an account to auto-fill credentials</p>
              <div className="grid grid-cols-2 gap-2">
                {users.map((u, idx) => {
                  const Icon = roleIcons[u.role];
                  return (
                    <motion.button
                      key={u.userId}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => quickFill(u)}
                      className="flex items-center gap-2.5 rounded-xl p-3 text-left transition-all duration-200"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.65 + idx * 0.06, duration: 0.4 }}
                      style={{
                        background: "rgba(28,28,42,0.8)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: `${roleColors[u.role]}20` }}>
                        <Icon size={14} style={{ color: roleColors[u.role] }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-[var(--text-primary)] truncate">{u.userName}</div>
                        <div className="text-[10px] text-[var(--text-muted)] truncate capitalize">{u.role}</div>
                      </div>
                      <ArrowRight size={12} className="text-[var(--text-muted)] flex-shrink-0" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-center text-[10px] text-[var(--text-muted)] mt-4"
          >
            Brightburn Dance & Fitness Studio &mdash; Demo v1.0
          </motion.p>
        </div>
      </div>
    </div>
  );
}
