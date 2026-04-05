"use client";

import { motion } from "framer-motion";

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function AnimatedCheckbox({
  checked,
  onChange,
  label,
}: AnimatedCheckboxProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <button
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
          checked
            ? "border-accent bg-accent"
            : "border-border bg-background hover:border-accent/50"
        }`}
      >
        <motion.svg
          viewBox="0 0 12 12"
          className="h-3 w-3 text-white"
          initial={false}
          animate={checked ? "checked" : "unchecked"}
        >
          <motion.path
            d="M2 6l3 3 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              checked: { pathLength: 1, opacity: 1 },
              unchecked: { pathLength: 0, opacity: 0 },
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.svg>
      </button>
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </label>
  );
}
