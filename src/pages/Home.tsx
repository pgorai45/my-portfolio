import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HomeNavbar } from "../components/home/HomeNavbar";
import { HomeHero } from "../components/home/HomeHero";
import { HomeAbout } from "../components/home/HomeAbout";
import { HomeSkills } from "../components/home/HomeSkills";
import { HomeExperience } from "../components/home/HomeExperience";
import { HomeEducation } from "../components/home/HomeEducation";
import { HomeProjects } from "../components/home/HomeProjects";
import { HomeResume } from "../components/home/HomeResume";
import { HomeContact } from "../components/home/HomeContact";
import { HomeFooter } from "../components/home/HomeFooter";

export const Home: React.FC = () => {
  const { hash } = useLocation();

  // Smooth scroll to hash anchor on mount or route transition
  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const navOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [hash]);

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-100 flex flex-col w-full overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* 1. Homepage Navbar */}
      <HomeNavbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* 2. Homepage Hero */}
        <HomeHero />

        {/* 3. About Section */}
        <HomeAbout />

        {/* 4. Skills & Technologies Section */}
        <HomeSkills />

        {/* 5. Journey / Experience Section */}
        <HomeExperience />

        {/* 6. Education Section */}
        <HomeEducation />

        {/* 7. Featured Projects Section */}
        <HomeProjects />

        {/* 8. Resume & Qualifications Section */}
        <HomeResume />

        {/* 9. Contact Section */}
        <HomeContact />
      </main>

      {/* 10. Homepage Footer */}
      <HomeFooter />
    </div>
  );
};

export default Home;
