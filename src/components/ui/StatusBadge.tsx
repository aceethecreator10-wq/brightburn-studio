"use client";
import { ReactNode } from "react";

type BadgeVariant = "success" | "danger" | "warning" | "info" | "neutral" | "gold" | "orange";

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string }> = {
  success: { bg: "rgba(34,197,94,0.12)", text: "#22C55E", border: "rgba(34,197,94,0.25)", dot: "#22C55E" },
  danger: { bg: "rgba(239,68,68,0.12)", text: "#EF4444", border: "rgba(239,68,68,0.25)", dot: "#EF4444" },
  warning: { bg: "rgba(245,158,11,0.12)", text: "#F59E0B", border: "rgba(245,158,11,0.25)", dot: "#F59E0B" },
  info: { bg: "rgba(59,130,246,0.12)", text: "#3B82F6", border: "rgba(59,130,246,0.25)", dot: "#3B82F6" },
  neutral: { bg: "rgba(161,161,170,0.08)", text: "#A1A1AA", border: "rgba(161,161,170,0.15)", dot: "#A1A1AA" },
  gold: { bg: "rgba(255,217,61,0.12)", text: "#FFD93D", border: "rgba(255,217,61,0.25)", dot: "#FFD93D" },
  orange: { bg: "rgba(74,124,255,0.12)", text: "#4A7CFF", border: "rgba(74,124,255,0.25)", dot: "#4A7CFF" },
};

interface StatusBadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ variant = "neutral", children, dot = true, className = "" }: StatusBadgeProps) {
  const s = variantStyles[variant];
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

const feeStatusMap: Record<string, BadgeVariant> = {
  paid: "success",
  due: "warning",
  overdue: "danger",
  first_payment_pending: "orange",
  first_payment_received: "gold",
};

export function FeeStatusBadge({ status }: { status: string }) {
  const variant = feeStatusMap[status] ?? "neutral";
  const labels: Record<string, string> = {
    paid: "Paid",
    due: "Due",
    overdue: "Overdue",
    first_payment_pending: "1st Payment",
    first_payment_received: "1st Received",
  };
  return <StatusBadge variant={variant}>{labels[status] ?? status}</StatusBadge>;
}

export function AttendanceStatusBadge({ status }: { status: string }) {
  return (
    <StatusBadge variant={status === "present" ? "success" : "danger"}>
      {status === "present" ? "Present" : "Absent"}
    </StatusBadge>
  );
}
