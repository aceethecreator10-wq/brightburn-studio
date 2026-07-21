"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface InsightCardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  delay?: number;
}

export function InsightCard({ children, className = "", padding = true, delay = 0 }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`glass-card rounded-2xl ${padding ? "p-5" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
