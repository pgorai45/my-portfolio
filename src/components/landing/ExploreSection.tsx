import React from "react";
import { EXPLORE_CARDS } from "../../data/explore";
import { ExploreCard } from "./ExploreCard";
import { SectionHeading } from "../common/SectionHeading";

export const ExploreSection: React.FC = () => {
  return (
    <section id="explore" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Soft Lighting Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badgeText="EXPLORE"
          titlePrefix="What you'll find"
          gradientText="inside"
          description="A showcase of my skills, projects, experience and journey as a Full Stack Developer."
          align="center"
          className="mb-14 md:mb-16"
        />

        {/* 4 Glass Cards Grid: 1 col on mobile, 2 col on tablet, 4 col on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPLORE_CARDS.map((card, index) => (
            <ExploreCard key={card.id} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
