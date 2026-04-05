import { HeaderNav } from "@/components/ui/header-nav";
import { HoverFooter } from "@/components/ui/hover-footer";

export default function TermsPage() {
  return (
    <>
      <HeaderNav />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground">
            Terms of Service
          </h1>
          <p className="mt-4 text-muted-foreground">Last updated: April 2026</p>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              These terms of service govern your use of Siyadah AI. Full legal
              content will be added before public launch.
            </p>
            <h2 className="text-lg font-semibold text-foreground">
              Service Description
            </h2>
            <p>
              Siyadah AI provides AI-powered business analysis and automation
              services. The service is provided &ldquo;as is&rdquo; during the
              beta period.
            </p>
            <h2 className="text-lg font-semibold text-foreground">
              User Responsibilities
            </h2>
            <p>
              You are responsible for the accuracy of data you provide and for
              complying with all applicable laws when using our automations.
            </p>
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p>For inquiries, contact us at legal@siyadah-ai.com.</p>
          </div>
        </div>
      </main>
      <HoverFooter />
    </>
  );
}
