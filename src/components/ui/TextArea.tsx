"use client";

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
}

export function TextArea({ value, onChange, label, placeholder, rows = 3 }: TextAreaProps) {
  return (
    <div>
      {label && <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-xl py-2.5 px-3 text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none resize-none transition-all duration-200"
        style={{ background: "#16161D", border: "1px solid rgba(255,255,255,0.08)" }}
      />
    </div>
  );
}
