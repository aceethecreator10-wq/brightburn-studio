"use client";
import { ReactNode, useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar, MobileNav } from "./Sidebar";
import { PageTransition } from "@/components/ui/PageTransition";
import { getSession, clearSession, getNotifications, setNotifications, getTourSeen, setTourSeen } from "@/lib/storage";
import {
  Menu, Bell, Search, X, LogOut, User, Settings, ChevronDown,
  Flame, AlertCircle, Calendar, CreditCard,
  Users, QrCode, IndianRupee, CalendarDays
} from "lucide-react";
import type { AuthSession, Notification as NotifType } from "@/lib/types";

const pageTitles: Record<string, string> = {
  "/admin": "Overview", "/admin/students": "Students", "/admin/batches": "Batches",
  "/admin/attendance": "Attendance", "/admin/reports": "Reports", "/admin/fees": "Fees",
  "/admin/notices": "Notices", "/admin/settings": "Settings", "/admin/schedule": "Schedule",
  "/admin/admissions": "Admissions", "/admin/leads": "Leads", "/admin/support": "Support",
  "/admin/documents": "Documents", "/admin/id-card": "ID Cards",
  "/developer": "System", "/parent": "Parent Dashboard",
  "/student": "Student Dashboard", "/student/scan": "Scan Attendance", "/profile": "Profile",
};

const notifIcons: Record<string, typeof Bell> = {
  attendance: AlertCircle, fees: CreditCard, schedule: Calendar, announcement: Bell, system: Settings,
};

/* ─── Branded Loading Screen ─── */
function BrandedLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#07070C" }}>
      <div className="flex flex-col items-center gap-5">
        {/* SVG stroke-trace branded "B" mark */}
        <div className="relative w-16 h-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent 70%, #4A7CFF 100%)",
              padding: "2px",
            }}
          >
            <div className="w-full h-full rounded-full" style={{ background: "#07070C" }} />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#4A7CFF] to-[#FF4F7A] shadow-lg shadow-[#4A7CFF]/30">
              <Flame size={18} className="text-white" />
            </div>
          </div>
        </div>

        {/* Three-dot pulse loader */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#4A7CFF]"
              animate={{ scale: [0.6, 1, 0.6], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, delay: i * 0.16, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <motion.p
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="text-[11px] text-[#5F5F75] tracking-widest uppercase"
        >
          Loading Brightburn
        </motion.p>
      </div>
    </div>
  );
}

/* ─── Page depth for directional transitions ─── */
function getPathDepth(path: string): number {
  return path.split("/").filter(Boolean).length;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [notifications, setNotifs] = useState<NotifType[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTour, setShowTour] = useState(false);
  const [prevPathDepth, setPrevPathDepth] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.push("/"); }
  }, [router]);

  useEffect(() => {
    const s = getSession();
    setTimeout(() => { setSessionState(s); setReady(true); }, 0);
  }, []);

  useEffect(() => {
    setTimeout(() => setNotifs(getNotifications()), 0);
  }, []);

  useEffect(() => {
    if (!session) return;
    const seen = getTourSeen();
    if (!seen) setTimeout(() => setShowTour(true), 1000);
  }, [session]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") { setSearchOpen(false); setNotifOpen(false); setAccountOpen(false); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Track depth for page transition direction
  useEffect(() => {
    setPrevPathDepth(getPathDepth(pathname));
  }, [pathname]);

  if (!ready) return <BrandedLoader />;
  if (!session) return null;

  const pageTitle = Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] ?? "Dashboard";
  const unreadCount = notifications.filter(n => !n.read && n.userId === session.userId).length;
  const userNotifs = notifications.filter(n => n.userId === session.userId).slice(-10);

  const markAllRead = () => {
    const updated = notifications.map(n => n.userId === session.userId ? { ...n, read: true } : n);
    setNotifications(updated);
    setNotifs(updated);
  };

  const currentDepth = getPathDepth(pathname);
  const goingDeeper = currentDepth > prevPathDepth;

  const searchRoutes = [
    { href: "/admin", label: "Admin Overview", keywords: "overview admin home dashboard" },
    { href: "/admin/students", label: "Student Management", keywords: "students pupils learners" },
    { href: "/admin/batches", label: "Batch Management", keywords: "batches classes groups" },
    { href: "/admin/schedule", label: "Class Schedule", keywords: "schedule timetable classes" },
    { href: "/admin/attendance", label: "QR Attendance", keywords: "attendance qr scan" },
    { href: "/admin/admissions", label: "Admissions Pipeline", keywords: "admissions leads inquiry join" },
    { href: "/admin/leads", label: "Smart Leads", keywords: "leads growth funnel scoring" },
    { href: "/admin/reports", label: "Reports", keywords: "reports analytics statistics" },
    { href: "/admin/fees", label: "Fees", keywords: "fees payments money dues" },
    { href: "/admin/id-card", label: "ID Cards", keywords: "id card print identity" },
    { href: "/admin/notices", label: "Notices", keywords: "notices announcements messages" },
    { href: "/admin/support", label: "Support Tickets", keywords: "support tickets help" },
    { href: "/admin/documents", label: "Documents", keywords: "documents files receipts" },
    { href: "/admin/settings", label: "Settings", keywords: "settings configuration" },
    { href: "/developer", label: "Developer System", keywords: "developer system status" },
    { href: "/parent", label: "Parent Dashboard", keywords: "parent child" },
    { href: "/student", label: "Student Dashboard", keywords: "student dashboard" },
    { href: "/student/scan", label: "Student Scan QR", keywords: "scan qr attendance student" },
    { href: "/profile", label: "My Profile", keywords: "profile account settings user" },
  ];

  const filteredSearch = searchQuery.trim()
    ? searchRoutes.filter(r =>
        r.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.keywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.href.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen flex" style={{ background: "#07070C" }}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 flex-shrink-0 z-30">
        <Sidebar role={session.role} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/65 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50"
            >
              <Sidebar role={session.role} collapsed={false} onToggle={() => setMobileOpen(false)} onMobileClose={() => setMobileOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0 overflow-hidden">
        {/* Top Nav */}
        <header className="sticky top-0 z-20 glass-nav">
          <div className="flex items-center justify-between h-14 px-5 lg:px-6">
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg md:hidden hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[#9898AE]"
              >
                <Menu size={19} />
              </motion.button>

              <AnimatePresence mode="wait">
                <motion.h1
                  key={pageTitle}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[14px] font-semibold text-[#F2F2F7] tracking-tight"
                >
                  {pageTitle}
                </motion.h1>
              </AnimatePresence>

              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-[0.14em] bg-[rgba(74,124,255,0.1)] text-[#4A7CFF] border border-[rgba(74,124,255,0.18)]">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-1.5 rounded-full bg-[#4A7CFF]"
                />
                Demo
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card border-none"
              >
                <Search size={13} className="text-[#5F5F75]" />
                <span className="text-xs text-[#5F5F75]">Search...</span>
                <kbd>⌘K</kbd>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[#9898AE]"
              >
                <Search size={18} />
              </motion.button>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setNotifOpen(!notifOpen); setAccountOpen(false); }}
                  className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors relative text-[#9898AE] hover:text-[#F2F2F7]"
                >
                  <Bell size={18} />
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gradient-to-r from-[#4A7CFF] to-[#7C6BFF] text-[8px] font-bold text-white flex items-center justify-center shadow-lg"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-full mt-2 w-80 rounded-2xl depth-shadow overflow-hidden z-50 liquid-glass"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                        <span className="text-[13px] font-semibold text-[#F2F2F7]">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-[10px] font-semibold text-[#4A7CFF] hover:text-[#6B8FFF] transition-colors">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {userNotifs.length === 0 ? (
                          <div className="p-6 text-center text-xs text-[#5F5F75]">No notifications yet</div>
                        ) : (
                          [...userNotifs].reverse().map((n, i) => {
                            const Icon = notifIcons[n.type] || Bell;
                            return (
                              <motion.div
                                key={n.id}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[rgba(255,255,255,0.035)] cursor-pointer"
                                style={{ opacity: n.read ? 0.55 : 1 }}
                                onClick={() => {
                                  const updated = notifications.map(x => x.id === n.id ? { ...x, read: true } : x);
                                  setNotifications(updated);
                                  setNotifs(updated);
                                }}
                              >
                                <div className="p-1.5 rounded-lg mt-0.5 flex-shrink-0" style={{
                                  background: n.read ? "rgba(255,255,255,0.035)" : "rgba(74,124,255,0.10)",
                                }}>
                                  <Icon size={13} style={{ color: n.read ? "#5F5F75" : "#4A7CFF" }} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-[#F2F2F7] truncate">{n.title}</p>
                                  <p className="text-[10.5px] text-[#5F5F75] mt-0.5 line-clamp-2">{n.message}</p>
                                  <p className="text-[9.5px] text-[#5F5F75] mt-1">
                                    {new Date(n.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                  </p>
                                </div>
                                {!n.read && (
                                  <motion.span
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-1.5 h-1.5 rounded-full bg-[#4A7CFF] flex-shrink-0 mt-1.5"
                                  />
                                )}
                              </motion.div>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Account */}
              <div className="relative" ref={accountRef}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setAccountOpen(!accountOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2 pl-2 border-l py-1 border-[rgba(255,255,255,0.07)]"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4A7CFF] to-[#FF4F7A] flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-[#4A7CFF]/20">
                    {session.userName?.charAt(0) ?? "U"}
                  </div>
                  <span className="hidden sm:block text-[13px] text-[#F2F2F7] font-medium max-w-[100px] truncate">{session.userName}</span>
                  <motion.div
                    animate={{ rotate: accountOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={12} className="text-[#5F5F75] hidden sm:block" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: "top right" }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-2xl depth-shadow overflow-hidden z-50 liquid-glass"
                    >
                      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                        <p className="text-[13px] font-semibold text-[#F2F2F7] truncate">{session.userName}</p>
                        <p className="text-[10px] text-[#5F5F75] capitalize mt-0.5">{session.role}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { router.push("/profile"); setAccountOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#9898AE] hover:text-[#F2F2F7] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                        >
                          <User size={13} /> Profile
                        </button>
                        <button
                          onClick={() => { clearSession(); router.push("/"); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#EF4444] hover:bg-[rgba(239,68,68,0.08)] transition-colors"
                        >
                          <LogOut size={13} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Main content with page transition */}
        <PageTransition goingDeeper={goingDeeper} className="flex-1 p-5 lg:p-7 xl:p-9 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </PageTransition>

        {/* Footer */}
        <footer className="hidden md:block border-t border-[rgba(255,255,255,0.04)] py-3 px-6">
          <div className="flex items-center justify-between text-[10px] text-[#5F5F75]">
            <span>Brightburn Dance &amp; Fitness Studio &mdash; Demo v1.0</span>
            <span className="flex items-center gap-1.5">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"
              />
              Demo &middot; All data stored locally
            </span>
          </div>
        </footer>
      </div>

      <MobileNav role={session.role} />

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh]"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/65 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -16 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg rounded-2xl depth-shadow overflow-hidden liquid-glass"
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[rgba(255,255,255,0.06)]">
                <Search size={15} className="text-[#5F5F75] flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search pages and features..."
                  className="flex-1 bg-transparent text-sm text-[#F2F2F7] placeholder:text-[#5F5F75] outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-[#5F5F75] hover:text-[#F2F2F7] transition-colors">
                    <X size={15} />
                  </button>
                )}
                <kbd>ESC</kbd>
              </div>
              {searchQuery && (
                <div className="max-h-[300px] overflow-y-auto p-2">
                  {filteredSearch.length === 0 ? (
                    <div className="p-5 text-center text-xs text-[#5F5F75]">No results for &ldquo;{searchQuery}&rdquo;</div>
                  ) : (
                    filteredSearch.map((r, i) => (
                      <motion.button
                        key={r.href}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}
                        onClick={() => { router.push(r.href); setSearchOpen(false); setSearchQuery(""); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#9898AE] hover:text-[#F2F2F7] hover:bg-[rgba(255,255,255,0.045)] transition-colors"
                      >
                        <Search size={13} className="text-[#5F5F75]" />
                        {r.label}
                        <span className="ml-auto text-[10px] text-[#5F5F75]">{r.href}</span>
                      </motion.button>
                    ))
                  )}
                </div>
              )}
              {!searchQuery && (
                <div className="px-4 py-3 text-[10.5px] text-[#5F5F75]">
                  Type to search pages, features, and sections...
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Tour */}
      <AnimatePresence>
        {showTour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => { setShowTour(false); setTourSeen(true); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 20 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
              className="relative w-full max-w-md rounded-2xl depth-shadow overflow-hidden liquid-glass p-7"
            >
              <motion.div
                initial={{ scale: 0.7, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", damping: 20, stiffness: 300 }}
                className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center bg-gradient-to-br from-[#4A7CFF] to-[#FF4F7A] shadow-xl shadow-[#4A7CFF]/30"
              >
                <Flame size={30} className="text-white" />
              </motion.div>
              <h2 className="text-xl font-bold text-[#F2F2F7] text-center mb-2">Welcome to Brightburn!</h2>
              <p className="text-sm text-[#9898AE] text-center mb-6 leading-relaxed">{"Here's a quick tour of what you can do"}</p>

              <div className="space-y-2.5">
                {[
                  { icon: Users, title: "Manage Students", desc: "Add, edit, and track all student profiles" },
                  { icon: QrCode, title: "QR Attendance", desc: "Scan QR codes for quick attendance tracking" },
                  { icon: IndianRupee, title: "Fee Management", desc: "Track payments, autopay, and receipts" },
                  { icon: CalendarDays, title: "Schedule Classes", desc: "View and manage your weekly schedule" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <div className="p-1.5 rounded-lg" style={{ background: "rgba(74,124,255,0.10)" }}>
                        <Icon size={15} style={{ color: "#4A7CFF" }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#F2F2F7]">{item.title}</p>
                        <p className="text-xs text-[#5F5F75]">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setShowTour(false); setTourSeen(true); }}
                className="w-full mt-6 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-300 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #4A7CFF, #7C6BFF)" }}
              >
                <span className="relative z-10">Get Started</span>
              </motion.button>
              <button
                onClick={() => { setShowTour(false); setTourSeen(true); }}
                className="w-full mt-2 text-xs text-[#5F5F75] hover:text-[#9898AE] transition-colors py-1"
              >
                {"Don't show again"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
