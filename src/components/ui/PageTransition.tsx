"use client";
import { ReactNode, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  goingDeeper?: boolean;
}

export function PageTransition({ children, className = "", goingDeeper = true }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, x: goingDeeper ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: goingDeeper ? -16 : 16 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className={className}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
