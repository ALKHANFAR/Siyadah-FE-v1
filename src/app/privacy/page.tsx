import { HeaderNav } from "@/components/ui/header-nav";
import { HoverFooter } from "@/components/ui/hover-footer";

export default function PrivacyPage() {
  return (
    <>
      <HeaderNav />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground">Last updated: April 2026</p>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              This privacy policy describes how Siyadah AI collects, uses, and
              protects your information. Full legal content will be added before
              public launch.
            </p>
            <h2 className="text-lg font-semibold text-foreground">
              Information We Collect
            </h2>
            <p>
              We collect website URLs submitted for analysis and chat
              conversations to provide our services. No personal data is stored
              permanently in Sprint 1.
            </p>
            <h2 className="text-lg font-semibold text-foreground">
              How We Use Your Information
            </h2>
            <p>
              Your data is used solely to analyze your business and provide
              automation recommendations. We do not sell or share your data with
              third parties.
            </p>
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p>For privacy inquiries, contact us at privacy@siyadah-ai.com.</p>
          </div>
        </div>
      </main>
      <HoverFooter />
    </>
  );
}
