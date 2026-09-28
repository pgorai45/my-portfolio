import React from "react";
import { Outlet } from "react-router-dom";

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* Subtle Ambient Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-950/20 via-purple-950/15 to-transparent rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Outlet />
      </div>
    </div>
  );
};
