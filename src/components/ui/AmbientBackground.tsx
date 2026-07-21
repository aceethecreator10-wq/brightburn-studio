"use client";
import { useEffect, useRef } from "react";

interface AmbientBackgroundProps {
  intensity?: number; // 0–1, controls visual richness
}

export function AmbientBackground({ intensity = 1 }: AmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame: number;
    let t = 0;
    let w = 0;
    let h = 0;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = prefersReduced ? 0 : 0.0022;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * Math.min(window.devicePixelRatio, 1.5);
      canvas!.height = h * Math.min(window.devicePixelRatio, 1.5);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // ─── Lissajous orb paths ───
    type Orb = {
      ax: number; bx: number; cx: number;
      ay: number; by: number; cy: number;
      r: number;
      color: [number, number, number];
      alpha: number;
      phaseX: number; phaseY: number;
    };

    const orbs: Orb[] = [
      { ax: 0.50, bx: 0.20, cx: 1.0, ay: 0.38, by: 0.16, cy: 0.7,  r: 0.52, color: [74,124,255],  alpha: 0.065 * intensity, phaseX: 0,   phaseY: 0   },
      { ax: 0.60, bx: 0.22, cx: 1.3, ay: 0.55, by: 0.18, cy: 0.9,  r: 0.40, color: [124,107,255], alpha: 0.050 * intensity, phaseX: 2.1, phaseY: 1.4 },
      { ax: 0.35, bx: 0.18, cx: 0.8, ay: 0.45, by: 0.14, cy: 0.6,  r: 0.38, color: [255,79,122],  alpha: 0.032 * intensity, phaseX: 4.2, phaseY: 2.8 },
      { ax: 0.70, bx: 0.25, cx: 1.1, ay: 0.30, by: 0.20, cy: 0.75, r: 0.30, color: [240,192,64],  alpha: 0.022 * intensity, phaseX: 1.5, phaseY: 3.5 },
      { ax: 0.25, bx: 0.28, cx: 0.65,ay: 0.65, by: 0.22, cy: 0.85, r: 0.32, color: [74,124,255],  alpha: 0.038 * intensity, phaseX: 3.1, phaseY: 0.9 },
      { ax: 0.80, bx: 0.15, cx: 1.4, ay: 0.50, by: 0.17, cy: 0.95, r: 0.28, color: [124,107,255], alpha: 0.028 * intensity, phaseX: 5.2, phaseY: 4.0 },
    ];

    // ─── Wave layers ───
    type Wave = {
      baseY: number;
      amp: number;
      freq: number;
      speed: number;
      phase: number;
      color: string;
      width: number;
      alpha: number;
    };

    const waves: Wave[] = [
      { baseY: 0.42, amp: 55, freq: 0.0038, speed: 0.35, phase: 0,   color: "74,124,255", width: 1.2, alpha: 0.045 * intensity },
      { baseY: 0.50, amp: 40, freq: 0.0045, speed: 0.50, phase: 2.1, color: "124,107,255",width: 0.8, alpha: 0.032 * intensity },
      { baseY: 0.58, amp: 30, freq: 0.0055, speed: 0.70, phase: 4.2, color: "74,124,255", width: 0.6, alpha: 0.022 * intensity },
      { baseY: 0.35, amp: 28, freq: 0.0030, speed: 0.25, phase: 1.3, color: "255,79,122", width: 0.5, alpha: 0.018 * intensity },
      { baseY: 0.65, amp: 22, freq: 0.0060, speed: 0.90, phase: 3.5, color: "124,107,255",width: 0.4, alpha: 0.014 * intensity },
    ];

    const draw = () => {
      t += speed;
      ctx.clearRect(0, 0, w, h);

      // ─── Orbs ───
      for (const orb of orbs) {
        const cx = w * (orb.ax + orb.bx * Math.sin(orb.cx * t + orb.phaseX));
        const cy = h * (orb.ay + orb.by * Math.cos(orb.cy * t + orb.phaseY));
        const radius = Math.min(w, h) * orb.r;

        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grd.addColorStop(0,    `rgba(${orb.color.join(",")},${orb.alpha})`);
        grd.addColorStop(0.45, `rgba(${orb.color.join(",")},${orb.alpha * 0.4})`);
        grd.addColorStop(0.80, `rgba(${orb.color.join(",")},${orb.alpha * 0.1})`);
        grd.addColorStop(1,    "transparent");

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
      }

      // ─── Choreographic wave lines ───
      if (!prefersReduced) {
        for (const wave of waves) {
          ctx.beginPath();
          ctx.lineWidth = wave.width;

          const baseY = h * wave.baseY;
          let firstPoint = true;

          for (let x = 0; x <= w; x += 4) {
            const progress = x / w;
            // Multi-harmonic wave — feels like a dancer's trajectory
            const y = baseY
              + wave.amp * Math.sin(x * wave.freq + t * wave.speed + wave.phase)
              + (wave.amp * 0.35) * Math.sin(x * wave.freq * 2.3 + t * wave.speed * 0.7 + wave.phase * 1.5)
              + (wave.amp * 0.15) * Math.cos(x * wave.freq * 0.6 + t * wave.speed * 1.2);

            // Fade in/out at edges
            const edgeFade = Math.min(progress * 5, 1) * Math.min((1 - progress) * 5, 1);
            ctx.globalAlpha = wave.alpha * edgeFade;

            if (firstPoint) {
              ctx.moveTo(x, y);
              firstPoint = false;
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.globalAlpha = 1;
          ctx.strokeStyle = `rgba(${wave.color},${wave.alpha})`;
          ctx.globalAlpha = 1;
          ctx.stroke();
        }
      }

      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [intensity]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{ opacity: 0.9 }}
      />
      {/* Vignette gradient for depth */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(7,7,12,0.7) 100%)",
        }}
        aria-hidden="true"
      />
      {/* Bottom fade */}
      <div
        className="fixed bottom-0 left-0 right-0 h-40 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to top, rgba(7,7,12,0.95), transparent)" }}
        aria-hidden="true"
      />
    </>
  );
}
