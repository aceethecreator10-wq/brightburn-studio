"use client";
import { useEffect, useRef } from "react";

interface HeroCanvasProps {
  intensity?: number;
  className?: string;
}

export function HeroCanvas({ intensity = 1, className = "" }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame: number;
    let t = 0;
    const speed = prefersReduced ? 0 : 0.003 * intensity;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += speed;
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, `rgba(74,124,255,${0.07 * intensity})`);
      bg.addColorStop(0.5, `rgba(124,107,255,${0.04 * intensity})`);
      bg.addColorStop(1, `rgba(255,79,122,${0.03 * intensity})`);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      if (!prefersReduced) {
        const waveData = [
          { baseY: 0.32, amp: 45, freq: 0.0048, speed: 0.4, phase: 0,   color: "74,124,255", alpha: 0.08, w: 1.4 },
          { baseY: 0.48, amp: 35, freq: 0.0056, speed: 0.6, phase: 2.0, color: "124,107,255", alpha: 0.06, w: 1.0 },
          { baseY: 0.62, amp: 28, freq: 0.0040, speed: 0.3, phase: 4.0, color: "74,124,255", alpha: 0.05, w: 0.7 },
          { baseY: 0.22, amp: 20, freq: 0.0035, speed: 0.5, phase: 1.3, color: "255,79,122", alpha: 0.04, w: 0.5 },
          { baseY: 0.75, amp: 18, freq: 0.0065, speed: 0.8, phase: 3.1, color: "124,107,255", alpha: 0.035, w: 0.4 },
        ];

        for (const wave of waveData) {
          ctx.beginPath();
          ctx.lineWidth = wave.w;
          const baseY = h * wave.baseY;

          for (let x = 0; x <= w; x += 3) {
            const y = baseY
              + wave.amp * Math.sin(x * wave.freq + t * wave.speed + wave.phase)
              + wave.amp * 0.3 * Math.sin(x * wave.freq * 2.1 + t * wave.speed * 0.6 + wave.phase);

            const edgeFade = Math.min(x / 60, 1) * Math.min((w - x) / 60, 1);
            ctx.globalAlpha = wave.alpha * edgeFade * intensity;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.globalAlpha = 1;
          ctx.strokeStyle = `rgba(${wave.color}, ${wave.alpha * intensity})`;
          ctx.stroke();
        }
      }

      const cx = w * (0.7 + 0.15 * Math.sin(t * 0.5));
      const cy = h * (0.3 + 0.15 * Math.cos(t * 0.4));
      const orb = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.4);
      orb.addColorStop(0, `rgba(74,124,255,${0.07 * intensity})`);
      orb.addColorStop(0.5, `rgba(124,107,255,${0.03 * intensity})`);
      orb.addColorStop(1, "transparent");
      ctx.fillStyle = orb;
      ctx.fillRect(0, 0, w, h);

      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
