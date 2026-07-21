"use client";
import { motion } from "framer-motion";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-[#B6B6C2] mb-0.5">{label}</label>
      )}
      <input
        className={`w-full rounded-xl px-3 py-2.5 text-sm text-[#FAFAFA] placeholder-[#737380] outline-none transition-all duration-200 ${className}`}
        style={{ background: "rgba(22,22,29,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(74,124,255,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,124,255,0.08)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
        {...props}
      />
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-[#EF4444]">
          {error}
        </motion.p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-[#B6B6C2] mb-0.5">{label}</label>
      )}
      <select
        className={`w-full rounded-xl px-3 py-2.5 text-sm text-[#FAFAFA] outline-none transition-all duration-200 ${className}`}
        style={{ background: "rgba(22,22,29,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(74,124,255,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,124,255,0.08)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextArea({ label, className = "", ...props }: TextAreaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-[#B6B6C2] mb-0.5">{label}</label>
      )}
      <textarea
        className={`w-full rounded-xl px-3 py-2.5 text-sm text-[#FAFAFA] placeholder-[#737380] outline-none transition-all duration-200 resize-none min-h-[100px] ${className}`}
        style={{ background: "rgba(22,22,29,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(74,124,255,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,124,255,0.08)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
        {...props}
      />
    </div>
  );
}
