import React from "react";
import { Navbar } from "../components/navbar/Navbar";
import { LandingHero } from "../components/landing/LandingHero";
import { ExploreSection } from "../components/landing/ExploreSection";
import { FinalCTA } from "../components/landing/FinalCTA";
import { LandingFooter } from "../components/landing/LandingFooter";

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* Fixed/Sticky Glassmorphism Navbar */}
      <Navbar />

      {/* Main Landing Page Content */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <LandingHero />

        {/* Explore / Portfolio Preview Section */}
        <ExploreSection />

        {/* Final Cinematic CTA Section */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};
