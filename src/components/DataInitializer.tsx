"use client";
import { useState } from "react";
import {
  registerInit, safeSet, safeGet, setSession,
} from "@/lib/storage";
import {
  createMockUsers, createMockBatches, createMockStudents,
  createMockParents, createMockAttendance, createMockFees,
  createMockAnnouncements, createMockSchedules,
  createMockNotifications, createMockSupportTickets,
  createMockAdmissions, createMockDocuments,
  createMockLeads,
} from "@/lib/mock-data";
import type { AuthSession } from "@/lib/types";

const STORAGE_VERSION_KEY = "brightburn_storage_version";
const CURRENT_VERSION = 2;

const ALL_KEYS = [
  "brightburn_demo_users", "brightburn_batches", "brightburn_students",
  "brightburn_parents", "brightburn_attendance", "brightburn_fees",
  "brightburn_announcements", "brightburn_schedules",
  "brightburn_notifications", "brightburn_support_tickets",
  "brightburn_admissions", "brightburn_documents",
  "brightburn_leads",
] as const;

const INIT_MAP: Record<string, () => object> = {
  brightburn_demo_users: createMockUsers,
  brightburn_batches: createMockBatches,
  brightburn_students: createMockStudents,
  brightburn_parents: createMockParents,
  brightburn_attendance: createMockAttendance,
  brightburn_fees: createMockFees,
  brightburn_announcements: createMockAnnouncements,
  brightburn_schedules: createMockSchedules,
  brightburn_notifications: createMockNotifications,
  brightburn_support_tickets: createMockSupportTickets,
  brightburn_admissions: createMockAdmissions,
  brightburn_documents: createMockDocuments,
  brightburn_leads: createMockLeads,
};

export function registerAllInits(): void {
  for (const key of ALL_KEYS) {
    const fn = INIT_MAP[key];
    if (fn) registerInit(key, () => JSON.stringify(fn()));
  }
}

function migrateStorage(): void {
  if (typeof window === "undefined") return;
  const version = safeGet<number>(STORAGE_VERSION_KEY, 0);
  const needsRefresh = version < 2;
  if (version < 2) {
    safeSet<number>(STORAGE_VERSION_KEY, CURRENT_VERSION);
  }
  let anyMissing = false;
  for (const key of ALL_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) { JSON.parse(raw); }
      else { anyMissing = true; }
    } catch { anyMissing = true; }
  }
  if (needsRefresh || anyMissing) {
    for (const key of ALL_KEYS) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) { const fn = INIT_MAP[key]; if (fn) safeSet(key, fn()); }
      } catch { const fn = INIT_MAP[key]; if (fn) safeSet(key, fn()); }
    }
  }
  const session = safeGet<AuthSession | null>("brightburn_session", null);
  if (session && (!session.userId || !session.role || !session.expiresAt || new Date(session.expiresAt) < new Date())) {
    setSession(null);
  }
}

export default function DataInitializer({ children }: { children: React.ReactNode }) {
  useState(() => {
    if (typeof window !== "undefined") {
      registerAllInits();
      migrateStorage();
    }
    return true;
  });
  return <>{children}</>;
}
