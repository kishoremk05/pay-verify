import { createFileRoute } from "@tanstack/react-router";
import GridLines from "@/components/landingpage ui/GridLines";
import Navbar from "@/components/landingpage ui/Navbar";
import Hero from "@/components/landingpage ui/Hero";
import Stats from "@/components/landingpage ui/Stats";
import HeroImage from "@/components/landingpage ui/HeroImage";
import SystemComponents from "@/components/landingpage ui/SystemComponents";
import Why from "@/components/landingpage ui/Why";
import Capabilities from "@/components/landingpage ui/Capabilities";
import WhoWeServe from "@/components/landingpage ui/WhoWeServe";
import Engagement from "@/components/landingpage ui/Engagement";
import Pricing from "@/components/landingpage ui/Pricing";
import FAQ from "@/components/landingpage ui/FAQ";
import Footer from "@/components/landingpage ui/Footer";

export { Navbar, Footer };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TODELLAA — AI-Powered Payment Reconciliation Platform" },
      { name: "description", content: "TODELLAA automates payment reconciliation for organizations and businesses. Match invoices with Paystack, bank transfers, and mobile money providers in real time." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#f7f6f1] text-[#010101] font-sans antialiased selection:bg-[#010101] selection:text-[#f7f6f1]">
      {/* Background Grid Lines & Glows */}
      <GridLines />

      {/* Page Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Hero />
          <Stats />
          <HeroImage />
          <SystemComponents />
          <Capabilities />
          <WhoWeServe />
          <Engagement />
          <Pricing />
          <FAQ />
        </main>
        <Footer />
      </div>
    </div>
  );
}
