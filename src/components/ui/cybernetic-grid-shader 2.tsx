"use client";

import { useEffect, useRef } from "react";

export function CyberneticGridShader() {
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

      const gridSize = 60;
      const cols = Math.ceil(width / gridSize) + 1;
      const rows = Math.ceil(height / gridSize) + 1;

      for (let i = 0; i < cols; i++) {
        const x = i * gridSize;
        const wave = Math.sin(time + i * 0.3) * 0.02;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + wave * width, height);
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 + Math.sin(time + i * 0.5) * 0.03})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      for (let j = 0; j < rows; j++) {
        const y = j * gridSize;
        const wave = Math.sin(time + j * 0.3) * 0.02;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y + wave * height);
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 + Math.cos(time + j * 0.5) * 0.03})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;
          const dist = Math.sqrt(
            Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2)
          );
          const pulse = Math.sin(time * 2 - dist * 0.005) * 0.5 + 0.5;

          if (pulse > 0.7) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${pulse * 0.4})`;
            ctx.fill();
          }
        }
      }

      time += 0.008;
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
      className="absolute inset-0 w-full h-full opacity-30"
      aria-hidden="true"
    />
  );
}
