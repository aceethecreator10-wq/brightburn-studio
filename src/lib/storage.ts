"use client";

import type {
  Student, Batch, AttendanceRecord, FeeRecord, Announcement,
  Parent, AuthSession, ClassSchedule, Notification,
  SupportTicket, AdmissionLead, DocumentRecord, Receipt, DemoUser,
  Lead
} from "./types";

type StorageKey =
  | "brightburn_students" | "brightburn_batches"
  | "brightburn_attendance" | "brightburn_fees"
  | "brightburn_announcements" | "brightburn_parents"
  | "brightburn_demo_users" | "brightburn_session"
  | "brightburn_schedules" | "brightburn_notifications"
  | "brightburn_support_tickets" | "brightburn_documents"
  | "brightburn_admissions" | "brightburn_tour_seen"
  | "brightburn_sessions" | "brightburn_receipts"
  | "brightburn_storage_version"
  | "brightburn_leads";

const INIT_FUNCTIONS: Record<string, () => string> = {};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function safeGet<T>(key: StorageKey, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function safeSet<T>(key: StorageKey, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or other error
  }
}

export function registerInit(key: StorageKey, fn: () => string): void {
  INIT_FUNCTIONS[key] = fn;
}

export function getWithInit<T>(key: StorageKey, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      const initFn = INIT_FUNCTIONS[key];
      if (initFn) {
        const data = initFn();
        safeSet(key, JSON.parse(data));
        return JSON.parse(data) as T;
      }
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function resetDemoData(): void {
  if (!isBrowser()) return;
  const keys: StorageKey[] = [
    "brightburn_students", "brightburn_batches",
    "brightburn_attendance", "brightburn_fees",
    "brightburn_announcements", "brightburn_parents",
    "brightburn_demo_users", "brightburn_schedules",
    "brightburn_notifications", "brightburn_support_tickets",
    "brightburn_documents", "brightburn_admissions",
    "brightburn_leads", "brightburn_tour_seen"
  ];
  for (const key of keys) {
    const initFn = INIT_FUNCTIONS[key];
    if (initFn) {
      const data = initFn();
      safeSet(key, JSON.parse(data));
    }
  }
  safeSet("brightburn_session", null);
}

export function getSession(): AuthSession | null {
  return safeGet<AuthSession | null>("brightburn_session", null);
}

export function setSession(session: AuthSession | null): void {
  if (!isBrowser()) return;
  if (session) {
    safeSet("brightburn_session", session);
  } else {
    localStorage.removeItem("brightburn_session");
  }
}

export function clearSession(): void {
  setSession(null);
}

export function isLoggedIn(): boolean {
  const session = getSession();
  if (!session) return false;
  if (new Date(session.expiresAt) < new Date()) {
    setSession(null);
    return false;
  }
  return true;
}

export function hasRole(role: string): boolean {
  const session = getSession();
  return session !== null && session.role === role && isLoggedIn();
}

// Admin CRUD helpers
export function getStudents(): Student[] {
  return safeGet<Student[]>("brightburn_students", []);
}
export function setStudents(v: Student[]): void {
  safeSet("brightburn_students", v);
}
export function getStudent(id: string): Student | undefined {
  return getStudents().find(s => s.id === id);
}

export function getBatches(): Batch[] {
  return safeGet<Batch[]>("brightburn_batches", []);
}
export function setBatches(v: Batch[]): void {
  safeSet("brightburn_batches", v);
}
export function getBatch(id: string): Batch | undefined {
  return getBatches().find(b => b.id === id);
}

export function getAttendance(): AttendanceRecord[] {
  return safeGet<AttendanceRecord[]>("brightburn_attendance", []);
}
export function setAttendance(v: AttendanceRecord[]): void {
  safeSet("brightburn_attendance", v);
}

export function getFees(): FeeRecord[] {
  return safeGet<FeeRecord[]>("brightburn_fees", []);
}
export function setFees(v: FeeRecord[]): void {
  safeSet("brightburn_fees", v);
}

export function getParents(): Parent[] {
  return safeGet<Parent[]>("brightburn_parents", []);
}
export function setParents(v: Parent[]): void {
  safeSet("brightburn_parents", v);
}

export function getAnnouncements(): Announcement[] {
  return safeGet<Announcement[]>("brightburn_announcements", []);
}
export function setAnnouncements(v: Announcement[]): void {
  safeSet("brightburn_announcements", v);
}

export function getSchedules(): ClassSchedule[] {
  return safeGet<ClassSchedule[]>("brightburn_schedules", []);
}
export function setSchedules(v: ClassSchedule[]): void {
  safeSet("brightburn_schedules", v);
}

export function getNotifications(): Notification[] {
  return safeGet<Notification[]>("brightburn_notifications", []);
}
export function setNotifications(v: Notification[]): void {
  safeSet("brightburn_notifications", v);
}

export function getSupportTickets(): SupportTicket[] {
  return safeGet<SupportTicket[]>("brightburn_support_tickets", []);
}
export function setSupportTickets(v: SupportTicket[]): void {
  safeSet("brightburn_support_tickets", v);
}

export function getAdmissions(): AdmissionLead[] {
  return safeGet<AdmissionLead[]>("brightburn_admissions", []);
}
export function setAdmissions(v: AdmissionLead[]): void {
  safeSet("brightburn_admissions", v);
}

export function getDocuments(): DocumentRecord[] {
  return safeGet<DocumentRecord[]>("brightburn_documents", []);
}
export function setDocuments(v: DocumentRecord[]): void {
  safeSet("brightburn_documents", v);
}

export function getLeads(): Lead[] {
  return safeGet<Lead[]>("brightburn_leads", []);
}
export function setLeads(v: Lead[]): void {
  safeSet("brightburn_leads", v);
}

export function getTourSeen(): boolean {
  return safeGet<boolean>("brightburn_tour_seen", false);
}
export function setTourSeen(v: boolean): void {
  safeSet("brightburn_tour_seen", v);
}

export function getDemoUsers(): DemoUser[] {
  return safeGet<DemoUser[]>("brightburn_demo_users", []);
}
export function setDemoUsers(v: DemoUser[]): void {
  safeSet("brightburn_demo_users", v);
}

export function getReceipts(): Receipt[] {
  return safeGet<Receipt[]>("brightburn_receipts", []);
}
export function setReceipts(v: Receipt[]): void {
  safeSet("brightburn_receipts", v);
}

// Backward-compatible aliases
export const saveStudents = setStudents;
export const saveFees = setFees;
export const saveBatches = setBatches;
export const saveAnnouncements = setAnnouncements;
export const saveAttendance = setAttendance;

export function getTodayAttendance(): AttendanceRecord[] {
  const today = new Date().toISOString().split("T")[0];
  return getAttendance().filter(a => a.date === today);
}

export function getStudentAttendance(studentId: string): AttendanceRecord[] {
  return getAttendance().filter(a => a.studentId === studentId);
}

export function markAttendance(studentId: string, date: string, status: AttendanceRecord["status"], method: AttendanceRecord["method"]): AttendanceRecord {
  const records = getAttendance();
  const record: AttendanceRecord = {
    id: `att-${Date.now()}`,
    studentId,
    date,
    status,
    timestamp: new Date().toISOString(),
    method,
  };
  setAttendance([...records, record]);
  return record;
}


