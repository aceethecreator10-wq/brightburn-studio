export function calculateMemberSince(joiningDate: string): string {
  const join = new Date(joiningDate);
  const now = new Date();
  let months = (now.getFullYear() - join.getFullYear()) * 12;
  months += now.getMonth() - join.getMonth();
  if (now.getDate() < join.getDate()) months--;
  if (months < 1) return "Less than a month";
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""}`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (remMonths === 0) return `${years} year${years !== 1 ? "s" : ""}`;
  return `${years} year${years !== 1 ? "s" : ""} ${remMonths} month${remMonths !== 1 ? "s" : ""}`;
}

export function calculateAttendancePercentage(
  records: { status: string; date?: string }[],
  month?: number,
  year?: number
): number {
  const now = new Date();
  const m = month ?? now.getMonth();
  const y = year ?? now.getFullYear();
  const relevant = records.filter((r) => {
    if (!r.date) return false;
    const d = new Date(r.date);
    return d.getMonth() === m && d.getFullYear() === y;
  });
  if (relevant.length === 0) return 0;
  const present = relevant.filter((r) => r.status === "present").length;
  return Math.round((present / relevant.length) * 100);
}

export function getAttendanceStats(records: { status: string; date?: string }[]) {
  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  return { total, present, absent, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
}

export function getCurrentMonthDays(): string[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days: string[] = [];
  const lastDay = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= lastDay; d++) {
    const date = new Date(year, month, d);
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      days.push(date.toISOString().split("T")[0]);
    }
  }
  return days;
}
