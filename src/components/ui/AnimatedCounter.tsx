"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number | string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  once?: boolean;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1200,
  className = "",
  once = true,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "-40px" });
  const [displayed, setDisplayed] = useState<string>("0");

  // If value is a string with non-numeric chars (e.g. "68%"), display as-is
  const isNumeric = typeof value === "number" || /^\d+\.?\d*$/.test(String(value));
  const numericTarget = isNumeric ? parseFloat(String(value)) : 0;

  useEffect(() => {
    if (!inView) return;

    if (!isNumeric) {
      setDisplayed(String(value));
      return;
    }

    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(String(value));
      return;
    }

    let startTime: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = eased * numericTarget;

      // Format: integer if target is integer, else 1 decimal
      const formatted = Number.isInteger(numericTarget)
        ? Math.round(current).toString()
        : current.toFixed(1);

      setDisplayed(formatted);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, isNumeric, numericTarget, value, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3 }}
    >
      {prefix}{displayed}{suffix}
    </motion.span>
  );
}
