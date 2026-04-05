"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface PulseBeamsCTAProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function PulseBeamsCTA({
  children,
  onClick,
  disabled,
  loading,
  className = "",
}: PulseBeamsCTAProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white transition-all hover:shadow-2xl hover:shadow-accent/30 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
        />
      ) : null}
      <span className="relative">{children}</span>
      {!loading && (
        <ArrowRight
          size={20}
          className="transition-transform group-hover:translate-x-1"
        />
      )}
    </motion.button>
  );
}
