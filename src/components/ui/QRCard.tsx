"use client";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

interface QRCardProps {
  value: string;
  label: string;
  status?: string;
  statusColor?: string;
}

export function QRCard({ value, label, status, statusColor = "#22C55E" }: QRCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="liquid-glass rounded-2xl p-6 flex flex-col items-center gap-4"
    >
      <div className="flex items-center gap-2.5">
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-[#22C55E]"
        />
        <p className="text-sm font-medium text-[#B6B6C2]">{label}</p>
      </div>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="bg-white p-3 rounded-2xl shadow-xl depth-shadow animate-border-glow"
      >
        <QRCodeSVG value={value} size={180} />
      </motion.div>
      {status && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-medium flex items-center gap-1.5"
          style={{ color: statusColor }}
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: statusColor }}
          />
          {status}
        </motion.p>
      )}
      <p className="text-[10px] text-[#737380] font-mono break-all text-center max-w-[200px] select-all">
        {value}
      </p>
    </motion.div>
  );
}
