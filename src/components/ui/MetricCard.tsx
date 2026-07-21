"use client";
import { ReactNode, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  accent?: "blue" | "red" | "gold" | "green" | "indigo" | "purple" | "orange" | "energy";
  subtitle?: string;
  delay?: number;
  animateValue?: boolean;
}

const accentColors = {
  orange: { bg: "rgba(74,124,255,0.10)", icon: "#4A7CFF", border: "rgba(74,124,255,0.28)", glow: "rgba(74,124,255,0.15)" },
  blue:   { bg: "rgba(74,124,255,0.10)", icon: "#4A7CFF", border: "rgba(74,124,255,0.28)", glow: "rgba(74,124,255,0.15)" },
  red:    { bg: "rgba(255,79,122,0.10)", icon: "#FF4F7A", border: "rgba(255,79,122,0.28)", glow: "rgba(255,79,122,0.15)" },
  gold:   { bg: "rgba(240,192,64,0.10)", icon: "#F0C040", border: "rgba(240,192,64,0.28)", glow: "rgba(240,192,64,0.15)" },
  green:  { bg: "rgba(34,197,94,0.10)",  icon: "#22C55E", border: "rgba(34,197,94,0.28)",  glow: "rgba(34,197,94,0.15)" },
  indigo: { bg: "rgba(59,130,246,0.10)", icon: "#3B82F6", border: "rgba(59,130,246,0.28)", glow: "rgba(59,130,246,0.15)" },
  purple: { bg: "rgba(124,107,255,0.10)",icon: "#7C6BFF", border: "rgba(124,107,255,0.28)",glow: "rgba(124,107,255,0.15)" },
  energy: { bg: "rgba(255,79,122,0.10)", icon: "#FF4F7A", border: "rgba(255,79,122,0.28)", glow: "rgba(255,79,122,0.15)" },
};

export function MetricCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  accent = "blue",
  subtitle,
  delay = 0,
  animateValue = true,
}: MetricCardProps) {
  const c = accentColors[accent];
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 5, y: dx * 5 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5 }}
      style={{
        rotateX: hovered ? tilt.x : 0,
        rotateY: hovered ? tilt.y : 0,
        transformStyle: "preserve-3d",
        perspective: 800,
        boxShadow: hovered
          ? `var(--shadow-glass), 0 0 32px ${c.glow}`
          : "none",
        transition: "box-shadow 0.35s ease",
      }}
      className="glass-card rounded-2xl p-5 cursor-default"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10.5px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.12em] truncate mb-2">
            {title}
          </p>
          <p className="text-[1.65rem] font-bold text-[var(--text-primary)] tracking-[-0.03em] leading-none">
            {animateValue ? (
              <AnimatedCounter value={value} duration={1100} />
            ) : (
              <span>{value}</span>
            )}
          </p>
          {subtitle && (
            <p className="text-[11px] text-[var(--text-muted)] mt-1.5 leading-snug">{subtitle}</p>
          )}
          {trend && (
            <motion.p
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`text-xs mt-2.5 flex items-center gap-1.5 font-medium ${trendUp ? "text-[#22C55E]" : "text-[#FF4F7A]"}`}
            >
              <motion.svg
                width="10" height="10" viewBox="0 0 10 10" fill="none"
                initial={{ y: trendUp ? 3 : -3 }}
                animate={{ y: 0 }}
                transition={{ delay: delay + 0.35, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <path
                  d={trendUp ? "M1 7L5 3L9 7" : "M1 3L5 7L9 3"}
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </motion.svg>
              {trend}
            </motion.p>
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.12, rotate: 8 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="p-3 rounded-xl flex-shrink-0"
          style={{
            background: c.bg,
            border: `1px solid ${c.border}`,
            color: c.icon,
            boxShadow: `0 0 0 0px ${c.glow}`,
          }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
}
