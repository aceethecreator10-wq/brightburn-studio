"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════
   BRIGHTBURN — Warm Editorial
   A boutique studio at golden hour.
   ═══════════════════════════════════════════════ */

const programs = [
  { name: "Kids Beginner Dance", desc: "Rhythm, coordination, confidence.", ages: "4–8 yrs", time: "Mon / Wed / Fri — 5 PM" },
  { name: "Hip Hop Teens", desc: "Choreography, groove, performance.", ages: "12–17 yrs", time: "Tue / Thu / Sat — 6:30 PM" },
  { name: "Fitness & Zumba", desc: "Cardio, strength, energy.", ages: "13+ yrs", time: "Mon – Fri — 7:30 AM" },
  { name: "Advanced Dance Crew", desc: "Intensive. Stage-ready.", ages: "15+ (eval)", time: "Sat / Sun — 8 PM" },
  { name: "Personal Training", desc: "One-on-one. Your goals.", ages: "All ages", time: "By appointment" },
];

const contactInfo = [
  { label: "Location", value: "Brightburn Studio, Kochi" },
  { label: "Phone", value: "+91-XXXXX-XXXXX" },
  { label: "Instagram", value: "@brightburn.studio" },
];

const easeSmooth = [0.22, 1, 0.36, 1] as const;

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return { ref, inView };
}

function FadeUp({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: easeSmooth }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Golden hour canvas — warm particles, soft light ─── */
function GoldenHour() {
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

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; alpha: number; phase: number }[] = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        size: 1.5 + Math.random() * 3,
        speedX: -0.0003 + Math.random() * 0.0006,
        speedY: -0.0002 + Math.random() * 0.0004,
        alpha: 0.1 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      if (!prefersReduced) t += 0.005;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Warm glow gradient
      const grd = ctx.createRadialGradient(w * 0.7, h * 0.3, 0, w * 0.7, h * 0.3, w * 0.7);
      grd.addColorStop(0, "rgba(212,163,115,0.08)");
      grd.addColorStop(0.4, "rgba(200,97,53,0.04)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // Second warm glow
      const grd2 = ctx.createRadialGradient(w * 0.2, h * 0.7, 0, w * 0.2, h * 0.7, w * 0.5);
      grd2.addColorStop(0, "rgba(232,93,58,0.04)");
      grd2.addColorStop(1, "transparent");
      ctx.fillStyle = grd2;
      ctx.fillRect(0, 0, w, h);

      if (!prefersReduced) {
        for (const p of particles) {
          const px = w * (p.x + Math.sin(t * p.speedX + p.phase) * 0.02);
          const py = h * (p.y + Math.cos(t * p.speedY + p.phase) * 0.02);
          const alpha = p.alpha * (0.6 + 0.4 * Math.sin(t * 0.5 + p.phase));

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,163,115,${alpha})`;
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}

/* ─── Warm image placeholder — abstract dance composition ─── */
function WarmImage({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: "linear-gradient(145deg, #EDE3D4 0%, #E8D5C0 30%, #DCC4A8 60%, #D4B898 100%)",
        boxShadow: "inset 0 2px 20px rgba(140,100,70,0.08)",
      }}
    >
      <GoldenHour />
      {/* Abstract silhouette suggestion */}
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <svg viewBox="0 0 200 260" className="w-3/5 h-3/5 opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 20 C120 40 140 30 150 50 C160 70 140 100 130 110 C120 120 100 130 90 140 C80 150 60 170 50 190 C40 210 30 240 30 240 L170 240 C170 240 175 200 180 180 C185 160 190 130 175 110 C160 90 140 80 130 70 C120 60 110 40 100 20Z"
            fill="rgba(200,97,53,0.15)" />
          <circle cx="100" cy="15" r="8" fill="rgba(200,97,53,0.12)" />
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTIONS
   ═══════════════════════════════════════════════ */

function NavWarm() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(249,246,240,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(180,160,140,0.08)" : "none",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight" style={{ color: "var(--text-heading)" }}>Brightburn</span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" })}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors" style={{ color: "var(--text-muted-warm)" }}>
              Programs
            </button>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors" style={{ color: "var(--text-muted-warm)" }}>
              Contact
            </button>
            <a href="/" className="text-xs font-medium px-4 py-1.5 rounded-lg transition-all"
              style={{ color: "white", background: "linear-gradient(135deg, #C86135, #D4734A)", boxShadow: "0 2px 8px rgba(200,97,53,0.2)" }}>
              Open App
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function HeroWarm() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 w-full pb-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left — typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeSmooth }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="accent-line" />
              <span className="warm-label">Kochi</span>
            </div>

            <h1 className="text-[clamp(3rem,7vw,5rem)] font-semibold leading-[0.92] tracking-[-0.04em]"
              style={{ color: "var(--text-heading)" }}>
              Dance.
              <br />
              <span style={{ color: "var(--accent-terracotta)" }}>Move.</span>
              <br />
              Grow.
            </h1>

            <p className="text-base sm:text-lg max-w-md leading-relaxed"
              style={{ color: "var(--text-body)" }}>
              A dance and fitness studio built on discipline, energy, and real progress.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="warm-btn warm-btn-primary">
                Get in touch
              </button>
              <button onClick={() => document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" })}
                className="warm-btn warm-btn-secondary">
                View programs
              </button>
            </div>
          </motion.div>

          {/* Right — warm visual */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: easeSmooth }}
            className="lg:col-span-6 hidden lg:block"
          >
            <div className="aspect-[4/3] rounded-3xl relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #EDE3D4 0%, #E8D5C0 30%, #DCC4A8 60%, #D4B898 100%)",
                boxShadow: "0 8px 40px rgba(140,100,70,0.12), inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              <GoldenHour />
              <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <svg viewBox="0 0 240 300" className="w-3/5 h-3/5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M120 20 C145 45 170 35 180 60 C190 85 165 120 155 130 C145 140 120 150 110 160 C100 170 75 195 60 220 C45 245 35 280 35 280 L205 280 C205 280 210 230 215 205 C220 180 225 145 205 120 C185 95 160 85 150 75 C140 65 130 40 120 20Z"
                    fill="rgba(200,97,53,0.12)" />
                  <circle cx="120" cy="18" r="10" fill="rgba(200,97,53,0.08)" />
                  <path d="M80 260 C100 240 140 240 160 260" stroke="rgba(200,97,53,0.08)" strokeWidth="1" fill="none" />
                </svg>
              </div>
              <div className="absolute bottom-5 left-5">
                <span className="text-xs" style={{ color: "var(--text-faint)" }}>Golden hour at the studio</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── About — editorial split ─── */
function AboutWarm() {
  const { ref, inView } = useReveal();

  return (
    <section className="py-28 lg:py-36" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: easeSmooth }}
            className="lg:col-span-6"
          >
            <div className="aspect-[5/4] rounded-3xl relative overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #E8D5C0 0%, #DCC4A8 40%, #D4B898 70%, #C8A880 100%)",
                boxShadow: "inset 0 2px 20px rgba(140,100,70,0.08), 0 8px 32px rgba(140,100,70,0.08)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <svg viewBox="0 0 200 200" className="w-2/3 h-2/3" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="70" r="30" fill="rgba(200,97,53,0.08)" />
                  <path d="M60 180 C70 140 90 120 100 110 C110 120 130 140 140 180" fill="rgba(200,97,53,0.06)" />
                  <path d="M70 160 C85 145 115 145 130 160" stroke="rgba(200,97,53,0.08)" strokeWidth="1" fill="none" />
                  <path d="M100 100 L100 110" stroke="rgba(200,97,53,0.06)" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Quote / text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: easeSmooth }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="space-y-2">
              <span className="accent-line" />
              <span className="warm-label">About</span>
            </div>

            <blockquote className="text-[clamp(1.4rem,2.5vw,2rem)] font-semibold leading-[1.2] tracking-[-0.02em]"
              style={{ color: "var(--text-heading)" }}>
              &ldquo;Every student deserves a space where they can<br />
              <span style={{ color: "var(--accent-terracotta)" }}>grow, express, and push their limits.</span>&rdquo;
            </blockquote>

            <p className="text-sm leading-relaxed max-w-sm"
              style={{ color: "var(--text-body)" }}>
              Brightburn brings together dance and fitness under one roof. Structured programs,
              professional coaching, and a community that pushes everyone forward.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--accent-terracotta-dim)", color: "var(--accent-terracotta)" }}>
                BB
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--text-heading)" }}>Brightburn</p>
                <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>Est. 2024</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Programs — alternating editorial ─── */
function ProgramsWarm() {
  const { ref, inView } = useReveal();

  return (
    <section id="programs" className="py-28 lg:py-36" ref={ref}
      style={{ background: "linear-gradient(180deg, transparent 0%, rgba(237,227,212,0.3) 50%, transparent 100%)" }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <FadeUp>
          <div className="flex items-center gap-3 mb-3">
            <span className="accent-line" />
            <span className="warm-label">Programs</span>
          </div>
        </FadeUp>

        <div className="mt-12 space-y-0">
          {programs.map((p, i) => (
            <ProgramRowWarm key={p.name} {...p} index={i} inView={inView} />
          ))}
        </div>

        <FadeUp delay={0.15}>
          <div className="mt-12 flex items-center gap-6" style={{ borderTop: "1px solid var(--border-warm)", paddingTop: "1.5rem" }}>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="warm-btn warm-btn-primary text-xs px-5 py-2.5">
              Inquire
            </button>
            <span className="text-xs" style={{ color: "var(--text-faint)" }}>All levels welcome</span>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function ProgramRowWarm({ name, desc, ages, time, index, inView }: {
  name: string; desc: string; ages: string; time: string; index: number; inView: boolean;
}) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06, ease: easeSmooth }}
      className="group py-6 lg:py-8 cursor-default"
      style={{ borderBottom: "1px solid var(--border-warm)" }}
    >
      <div       className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        {/* Number + Name */}
        <div className="lg:col-span-4 flex items-start gap-4">
          <span className="text-xs font-mono pt-0.5" style={{ color: "var(--text-faint)" }}>
            {(index + 1).toString().padStart(2, "0")}
          </span>
          <h3 className="text-lg sm:text-xl font-semibold transition-colors"
            style={{ color: "var(--text-heading)" }}>
            {name}
          </h3>
        </div>

        {/* Description */}
        <div className="lg:col-span-4 lg:col-start-6">
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-body)" }}>{desc}</p>
        </div>

        {/* Details column */}
        <div className="lg:col-span-3 lg:col-start-10 flex flex-col sm:flex-row lg:flex-col gap-1 sm:gap-4 lg:gap-1">
          <span className="text-xs" style={{ color: "var(--text-faint)" }}>{ages}</span>
          <span className="text-xs" style={{ color: "var(--text-faint)" }}>{time}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Contact — warm gradient card ─── */
function ContactWarm() {
  const { ref, inView } = useReveal();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 4000); };

  return (
    <section id="contact" className="py-28 lg:py-36" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: easeSmooth }}
          className="rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #F5EDE0 0%, #EDE3D4 30%, #E8D5C0 70%, #E0CCB4 100%)",
            boxShadow: "0 8px 40px rgba(140,100,70,0.10), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}
        >
          {/* Warm glow */}
          <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 70% 30%, rgba(212,163,115,0.12) 0%, transparent 70%)",
            }}
          />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 30% 80%, rgba(200,97,53,0.06) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="accent-line mb-3" />
                <span className="warm-label">Contact</span>
              </div>

              <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[1.0] tracking-[-0.02em]"
                style={{ color: "var(--text-heading)" }}>
                <span style={{ color: "var(--accent-terracotta)" }}>hello@</span>brightburn.studio
              </h2>

              <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--text-muted-warm)" }}>
                Kochi&rsquo;s dance and fitness studio. Morning and evening batches available.
              </p>

              <div className="space-y-2 text-xs" style={{ color: "var(--text-faint)" }}>
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-3">
                    <span className="w-16 shrink-0" style={{ color: "var(--text-faint)" }}>{info.label}</span>
                    <span style={{ color: "var(--text-muted-warm)" }}>{info.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="rounded-2xl p-6 sm:p-8"
                style={{
                  background: "rgba(255,252,248,0.6)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(180,160,140,0.12)",
                  boxShadow: "0 4px 24px rgba(140,100,70,0.06)",
                }}>
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center">
                      <p className="text-sm" style={{ color: "var(--text-muted-warm)" }}>Thanks. We&apos;ll be in touch.</p>
                    </motion.div>
                  ) : (
                    <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-faint)" }}>Name</label>
                          <input type="text" placeholder="Your name" value={form.name} onChange={(e) => update("name", e.target.value)} required className="warm-input" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-faint)" }}>Phone</label>
                          <input type="tel" placeholder="Your number" value={form.phone} onChange={(e) => update("phone", e.target.value)} required className="warm-input" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-faint)" }}>Message</label>
                        <textarea placeholder="What are you looking for?" value={form.message} onChange={(e) => update("message", e.target.value)} rows={3} className="warm-input resize-none" />
                      </div>
                      <button type="submit" className="warm-btn warm-btn-primary w-full justify-center">
                        Send inquiry
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function FooterWarm() {
  return (
    <footer className="pb-10">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div style={{ borderTop: "1px solid var(--border-warm)", paddingTop: "1.5rem" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>Brightburn Dance & Fitness Studio</p>
            <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-faint)" }}>
              <a href="#" className="hover:opacity-70 transition-opacity">Instagram</a>
              <a href="#" className="hover:opacity-70 transition-opacity">WhatsApp</a>
              <a href="#" className="hover:opacity-70 transition-opacity">Email</a>
            </div>
            <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>
              &copy; {new Date().getFullYear()} Brightburn
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════ */

export default function StudioLanding() {
  return (
    <div className="warm-body">
      <NavWarm />
      <main className="relative z-10">
        <HeroWarm />
        <AboutWarm />
        <ProgramsWarm />
        <ContactWarm />
      </main>
      <FooterWarm />
    </div>
  );
}
