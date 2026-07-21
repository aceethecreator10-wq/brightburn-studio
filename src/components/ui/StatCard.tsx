"use client";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  accent?: string;
}

export function StatCard({ title, value, icon, trend, trendUp, accent = "#4A7CFF" }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 spotlight-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[#B6B6C2] text-xs font-medium uppercase tracking-wider">{title}</p>
          <p className="text-[#FAFAFA] text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trendUp ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl glass-card border-none" style={{ boxShadow: `0 0 20px ${accent}15` }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
