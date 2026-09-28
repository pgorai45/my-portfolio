import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SOCIAL_LINKS } from "../../data/socialLinks";
import { ContactModal } from "../common/ContactModal";

export const LandingFooter: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <footer className="relative border-t border-white/[0.06] bg-[#020617]/90 backdrop-blur-md py-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Developer Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Link
              to="/"
              className="text-2xl font-black text-white hover:text-purple-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg px-1"
              aria-label="Back to top"
            >
              PG<span className="text-purple-400">.</span>
            </Link>
            <div className="hidden sm:block w-[1px] h-6 bg-slate-700" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-200">Prasanta Gorai</span>
              <span className="text-xs text-slate-400 font-medium">Full Stack Developer</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((item) => {
              const Icon = item.icon;
              if (item.name === "Email") {
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIsContactOpen(true)}
                    aria-label={item.label}
                    title="Send a message"
                    className="w-10 h-10 rounded-full bg-slate-900/80 border border-white/10 hover:border-purple-500/50 hover:bg-purple-950/40 text-slate-400 hover:text-purple-300 flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              }
              return (
                <a
                  key={item.name}
                  href={item.href}
                  aria-label={item.label}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-10 h-10 rounded-full bg-slate-900/80 border border-white/10 hover:border-purple-500/50 hover:bg-purple-950/40 text-slate-400 hover:text-purple-300 flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          {/* Copyright Notice */}
          <div className="text-xs text-slate-500 text-center md:text-right">
            © 2026 Prasanta Gorai. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Centered Modern Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
};
