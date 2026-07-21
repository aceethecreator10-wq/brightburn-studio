"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Flame, QrCode, Bell, Dumbbell, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

const highlights = [
  { icon: Users,    label: "Active batches",  desc: "Structured programs for all ages" },
  { icon: QrCode,   label: "QR attendance",   desc: "Instant check-in & tracking" },
  { icon: Bell,     label: "Parent updates",  desc: "Real-time progress notifications" },
  { icon: Dumbbell, label: "Fitness + dance", desc: "Dual-program curriculum" },
];

const tags = ["Structured Batches", "QR Attendance", "Parent Dashboard", "Progress Tracking"];

export function LandingHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Background moves slower than content = depth
  const bgY       = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY  = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const cardY     = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax background layer */}
      <motion.div
        style={{ y: bgY, opacity: heroOpacity }}
        className="absolute inset-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#4A7CFF]/6 via-transparent to-[#07070C]" />
        <div className="floating-orb w-[700px] h-[700px] bg-[#4A7CFF]/7 top-[-15%] left-[-10%]" style={{ animationDuration: "20s" }} />
        <div className="floating-orb w-[500px] h-[500px] bg-[#FF4F7A]/5 bottom-[-15%] right-[-8%]" style={{ animationDuration: "24s" }} />
        <div className="floating-orb w-[380px] h-[380px] bg-[#7C6BFF]/4 top-[35%] right-[15%]" style={{ animationDuration: "28s" }} />
        <div className="floating-orb w-[280px] h-[280px] bg-[#F0C040]/3 bottom-[30%] left-[10%]" style={{ animationDuration: "22s" }} />
      </motion.div>

      {/* Parallax content — moves at 14% vs bg 30% = depth layering */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 will-change-transform"
      >
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left — text content */}
          <div className="lg:col-span-7 space-y-10">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-10 bg-gradient-to-r from-[#4A7CFF] to-transparent" />
              <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#4A7CFF]">
                Brightburn Studio
              </span>
            </motion.div>

            {/* Headline — word stagger with skewY unwind */}
            <h1
              className="text-5xl sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] leading-[0.93] tracking-[-0.04em]"
              aria-label="Dance. Fitness. Discipline."
            >
              {[
                { word: "Dance.", delay: 0.08 },
                { word: "Fitness.", delay: 0.2 },
                { word: "Discipline.", delay: 0.32 },
              ].map(({ word, delay }, i) => (
                <motion.span
                  key={word}
                  className={`block ${i === 1 ? "text-gradient-primary" : "text-[#F2F2F7]"}`}
                  initial={{ opacity: 0, y: 40, skewY: 3 }}
                  animate={{ opacity: 1, y: 0, skewY: 0 }}
                  transition={{ delay, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  aria-hidden="true"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl text-[#9898AE] max-w-xl leading-[1.7]"
            >
              A modern dance and fitness studio built for students who want
              confidence, energy, and growth.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3"
            >
              <Button size="lg" variant="energy" onClick={() => scrollTo("inquiry")}>
                <Sparkles size={15} />
                Start Your Journey
              </Button>
              <Button variant="glass" size="lg" onClick={() => scrollTo("classes")}>
                View Programs <ArrowRight size={15} />
              </Button>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.88 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-[#5F5F75]"
            >
              {tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="w-1 h-1 rounded-full bg-[#4A7CFF]" />
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Right — floating card (moves slower than text for parallax depth) */}
          <motion.div
            style={{ y: cardY }}
            className="lg:col-span-5 hidden lg:block will-change-transform"
          >
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Glow halo */}
              <div className="absolute -inset-6 bg-gradient-to-br from-[#4A7CFF]/10 via-[#FF4F7A]/5 to-[#7C6BFF]/10 rounded-[36px] blur-2xl" />

              {/* Card */}
              <div className="relative liquid-glass rounded-[24px] p-8 space-y-6">
                <div className="flex items-center gap-2 text-[11px] text-[#9898AE] uppercase tracking-[0.14em] font-semibold">
                  <Flame size={13} className="text-[#4A7CFF]" />
                  Studio Highlights
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {highlights.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.65 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                        className="rounded-xl p-4 space-y-2.5 cursor-default"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4A7CFF]/14 to-[#FF4F7A]/8 flex items-center justify-center">
                          <Icon size={17} className="text-[#4A7CFF]" />
                        </div>
                        <p className="text-[13px] font-semibold text-[#F2F2F7] leading-tight">{item.label}</p>
                        <p className="text-[11px] text-[#5F5F75] leading-snug">{item.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-[rgba(255,255,255,0.06)]">
                  <p className="text-[10px] text-[#5F5F75] text-center">
                    Part of the Brightburn Studio Management System
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0]) }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-[#5F5F75]"
        >
          <span className="text-[9.5px] uppercase tracking-[0.2em] font-medium">Scroll</span>
          <motion.div
            animate={{ scaleY: [0, 1, 0], opacity: [0, 0.7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-[#4A7CFF] to-transparent"
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}