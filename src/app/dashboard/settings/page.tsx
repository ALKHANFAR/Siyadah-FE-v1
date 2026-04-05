"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex items-center justify-center p-8 min-h-[calc(100vh-4rem)]">
      <EmptyState
        icon={<Settings size={28} className="text-muted-foreground" />}
        title="Settings — Coming in Sprint 2"
        description="Manage your connected channels, notification preferences, and account settings."
      />
    </div>
  );
}
