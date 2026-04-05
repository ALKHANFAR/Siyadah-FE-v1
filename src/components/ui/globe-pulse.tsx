"use client";

import { useEffect, useRef } from "react";

export function GlobePulse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    function resize() {
      if (!canvas) return;
      const size = Math.min(canvas.offsetWidth, canvas.offsetHeight);
      canvas.width = size * window.devicePixelRatio;
      canvas.height = size * window.devicePixelRatio;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(width, height) * 0.35;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      for (let i = 0; i < 5; i++) {
        const offset = (i - 2) * 0.3;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * Math.cos(offset), r, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(99, 102, 241, 0.08)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      for (let i = 0; i < 5; i++) {
        const yOff = (i - 2) * (r * 0.4);
        const xR = Math.sqrt(Math.max(0, r * r - yOff * yOff));
        ctx.beginPath();
        ctx.ellipse(cx, cy + yOff, xR, xR * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(99, 102, 241, 0.08)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      const dots = [
        { lat: 24.7, lng: 46.7 },  // Riyadh
        { lat: 25.2, lng: 55.3 },  // Dubai
        { lat: 30.0, lng: 31.2 },  // Cairo
        { lat: 21.4, lng: 39.8 },  // Jeddah
        { lat: 33.9, lng: 35.5 },  // Beirut
      ];

      dots.forEach((dot, i) => {
        const angle = ((dot.lng - 46) / 360) * Math.PI * 2 + time * 0.2;
        const latRad = (dot.lat / 90) * (Math.PI / 2);
        const x = cx + Math.cos(angle) * r * Math.cos(latRad) * 0.8;
        const y = cy - Math.sin(latRad) * r * 0.8;
        const pulse = 3 + Math.sin(time * 2 + i) * 2;

        ctx.beginPath();
        ctx.arc(x, y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${0.3 + Math.sin(time * 2 + i) * 0.2})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99, 102, 241, 0.8)";
        ctx.fill();
      });

      time += 0.01;
      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      aria-hidden="true"
    />
  );
}
