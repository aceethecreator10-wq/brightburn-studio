"use client";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
}

export function Select({ value, onChange, options, label, placeholder, className = "" }: SelectProps) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full rounded-xl py-2.5 px-3 text-sm text-[#FAFAFA] appearance-none outline-none transition-all duration-200"
          style={{ background: "#16161D", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
      </div>
    </div>
  );
}
