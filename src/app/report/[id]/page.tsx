"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { HeaderNav } from "@/components/ui/header-nav";
import { AnalysisResult, type AnalysisData } from "@/components/sections/analysis-result";
import { SkeletonReport } from "@/components/ui/skeleton";
import { HudStatus } from "@/components/ui/hud-status";

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 8, 95));
    }, 500);

    const stored = sessionStorage.getItem(`report-${id}`);
    if (stored) {
      try {
        setData(JSON.parse(stored));
        setProgress(100);
      } catch {
        setError("ما قدرنا نعرض التقرير. حاول مرة ثانية.");
      }
      setLoading(false);
    } else {
      setError("ما لقينا التقرير. حلل الموقع مرة ثانية.");
      setLoading(false);
    }

    return () => clearInterval(interval);
  }, [id]);

  return (
    <>
      <HeaderNav />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="mx-auto max-w-5xl">
          {loading && (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <h1 className="text-2xl font-bold text-foreground">
                  Analyzing your business...
                </h1>
                <p className="mt-2 text-muted-foreground">
                  This usually takes about 30 seconds
                </p>
                <div className="mx-auto mt-6 h-2 max-w-md overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
              <SkeletonReport />
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center gap-4 pt-12">
              <HudStatus type="error" message={error} />
              <a
                href="/"
                className="rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90"
              >
                Try Again
              </a>
            </div>
          )}

          {data && !loading && <AnalysisResult data={data} />}
        </div>
      </main>
    </>
  );
}
