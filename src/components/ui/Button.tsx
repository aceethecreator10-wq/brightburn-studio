"use client";
import { ReactNode, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "glass";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  const base = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none relative overflow-hidden";
  const sizes = {
    sm: "px-4 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3 text-base gap-2"
  };
  const variants = {
    primary:
      "bg-gradient-to-r from-[#4A7CFF] to-[#7C6BFF] text-white shadow-lg shadow-[#4A7CFF]/25 hover:shadow-[#4A7CFF]/45 hover:shadow-xl",
    secondary:
      "bg-[#FF6B6B] text-white shadow-lg shadow-[#FF6B6B]/20 hover:shadow-[#FF6B6B]/35 hover:shadow-xl",
    outline:
      "border border-[rgba(255,255,255,0.18)] text-[var(--text-primary)] hover:bg-[rgba(74,124,255,0.12)] hover:border-[#4A7CFF] active:bg-[rgba(74,124,255,0.18)]",
    ghost:
      "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.08)] active:bg-[rgba(255,255,255,0.12)]",
    danger:
      "bg-[#EF4444] text-white shadow-lg shadow-[#EF4444]/20 hover:shadow-[#EF4444]/35",
    success:
      "bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20 hover:shadow-[#22C55E]/35",
    glass:
      "bg-[rgba(74,124,255,0.08)] backdrop-blur-xl border border-[rgba(74,124,255,0.18)] text-[var(--text-primary)] hover:bg-[rgba(74,124,255,0.14)] hover:border-[#4A7CFF] active:bg-[rgba(74,124,255,0.2)]",
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setSpot({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
      }}
      {...props}
    >
      <span
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
        }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
