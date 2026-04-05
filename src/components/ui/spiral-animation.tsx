"use client";

import { useEffect, useRef } from "react";

export function SpiralAnimation() {
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
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const hue = 239 + i * 10;
        ctx.strokeStyle = `hsla(${hue}, 84%, 63%, ${0.08 - i * 0.02})`;
        ctx.lineWidth = 1.5;

        for (let angle = 0; angle < Math.PI * 12; angle += 0.02) {
          const radius = angle * (Math.min(width, height) / 80) + i * 40;
          const x = cx + Math.cos(angle + time * 0.3 + i) * radius;
          const y = cy + Math.sin(angle + time * 0.3 + i) * radius;

          if (angle === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2 + time * 0.1;
        const radius = 100 + Math.sin(time + i) * 200;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        const size = 1 + Math.sin(time * 2 + i) * 0.5;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(239, 84%, 63%, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.fill();
      }

      time += 0.005;
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
      className="absolute inset-0 w-full h-full opacity-40"
      aria-hidden="true"
    />
  );
}
