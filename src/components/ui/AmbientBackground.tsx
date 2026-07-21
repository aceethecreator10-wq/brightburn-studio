"use client";
import { useEffect, useRef } from "react";

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame: number;
    let time = 0;
    let width = 0;
    let height = 0;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      time += prefersReduced ? 0.001 : 0.004;
      ctx.clearRect(0, 0, width, height);

      const cx = width * (0.5 + 0.18 * Math.sin(time * 0.3));
      const cy = height * (0.4 + 0.14 * Math.cos(time * 0.25));

      const grd1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.55);
      grd1.addColorStop(0, "rgba(74,124,255,0.07)");
      grd1.addColorStop(0.35, "rgba(124,107,255,0.04)");
      grd1.addColorStop(0.7, "rgba(74,124,255,0.015)");
      grd1.addColorStop(1, "transparent");
      ctx.fillStyle = grd1;
      ctx.fillRect(0, 0, width, height);

      const cx2 = width * (0.65 + 0.2 * Math.sin(time * 0.35 + 1.5));
      const cy2 = height * (0.6 + 0.12 * Math.cos(time * 0.28 + 1.2));
      const grd2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, width * 0.4);
      grd2.addColorStop(0, "rgba(255,107,107,0.05)");
      grd2.addColorStop(0.5, "rgba(255,217,61,0.025)");
      grd2.addColorStop(1, "transparent");
      ctx.fillStyle = grd2;
      ctx.fillRect(0, 0, width, height);

      const cx3 = width * (0.3 + 0.22 * Math.sin(time * 0.28 + 3.0));
      const cy3 = height * (0.5 + 0.16 * Math.cos(time * 0.32 + 0.8));
      const grd3 = ctx.createRadialGradient(cx3, cy3, 0, cx3, cy3, width * 0.45);
      grd3.addColorStop(0, "rgba(124,107,255,0.045)");
      grd3.addColorStop(0.6, "rgba(74,124,255,0.015)");
      grd3.addColorStop(1, "transparent");
      ctx.fillStyle = grd3;
      ctx.fillRect(0, 0, width, height);

      if (!prefersReduced) {
        ctx.strokeStyle = "rgba(74,124,255,0.04)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          const offset = i * 1.8 + time * 0.5;
          const baseY = height * (0.5 + 0.08 * Math.sin(i * 2.1));
          const amp = 40 + 20 * Math.sin(i * 1.3 + time);
          const freq = 0.006 + 0.002 * Math.sin(i * 0.7);
          for (let x = 0; x <= width; x += 6) {
            const y = baseY + amp * Math.sin(x * freq + offset);
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
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
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.85 }}
      />
      <div className="fixed inset-0 pointer-events-none z-[1] bg-gradient-to-b from-[var(--bg-base)]/30 via-transparent to-[var(--bg-base)]/80" />
    </>
  );
}
