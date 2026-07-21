"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Flame, QrCode, Bell, Dumbbell, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LandingHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4A7CFF]/5 via-transparent to-[#050507]" />
        <div className="floating-orb w-[700px] h-[700px] bg-[#4A7CFF]/8 top-[-15%] left-[-10%]" style={{ animationDuration: "18s" }} />
        <div className="floating-orb w-[500px] h-[500px] bg-[#FF6B6B]/6 bottom-[-15%] right-[-8%]" style={{ animationDuration: "22s" }} />
        <div className="floating-orb w-[400px] h-[400px] bg-[#7C6BFF]/5 top-[35%] right-[15%]" style={{ animationDuration: "25s" }} />
        <div className="floating-orb w-[300px] h-[300px] bg-[#FFD93D]/4 bottom-[30%] left-[10%]" style={{ animationDuration: "20s" }} />
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="h-px w-8 bg-gradient-to-r from-[#4A7CFF] to-transparent" />
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#4A7CFF]">Brightburn Studio</span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-[-0.03em]">
                Dance.
                <br />
                <span className="text-gradient-primary">Fitness.</span>
                <br />
                Discipline.
              </h1>

              <p className="text-lg sm:text-xl text-[#B6B6C2] max-w-xl leading-relaxed">
                A modern dance and fitness studio built for students who want confidence, energy, and growth.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" onClick={() => scrollTo("inquiry")}>
                <Sparkles size={16} /> Start Your Journey
              </Button>
              <Button variant="glass" size="lg" onClick={() => scrollTo("classes")}>
                View Programs <ArrowRight size={16} />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-6 text-xs text-[#737380]"
            >
              {["Structured Batches", "QR Attendance", "Parent Dashboard", "Progress Tracking"].map((tag) => (
                <span key={tag} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#4A7CFF]" />
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#4A7CFF]/10 via-[#FF6B6B]/5 to-[#7C6BFF]/10 rounded-[32px] blur-2xl" />
              <div className="relative liquid-glass rounded-[24px] p-8 space-y-6">
                <div className="flex items-center gap-2 text-xs text-[#B6B6C2] uppercase tracking-wider font-medium">
                  <Flame size={14} className="text-[#4A7CFF]" />
                  Studio Highlights
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Users, label: "Active batches", desc: "Structured programs for all ages" },
                    { icon: QrCode, label: "QR attendance", desc: "Instant check-in & tracking" },
                    { icon: Bell, label: "Parent updates", desc: "Real-time progress notifications" },
                    { icon: Dumbbell, label: "Fitness + dance", desc: "Dual-program curriculum" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
                        className="rounded-xl p-4 space-y-2 border-gradient"
                        style={{ background: "rgba(255,255,255,0.03)" }}
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4A7CFF]/15 to-[#FF6B6B]/10 flex items-center justify-center">
                          <Icon size={18} className="text-[#4A7CFF]" />
                        </div>
                        <p className="text-sm font-medium text-[#FAFAFA]">{item.label}</p>
                        <p className="text-xs text-[#737380]">{item.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="pt-2 border-t border-[rgba(255,255,255,0.06)]">
                  <p className="text-[10px] text-[#737380] text-center">
                    Part of the Brightburn Studio Management System
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0, 0.6], [1, 0]) }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-[#737380]"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#4A7CFF]/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}