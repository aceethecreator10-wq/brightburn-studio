"use client";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function DashboardCard({ title, children, action, className = "" }: DashboardCardProps) {
  return (
    <div className={`glass-card rounded-2xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-[#B6B6C2] uppercase tracking-wider">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
