"use client";
import { motion } from "framer-motion";
import { Clock, CalendarDays } from "lucide-react";

const schedule = [
  { name: "Kids Beginner Dance", days: "Mon / Wed / Fri", time: "5:00 PM — 6:00 PM" },
  { name: "Hip Hop Teens", days: "Tue / Thu / Sat", time: "6:30 PM — 7:30 PM" },
  { name: "Fitness & Zumba", days: "Mon — Fri", time: "7:30 AM — 8:30 AM" },
  { name: "Advanced Dance Crew", days: "Sat / Sun", time: "8:00 PM — 9:30 PM" },
];

const dayColors: Record<string, string> = {
  "Kids Beginner Dance": "#4A7CFF",
  "Hip Hop Teens": "#7C6BFF",
  "Fitness & Zumba": "#22C55E",
  "Advanced Dance Crew": "#FF6B6B",
};

export function SchedulePreview() {
  return (
    <div className="space-y-4">
      {schedule.map((s, i) => {
        const accent = dayColors[s.name] || "#4A7CFF";
        return (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-40px" }}
            className="group relative rounded-2xl p-5 overflow-hidden border-gradient"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-1 opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(to bottom, ${accent}, transparent)` }}
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pl-3">
              <div>
                <p className="text-base font-medium text-[#FAFAFA] group-hover:translate-x-1 transition-transform duration-300">{s.name}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-[#B6B6C2]">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={13} style={{ color: accent }} />
                  {s.days}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={13} style={{ color: accent }} />
                  {s.time}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}