"use client";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Users } from "lucide-react";

interface ProgramCardProps {
  name: string;
  description: string;
  group: string;
  timing: string;
  optional?: boolean;
  index: number;
}

export function ProgramCard({ name, description, group, timing, optional, index }: ProgramCardProps) {
  const scrollToInquiry = () => {
    const el = document.getElementById("inquiry");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-40px" }}
      className="group relative rounded-[20px] p-6 sm:p-7 space-y-5 border-gradient overflow-hidden"
      style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))` }}
    >
      <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-[#4A7CFF]/5 via-[#FF6B6B]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#4A7CFF]/5 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {optional && (
        <span className="relative z-10 inline-block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#FFD93D] bg-[#FFD93D]/10 px-3 py-1 rounded-full border border-[#FFD93D]/20">
          Optional
        </span>
      )}

      <div className="relative z-10 space-y-1">
        <h3 className="text-xl font-semibold text-[#FAFAFA]">{name}</h3>
        <p className="text-sm text-[#B6B6C2] leading-relaxed">{description}</p>
      </div>

      <div className="relative z-10 flex flex-wrap gap-4 text-xs text-[#737380]">
        <span className="inline-flex items-center gap-1.5">
          <Users size={13} className="text-[#4A7CFF]/70" />
          {group}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={13} className="text-[#4A7CFF]/70" />
          {timing}
        </span>
      </div>

      <div className="relative z-10 h-px bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />

      <motion.button
        whileHover={{ x: 4 }}
        onClick={scrollToInquiry}
        className="relative z-10 inline-flex items-center gap-2 text-sm font-medium text-[#4A7CFF] hover:text-[#FF6B6B] transition-colors"
      >
        Enquire Now <ArrowRight size={14} />
      </motion.button>
    </motion.div>
  );
}