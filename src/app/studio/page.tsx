"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════
   BRIGHTBURN STUDIO — Landing
   Design: Premium editorial. No templates.
   ═══════════════════════════════════════════════ */

/* ─── Data ─── */
const programs = [
  { name: "Kids Beginner Dance", desc: "Rhythm, coordination, and confidence for young dancers.", ages: "Ages 4–8", time: "Mon / Wed / Fri — 5:00 PM" },
  { name: "Hip Hop Teens", desc: "Choreography and performance.", ages: "Ages 12–17", time: "Tue / Thu / Sat — 6:30 PM" },
  { name: "Fitness & Zumba", desc: "High-energy cardio, strength, and movement.", ages: "Ages 13+", time: "Mon – Fri — 7:30 AM" },
  { name: "Advanced Dance Crew", desc: "Intensive training for experienced dancers.", ages: "Ages 15+ (eval)", time: "Sat / Sun — 8:00 PM" },
  { name: "Personal Training", desc: "One-on-one sessions.", ages: "All ages", time: "By appointment" },
];

const contactInfo = [
  { label: "Location", value: "Brightburn Dance & Fitness Studio" },
  { label: "Phone", value: "+91-XXXXX-XXXXX" },
  { label: "Instagram", value: "@brightburn.studio" },
];

/* ─── Hooks ─── */
const easeReveal = [0.22, 1, 0.36, 1] as const;

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return { ref, inView };
}

/* ─── Reveal Components ─── */
function FadeUp({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: easeReveal }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ScaleIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: easeReveal }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Hero Visual (abstract motion paths) ─── */
function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame: number;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      if (!prefersReduced) t += 0.006;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Three choreographic arcs
      const arcs = [
        { x1: 0.15, y1: 0.2, x2: 0.85, y2: 0.5, cx: 0.3, cy: 0.7, phase: 0, speed: 0.3 },
        { x1: 0.1, y1: 0.6, x2: 0.75, y2: 0.2, cx: 0.6, cy: 0.2, phase: 2, speed: 0.4 },
        { x1: 0.2, y1: 0.8, x2: 0.9, y2: 0.4, cx: 0.4, cy: 0.3, phase: 4, speed: 0.25 },
      ];

      if (!prefersReduced) {
        for (const arc of arcs) {
          ctx.beginPath();
          ctx.moveTo(w * arc.x1, h * arc.y1);
          ctx.quadraticCurveTo(w * arc.cx, h * arc.cy, w * arc.x2, h * arc.y2);
          ctx.strokeStyle = `rgba(232,93,58,${0.06 + 0.03 * Math.sin(t * arc.speed + arc.phase)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Moving particles along paths
      for (const arc of arcs) {
        for (let i = 0; i < 2; i++) {
          const progress = ((t * arc.speed + arc.phase + i * 0.5) % 1);
          const px = w * (arc.x1 + (arc.cx - arc.x1) * 2 * (1 - progress) * progress + (arc.x2 - arc.x1) * progress * progress);
          const py = h * (arc.y1 + (arc.cy - arc.y1) * 2 * (1 - progress) * progress + (arc.y2 - arc.y1) * progress * progress);

          const size = 2.5 - i * 0.8;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232,93,58,${0.2 - i * 0.06})`;
          ctx.fill();
        }
      }

      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />;
}

/* ═══════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════ */

export default function StudioLanding() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-body min-h-screen" style={{ background: "#0A0A0A" }}>
      {/* ─── Nav ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navScrolled ? "bg-[#0A0A0A]/90 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2.5 group">
              <span className="text-sm font-semibold tracking-tight" style={{ color: "var(--text-primary-new)" }}>
                Brightburn
              </span>
              <span className="text-[10px]" style={{ color: "var(--text-muted-new)" }}>Studio</span>
            </button>
            <div className="flex items-center gap-1">
              <button onClick={() => scrollTo("programs")} className="text-xs px-3 py-1.5 rounded-lg transition-colors duration-200" style={{ color: "var(--text-secondary-new)" }}>
                Programs
              </button>
              <button onClick={() => scrollTo("contact")} className="text-xs px-3 py-1.5 rounded-lg transition-colors duration-200" style={{ color: "var(--text-secondary-new)" }}>
                Contact
              </button>
              <div className="h-4 w-px mx-2" style={{ background: "var(--border-new)" }} />
              <a href="/" className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200" style={{ color: "var(--accent)", border: "1px solid var(--accent-dim)", background: "transparent" }}>
                Open App
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: easeReveal }}
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "var(--text-muted-new)" }}>
              Kochi
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12 items-end mt-8">
            {/* Left */}
            <div className="lg:col-span-7 space-y-8">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.15, ease: easeReveal }}
                className="text-[clamp(2.8rem,8vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.04em]"
                style={{ color: "var(--text-primary-new)" }}
              >
                Dance.
                <br />
                <span style={{ color: "var(--accent)" }}>Move.</span>
                <br />
                Grow.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: easeReveal }}
                className="text-base sm:text-lg max-w-md leading-relaxed"
                style={{ color: "var(--text-secondary-new)" }}
              >
                A studio built on discipline, energy, and real progress.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: easeReveal }}
                className="flex flex-wrap gap-3"
              >
                <button onClick={() => scrollTo("contact")} className="px-6 py-3 text-sm font-medium text-white rounded-lg transition-colors duration-200" style={{ background: "var(--accent)" }}>
                  Get in touch
                </button>
                <button onClick={() => scrollTo("programs")} className="px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200" style={{ color: "var(--text-secondary-new)", border: "1px solid var(--border-new)", background: "transparent" }}>
                  View programs
                </button>
              </motion.div>
            </div>

            {/* Right — visual */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: easeReveal }}
              className="lg:col-span-5 hidden lg:block"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative" style={{ background: "var(--surface-new)", border: "1px solid var(--border-new)" }}>
                <HeroVisual />
                <div className="absolute bottom-5 left-5">
                  <span className="text-xs" style={{ color: "var(--text-muted-new)" }}>Motion studies</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ STUDIO ═══ */}
      <section className="py-28 lg:py-36" style={{ borderTop: "1px solid var(--border-new)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-8">
              <FadeUp>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "var(--text-muted-new)" }}>
                  About
                </span>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.0] tracking-[-0.03em]" style={{ color: "var(--text-primary-new)" }}>
                  A studio built for
                  <br />
                  <span style={{ color: "var(--accent)" }}>movement</span>
                </h2>
              </FadeUp>
              <FadeUp delay={0.2}>
                <p className="max-w-md leading-relaxed" style={{ color: "var(--text-secondary-new)" }}>
                  Brightburn is where discipline meets expression. Structured dance and fitness programs
                  with professional coaching and progress tracking.
                </p>
              </FadeUp>
            </div>

            {/* Right — stat block */}
            <ScaleIn delay={0.3}>
              <div className="rounded-2xl p-8" style={{ background: "var(--surface-new)", border: "1px solid var(--border-new)" }}>
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {[
                    { number: "5", label: "Programs" },
                    { number: "QR", label: "Attendance" },
                    { number: "24/7", label: "Dashboard" },
                    { number: "All", label: "Age Groups" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text-primary-new)" }}>{stat.number}</p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted-new)" }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid var(--border-new)", paddingTop: "1.5rem" }}>
                  <blockquote className="text-sm italic leading-relaxed" style={{ color: "var(--text-secondary-new)" }}>
                    &ldquo;Every student deserves a space where they can grow, express, and push their limits.&rdquo;
                  </blockquote>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
                      BB
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: "var(--text-primary-new)" }}>Brightburn Team</p>
                      <p className="text-[10px]" style={{ color: "var(--text-muted-new)" }}>Est. 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* ═══ PROGRAMS ═══ */}
      <ProgramsSection />

      {/* ═══ CONTACT ═══ */}
      <ContactSection />

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: "1px solid var(--border-new)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary-new)" }}>Brightburn</span>
              <span className="text-[10px]" style={{ color: "var(--text-muted-new)" }}>Studio</span>
            </div>
            <div className="flex items-center gap-6 text-xs" style={{ color: "var(--text-muted-new)" }}>
              <a href="#" className="hover:opacity-70 transition-opacity">Instagram</a>
              <a href="#" className="hover:opacity-70 transition-opacity">WhatsApp</a>
              <a href="#" className="hover:opacity-70 transition-opacity">Email</a>
            </div>
            <p className="text-[10px]" style={{ color: "var(--text-muted-new)" }}>
              &copy; {new Date().getFullYear()} Brightburn Dance & Fitness Studio
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PROGRAMS SECTION — Editorial list
   ═══════════════════════════════════════════════ */

function ProgramsSection() {
  const { ref, inView } = useReveal();

  return (
    <section id="programs" className="py-28 lg:py-36" ref={ref} style={{ background: "var(--surface-new)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <FadeUp>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "var(--text-muted-new)" }}>
            Programs
          </span>
        </FadeUp>

        <div className="mt-10 divide-y" style={{ borderColor: "var(--border-new)" }}>
          {programs.map((p, i) => (
            <ProgramRow key={p.name} {...p} index={i} inView={inView} />
          ))}
        </div>

        <FadeUp delay={0.15}>
          <div className="mt-10" style={{ borderTop: "1px solid var(--border-new)", paddingTop: "1.5rem" }}>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="text-xs uppercase tracking-[0.15em] transition-all duration-200 inline-flex items-center gap-2"
              style={{ color: "var(--text-muted-new)" }}>
              Inquire about a program
              <span className="inline-block transition-transform duration-200" style={{ color: "var(--accent)" }}>→</span>
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function ProgramRow({ name, desc, ages, time, index, inView }: {
  name: string; desc: string; ages: string; time: string; index: number; inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05, ease: easeReveal }}
      className="group py-5 grid lg:grid-cols-12 gap-3 lg:gap-6 items-start cursor-default"
      style={{ borderColor: "var(--border-new)" }}
    >
      <div className="lg:col-span-1">
        <span className="text-xs font-mono" style={{ color: "var(--text-muted-new)" }}>
          {(index + 1).toString().padStart(2, "0")}
        </span>
      </div>
      <div className="lg:col-span-5">
        <h3 className="text-base sm:text-lg font-semibold transition-colors duration-200" style={{ color: "var(--text-primary-new)" }}>
          {name}
        </h3>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary-new)" }}>{desc}</p>
      </div>
      <div className="lg:col-span-3">
        <p className="text-xs" style={{ color: "var(--text-muted-new)" }}>{ages}</p>
      </div>
      <div className="lg:col-span-3">
        <p className="text-xs" style={{ color: "var(--text-muted-new)" }}>{time}</p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   CONTACT — Minimal. Large email. Clean form.
   ═══════════════════════════════════════════════ */

function ContactSection() {
  const { ref, inView } = useReveal();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const existing = JSON.parse(localStorage.getItem("brightburn_admissions") || "[]");
      if (Array.isArray(existing)) {
        existing.push({
          id: `inq-${Date.now()}`,
          name: form.name,
          parentName: form.name,
          parentPhone: form.phone,
          interestedBatch: "",
          notes: form.message,
          stage: "inquiry",
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("brightburn_admissions", JSON.stringify(existing));
      }
    } catch { /* unavailable */ }
    setSent(true);
  };

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <section id="contact" className="py-28 lg:py-36" style={{ borderTop: "1px solid var(--border-new)" }} ref={ref}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left — info */}
          <div className="lg:col-span-5 space-y-8">
            <FadeUp>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "var(--text-muted-new)" }}>
                Contact
              </span>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.0] tracking-[-0.03em]" style={{ color: "var(--text-primary-new)" }}>
                <span style={{ color: "var(--accent)" }}>hello@</span>brightburn.studio
              </h2>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="space-y-3">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-3">
                    <span className="text-xs w-20 shrink-0" style={{ color: "var(--text-muted-new)" }}>{info.label}</span>
                    <span className="text-sm" style={{ color: "var(--text-secondary-new)" }}>{info.value}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Right — form */}
          <ScaleIn delay={0.2}>
            <div className="rounded-2xl p-6 sm:p-8" style={{ background: "var(--surface-new)", border: "1px solid var(--border-new)" }}>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="py-12 text-center">
                    <p className="text-sm" style={{ color: "var(--text-secondary-new)" }}>Thanks. We&apos;ll be in touch.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted-new)" }}>Name</label>
                        <input type="text" placeholder="Your name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted-new)" }}>Phone</label>
                        <input type="tel" placeholder="Your number" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted-new)" }}>Message</label>
                      <textarea placeholder="What are you looking for?" value={form.message} onChange={(e) => update("message", e.target.value)} rows={3} className="w-full resize-none" />
                    </div>
                    <button type="submit" className="w-full px-6 py-3 text-sm font-medium text-white rounded-lg transition-colors duration-200" style={{ background: "var(--accent)" }}>
                      Send inquiry
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </ScaleIn>
        </div>
      </div>
    </section>
  );
}
