"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Flame, Mail, Lock, Eye, EyeOff, LogIn, Shield, Code, UserCheck,
  GraduationCap, AlertCircle, CheckCircle2, ArrowRight, Sparkles, Zap
} from "lucide-react";
import { setSession, getDemoUsers } from "@/lib/storage";
import { useToast } from "@/components/Toast";
import { HeroCanvas } from "@/components/ui/HeroCanvas";
import type { DemoUser, AuthSession } from "@/lib/types";

const roleIcons: Record<string, typeof Shield> = {
  admin: Shield, developer: Code, parent: UserCheck, student: GraduationCap,
};
const roleColors: Record<string, string> = {
  admin: "#4A7CFF", developer: "#7C6BFF", parent: "#F0C040", student: "#22C55E",
};

const features = [
  "Student & batch management",
  "QR attendance check-in",
  "Fee tracking & receipts",
  "Parent & student dashboards",
  "Smart lead scoring",
];

/* ─── 3D tilt Quick Fill card ─── */
function QuickFillCard({ user, idx, onFill }: { user: DemoUser; idx: number; onFill: () => void }) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const Icon = roleIcons[user.role];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setTilt({ x: -dy * 6, y: dx * 6 });
  }, []);

  return (
    <motion.button
      ref={cardRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 + idx * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.95 }}
      type="button"
      onClick={onFill}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      className="flex items-center gap-2.5 rounded-xl p-3 text-left transition-all duration-200 w-full relative overflow-hidden"
      style={{
        background: hovered ? "rgba(74,124,255,0.06)" : "rgba(24,24,42,0.8)",
        border: `1px solid ${hovered ? "rgba(74,124,255,0.22)" : "rgba(255,255,255,0.06)"}`,
        rotateX: tilt.x,
        rotateY: tilt.y,
        transformStyle: "preserve-3d",
        transition: "background 0.2s ease, border-color 0.2s ease",
      }}
    >
      {hovered && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(74,124,255,0.06) 0%, transparent 70%)",
          }}
        />
      )}
      <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: `${roleColors[user.role]}18` }}>
        <Icon size={13} style={{ color: roleColors[user.role] }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-[#F2F2F7] truncate">{user.userName}</div>
        <div className="text-[10px] text-[#5F5F75] truncate capitalize">{user.role}</div>
      </div>
      <ArrowRight size={11} className="text-[#5F5F75] flex-shrink-0" />
    </motion.button>
  );
}

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
    setTimeout(() => { doLogin(user); }, 900);
  };

  const quickFill = (user: DemoUser) => {
    setEmail(user.email); setPassword(user.password); setRememberMe(true); setError("");
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* ─── Left Panel ─── */}
      <div className="hidden lg:flex lg:w-[54%] relative items-center justify-center p-12 overflow-hidden">
        {/* Animated canvas background */}
        <HeroCanvas />

        {/* Subtle dark gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07070C]/60 via-transparent to-[#07070C]/40 pointer-events-none" />

        <div className="relative z-10 max-w-lg w-full">
          {/* Brand mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-12"
          >
            <motion.div
              animate={{ rotate: [0, -3, 3, -2, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              className="p-3 rounded-2xl bg-gradient-to-br from-[#4A7CFF] to-[#FF4F7A] shadow-xl shadow-[#4A7CFF]/30"
            >
              <Flame size={22} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-[22px] tracking-[-0.03em] font-bold text-[#F2F2F7]">Brightburn</h1>
              <p className="text-[11px] text-[#5F5F75] font-medium tracking-[0.08em] uppercase">Dance & Fitness Studio</p>
            </div>
          </motion.div>

          {/* Hero headline — word-by-word stagger */}
          <div className="space-y-5 mb-10">
            <h2 className="text-[3.6rem] lg:text-[4rem] xl:text-[4.5rem] leading-[0.95] tracking-[-0.04em]" aria-label="Manage your studio from one place">
              {[
                { text: "Manage", className: "text-[#F2F2F7]" },
                { text: "your", className: "text-[#F2F2F7]" },
                { text: "studio", className: "text-[#F2F2F7]" },
              ].map(({ text, className }, wi) => (
                <motion.span
                  key={`${text}-${wi}`}
                  className={`inline-block mr-[0.22em] ${className}`}
                  initial={{ opacity: 0, y: 28, skewY: 3 }}
                  animate={{ opacity: 1, y: 0, skewY: 0 }}
                  transition={{ delay: 0.1 + wi * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  aria-hidden="true"
                >
                  {text}
                </motion.span>
              ))}
              <br />
              {[
                { text: "from", className: "text-gradient-primary" },
                { text: "one", className: "text-gradient-primary" },
                { text: "place.", className: "text-gradient-primary" },
              ].map(({ text, className }, wi) => (
                <motion.span
                  key={`${text}-2-${wi}`}
                  className={`inline-block mr-[0.22em] ${className}`}
                  initial={{ opacity: 0, y: 28, skewY: 3 }}
                  animate={{ opacity: 1, y: 0, skewY: 0 }}
                  transition={{ delay: 0.42 + wi * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  aria-hidden="true"
                >
                  {text}
                </motion.span>
              ))}
            </h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className="text-[15px] text-[#9898AE] max-w-md leading-[1.7]"
            >
              Track attendance, manage fees, communicate with parents,
              and grow your studio — all in one dashboard.
            </motion.p>
          </div>

          {/* Feature list */}
          <div className="space-y-3 mb-10">
            {features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.82 + i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 text-[13px] text-[#9898AE]"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.88 + i * 0.08, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(74,124,255,0.12)" }}
                >
                  <Zap size={9} className="text-[#4A7CFF]" />
                </motion.div>
                {f}
              </motion.div>
            ))}
          </div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25, duration: 0.5 }}
            className="flex items-center gap-3 text-xs text-[#5F5F75]"
          >
            <div className="flex -space-x-2">
              {["#4A7CFF", "#FF4F7A", "#F0C040", "#22C55E"].map((c, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-[#07070C] shadow-lg"
                  style={{ background: c }}
                />
              ))}
            </div>
            <span>Trusted by studio owners</span>
          </motion.div>
        </div>
      </div>

      {/* ─── Right Panel — Login Form ─── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        {/* Mobile gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A7CFF]/4 via-transparent to-[#FF4F7A]/3 lg:hidden" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden flex items-center gap-3 mb-8"
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#4A7CFF] to-[#FF4F7A] shadow-lg shadow-[#4A7CFF]/20">
              <Flame size={17} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg tracking-[-0.03em] font-bold">Brightburn</h1>
              <p className="text-[9.5px] text-[#5F5F75] uppercase tracking-wider">Dance & Fitness Studio</p>
            </div>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-8 lg:p-9 border-accent depth-shadow"
            style={{ background: "rgba(15,15,24,0.92)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5 }}
              className="mb-7"
            >
              <h2 className="text-[1.35rem] font-bold tracking-[-0.025em] mb-1">Welcome back</h2>
              <p className="text-[13px] text-[#9898AE] leading-relaxed">Sign in to your account to continue</p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <label className="block text-[11px] font-semibold text-[#9898AE] mb-1.5 tracking-wide">Email</label>
                <div className="relative group">
                  <div className="input-accent-bar" />
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5F5F75] group-focus-within:text-[#4A7CFF] transition-colors duration-200" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl py-3 pl-10 pr-4 text-[13px] text-[#F2F2F7] placeholder:text-[#5F5F75] outline-none border border-[rgba(255,255,255,0.07)] focus:border-[#4A7CFF]/50"
                    style={{ background: "rgba(24,24,42,0.85)" }}
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <label className="block text-[11px] font-semibold text-[#9898AE] mb-1.5 tracking-wide">Password</label>
                <div className="relative group">
                  <div className="input-accent-bar" />
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5F5F75] group-focus-within:text-[#4A7CFF] transition-colors duration-200" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl py-3 pl-10 pr-10 text-[13px] text-[#F2F2F7] placeholder:text-[#5F5F75] outline-none border border-[rgba(255,255,255,0.07)] focus:border-[#4A7CFF]/50"
                    style={{ background: "rgba(24,24,42,0.85)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5F5F75] hover:text-[#9898AE] transition-colors"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </motion.div>

              {/* Remember me */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.46, duration: 0.4 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    className="w-4 h-4 rounded border border-[rgba(255,255,255,0.12)] flex items-center justify-center transition-all group-hover:border-[#4A7CFF]/50"
                    style={{ background: rememberMe ? "#4A7CFF" : "transparent" }}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    <AnimatePresence>
                      {rememberMe && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                          <CheckCircle2 size={11} className="text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="hidden" />
                  <span className="text-[11px] text-[#5F5F75] group-hover:text-[#9898AE] transition-colors">Remember me (7 days)</span>
                </label>
              </motion.div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-2 text-xs text-[#EF4444] p-3 rounded-xl overflow-hidden"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.14)" }}
                  >
                    <AlertCircle size={13} className="flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={loading}
                id="login-submit-btn"
                className="motion-button relative w-full rounded-xl py-3.5 text-[13.5px] font-semibold text-white disabled:opacity-60 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #3D6EF0, #4A7CFF, #7C6BFF)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.4 }}
              >
                {loading ? (
                  /* Three-dot branded loader */
                  <span className="flex items-center justify-center gap-1.5 py-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-white"
                        animate={{ scale: [0.6, 1, 0.6], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, delay: i * 0.15, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ))}
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <LogIn size={15} /> Sign In
                  </span>
                )}
              </motion.button>
            </form>

            {/* Demo mode badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.58, duration: 0.4 }}
              className="flex items-center gap-2 text-[10px] text-[#5F5F75] justify-center mt-4"
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"
              />
              Demo mode &middot; No real auth
            </motion.div>

            {/* Quick Fill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.45 }}
              className="mt-7 pt-6 border-t border-[rgba(255,255,255,0.06)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={11} className="text-[#F0C040]" />
                <p className="text-[10.5px] font-semibold text-[#5F5F75] uppercase tracking-[0.12em]">Quick Fill</p>
              </div>
              <p className="text-[10.5px] text-[#5F5F75] mb-3">Select an account to auto-fill credentials</p>
              <div className="grid grid-cols-2 gap-2">
                {users.map((u, idx) => (
                  <QuickFillCard
                    key={u.userId}
                    user={u}
                    idx={idx}
                    onFill={() => quickFill(u)}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="text-center text-[10px] text-[#5F5F75] mt-4"
          >
            Brightburn Dance & Fitness Studio &mdash; Demo v1.0
          </motion.p>
        </div>
      </div>
    </div>
  );
}
