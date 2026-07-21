"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame, QrCode, Bell, Receipt, Smartphone,
  Users, MapPin, Phone, Clock, Sparkles,
  Camera, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LandingHero } from "@/components/landing/LandingHero";
import { ProgramCard } from "@/components/landing/ProgramCard";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { SchedulePreview } from "@/components/landing/SchedulePreview";
import { InquiryForm } from "@/components/landing/InquiryForm";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const programs = [
  {
    name: "Kids Beginner Dance",
    description: "Fun and structured dance sessions for young beginners to build coordination, rhythm, and confidence.",
    group: "Ages 4–8",
    timing: "Mon/Wed/Fri — 5:00 PM to 6:00 PM",
  },
  {
    name: "Hip Hop Teens",
    description: "Energetic hip hop routines and choreography for teens who want to groove and perform.",
    group: "Ages 12–17",
    timing: "Tue/Thu/Sat — 6:30 PM to 7:30 PM",
  },
  {
    name: "Fitness & Zumba",
    description: "High-energy fitness sessions with Zumba, cardio, and strength training for all levels.",
    group: "Ages 13+",
    timing: "Mon–Fri — 7:30 AM to 8:30 AM",
  },
  {
    name: "Advanced Dance Crew",
    description: "Intensive choreography, performance training, and crew routines for experienced dancers.",
    group: "Ages 15+ (by assessment)",
    timing: "Sat/Sun — 8:00 PM to 9:30 PM",
  },
  {
    name: "Personal Training",
    description: "One-on-one or private group sessions tailored to individual goals and schedules.",
    group: "All ages",
    timing: "By appointment",
    optional: true,
  },
];

const features = [
  { icon: Users, title: "Professional batches", description: "Structured batches with experienced instructors and clear curriculum." },
  { icon: QrCode, title: "QR-based attendance", description: "Instant attendance tracking with QR check-in for accuracy and speed." },
  { icon: Bell, title: "Parent transparency", description: "Parents receive real-time updates on attendance, fees, and progress." },
  { icon: TrendingUpIcon, title: "Monthly progress tracking", description: "Detailed progress reports help students see their growth every month." },
  { icon: Receipt, title: "Fee and receipt system", description: "Digital fee records and receipts — no more paper hassle." },
  { icon: MegaphoneIcon, title: "Studio announcements", description: "Stay informed with studio-wide announcements and batch updates." },
  { icon: Smartphone, title: "Student dashboard", description: "Students can track their own attendance, schedule, and progress." },
];

const galleryItems = [
  { label: "Studio Training", gradient: "from-[#4A7CFF]/20 to-[#FF6B6B]/10", size: "large" },
  { label: "Dance Sessions", gradient: "from-[#7C6BFF]/20 to-[#4A7CFF]/10", size: "small" },
  { label: "Fitness Batches", gradient: "from-[#FF6B6B]/20 to-[#FFD93D]/10", size: "small" },
  { label: "Performances", gradient: "from-[#FFD93D]/20 to-[#FF6B6B]/10", size: "wide" },
  { label: "Student Community", gradient: "from-[#4A7CFF]/20 to-[#7C6BFF]/10", size: "small" },
];

const contacts = [
  { icon: MapPin, label: "Location", value: "Brightburn Dance & Fitness Studio" },
  { icon: Phone, label: "Phone", value: "+91-XXXXX-XXXXX" },
  { icon: InstaIcon, label: "Instagram", value: "@brightburn.studio" },
  { icon: Clock, label: "Timings", value: "Morning and evening batches available" },
];

export default function StudioLanding() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050507] text-[#FAFAFA]">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[rgba(5,5,7,0.85)] backdrop-blur-2xl shadow-lg shadow-black/20 border-b border-[rgba(255,255,255,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 transition-all duration-300">
            <a href="/studio" className="flex items-center gap-2.5 group">
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-[#4A7CFF] to-[#FF6B6B] shadow-lg shadow-[#4A7CFF]/20 group-hover:shadow-[#4A7CFF]/40 transition-shadow duration-300">
                <Flame size={16} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-[#FAFAFA] tracking-tight">Brightburn</span>
            </a>
            <div className="flex items-center gap-1">
              <NavLink href="#classes" label="Programs" />
              <NavLink href="#features" label="Features" />
              <NavLink href="#schedule" label="Schedule" hidden />
              <NavLink href="#inquiry" label="Contact" />
              <div className="h-5 w-px bg-[rgba(255,255,255,0.06)] mx-2" />
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/"} className="text-xs">
                Open App <ChevronRight size={12} />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <LandingHero />

      <section id="about" className="relative py-28 sm:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4A7CFF]/3 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-gradient-to-r from-[#4A7CFF] to-transparent" />
                  <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#4A7CFF]">About</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.02em]">
                  Where dance meets
                  <br />
                  <span className="text-gradient-primary">discipline</span>
                </h2>
                <p className="text-base sm:text-lg text-[#B6B6C2] leading-relaxed max-w-xl">
                  Brightburn Dance & Fitness Studio brings together dance training, fitness sessions, discipline, and community.
                  From beginners to advanced learners, students get structured batches, progress tracking, attendance transparency,
                  and a professional studio experience.
                </p>
                <div className="flex flex-wrap gap-8 pt-2">
                  {[
                    { number: "4+", label: "Programs" },
                    { number: "QR", label: "Attendance" },
                    { number: "24/7", label: "Dashboard" },
                  ].map((s) => (
                    <div key={s.label} className="space-y-1">
                      <p className="text-2xl font-semibold text-[#FAFAFA]">{s.number}</p>
                      <p className="text-xs text-[#737380]">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#4A7CFF]/10 via-[#FF6B6B]/5 to-[#7C6BFF]/10 rounded-[32px] blur-2xl" />
                  <div className="relative rounded-[24px] p-8 border-gradient" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <Flame size={28} className="text-[#4A7CFF] mb-4" />
                    <p className="text-sm text-[#B6B6C2] leading-relaxed italic">
                      &ldquo;Every student deserves a space where they can grow, express, and push their limits.&rdquo;
                    </p>
                    <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A7CFF] to-[#FF6B6B] flex items-center justify-center text-xs font-bold text-white">
                        BB
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#FAFAFA]">Brightburn Team</p>
                        <p className="text-[10px] text-[#737380]">Est. 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="classes" className="relative py-28 sm:py-36">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF6B6B]/3 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Programs"
            subtitle="Find the right program for every age and skill level"
            align="left"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {programs.map((p, i) => (
              <ProgramCard key={p.name} {...p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="relative py-28 sm:py-36">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7C6BFF]/3 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Brightburn"
            subtitle="Everything you need for a premium studio experience"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section id="schedule" className="relative py-28 sm:py-36">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4A7CFF]/3 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Weekly Schedule"
            subtitle="Regular class timings for all programs"
            align="left"
          />
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <SchedulePreview />
            </div>
            <ScrollReveal direction="right" delay={0.2} className="hidden lg:block">
              <div className="rounded-[24px] p-8 border-gradient" style={{ background: "rgba(255,255,255,0.03)" }}>
                <h3 className="text-lg font-semibold text-[#FAFAFA] mb-3">Flexible Timing</h3>
                <p className="text-sm text-[#B6B6C2] leading-relaxed mb-6">
                  Morning and evening batches available across all programs. Contact us for custom timing options.
                </p>
                <Button variant="glass" onClick={() => {
                  const el = document.getElementById("inquiry");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}>
                  <Sparkles size={14} /> Enroll Now
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section id="gallery" className="relative py-28 sm:py-36">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFD93D]/3 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Gallery"
            subtitle="A glimpse into the Brightburn experience"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {galleryItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-40px" }}
                className={`relative rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center overflow-hidden group cursor-pointer ${
                  item.size === "large" ? "sm:col-span-2 sm:row-span-2 h-64 sm:h-auto" :
                  item.size === "wide" ? "sm:col-span-2 h-48 sm:h-56" :
                  "h-48 sm:h-56"
                }`}
              >
                <div className="absolute inset-0 bg-[#050507]/50 group-hover:bg-[#050507]/30 transition-colors duration-500" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Camera size={32} className="relative z-10 text-white/40 group-hover:text-white/70 transition-all duration-300 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm font-medium text-[#FAFAFA]">{item.label}</p>
                  <p className="text-[10px] text-[#B6B6C2] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Photo placeholder</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="inquiry" className="relative py-28 sm:py-36">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4A7CFF]/3 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-2 lg:sticky lg:top-28 space-y-6">
              <ScrollReveal>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-gradient-to-r from-[#4A7CFF] to-transparent" />
                  <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#4A7CFF]">Inquiry</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.02em]">
                  Start your
                  <br />
                  <span className="text-gradient-primary">journey</span>
                </h2>
                <p className="text-base text-[#B6B6C2] leading-relaxed">
                  Fill in the form and we&apos;ll get back to you with all the details you need to get started.
                </p>
                <div className="space-y-3 pt-2">
                  {[
                    "Free trial class available",
                    "No registration fees",
                    "Flexible batch timings",
                  ].map((perk) => (
                    <div key={perk} className="flex items-center gap-2.5 text-sm text-[#B6B6C2]">
                      <Sparkles size={14} className="text-[#4A7CFF]" />
                      {perk}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-3">
              <ScrollReveal direction="right" delay={0.15}>
                <div className="rounded-[24px] p-6 sm:p-8 border-gradient" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <InquiryForm />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative py-28 sm:py-36">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF6B6B]/3 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Get in Touch"
            subtitle="We&apos;d love to hear from you"
          />
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="rounded-[24px] p-8 sm:p-10 border-gradient" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="grid sm:grid-cols-2 gap-8">
                  {contacts.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-4 group"
                      >
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#4A7CFF]/15 to-[#FF6B6B]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Icon size={18} className="text-[#4A7CFF]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#737380] uppercase tracking-wider">{item.label}</p>
                          <p className="text-sm text-[#FAFAFA] mt-0.5">{item.value}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-10 pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-wrap gap-3 justify-center">
                  <Button><Phone size={15} /> Call Now</Button>
                  <Button variant="glass"><MessageIcon size={15} /> WhatsApp Inquiry</Button>
                  <Button variant="outline" onClick={() => window.location.href = "/"}>
                    <ChevronRight size={15} /> Open Demo App
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

function NavLink({ href, label, hidden }: { href: string; label: string; hidden?: boolean }) {
  return (
    <a
      href={href}
      className={`text-xs text-[#B6B6C2] hover:text-[#FAFAFA] transition-colors px-3 py-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] ${
        hidden ? "hidden sm:inline-block" : ""
      }`}
    >
      {label}
    </a>
  );
}

function SectionHeader({
  title,
  subtitle,
  align = "center",
}: {
  title: string;
  subtitle: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-60px" }}
      className={`mb-14 ${align === "left" ? "text-left" : "text-center"}`}
    >
      {align === "left" && (
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-gradient-to-r from-[#4A7CFF] to-transparent" />
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#4A7CFF]">{title}</span>
        </div>
      )}
      <h2 className={`text-3xl sm:text-4xl leading-[1.1] tracking-[-0.02em] ${align === "left" ? "" : ""}`}>
        {align === "left" ? subtitle : title}
      </h2>
      {align === "center" && (
        <p className="text-sm text-[#B6B6C2] mt-3 max-w-xl mx-auto">{subtitle}</p>
      )}
    </motion.div>
  );
}

function TrendingUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function InstaIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface IconSize { size?: number; className?: string; }
function MessageIcon({ size = 24, className }: IconSize) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}