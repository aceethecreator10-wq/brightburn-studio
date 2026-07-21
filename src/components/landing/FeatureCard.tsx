"use client";
import { motion } from "framer-motion";
import { type FC, type SVGProps } from "react";

type IconComponent = FC<SVGProps<SVGSVGElement>>;

interface FeatureCardProps {
  icon: IconComponent;
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-40px" }}
      className="group relative rounded-2xl p-5 sm:p-6 space-y-4 border-gradient"
      style={{ background: "rgba(255,255,255,0.025)" }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4A7CFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 w-11 h-11 rounded-2xl bg-gradient-to-br from-[#4A7CFF]/15 to-[#7C6BFF]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon width={20} height={20} className="text-[#4A7CFF]" />
      </div>
      <div className="relative z-10 space-y-2">
        <h3 className="text-base font-semibold text-[#FAFAFA]">{title}</h3>
        <p className="text-sm text-[#B6B6C2] leading-relaxed">{description}</p>
      </div>
      <div className="relative z-10 w-8 h-px bg-gradient-to-r from-[#4A7CFF]/30 to-transparent" />
    </motion.div>
  );
}