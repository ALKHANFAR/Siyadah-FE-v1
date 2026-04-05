"use client";

import { motion } from "framer-motion";

interface StarButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export function StarButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  className = "",
}: StarButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const variantClasses = {
    primary:
      "bg-accent text-white hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25",
    secondary:
      "bg-card text-foreground border border-border hover:border-accent/50 hover:bg-accent/5",
    ghost:
      "text-muted-foreground hover:text-foreground hover:bg-card",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {variant === "primary" && (
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity hover:opacity-100" />
      )}
      <span className="relative">{children}</span>
    </motion.button>
  );
}
