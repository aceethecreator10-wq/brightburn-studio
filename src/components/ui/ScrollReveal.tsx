"use client";
import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "skew" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
  duration?: number;
  once?: boolean;
  /** Index in a stagger sequence (multiplies delay by this index) */
  staggerIndex?: number;
  staggerBase?: number;
}

const getInitial = (dir: RevealDirection) => {
  switch (dir) {
    case "up":    return { opacity: 0, y: 36 };
    case "down":  return { opacity: 0, y: -36 };
    case "left":  return { opacity: 0, x: -36 };
    case "right": return { opacity: 0, x: 36 };
    case "scale": return { opacity: 0, scale: 0.92 };
    case "skew":  return { opacity: 0, y: 24, skewY: 2 };
    case "none":  return { opacity: 0 };
  }
};

const getAnimate = (dir: RevealDirection) => {
  switch (dir) {
    case "up":    return { opacity: 1, y: 0 };
    case "down":  return { opacity: 1, y: 0 };
    case "left":  return { opacity: 1, x: 0 };
    case "right": return { opacity: 1, x: 0 };
    case "scale": return { opacity: 1, scale: 1 };
    case "skew":  return { opacity: 1, y: 0, skewY: 0 };
    case "none":  return { opacity: 1 };
  }
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = true,
  staggerIndex,
  staggerBase = 0.07,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-50px" });

  const computedDelay = delay + (staggerIndex !== undefined ? staggerIndex * staggerBase : 0);

  return (
    <motion.div
      ref={ref}
      initial={getInitial(direction)}
      animate={inView ? getAnimate(direction) : getInitial(direction)}
      transition={{
        duration,
        delay: computedDelay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stagger Grid ─── */
export function StaggerGrid({
  children,
  className = "",
  staggerDelay = 0.06,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
        hidden: {},
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export const staggerItemLeft = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const staggerItemScale = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

/* ─── Word-by-word stagger headline ─── */
export function WordReveal({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.07,
  duration = 0.65,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}) {
  const words = text.split(" ");
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <span ref={ref} className={`inline ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={`inline-block mr-[0.22em] ${wordClassName}`}
          initial={{ opacity: 0, y: 22, skewY: 2 }}
          animate={inView ? { opacity: 1, y: 0, skewY: 0 } : {}}
          transition={{
            duration,
            delay: delay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          aria-hidden="true"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Parallax image wrapper ─── */
export function ParallaxImage({
  children,
  className = "",
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div style={{ willChange: "transform" }}>
        {children}
      </motion.div>
    </div>
  );
}
