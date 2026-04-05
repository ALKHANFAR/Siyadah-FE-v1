"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface PulseBeamsCTAProps {
  label?: string;
  href?: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
  children?: React.ReactNode;
}

export function PulseBeamsCTA({
  label,
  href,
  onClick,
  loading,
  disabled,
  variant = "primary",
  className = "",
  children,
}: PulseBeamsCTAProps) {
  const isPrimary = variant === "primary";
  const displayText = children || label;

  const inner = (
    <motion.span
      className={`relative inline-flex items-center justify-center rounded-xl px-8 py-3 text-sm font-medium transition-all ${
        isPrimary
          ? "bg-accent text-white shadow-lg shadow-accent/25 hover:shadow-accent/40"
          : "border border-border text-foreground hover:border-accent/50 hover:text-accent"
      } ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
    >
      {isPrimary && (
        <motion.span
          className="absolute inset-0 rounded-xl bg-accent/30"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <span className="relative z-10">{displayText}</span>
    </motion.span>
  );

  if (href && !onClick) {
    return (
      <Link href={href} className="inline-block">
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-block"
    >
      {inner}
    </button>
  );
}
