"use client";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, BarChart3, IndianRupee, Megaphone, Settings, LogOut, ChevronLeft,
  Layers, QrCode, Cpu, GraduationCap, UserCheck, Scan, Flame,
  CalendarDays, UserPlus, MessageSquare, FileText, CreditCard, User,
  TrendingUp,
} from "lucide-react";
import { clearSession } from "@/lib/storage";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; badge?: number };

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: Record<string, NavGroup[]> = {
  admin: [
    {
      label: "Operations",
      items: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/students", label: "Students", icon: Users },
        { href: "/admin/batches", label: "Batches", icon: Layers },
        { href: "/admin/schedule", label: "Schedule", icon: CalendarDays },
        { href: "/admin/attendance", label: "Attendance", icon: QrCode },
        { href: "/admin/admissions", label: "Admissions", icon: UserPlus },
        { href: "/admin/leads", label: "Leads / Growth", icon: TrendingUp },
      ],
    },
    {
      label: "Finance",
      items: [
        { href: "/admin/fees", label: "Fees", icon: IndianRupee },
        { href: "/admin/reports", label: "Reports", icon: BarChart3 },
      ],
    },
    {
      label: "Communication",
      items: [
        { href: "/admin/notices", label: "Notices", icon: Megaphone },
        { href: "/admin/support", label: "Support", icon: MessageSquare },
      ],
    },
    {
      label: "System",
      items: [
        { href: "/admin/id-card", label: "ID Cards", icon: CreditCard },
        { href: "/admin/documents", label: "Documents", icon: FileText },
        { href: "/admin/settings", label: "Settings", icon: Settings },
        { href: "/profile", label: "Profile", icon: User },
      ],
    },
  ],
  developer: [
    {
      label: "General",
      items: [
        { href: "/developer", label: "System", icon: Cpu },
        { href: "/developer/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/profile", label: "Profile", icon: User },
      ],
    },
  ],
  parent: [
    {
      label: "General",
      items: [
        { href: "/parent", label: "Dashboard", icon: UserCheck },
        { href: "/parent/payments", label: "Payments", icon: IndianRupee },
        { href: "/profile", label: "Profile", icon: User },
      ],
    },
  ],
  student: [
    {
      label: "General",
      items: [
        { href: "/student", label: "Dashboard", icon: GraduationCap },
        { href: "/student/scan", label: "Scan QR", icon: Scan },
        { href: "/profile", label: "Profile", icon: User },
      ],
    },
  ],
};

interface SidebarProps {
  role: string;
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
}

export function Sidebar({ role, collapsed, onToggle, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const groups = navGroups[role] ?? [];

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href) && href !== "/admin" || pathname === href);

  // More precise active check for root routes
  const isActiveStrict = (href: string) => {
    if (href === "/admin" || href === "/developer" || href === "/parent" || href === "/student") {
      return pathname === href;
    }
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="h-full flex flex-col glass-sidebar overflow-hidden"
      style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Logo Header */}
      <div
        className="flex items-center h-16 border-b flex-shrink-0 px-3"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Flame with subtle oscillation */}
          <motion.div
            animate={{ rotate: [0, -4, 4, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            className="p-1.5 rounded-lg bg-gradient-to-br from-[#4A7CFF] to-[#FF4F7A] flex-shrink-0 shadow-lg shadow-[#4A7CFF]/20"
          >
            <Flame size={16} className="text-white" />
          </motion.div>

          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                key="logo-text"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="min-w-0"
              >
                <p className="text-[13px] font-bold text-[#FAFAFA] tracking-tight truncate">Brightburn</p>
                <p className="text-[9.5px] text-[#4A7CFF] font-semibold uppercase tracking-[0.12em] truncate capitalize">{role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#5F5F75] hover:text-[#FAFAFA] transition-colors flex-shrink-0"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
            <ChevronLeft size={14} />
          </motion.div>
        </motion.button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {groups.map((group, gi) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4"
          >
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="px-3 pt-1 pb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#5F5F75]"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="space-y-0.5">
              {group.items.map((link, idx) => {
                const active = isActiveStrict(link.href);
                const Icon = link.icon;
                return (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: gi * 0.04 + idx * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ x: collapsed ? 0 : 3, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      router.push(link.href);
                      onMobileClose?.();
                    }}
                    className={`relative w-full flex items-center rounded-xl text-sm transition-colors duration-200 ${
                      collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3 py-2.5"
                    }`}
                    style={{
                      background: active
                        ? "linear-gradient(135deg, rgba(74,124,255,0.14) 0%, rgba(124,107,255,0.08) 100%)"
                        : "transparent",
                      color: active ? "#4A7CFF" : "#9898AE",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.045)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                    title={collapsed ? link.label : undefined}
                  >
                    {/* Sliding active pill (Framer Layout) */}
                    {active && (
                      <motion.span
                        layoutId="sidebar-active-pill"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full"
                        style={{
                          background: "linear-gradient(180deg, #4A7CFF 0%, #7C6BFF 100%)",
                          boxShadow: "0 0 8px rgba(74,124,255,0.6)",
                        }}
                        transition={{ type: "spring", damping: 26, stiffness: 340 }}
                      />
                    )}

                    <Icon size={17} className="flex-shrink-0" />

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="font-medium text-left flex-1 text-[13px]"
                        >
                          {link.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {!collapsed && link.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[rgba(74,124,255,0.14)] text-[#4A7CFF]">
                        {link.badge}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="p-2 border-t flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <motion.button
          whileHover={{ x: collapsed ? 0 : 3, transition: { duration: 0.18 } }}
          whileTap={{ scale: 0.96 }}
          onClick={handleLogout}
          className={`w-full flex items-center rounded-xl text-sm text-[#5F5F75] hover:text-[#FF4F7A] transition-colors ${
            collapsed ? "justify-center h-10" : "gap-3 px-3 py-2.5"
          }`}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,79,122,0.07)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <LogOut size={17} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-[13px] font-medium"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}

/* ─── Mobile Bottom Nav ─── */
export function MobileNav({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const groups = navGroups[role] ?? [];
  const allLinks = groups.flatMap((g) => g.items);
  const primary = allLinks.slice(0, 5);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t glass-nav"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center justify-around px-1 py-1">
        {primary.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/" && pathname.startsWith(link.href) && link.href.length > 1);
          const Icon = link.icon;
          return (
            <motion.button
              key={link.href}
              whileTap={{ scale: 0.88 }}
              onClick={() => router.push(link.href)}
              className="relative flex flex-col items-center gap-0.5 py-2 px-3 text-[9.5px] transition-colors"
              style={{ color: active ? "#4A7CFF" : "#737380" }}
            >
              {active && (
                <motion.span
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #4A7CFF, #7C6BFF)",
                    boxShadow: "0 0 6px rgba(74,124,255,0.7)",
                  }}
                  transition={{ type: "spring", damping: 26, stiffness: 340 }}
                />
              )}
              <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
              <span className="font-semibold">{link.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
