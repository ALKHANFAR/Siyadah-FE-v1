"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface CalendarCTAProps {
  label?: string;
  href?: string;
  className?: string;
}

export function CalendarCTA({
  label = "Book a Demo",
  href = "#",
  className = "",
}: CalendarCTAProps) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-accent/50 hover:bg-accent/5 ${className}`}
    >
      <Calendar size={16} className="text-accent" />
      {label}
    </motion.a>
  );
}
