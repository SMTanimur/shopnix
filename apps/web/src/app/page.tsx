import React from 'react';
import {
  LandingNavbar,
  LandingHero,
  BrandMarquee,
  AppShowcase,
  FunnelBuilderShowcase,
  CallCenterSection,
  MultistoreSection,
  OmnichannelSection,
  CourierSection,
  AIIntelligenceSection,
  FeatureMatrixSection,
  PricingSection,
  TestimonialsSection,
  FAQSection,
  CTABanner,
  LandingFooter,
} from '@/components/marketing';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* 1. Glassmorphic Navigation Bar */}
      <LandingNavbar />

      {/* Main Page Flow */}
      <main className="flex-1 flex flex-col">
        {/* 2. Cinematic Hero Section */}
        <LandingHero />

        {/* 3. Partner Logo Marquee */}
        <BrandMarquee />

        {/* 4. Inside-the-App Live Vector Showcase (5 Interactive Modules) */}
        <AppShowcase />

        {/* 5. Built-In 1-Click COD Funnel & Landing Page Builder */}
        <FunnelBuilderShowcase />

        {/* 6. Integrated Softphone Call Center & Confirmation Flow */}
        <CallCenterSection />

        {/* 7. Multi-Store Synchronization (Shopify & WooCommerce) */}
        <MultistoreSection />

        {/* 8. WhatsApp & Messenger Omnichannel Social Inbox with AI Copilot */}
        <OmnichannelSection />

        {/* 9. Multi-Carrier Courier Dispatch & Anti-Fraud Center */}
        <CourierSection />

        {/* 10. AI Model Hub & OpenRouter Free Model Discovery */}
        <AIIntelligenceSection />

        {/* 11. Feature Comparison: Shopnix vs EcomDrive BD */}
        <FeatureMatrixSection />

        {/* 12. Transparent SaaS Pricing in BDT (৳) */}
        <PricingSection />

        {/* 13. Merchant Testimonials & Proof */}
        <TestimonialsSection />

        {/* 14. Interactive FAQ Accordion */}
        <FAQSection />

        {/* 15. Radiant Rose Pre-Footer CTA */}
        <CTABanner />
      </main>

      {/* 16. Comprehensive Footer */}
      <LandingFooter />
    </div>
  );
}
