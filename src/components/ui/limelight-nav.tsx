"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Building2,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare, label: "Chat", href: "/dashboard/chat" },
  { icon: Building2, label: "Departments", href: "/dashboard/department/sales", disabled: true },
  { icon: Settings, label: "Settings", href: "/dashboard/settings", disabled: true },
];

export function LimelightNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 rounded-2xl border border-border bg-card/80 p-1.5 backdrop-blur-xl">
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;

        if (item.disabled) {
          return (
            <div
              key={item.href}
              className="relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm opacity-40 cursor-not-allowed"
              title="Coming in Sprint 2"
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{item.label}</span>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-colors"
          >
            {isActive && (
              <motion.div
                layoutId="nav-highlight"
                className="absolute inset-0 rounded-xl bg-accent/10 border border-accent/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <Icon
              size={18}
              className={`relative z-10 ${isActive ? "text-accent" : "text-muted-foreground"}`}
            />
            <span
              className={`relative z-10 hidden sm:inline ${
                isActive ? "text-accent font-medium" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
