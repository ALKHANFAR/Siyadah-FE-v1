import { HeaderNav } from "@/components/ui/header-nav";
import { AnnouncementBanner } from "@/components/ui/announcement-banner";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { HoverFooter } from "@/components/ui/hover-footer";

export default function Home() {
  return (
    <>
      <AnnouncementBanner />
      <HeaderNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
      </main>
      <HoverFooter />
    </>
  );
}
