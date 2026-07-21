"use client";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  return (
    <aside
      className="h-full flex flex-col border-r transition-all duration-300 glass-sidebar"
      style={{
        width: collapsed ? "72px" : "256px",
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <div
        className={`flex items-center h-16 border-b flex-shrink-0 ${collapsed ? "justify-center px-0" : "px-4"}`}
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#4A7CFF] to-[#FF6B6B] flex-shrink-0 shadow-lg shadow-[#4A7CFF]/20">
              <Flame size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#FAFAFA] truncate">Brightburn</p>
              <p className="text-[10px] text-[#4A7CFF] font-medium uppercase tracking-wider truncate">{role}</p>
            </div>
          </div>
        )}
        {!collapsed && (
          <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[#737380] hover:text-[#FAFAFA] transition-all flex-shrink-0">
            <ChevronLeft size={14} />
          </button>
        )}
        {collapsed && (
          <div className="flex flex-col items-center">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#4A7CFF] to-[#FF6B6B] mb-2 shadow-lg shadow-[#4A7CFF]/20">
              <Flame size={16} className="text-white" />
            </div>
            <button onClick={onToggle} className="p-1 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[#737380] hover:text-[#FAFAFA] transition-all">
              <ChevronLeft size={14} className="rotate-180" />
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 overflow-y-auto scrollbar-thin">
        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#737380]">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5 mt-1">
              {group.items.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <motion.button
                    key={link.href}
                    initial={false}
                    whileHover={{ x: 2, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      router.push(link.href);
                      onMobileClose?.();
                    }}
                    className={`w-full flex items-center rounded-lg text-sm transition-all duration-200 ${
                      collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3 py-2"
                    }`}
                    style={{
                      background: active
                        ? "linear-gradient(135deg, rgba(74,124,255,0.12) 0%, rgba(255,107,107,0.08) 100%)"
                        : "transparent",
                      color: active ? "#4A7CFF" : "#A1A1AA",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = "transparent";
                    }}
                    title={collapsed ? link.label : undefined}
                  >
                    {active && (
                      <motion.span
                        layoutId="activeSidebar"
                        className="absolute left-0 w-0.5 h-5 rounded-r-full bg-gradient-to-b from-[#4A7CFF] to-[#FF6B6B]"
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      />
                    )}
                    <link.icon size={17} className="flex-shrink-0" />
                    {!collapsed && (
                      <span className="font-medium text-left flex-1">{link.label}</span>
                    )}
                    {!collapsed && link.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[rgba(74,124,255,0.15)] text-[#4A7CFF]">
                        {link.badge}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-2 border-t flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <motion.button
          whileHover={{ x: collapsed ? 0 : 2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className={`w-full flex items-center rounded-lg text-sm text-[#737380] hover:text-[#EF4444] transition-all ${
            collapsed ? "justify-center h-10" : "gap-3 px-3 py-2.5"
          }`}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </motion.button>
      </div>
    </aside>
  );
}

export function MobileNav({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const groups = navGroups[role] ?? [];
  const allLinks = groups.flatMap(g => g.items);
  const primary = allLinks.slice(0, 5);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t glass-nav"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center justify-around px-2 py-1">
        {primary.map((link) => {
          const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <motion.button
              key={link.href}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push(link.href)}
              className="flex flex-col items-center gap-0.5 py-2 px-3 text-[10px] transition-all relative"
              style={{ color: active ? "#4A7CFF" : "#737380" }}
            >
              {active && (
                <motion.span
                  layoutId="activeMobileNav"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-[#4A7CFF] to-[#FF6B6B]"
                />
              )}
              <Icon size={18} />
              <span className="font-medium">{link.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
