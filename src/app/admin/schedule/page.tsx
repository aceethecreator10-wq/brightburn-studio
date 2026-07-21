"use client";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getSchedules, getBatches } from "@/lib/storage";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  CalendarDays, ChevronLeft, ChevronRight, MapPin, Clock, XCircle,
  CheckCircle2
} from "lucide-react";
import type { ClassSchedule, Batch } from "@/lib/types";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SchedulePage() {
  const [schedules] = useState<ClassSchedule[]>(() => getSchedules());
  const [batches] = useState<Batch[]>(() => getBatches());
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDays = () => {
    const today = new Date();
    today.setDate(today.getDate() + weekOffset * 7);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const todayStr = new Date().toLocaleDateString("en-IN");

  const getSchedulesForDay = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return schedules
      .filter(s => s.date === dateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getBatchName = (batchId: string) => {
    return batches.find(b => b.id === batchId)?.name ?? "Unknown";
  };

  return (
    <AppShell>
    <div className="space-y-6">
      <PageHeader
        title="Class Schedule"
        description="Weekly view of all studio classes"
        icon={<CalendarDays size={22} className="text-[#7C6BFF]" />}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWeekOffset(w => w - 1)}
          ><ChevronLeft size={16} /></Button>
          <span className="text-sm font-medium text-[#FAFAFA] min-w-[200px] text-center">
            {weekDays[0].toLocaleDateString("en-IN", { month: "long", day: "numeric" })} - {weekDays[6].toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWeekOffset(w => w + 1)}
          ><ChevronRight size={16} /></Button>
          {weekOffset !== 0 && (
            <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)}>
              Today
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, idx) => {
          const daySchedules = getSchedulesForDay(day);
          const isToday = day.toLocaleDateString("en-IN") === todayStr;
          return (
            <div key={idx} className="min-h-[300px]">
              <div
                className={`text-center p-2 rounded-t-xl text-xs font-semibold ${
                  isToday ? "text-[#4A7CFF]" : "text-[#A1A1AA]"
                }`}
                style={{
                  background: isToday ? "rgba(255,106,0,0.08)" : "rgba(255,255,255,0.04)",
                  borderBottom: isToday ? "2px solid #4A7CFF" : "2px solid transparent",
                }}
              >
                <div className="text-[10px] uppercase">{dayNames[idx]}</div>
                <div className="text-lg font-bold">{day.getDate()}</div>
              </div>
              <div className="space-y-1.5 p-1">
                {daySchedules.length === 0 ? (
                  <p className="text-[10px] text-[#71717A] text-center py-4">No classes</p>
                ) : (
                  daySchedules.map(s => {
                    const isCancelled = s.status === "cancelled";
                    const isCompleted = s.status === "completed";
                    return (
                      <div
                        key={s.id}
                        className="rounded-lg p-2 text-[10px] transition-all"
                        style={{
                          background: isCancelled ? "rgba(239,68,68,0.08)" :
                            isCompleted ? "rgba(34,197,94,0.08)" : "rgba(124,107,255,0.1)",
                          border: `1px solid ${
                            isCancelled ? "rgba(239,68,68,0.15)" :
                            isCompleted ? "rgba(34,197,94,0.15)" : "rgba(124,107,255,0.15)"
                          }`,
                          opacity: isCancelled ? 0.6 : 1,
                        }}
                      >
                        <p className="font-semibold text-[#FAFAFA] truncate">{getBatchName(s.batchId)}</p>
                        <div className="flex items-center gap-1 mt-0.5 text-[#A1A1AA]">
                          <Clock size={10} />
                          {s.startTime} - {s.endTime}
                        </div>
                        <div className="flex items-center gap-1 text-[#71717A]">
                          <MapPin size={10} />
                          {s.studioRoom}
                        </div>
                        {isCancelled && (
                          <div className="flex items-center gap-1 mt-0.5 text-[#EF4444]">
                            <XCircle size={10} /> Cancelled
                          </div>
                        )}
                        {isCompleted && (
                          <div className="flex items-center gap-1 mt-0.5 text-[#22C55E]">
                            <CheckCircle2 size={10} /> Done
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </AppShell>
  );
}
