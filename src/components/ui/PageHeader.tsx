"use client";
import { ReactNode } from "react";

interface PageHeaderProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
  badge?: ReactNode;
}

export function PageHeader({ icon, title, description, actions, badge }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
      <div className="flex items-center gap-4">
        {icon && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#4A7CFF]/15 to-[#7C6BFF]/10 border border-[#4A7CFF]/20 shadow-lg shadow-[#4A7CFF]/5 backdrop-blur-sm">
            {icon}
          </div>
        )}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#FAFAFA] tracking-tight">{title}</h1>
            {badge}
          </div>
          {description && (
            <p className="text-sm text-[#B6B6C2] mt-1 max-w-2xl">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
      )}
    </div>
  );
}
