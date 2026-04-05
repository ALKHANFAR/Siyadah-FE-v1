"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function AnimatedCheckbox({
  checked,
  onChange,
  label,
  className = "",
}: AnimatedCheckboxProps) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 ${className}`}>
      <motion.div
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(!checked)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
          checked
            ? "border-accent bg-accent"
            : "border-border bg-card hover:border-accent/50"
        }`}
      >
        <motion.div
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <Check size={12} className="text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>
      {label && (
        <span
          className={`text-sm transition-colors ${
            checked
              ? "text-muted-foreground line-through"
              : "text-foreground"
          }`}
        >
          {label}
        </span>
      )}
    </label>
  );
}
