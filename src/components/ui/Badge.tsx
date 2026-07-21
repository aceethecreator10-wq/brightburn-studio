"use client";
import { ReactNode } from "react";

interface BadgeProps {
  variant?: "success" | "danger" | "warning" | "info" | "neutral" | "gold";
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  success: { bg: "rgba(34,197,94,0.12)", text: "#22C55E", border: "rgba(34,197,94,0.25)", dot: "#22C55E" },
  danger: { bg: "rgba(239,68,68,0.12)", text: "#EF4444", border: "rgba(239,68,68,0.25)", dot: "#EF4444" },
  warning: { bg: "rgba(245,158,11,0.12)", text: "#F59E0B", border: "rgba(245,158,11,0.25)", dot: "#F59E0B" },
  info: { bg: "rgba(59,130,246,0.12)", text: "#3B82F6", border: "rgba(59,130,246,0.25)", dot: "#3B82F6" },
  neutral: { bg: "rgba(161,161,170,0.08)", text: "#A1A1AA", border: "rgba(161,161,170,0.15)", dot: "#A1A1AA" },
  gold: { bg: "rgba(255,217,61,0.12)", text: "#FFD93D", border: "rgba(255,217,61,0.25)", dot: "#FFD93D" },
};

export function Badge({ variant = "neutral", children, className = "", dot = false }: BadgeProps) {
  const s = variantStyles[variant] ?? variantStyles.neutral;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />}
      {children}
    </span>
  );
}

export function AttendanceBadge({ status }: { status: string }) {
  return (
    <Badge variant={status === "present" ? "success" : "danger"} dot>
      {status === "present" ? "Present" : "Absent"}
    </Badge>
  );
}

export function FeeStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: "success" | "danger" | "warning" | "info" | "neutral" | "gold"; label: string }> = {
    paid: { variant: "success", label: "Paid" },
    due: { variant: "warning", label: "Due" },
    overdue: { variant: "danger", label: "Overdue" },
    first_payment_pending: { variant: "info", label: "1st Payment" },
    first_payment_received: { variant: "gold", label: "1st Received" },
  };
  const config = map[status] ?? { variant: "neutral" as const, label: status };
  return <Badge variant={config.variant} dot>{config.label}</Badge>;
}
