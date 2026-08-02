import { createFileRoute } from "@tanstack/react-router";
import GridLines from "@/components/landingpage ui/GridLines";
import Navbar from "@/components/landingpage ui/Navbar";
import Hero from "@/components/landingpage ui/Hero";
import Stats from "@/components/landingpage ui/Stats";
import HeroImage from "@/components/landingpage ui/HeroImage";
import Capabilities from "@/components/landingpage ui/Capabilities";
import WhoWeServe from "@/components/landingpage ui/WhoWeServe";
import SystemComponents from "@/components/landingpage ui/SystemComponents";
import Pricing from "@/components/landingpage ui/Pricing";
import Engagement from "@/components/landingpage ui/Engagement";
import CTABanner from "@/components/landingpage ui/CTABanner";
import FAQ from "@/components/landingpage ui/FAQ";
import Footer from "@/components/landingpage ui/Footer";

export { Navbar, Footer };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TODELLAA — AI-Powered Payment Reconciliation Platform" },
      { name: "description", content: "TODELLAA automates payment verification, matches payments from multiple sources, and gives you real-time clarity in one secure platform." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white text-[#010101] font-sans antialiased selection:bg-[#e8562a] selection:text-white overflow-x-hidden">
      {/* Background Grid Lines */}
      <GridLines />

      {/* Page Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="grow">
          <Hero />
          <Stats />
          <HeroImage />
          <Capabilities />
          <WhoWeServe />
          <SystemComponents />
          <Pricing />
          <Engagement />
          <CTABanner />
          <FAQ />
        </main>
        <Footer />
      </div>
    </div>
  );
}
