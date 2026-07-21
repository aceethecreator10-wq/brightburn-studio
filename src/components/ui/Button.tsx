"use client";
import { ReactNode, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "glass" | "energy";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  id?: string;
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
  const [isHovered, setIsHovered] = useState(false);

  const base =
    "inline-flex items-center justify-center font-semibold tracking-[-0.01em] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7CFF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] disabled:opacity-50 disabled:cursor-not-allowed select-none relative overflow-hidden rounded-xl";

  const sizes = {
    sm: "px-4 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-[0.94rem] gap-2.5",
  };

  const variants = {
    primary:
      "bg-gradient-to-r from-[#3D6EF0] via-[#4A7CFF] to-[#6B8FFF] text-white shadow-lg shadow-[#4A7CFF]/20 hover:shadow-[#4A7CFF]/40 hover:shadow-xl",
    secondary:
      "bg-gradient-to-r from-[#FF4F7A] to-[#FF7A50] text-white shadow-lg shadow-[#FF4F7A]/20 hover:shadow-[#FF4F7A]/40 hover:shadow-xl",
    energy:
      "bg-gradient-to-r from-[#FF4F7A] via-[#FF7A50] to-[#F0C040] text-white shadow-lg shadow-[#FF4F7A]/20 hover:shadow-[#FF4F7A]/40 hover:shadow-xl",
    outline:
      "border border-[rgba(255,255,255,0.16)] text-[var(--text-primary)] hover:bg-[rgba(74,124,255,0.10)] hover:border-[rgba(74,124,255,0.5)] active:bg-[rgba(74,124,255,0.16)]",
    ghost:
      "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.06)] active:bg-[rgba(255,255,255,0.10)]",
    danger:
      "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white shadow-lg shadow-[#EF4444]/20 hover:shadow-[#EF4444]/35",
    success:
      "bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white shadow-lg shadow-[#22C55E]/20 hover:shadow-[#22C55E]/35",
    glass:
      "bg-[rgba(74,124,255,0.07)] backdrop-blur-xl border border-[rgba(74,124,255,0.16)] text-[var(--text-primary)] hover:bg-[rgba(74,124,255,0.13)] hover:border-[rgba(74,124,255,0.35)]",
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...props}
    >
      {/* Magnetic spotlight */}
      <span
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(255,255,255,0.14) 0%, transparent 60%)`,
        }}
      />
      {/* Shimmer sweep on hover */}
      {(variant === "primary" || variant === "energy" || variant === "secondary") && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          initial={{ x: "-110%", skewX: "-15deg" }}
          animate={isHovered ? { x: "110%" } : { x: "-110%" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
          }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
