import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { DemoPreview } from "./DemoPreview";
import { HowItWorks } from "./HowItWorks";
import { UseCases } from "./UseCases";
import { Features } from "./Features";
import { BottomCTA } from "./BottomCTA";
import { Footer } from "./Footer";

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-landing-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(217,119,6,0.14),transparent_32%),radial-gradient(circle_at_86%_2%,rgba(251,191,36,0.09),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(217,119,6,0.08),transparent_34%)]" />
      <div className="relative">
        <Nav />
        <Hero />
        <DemoPreview />
        <HowItWorks />
        <UseCases />
        <Features />
        <BottomCTA />
        <Footer />
      </div>
    </div>
  );
}
