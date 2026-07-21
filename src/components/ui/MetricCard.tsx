"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  accent?: "blue" | "red" | "gold" | "green" | "indigo" | "purple" | "orange";
  subtitle?: string;
  delay?: number;
}

const accentColors = {
  orange: { bg: "rgba(74,124,255,0.12)", icon: "#4A7CFF", border: "rgba(74,124,255,0.3)", glow: "rgba(74,124,255,0.15)" },
  blue: { bg: "rgba(74,124,255,0.12)", icon: "#4A7CFF", border: "rgba(74,124,255,0.3)", glow: "rgba(74,124,255,0.15)" },
  red: { bg: "rgba(255,107,107,0.12)", icon: "#FF6B6B", border: "rgba(255,107,107,0.3)", glow: "rgba(255,107,107,0.15)" },
  gold: { bg: "rgba(255,217,61,0.12)", icon: "#FFD93D", border: "rgba(255,217,61,0.3)", glow: "rgba(255,217,61,0.15)" },
  green: { bg: "rgba(34,197,94,0.12)", icon: "#22C55E", border: "rgba(34,197,94,0.3)", glow: "rgba(34,197,94,0.15)" },
  indigo: { bg: "rgba(59,130,246,0.12)", icon: "#3B82F6", border: "rgba(59,130,246,0.3)", glow: "rgba(59,130,246,0.15)" },
  purple: { bg: "rgba(124,107,255,0.12)", icon: "#7C6BFF", border: "rgba(124,107,255,0.3)", glow: "rgba(124,107,255,0.15)" },
};

export function MetricCard({ title, value, icon, trend, trendUp, accent = "blue", subtitle, delay = 0 }: MetricCardProps) {
  const c = accentColors[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="glass-card rounded-2xl p-5"
      style={{ "--card-glow": c.glow } as React.CSSProperties}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-[#B6B6C2] uppercase tracking-wider truncate">{title}</p>
          <p className="text-2xl font-bold text-[#FAFAFA] mt-2 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-[#737380] mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-xs mt-2 flex items-center gap-1.5 ${trendUp ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d={trendUp ? "M1 7L5 3L9 7" : "M1 3L5 7L9 3"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {trend}
            </p>
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="p-3 rounded-xl flex-shrink-0 backdrop-blur-sm"
          style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.icon }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
}
