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
    <div className="min-h-screen bg-landing-bg">
      <Nav />
      <Hero />
      <DemoPreview />
      <HowItWorks />
      <UseCases />
      <Features />
      <BottomCTA />
      <Footer />
    </div>
  );
}
