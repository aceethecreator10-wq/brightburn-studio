"use client";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      {icon && <div className="mb-4 text-[#737380] animate-float">{icon}</div>}
      <h3 className="text-lg font-semibold text-[#FAFAFA] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#B6B6C2] max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}
