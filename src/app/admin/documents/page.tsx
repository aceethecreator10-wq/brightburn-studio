"use client";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getDocuments } from "@/lib/storage";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  FileText, File, Receipt, CreditCard, BookOpen, BarChart3
} from "lucide-react";
import type { DocumentRecord } from "@/lib/types";

const typeIcons: Record<string, typeof FileText> = {
  receipt: Receipt, id_card: CreditCard, rules: BookOpen, report: BarChart3, other: File,
};

const typeLabels: Record<string, string> = {
  receipt: "Receipt", id_card: "ID Card", rules: "Rules", report: "Report", other: "Other",
};

const typeColors: Record<string, string> = {
  receipt: "#22C55E", id_card: "#4A7CFF", rules: "#3B82F6", report: "#7C6BFF", other: "#71717A",
};

export default function DocumentsPage() {
  const [docs] = useState<DocumentRecord[]>(() => getDocuments());

  return (
    <AppShell>
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Access receipts, ID cards, reports, and studio documents"
        icon={<FileText size={22} className="text-[#3B82F6]" />}
      />

      {docs.length === 0 ? (
        <EmptyState icon={<FileText size={16} />} title="No documents yet" description="Documents will appear here once generated" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {docs.map(doc => {
            const Icon = typeIcons[doc.type] || File;
            return (
              <div
                key={doc.id}
                className="rounded-xl p-4 transition-all hover:translate-y-[-2px] cursor-pointer glass-card"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-2.5 rounded-xl flex-shrink-0"
                    style={{ background: `${typeColors[doc.type]}15` }}
                  >
                    <Icon size={20} style={{ color: typeColors[doc.type] }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#FAFAFA] truncate">{doc.title}</p>
                    {doc.description && (
                      <p className="text-xs text-[#71717A] mt-0.5 line-clamp-2">{doc.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{ background: `${typeColors[doc.type]}15`, color: typeColors[doc.type] }}
                      >
                        {typeLabels[doc.type]}
                      </span>
                      <span className="text-[10px] text-[#71717A]">{new Date(doc.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </AppShell>
  );
}
