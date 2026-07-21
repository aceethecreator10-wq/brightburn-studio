export type UserRole = "admin" | "developer" | "parent" | "student";

export type FeeStatus = "paid" | "due" | "overdue" | "first_payment_pending" | "first_payment_received";

export type AutopayStatus = "active" | "inactive" | "failed";

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface Batch {
  id: string;
  name: string;
  style: string;
  days: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  currentStudents: number;
  monthlyFee: number;
  active: boolean;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  photoPlaceholder: string;
  parentName: string;
  parentPhone: string;
  batchId: string;
  batchName: string;
  joiningDate: string;
  monthlyFee: number;
  firstPaymentStatus: "pending" | "received";
  autopayStatus: AutopayStatus;
  feeStatus: FeeStatus;
  nextDueDate: string;
  active: boolean;
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  children: string[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  timestamp: string;
  method: "qr" | "manual";
  note?: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  month: string;
  year: number;
  amount: number;
  status: FeeStatus;
  paidDate?: string;
  method: "offline" | "autopay";
  receiptNumber?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target: "all" | "batch" | "parents" | "students";
  batchId?: string;
  createdAt: string;
  createdBy: string;
}

export interface DemoUser {
  email: string;
  password: string;
  userId: string;
  userName: string;
  role: UserRole;
  parentId?: string;
  studentId?: string;
}

export interface AuthSession {
  userId: string;
  userName: string;
  email: string;
  role: UserRole;
  loginTime: string;
  expiresAt: string;
  parentId?: string;
  studentId?: string;
}

export interface ClassSchedule {
  id: string;
  batchId: string;
  title: string;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  studioRoom: string;
  status: "scheduled" | "cancelled" | "completed" | "holiday";
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "attendance" | "fees" | "schedule" | "announcement" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  category: "attendance" | "payment" | "schedule" | "other";
  message: string;
  status: "open" | "resolved";
  createdAt: string;
  resolvedAt?: string;
  adminNote?: string;
}

export interface AdmissionLead {
  id: string;
  name: string;
  age: number;
  parentName: string;
  parentPhone: string;
  interestedBatch: string;
  stage: "inquiry" | "first_payment_pending" | "first_payment_received" | "batch_assigned" | "parent_linked" | "active";
  notes?: string;
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  userId: string;
  type: "receipt" | "id_card" | "rules" | "report" | "other";
  title: string;
  description?: string;
  createdAt: string;
}

export interface Receipt {
  receiptNumber: string;
  studentId: string;
  studentName: string;
  parentName: string;
  month: string;
  year: number;
  amount: number;
  method: string;
  paidDate: string;
}

export type LeadStage = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

export interface Lead {
  id: string;
  name: string;
  age: number;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  interestedBatch: string;
  stage: LeadStage;
  source: "walk_in" | "referral" | "social_media" | "website" | "call" | "other";
  notes: string;
  urgency: number;       // 1-5 (how soon they want to join)
  budgetFit: number;     // 1-5
  batchSeats: number;    // 1-5 (availability in desired batch)
  sourceQuality: number; // 1-5
  followUpRecency: number; // 1-5 (1 = never followed, 5 = recently)
  parentContact: number;   // 1-5 (1 = hard to reach, 5 = responsive)
  paymentIntent: number;   // 1-5
  score: number;
  temperature: "hot" | "warm" | "cold";
  createdAt: string;
  lastContactedAt?: string;
}

export interface ClassSession {
  id: string;
  batchId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  studioRoom: string;
  status: "scheduled" | "completed" | "cancelled" | "holiday";
  notes?: string;
}
