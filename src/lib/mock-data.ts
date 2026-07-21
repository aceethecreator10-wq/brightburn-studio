import type {
  Student, Batch, AttendanceRecord, FeeRecord, Announcement,
  Parent, DemoUser, ClassSchedule, Notification,
  SupportTicket, AdmissionLead, DocumentRecord, Lead
} from "./types";

export function createMockUsers(): DemoUser[] {
  return [
    { email: "admin@brightburn.demo", password: "admin123", userId: "u-admin", userName: "Priya Sharma", role: "admin" },
    { email: "ace@adwave.demo", password: "ace123", userId: "u-dev", userName: "Rahul Verma", role: "developer" },
    { email: "parent@brightburn.demo", password: "parent123", userId: "u-parent", userName: "Ananya Gupta", role: "parent", parentId: "p1" },
    { email: "student@brightburn.demo", password: "student123", userId: "u-student", userName: "Neha Patel", role: "student", studentId: "s2" },
  ];
}

export function createMockBatches(): Batch[] {
  return [
    { id: "b1", name: "Rising Stars", style: "Jazz-Funk", days: "Mon, Wed, Fri", startTime: "15:30", endTime: "16:45", maxStudents: 20, currentStudents: 8, monthlyFee: 1200, active: true },
    { id: "b2", name: "Elite Crew", style: "Hip-Hop", days: "Tue, Thu, Sat", startTime: "17:00", endTime: "18:30", maxStudents: 15, currentStudents: 6, monthlyFee: 1500, active: true },
    { id: "b3", name: "Little Groovers", style: "Creative Movement", days: "Mon, Wed, Fri", startTime: "10:00", endTime: "11:00", maxStudents: 12, currentStudents: 5, monthlyFee: 800, active: true },
    { id: "b4", name: "Pro Division", style: "Contemporary", days: "Tue, Thu, Sat", startTime: "14:00", endTime: "15:30", maxStudents: 10, currentStudents: 4, monthlyFee: 1800, active: true },
  ];
}

export function createMockStudents(): Student[] {
  return [
    { id: "s1", name: "Aarav Sharma", age: 12, photoPlaceholder: "AS", parentName: "Priya Sharma", parentPhone: "9876543210", batchId: "b1", batchName: "Rising Stars", joiningDate: "2025-08-15", monthlyFee: 1200, firstPaymentStatus: "received", autopayStatus: "active", feeStatus: "paid", nextDueDate: "2026-07-01", active: true },
    { id: "s2", name: "Neha Patel", age: 14, photoPlaceholder: "NP", parentName: "Ananya Gupta", parentPhone: "9876543211", batchId: "b2", batchName: "Elite Crew", joiningDate: "2025-03-10", monthlyFee: 1500, firstPaymentStatus: "received", autopayStatus: "active", feeStatus: "paid", nextDueDate: "2026-07-01", active: true },
    { id: "s3", name: "Rohan Singh", age: 7, photoPlaceholder: "RS", parentName: "Meera Singh", parentPhone: "9876543212", batchId: "b3", batchName: "Little Groovers", joiningDate: "2026-01-20", monthlyFee: 800, firstPaymentStatus: "received", autopayStatus: "inactive", feeStatus: "overdue", nextDueDate: "2026-05-20", active: true },
    { id: "s4", name: "Kavya Nair", age: 15, photoPlaceholder: "KN", parentName: "Deepak Nair", parentPhone: "9876543213", batchId: "b4", batchName: "Pro Division", joiningDate: "2025-06-01", monthlyFee: 1800, firstPaymentStatus: "received", autopayStatus: "active", feeStatus: "paid", nextDueDate: "2026-07-01", active: true },
    { id: "s5", name: "Arjun Reddy", age: 10, photoPlaceholder: "AR", parentName: "Lakshmi Reddy", parentPhone: "9876543214", batchId: "b1", batchName: "Rising Stars", joiningDate: "2025-11-05", monthlyFee: 1200, firstPaymentStatus: "received", autopayStatus: "inactive", feeStatus: "due", nextDueDate: "2026-06-01", active: true },
    { id: "s6", name: "Maya Joseph", age: 13, photoPlaceholder: "MJ", parentName: "Thomas Joseph", parentPhone: "9876543215", batchId: "b2", batchName: "Elite Crew", joiningDate: "2026-02-14", monthlyFee: 1500, firstPaymentStatus: "received", autopayStatus: "failed", feeStatus: "overdue", nextDueDate: "2026-05-01", active: true },
    { id: "s7", name: "Vivaan Kapoor", age: 6, photoPlaceholder: "VK", parentName: "Sneha Kapoor", parentPhone: "9876543216", batchId: "b3", batchName: "Little Groovers", joiningDate: "2026-04-01", monthlyFee: 800, firstPaymentStatus: "pending", autopayStatus: "inactive", feeStatus: "first_payment_pending", nextDueDate: "2026-04-01", active: true },
    { id: "s8", name: "Anika Desai", age: 16, photoPlaceholder: "AD", parentName: "Ravi Desai", parentPhone: "9876543217", batchId: "b4", batchName: "Pro Division", joiningDate: "2025-09-12", monthlyFee: 1800, firstPaymentStatus: "received", autopayStatus: "active", feeStatus: "paid", nextDueDate: "2026-07-01", active: true },
  ];
}

export function createMockParents(): Parent[] {
  return [
    { id: "p1", name: "Priya Sharma", phone: "9876543210", email: "priya.sharma@email.com", children: ["s1"] },
    { id: "p2", name: "Ananya Gupta", phone: "9876543211", email: "ananya.gupta@email.com", children: ["s2"] },
    { id: "p3", name: "Meera Singh", phone: "9876543212", email: "meera.singh@email.com", children: ["s3"] },
    { id: "p4", name: "Deepak Nair", phone: "9876543213", email: "deepak.nair@email.com", children: ["s4"] },
    { id: "p5", name: "Lakshmi Reddy", phone: "9876543214", email: "lakshmi.reddy@email.com", children: ["s5"] },
    { id: "p6", name: "Thomas Joseph", phone: "9876543215", email: "thomas.joseph@email.com", children: ["s6"] },
    { id: "p7", name: "Sneha Kapoor", phone: "9876543216", email: "sneha.kapoor@email.com", children: ["s7"] },
    { id: "p8", name: "Ravi Desai", phone: "9876543217", email: "ravi.desai@email.com", children: ["s8"] },
  ];
}

export function createMockAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const studentIds = ["s1","s2","s3","s4","s5","s6","s7","s8"];
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  let idCounter = 1;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const day = d.getDay();
    if (day === 0) continue;
    for (const sid of studentIds) {
      const present = Math.random() > 0.15;
      const statusRoll = Math.random();
      let status: AttendanceRecord["status"];
      if (present) {
        if (statusRoll < 0.1) status = "late";
        else status = "present";
      } else {
        if (statusRoll < 0.5) status = "excused";
        else status = "absent";
      }
      records.push({
        id: `att-${idCounter++}`,
        studentId: sid,
        date: dateStr,
        status,
        timestamp: `${dateStr}T09:${String(Math.floor(Math.random()*59)).padStart(2,"0")}:00`,
        method: Math.random() > 0.3 ? "qr" : "manual",
      });
    }
  }
  return records;
}

export function createMockFees(): FeeRecord[] {
  const records: FeeRecord[] = [];
  const students = createMockStudents();
  let idCounter = 1;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const monthNamesZero = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const startMonth = Math.max(0, currentMonth - 3);
  for (const s of students) {
    for (let m = startMonth; m <= currentMonth; m++) {
      const month = monthNamesZero[m];
      const monthNum = m + 1;
      const isPast = m < currentMonth;
      const status = isPast ? "paid" as const : (s.feeStatus === "overdue" || s.feeStatus === "due" ? s.feeStatus : "paid" as const);
      const paidDate = isPast ? `${currentYear}-${String(monthNum).padStart(2,"0")}-05` : undefined;
      records.push({
        id: `fee-${idCounter++}`,
        studentId: s.id,
        month,
        year: currentYear,
        amount: s.monthlyFee,
        status: s.firstPaymentStatus === "pending" && m === startMonth ? "first_payment_pending" : status,
        paidDate,
        method: s.autopayStatus === "active" && isPast ? "autopay" : "offline",
        receiptNumber: paidDate ? `RCP-${s.id}-${m}` : undefined,
      });
    }
  }
  return records;
}

export function createMockAnnouncements(): Announcement[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return [
    { id: "a1", title: "Summer Workshop Registration Open", content: "We are excited to announce our Summer Dance Workshop from May 15-20. Limited spots available! Register at the front desk.", target: "all", createdAt: `${y}-${m}-01T10:00:00Z`, createdBy: "Priya Sharma" },
    { id: "a2", title: "Elite Crew - Costume Fitting on Saturday", content: "Attention Elite Crew members: Costume fitting scheduled for this Saturday at 4 PM. Please bring your dance shoes.", target: "batch", batchId: "b2", createdAt: `${y}-${m}-10T08:30:00Z`, createdBy: "Priya Sharma" },
    { id: "a3", title: "Fee Reminder - This Month Cycle", content: "This is a gentle reminder that this month fees are due by the 10th. Late payments will incur a penalty.", target: "parents", createdAt: `${y}-${m}-05T09:00:00Z`, createdBy: "Priya Sharma" },
    { id: "a4", title: "Studio Closed - Monthly Maintenance", content: "The studio will remain closed on the 20th for monthly maintenance. Regular schedule resumes the next day.", target: "all", createdAt: `${y}-${m}-12T14:00:00Z`, createdBy: "Priya Sharma" },
  ];
}

export function createMockSchedules(): ClassSchedule[] {
  const batches = createMockBatches();
  const schedules: ClassSchedule[] = [];
  let idCounter = 1;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const dayName = dayNames[d.getDay()];
    for (const b of batches) {
      if (!b.days.includes(dayName)) continue;
      const statusRoll = Math.random();
      let status: ClassSchedule["status"];
      if (statusRoll < 0.1) status = "cancelled";
      else if (statusRoll < 0.85) status = "scheduled";
      else status = "completed";
      schedules.push({
        id: `sch-${idCounter++}`,
        batchId: b.id,
        title: `${b.name} - ${b.style}`,
        date: dateStr,
        day: dayName,
        startTime: b.startTime,
        endTime: b.endTime,
        studioRoom: ["Studio A","Studio B","Main Hall","Practice Room"][idCounter % 4],
        status,
      });
    }
  }
  return schedules;
}

export function createMockNotifications(): Notification[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return [
    { id: "n1", userId: "u-admin", type: "attendance", title: "Late arrivals today", message: "2 students marked late for morning batch", read: false, createdAt: `${y}-${m}-${d}T10:30:00Z` },
    { id: "n2", userId: "u-admin", type: "fees", title: "3 overdue payments", message: "Rohan Singh, Maya Joseph have dues exceeding 30 days", read: false, createdAt: `${y}-${m}-${d}T09:00:00Z` },
    { id: "n3", userId: "u-admin", type: "schedule", title: "Class cancelled tomorrow", message: "Little Groovers batch cancelled due to instructor training", read: true, createdAt: `${y}-${m}-${d}T16:00:00Z` },
    { id: "n4", userId: "u-admin", type: "system", title: "Monthly report available", message: `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][now.getMonth()]} attendance report is now ready for download`, read: true, createdAt: `${y}-${m}-${d}T12:00:00Z` },
    { id: "n5", userId: "u-admin", type: "announcement", title: "New admission inquiry", message: "New lead interested in Rising Stars batch", read: false, createdAt: `${y}-${m}-${d}T08:15:00Z` },
    { id: "n6", userId: "u-parent", type: "attendance", title: "Neha marked late", message: "Neha Patel was marked late today at 9:15 AM", read: false, createdAt: `${y}-${m}-${d}T09:15:00Z` },
    { id: "n7", userId: "u-student", type: "schedule", title: "Class cancelled", message: "Elite Crew class cancelled due to instructor training", read: false, createdAt: `${y}-${m}-${d}T14:00:00Z` },
  ];
}

export function createMockSupportTickets(): SupportTicket[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return [
    { id: "st1", userId: "u-student", userName: "Neha Patel", subject: "Unable to scan QR", category: "attendance", message: "The QR scanner is not opening on my phone. Can you help?", status: "open", createdAt: `${y}-${m}-${d}T11:00:00Z` },
    { id: "st2", userId: "u-parent", userName: "Ananya Gupta", subject: "Autopay failed this month", category: "payment", message: "My autopay was not processed this month. Can you check?", status: "resolved", createdAt: `${y}-${m}-${d}T09:30:00Z`, resolvedAt: `${y}-${m}-${d}T10:00:00Z`, adminNote: "Resolved - card was expired, new payment processed offline" },
  ];
}

export function createMockAdmissions(): AdmissionLead[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return [
    { id: "al1", name: "Ishaan Mehta", age: 9, parentName: "Pooja Mehta", parentPhone: "9988776655", interestedBatch: "Rising Stars", stage: "inquiry", notes: "Interested in trial class", createdAt: `${y}-${m}-10` },
    { id: "al2", name: "Diya Rao", age: 11, parentName: "Sunita Rao", parentPhone: "8877665544", interestedBatch: "Elite Crew", stage: "first_payment_pending", notes: "Trial completed, awaiting registration fee", createdAt: `${y}-${m}-08` },
    { id: "al3", name: "Reyansh Joshi", age: 5, parentName: "Neha Joshi", parentPhone: "7766554433", interestedBatch: "Little Groovers", stage: "first_payment_received", notes: "First payment received, batch assignment pending", createdAt: `${y}-${m}-05` },
  ];
}

function calcLeadScore(l: Omit<Lead, "id" | "score" | "temperature">): { score: number; temperature: "hot" | "warm" | "cold" } {
  const score = Math.round(
    (l.urgency * 20) +
    (l.budgetFit * 15) +
    (l.batchSeats * 15) +
    (l.sourceQuality * 10) +
    (l.followUpRecency * 15) +
    (l.parentContact * 10) +
    (l.paymentIntent * 15)
  );
  const clamped = Math.min(100, Math.max(0, score));
  return { score: clamped, temperature: clamped >= 75 ? "hot" : clamped >= 45 ? "warm" : "cold" };
}

export function createMockLeads(): Lead[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const baseLeads = [
    { name: "Ishaan Mehta", age: 9, parentName: "Pooja Mehta", parentPhone: "9988776655", parentEmail: "pooja.mehta@email.com", interestedBatch: "Rising Stars", stage: "new" as const, source: "referral" as const, notes: "Referred by Aarav's mom. Very keen to join.", urgency: 5, budgetFit: 4, batchSeats: 3, sourceQuality: 4, followUpRecency: 5, parentContact: 5, paymentIntent: 4, createdAt: `${y}-${m}-08` },
    { name: "Diya Rao", age: 11, parentName: "Sunita Rao", parentPhone: "8877665544", parentEmail: "sunita.rao@email.com", interestedBatch: "Elite Crew", stage: "negotiation" as const, source: "website" as const, notes: "Trial completed. Discussing batch time flexibility.", urgency: 3, budgetFit: 3, batchSeats: 2, sourceQuality: 3, followUpRecency: 4, parentContact: 3, paymentIntent: 5, createdAt: `${y}-${m}-05` },
    { name: "Reyansh Joshi", age: 5, parentName: "Neha Joshi", parentPhone: "7766554433", parentEmail: "neha.joshi@email.com", interestedBatch: "Little Groovers", stage: "won" as const, source: "social_media" as const, notes: "Converted! First payment received.", urgency: 4, budgetFit: 5, batchSeats: 5, sourceQuality: 3, followUpRecency: 2, parentContact: 4, paymentIntent: 5, createdAt: `${y}-${m}-03` },
    { name: "Aanya Kapoor", age: 8, parentName: "Rohit Kapoor", parentPhone: "7654321098", parentEmail: "rohit.kapoor@email.com", interestedBatch: "Rising Stars", stage: "contacted" as const, source: "walk_in" as const, notes: "Walked in during open house. Very impressed.", urgency: 2, budgetFit: 4, batchSeats: 4, sourceQuality: 5, followUpRecency: 3, parentContact: 2, paymentIntent: 2, createdAt: `${y}-${m}-10` },
    { name: "Vihaan Reddy", age: 13, parentName: "Kavitha Reddy", parentPhone: "6543210987", parentEmail: "kavitha.reddy@email.com", interestedBatch: "Pro Division", stage: "qualified" as const, source: "call" as const, notes: "Call from inquiry. Wants competitive training.", urgency: 4, budgetFit: 3, batchSeats: 1, sourceQuality: 3, followUpRecency: 4, parentContact: 4, paymentIntent: 3, createdAt: `${y}-${m}-07` },
    { name: "Myra Singh", age: 6, parentName: "Aditi Singh", parentPhone: "5432109876", parentEmail: "aditi.singh@email.com", interestedBatch: "Little Groovers", stage: "proposal" as const, source: "referral" as const, notes: "Referred by Meera Singh (Rohan's mom).", urgency: 3, budgetFit: 5, batchSeats: 4, sourceQuality: 4, followUpRecency: 2, parentContact: 5, paymentIntent: 4, createdAt: `${y}-${m}-06` },
    { name: "Arnav Gupta", age: 10, parentName: "Suman Gupta", parentPhone: "4321098765", parentEmail: "suman.gupta@email.com", interestedBatch: "Elite Crew", stage: "lost" as const, source: "website" as const, notes: "Decided to join another studio closer to home.", urgency: 1, budgetFit: 2, batchSeats: 3, sourceQuality: 2, followUpRecency: 1, parentContact: 1, paymentIntent: 1, createdAt: `${y}-${m}-01` },
    { name: "Sara Khan", age: 14, parentName: "Zara Khan", parentPhone: "3210987654", parentEmail: "zara.khan@email.com", interestedBatch: "Pro Division", stage: "new" as const, source: "social_media" as const, notes: "Saw Instagram ad. Called for details.", urgency: 2, budgetFit: 3, batchSeats: 2, sourceQuality: 3, followUpRecency: 1, parentContact: 3, paymentIntent: 2, createdAt: `${y}-${m}-11` },
    { name: "Kabir Malhotra", age: 7, parentName: "Neelam Malhotra", parentPhone: "2109876543", parentEmail: "neelam.malhotra@email.com", interestedBatch: "Rising Stars", stage: "contacted" as const, source: "other" as const, notes: "Found through community flyer.", urgency: 3, budgetFit: 4, batchSeats: 5, sourceQuality: 2, followUpRecency: 3, parentContact: 3, paymentIntent: 3, createdAt: `${y}-${m}-09` },
  ];
  return baseLeads.map(l => {
    const { score, temperature } = calcLeadScore(l);
    return { ...l, id: `lead-${l.name.toLowerCase().replace(/\s+/g, "-")}`, score, temperature };
  });
}

export function createMockDocuments(): DocumentRecord[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const monthName = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][now.getMonth()];
  return [
    { id: "doc1", userId: "u-admin", type: "id_card", title: "Student ID Card Template v2", description: "Official Brightburn ID card format", createdAt: `${y}-${m}-01` },
    { id: "doc2", userId: "u-admin", type: "rules", title: "Studio Rules & Code of Conduct", description: `Updated ${monthName} ${y}`, createdAt: `${y}-${m}-10` },
    { id: "doc3", userId: "u-student", type: "receipt", title: `Fee Receipt - ${monthName} ${y}`, description: "Neha Patel - Elite Crew", createdAt: `${y}-${m}-05` },
    { id: "doc4", userId: "u-parent", type: "receipt", title: `Fee Receipt - ${monthName} ${y}`, description: "Neha Patel", createdAt: `${y}-${m}-05` },
    { id: "doc5", userId: "u-student", type: "report", title: `Attendance Report - ${monthName} ${y}`, description: "Monthly attendance summary", createdAt: `${y}-${m}-01` },
  ];
}
