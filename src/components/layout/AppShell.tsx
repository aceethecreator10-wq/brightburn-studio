"use client";
import { ReactNode, useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar, MobileNav } from "./Sidebar";
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

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050507" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-[#4A7CFF] border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-[#FF6B6B] border-b-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s", opacity: 0.5 }} />
          </div>
          <p className="text-sm text-[#B6B6C2] animate-pulse-soft">Loading Brightburn...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const pageTitle = Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] ?? "Dashboard";
  const unreadCount = notifications.filter(n => !n.read && n.userId === session.userId).length;
  const userNotifs = notifications.filter(n => n.userId === session.userId).slice(-10);

  const markAllRead = () => {
    const updated = notifications.map(n => n.userId === session.userId ? { ...n, read: true } : n);
    setNotifications(updated);
    setNotifs(updated);
  };

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
    <div className="min-h-screen flex" style={{ background: "#050507" }}>
      <div className="hidden md:block h-screen sticky top-0 flex-shrink-0 z-30">
        <Sidebar role={session.role} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50"
            >
              <Sidebar role={session.role} collapsed={false} onToggle={() => setMobileOpen(false)} onMobileClose={() => setMobileOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0 overflow-hidden">
        <header className="sticky top-0 z-20 glass-nav">
          <div className="flex items-center justify-between h-16 px-5 lg:px-7">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg md:hidden hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                style={{ color: "#B6B6C2" }}
              >
                <Menu size={20} />
              </button>
              <motion.h1
                key={pageTitle}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-base font-semibold text-[#FAFAFA] tracking-tight"
              >
                {pageTitle}
              </motion.h1>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-[rgba(74,124,255,0.12)] text-[#4A7CFF] border border-[rgba(74,124,255,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A7CFF] animate-pulse-soft" />
                Demo
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all glass-card border-none"
              >
                <Search size={14} className="text-[#737380]" />
                <span className="text-xs text-[#737380]">Search...</span>
                <kbd>⌘K</kbd>
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                style={{ color: "#B6B6C2" }}
              >
                <Search size={18} />
              </button>

              <div className="relative" ref={notifRef}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setNotifOpen(!notifOpen); setAccountOpen(false); }}
                  className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors relative"
                  style={{ color: "#B6B6C2" }}
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-[#4A7CFF] to-[#FF6B6B] text-[8px] font-bold text-white flex items-center justify-center shadow-lg"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </motion.span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-80 rounded-2xl depth-shadow overflow-hidden z-50 liquid-glass"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                        <span className="text-sm font-semibold text-[#FAFAFA]">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-[10px] font-medium text-[#4A7CFF] hover:text-[#e65e00]">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-[320px] overflow-y-auto">
                        {userNotifs.length === 0 ? (
                          <div className="p-6 text-center text-xs text-[#737380]">No notifications</div>
                        ) : (
                          userNotifs.reverse().map(n => {
                            const Icon = notifIcons[n.type] || Bell;
                            return (
                              <motion.div
                                key={n.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-start gap-3 px-4 py-3 transition-all hover:bg-[rgba(255,255,255,0.04)] cursor-pointer"
                                style={{ opacity: n.read ? 0.6 : 1 }}
                                onClick={() => {
                                  const updated = notifications.map(x => x.id === n.id ? { ...x, read: true } : x);
                                  setNotifications(updated);
                                  setNotifs(updated);
                                }}
                              >
                                <div className="p-1.5 rounded-lg mt-0.5 flex-shrink-0" style={{
                                  background: n.read ? "rgba(255,255,255,0.04)" : "rgba(74,124,255,0.12)",
                                }}>
                                  <Icon size={14} style={{ color: n.read ? "#737380" : "#4A7CFF" }} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium text-[#FAFAFA] truncate">{n.title}</p>
                                  <p className="text-[10px] text-[#737380] mt-0.5 line-clamp-2">{n.message}</p>
                                  <p className="text-[9px] text-[#737380] mt-1">{new Date(n.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                                </div>
                                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#4A7CFF] flex-shrink-0 mt-1.5" />}
                              </motion.div>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative" ref={accountRef}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setAccountOpen(!accountOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2 pl-2 border-l py-1 border-[rgba(255,255,255,0.06)]"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4A7CFF] to-[#FF6B6B] flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    {session.userName?.charAt(0) ?? "U"}
                  </div>
                  <span className="hidden sm:block text-sm text-[#FAFAFA] font-medium max-w-[100px] truncate">{session.userName}</span>
                  <ChevronDown size={12} className="text-[#737380] hidden sm:block" />
                </motion.button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-2xl depth-shadow overflow-hidden z-50 glass-card"
                    >
                      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                        <p className="text-sm font-medium text-[#FAFAFA] truncate">{session.userName}</p>
                        <p className="text-[10px] text-[#737380] capitalize">{session.role}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { router.push("/profile"); setAccountOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[#B6B6C2] hover:text-[#FAFAFA] hover:bg-[rgba(255,255,255,0.04)]"
                        >
                          <User size={14} /> Profile
                        </button>
                        <button
                          onClick={() => { clearSession(); router.push("/"); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[#EF4444] hover:bg-[rgba(239,68,68,0.08)]"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex-1 p-6 lg:p-8 xl:p-10 overflow-auto"
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </motion.main>

        <footer className="hidden md:block border-t border-[rgba(255,255,255,0.04)] py-3 px-6">
          <div className="flex items-center justify-between text-[10px] text-[#737380]">
            <span>Brightburn Dance & Fitness Studio &mdash; Demo v1.0</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse-soft" />
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
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
              className="relative w-full max-w-lg rounded-2xl depth-shadow overflow-hidden glass-card"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                <Search size={16} className="text-[#737380]" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search pages and features..."
                  className="flex-1 bg-transparent text-sm text-[#FAFAFA] placeholder:text-[#737380] outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-[#737380] hover:text-[#FAFAFA]">
                    <X size={16} />
                  </button>
                )}
                <kbd>ESC</kbd>
              </div>
              {searchQuery && (
                <div className="max-h-[300px] overflow-y-auto p-2">
                  {filteredSearch.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#737380]">No results found</div>
                  ) : (
                    filteredSearch.map(r => (
                      <button
                        key={r.href}
                        onClick={() => { router.push(r.href); setSearchOpen(false); setSearchQuery(""); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#B6B6C2] hover:text-[#FAFAFA] hover:bg-[rgba(255,255,255,0.04)]"
                      >
                        <Search size={14} className="text-[#737380]" />
                        {r.label}
                        <span className="ml-auto text-[10px] text-[#737380]">{r.href}</span>
                      </button>
                    ))
                  )}
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
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setShowTour(false); setTourSeen(true); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md rounded-2xl depth-shadow overflow-hidden glass-card p-6"
            >
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-[#4A7CFF] to-[#FF6B6B] shadow-lg shadow-[#4A7CFF]/25">
                <Flame size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#FAFAFA] text-center mb-2">Welcome to Brightburn!</h2>
              <p className="text-sm text-[#B6B6C2] text-center mb-6">Here&apos;s a quick tour of what you can do</p>

              <div className="space-y-3">
                {[
                  { icon: Users, title: "Manage Students", desc: "Add, edit, and track all student profiles" },
                  { icon: QrCode, title: "QR Attendance", desc: "Scan QR codes for quick attendance tracking" },
                  { icon: IndianRupee, title: "Fee Management", desc: "Track payments, autopay, and receipts" },
                  { icon: CalendarDays, title: "Schedule Classes", desc: "View and manage your weekly schedule" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.04)]">
                      <div className="p-1.5 rounded-lg bg-[rgba(74,124,255,0.1)]">
                        <Icon size={16} style={{ color: "#4A7CFF" }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#FAFAFA]">{item.title}</p>
                        <p className="text-xs text-[#737380]">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => { setShowTour(false); setTourSeen(true); }}
                className="w-full mt-6 rounded-xl py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#4A7CFF] to-[#FF6B6B] hover:shadow-lg hover:shadow-[#4A7CFF]/25 transition-all duration-300"
              >
                Get Started
              </button>
              <button
                onClick={() => { setShowTour(false); setTourSeen(true); }}
                className="w-full mt-2 text-xs text-[#737380] hover:text-[#B6B6C2]"
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
