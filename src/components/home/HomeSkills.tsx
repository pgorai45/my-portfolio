import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Server,
  Database,
  Wrench,
  Binary,
  Languages,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { portfolioApi } from "../../services/api";

// ─── Custom Brand & Domain Icons (Crisp, High-DPI SVGs) ───────────────────────
const TechIcons: Record<string, React.FC<{ className?: string }>> = {
  // ── Frontend ──
  React: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="none">
      <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
      <g stroke="#00d8ff" strokeWidth="1">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  ),
  TypeScript: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128">
      <rect width="128" height="128" rx="20" fill="#3178c6" />
      <path
        d="M74.4 78.4c3.4 4.8 8.6 7.6 15 7.6 6.8 0 10.8-3.4 10.8-8.4 0-5.4-4-7.4-12.8-11.4-12.2-5.4-17.6-11.6-17.6-22.2 0-11.6 9.4-20 23.4-20 8.6 0 15.6 2.8 20.6 7.8l-6.8 9.6c-3.6-3.8-8.2-5.6-13.8-5.6-6.4 0-9.6 3.4-9.6 7.4 0 5 3.8 6.8 12.8 11 12.4 5.6 17.6 12 17.6 22.8 0 12.8-9.8 21.2-24.8 21.2-10.4 0-18.8-3.6-24.8-10.2l10-10.6zM15 36h45.2v11.6H38.8v68.4H26.2V47.6H15V36z"
        fill="#ffffff"
      />
    </svg>
  ),
  JavaScript: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128">
      <rect width="128" height="128" rx="20" fill="#f7df1e" />
      <path
        d="M67.3 93.3c3.2 5.2 7.7 8.5 14.8 8.5 7.1 0 11.6-3.5 11.6-8.3 0-5.8-4.6-7.8-12.4-11.2-11.2-4.9-18.6-10.6-18.6-23.7 0-12.8 9.7-22.6 24.8-22.6 10.6 0 18.2 4.4 23.4 13.5l-9.9 6.3c-2.8-4.9-6-7.1-13.5-7.1-5.1 0-8.9 3.2-8.9 7.3 0 4.6 3.4 6.7 11.4 10.1 13 5.6 19.8 11.2 19.8 24.8 0 14.3-11.2 24.2-28 24.2-15.6 0-24.6-7.9-29.2-17.6l10.7-4.2zm-40.4 2.1c2.4 4.2 4.7 7.7 10.3 7.7 5.3 0 8.7-2.6 8.7-12.4V38h15.7v51.2c0 17.7-10.1 25.8-24.2 25.8-11.9 0-19.1-6.1-22.8-14.8l12.3-4.8z"
        fill="#000000"
      />
    </svg>
  ),
  HTML5: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M19.4 113.8L8.6 0h110.8l-10.8 113.8-44.6 14.2z" fill="#e44d26" />
      <path d="M64 116.5l36.3-11.6 9-94.9H64z" fill="#f16529" />
      <path
        d="M64 47.9h19.5l-1.4 14.3H64v14.3h16.7l-1.7 19.5-15 4.1v14.8l29.4-8.2 4.1-44.5H64zm0-24.7h38.2l1.3-14.3H64zm0 63.6l-.1.1v-14.3l.1-.1zm0-38.9h-19.5l1.4-14.3H64V19.4H25.8l4.1 44.5H64zM44.5 62.2h-1.4l-1.7 19.5 22.6 6.3V73.2L49.1 69z"
        fill="#ffffff"
      />
    </svg>
  ),
  CSS3: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M19.4 113.8L8.6 0h110.8l-10.8 113.8-44.6 14.2z" fill="#1572b6" />
      <path d="M64 116.5l36.3-11.6 9-94.9H64z" fill="#33a9dc" />
      <path
        d="M64 47.9h19.5l-1.4 14.3H64v14.3h16.7l-1.7 19.5-15 4.1v14.8l29.4-8.2 4.1-44.5H64zm0-24.7h38.2l1.3-14.3H64zm0 63.6l-.1.1v-14.3l.1-.1zm0-38.9h-19.5l1.4-14.3H64V19.4H25.8l4.1 44.5H64zM44.5 62.2h-1.4l-1.7 19.5 22.6 6.3V73.2L49.1 69z"
        fill="#ffffff"
      />
    </svg>
  ),
  "Tailwind CSS": ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128" fill="#38bdf8">
      <path d="M64 26.6c-17.1 0-27.7 8.5-32 25.6 6.4-8.5 13.9-11.7 22.4-9.6 4.9 1.2 8.3 4.7 12.2 8.7 6.3 6.4 13.6 13.9 29.4 13.9 17.1 0 27.7-8.5 32-25.6-6.4 8.5-13.9 11.7-22.4 9.6-4.9-1.2-8.3-4.7-12.2-8.7-6.3-6.5-13.6-13.9-29.4-13.9zm-32 37.4c-17.1 0-27.7 8.5-32 25.6 6.4-8.5 13.9-11.7 22.4-9.6 4.9 1.2 8.3 4.7 12.2 8.7 6.3 6.4 13.6 13.9 29.4 13.9 17.1 0 27.7-8.5 32-25.6-6.4 8.5-13.9 11.7-22.4 9.6-4.9-1.2-8.3-4.7-12.2-8.7-6.3-6.5-13.6-13.9-29.4-13.9z" />
    </svg>
  ),

  // ── Backend ──
  Python: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128">
      <path
        fill="#387eb8"
        d="M63.5 6.7c-29.3 0-27.5 12.7-27.5 12.7l.1 13.2h28.1v4H25.4S6.2 34.4 6.2 64.2c0 29.8 16.8 28.7 16.8 28.7h10.1v-14.2s-.5-16.8 16.5-16.8h28.2v-4.2S79.6 42 79.6 30.1c0-11.8-16.1-23.4-16.1-23.4zm-14.7 9.8c2.9 0 5.2 2.3 5.2 5.2s-2.3 5.2-5.2 5.2-5.2-2.3-5.2-5.2 2.3-5.2 5.2-5.2z"
      />
      <path
        fill="#ffe873"
        d="M64.5 121.3c29.3 0 27.5-12.7 27.5-12.7l-.1-13.2H63.8v-4h38.8s19.2 2.2 19.2-27.6c0-29.8-16.8-28.7-16.8-28.7h-10.1v14.2s.5 16.8-16.5 16.8H50.2v4.2s-1.8 9.7-1.8 21.6c0 11.8 16.1 23.4 16.1 23.4zm14.7-9.8c-2.9 0-5.2-2.3-5.2-5.2s2.3-5.2 5.2-5.2 5.2 2.3 5.2 5.2-2.3 5.2-5.2 5.2z"
      />
    </svg>
  ),
  Flask: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="1.8">
      <path d="M9 3h6m-3 0v6l4.5 9A2 2 0 0 1 14.7 21H9.3a2 2 0 0 1-1.8-3L12 9V3" />
      <path d="M7 16h10" stroke="#38bdf8" />
      <circle cx="10" cy="18" r="1" fill="#38bdf8" />
      <circle cx="14" cy="18" r="1" fill="#c084fc" />
    </svg>
  ),
  "Node.js": ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128">
      <path
        d="M64 7.2L12.5 36.9v59.4L64 126l51.5-29.7V36.9L64 7.2z"
        fill="#339933"
      />
      <path
        d="M64 22.4l38.3 22.1v44.2L64 110.8 25.7 88.7V44.5L64 22.4z"
        fill="#026e00"
      />
      <path
        d="M51.8 77.2c-2.4 0-4.3-.8-5.6-2.4-1.3-1.6-2-3.8-2-6.6V49.8h8.8v18.4c0 1.2.3 2.1.8 2.7.5.6 1.3.9 2.3.9 1 0 1.8-.3 2.3-.9.5-.6.8-1.5.8-2.7V49.8h8.8v18.4c0 2.8-.7 5-2 6.6-1.3 1.6-3.2 2.4-5.6 2.4h-6.6zm24.4 0c-2.4 0-4.3-.8-5.6-2.4-1.3-1.6-2-3.8-2-6.6V49.8h8.8v18.4c0 1.2.3 2.1.8 2.7.5.6 1.3.9 2.3.9 1 0 1.8-.3 2.3-.9.5-.6.8-1.5.8-2.7V49.8H92v18.4c0 2.8-.7 5-2 6.6-1.3 1.6-3.2 2.4-5.6 2.4h-8.2z"
        fill="#ffffff"
      />
    </svg>
  ),
  "REST API": ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.8">
      <rect x="2" y="3" width="20" height="7" rx="2" />
      <rect x="2" y="14" width="20" height="7" rx="2" />
      <line x1="6" y1="6.5" x2="6.01" y2="6.5" strokeWidth="2.5" />
      <line x1="10" y1="6.5" x2="10.01" y2="6.5" strokeWidth="2.5" />
      <line x1="6" y1="17.5" x2="6.01" y2="17.5" strokeWidth="2.5" />
      <line x1="10" y1="17.5" x2="10.01" y2="17.5" strokeWidth="2.5" />
      <path d="M17 10v4" stroke="#c084fc" strokeDasharray="2 2" />
    </svg>
  ),

  // ── Core CS ──
  DSA: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="4" r="2.5" fill="#c084fc" stroke="#c084fc" />
      <circle cx="6" cy="12" r="2.5" fill="#38bdf8" stroke="#38bdf8" />
      <circle cx="18" cy="12" r="2.5" fill="#38bdf8" stroke="#38bdf8" />
      <circle cx="4" cy="20" r="2" fill="#818cf8" stroke="#818cf8" />
      <circle cx="8" cy="20" r="2" fill="#818cf8" stroke="#818cf8" />
      <circle cx="16" cy="20" r="2" fill="#818cf8" stroke="#818cf8" />
      <circle cx="20" cy="20" r="2" fill="#818cf8" stroke="#818cf8" />
      <path d="M12 6.5L6 9.5m6-3l6 3M6 14.5l-2 3.5m2-3.5l2 3.5m10-3.5l-2 3.5m2-3.5l2 3.5" stroke="#94a3b8" strokeWidth="1.4" />
    </svg>
  ),
  OOP: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#a855f7" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="#c084fc" />
      <line x1="12" y1="22.08" x2="12" y2="12" stroke="#38bdf8" />
      <circle cx="12" cy="12" r="2" fill="#22d3ee" stroke="#ffffff" />
    </svg>
  ),
  DBMS: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="12" cy="5" rx="9" ry="3" stroke="#38bdf8" fill="#0369a1" fillOpacity="0.25" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" stroke="#818cf8" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="#38bdf8" />
      <path d="M21 8.5c0 1.66-4 3-9 3s-9-1.34-9-3" stroke="#c084fc" />
      <path d="M21 15.5c0 1.66-4 3-9 3s-9-1.34-9-3" stroke="#818cf8" />
    </svg>
  ),
  "Operating Systems": ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="#c084fc" />
      <rect x="8" y="8" width="8" height="8" rx="1.5" fill="#a855f7" fillOpacity="0.3" stroke="#38bdf8" />
      <line x1="1" y1="9" x2="4" y2="9" stroke="#94a3b8" />
      <line x1="1" y1="15" x2="4" y2="15" stroke="#94a3b8" />
      <line x1="20" y1="9" x2="23" y2="9" stroke="#94a3b8" />
      <line x1="20" y1="15" x2="23" y2="15" stroke="#94a3b8" />
      <line x1="9" y1="1" x2="9" y2="4" stroke="#94a3b8" />
      <line x1="15" y1="1" x2="15" y2="4" stroke="#94a3b8" />
      <line x1="9" y1="20" x2="9" y2="23" stroke="#94a3b8" />
      <line x1="15" y1="20" x2="15" y2="23" stroke="#94a3b8" />
    </svg>
  ),
  "Computer Networks": ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="#38bdf8" fill="#0284c7" fillOpacity="0.25" />
      <rect x="16" y="2" width="6" height="6" rx="1.5" stroke="#38bdf8" fill="#0284c7" fillOpacity="0.25" />
      <rect x="9" y="16" width="6" height="6" rx="1.5" stroke="#c084fc" fill="#9333ea" fillOpacity="0.25" />
      <path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" stroke="#94a3b8" />
      <line x1="12" y1="13" x2="12" y2="16" stroke="#94a3b8" />
      <circle cx="12" cy="13" r="1.5" fill="#38bdf8" />
    </svg>
  ),

  // ── Database ──
  SQL: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128">
      <rect width="128" height="128" rx="20" fill="#00758f" />
      <ellipse cx="64" cy="32" rx="42" ry="16" fill="#f29111" />
      <path d="M22 32v34c0 9 19 16 42 16s42-7 42-16V32" fill="#005d73" opacity="0.6" stroke="#ffffff" strokeWidth="3" />
      <path d="M22 66v34c0 9 19 16 42 16s42-7 42-16V66" fill="#004759" opacity="0.8" stroke="#ffffff" strokeWidth="3" />
      <text x="64" y="80" textAnchor="middle" fontFamily="monospace" fontSize="26" fontWeight="bold" fill="#ffffff">
        SQL
      </text>
    </svg>
  ),

  // ── Tools ──
  Git: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128">
      <path
        d="M125 57.3L70.7 3c-4-4-10.4-4-14.4 0L42.5 16.8l18.2 18.2c4.3-1.5 9.4-.5 12.8 2.9 3.4 3.4 4.4 8.5 2.9 12.8l17.5 17.5c4.3-1.5 9.4-.5 12.8 2.9 4.7 4.7 4.7 12.3 0 17-4.7 4.7-12.3 4.7-17 0-3.6-3.6-4.5-8.9-2.7-13.4L73 53.6v33.8c1.3.8 2.4 1.8 3.3 3.1 4.7 4.7 4.7 12.3 0 17-4.7 4.7-12.3 4.7-17 0-4.7-4.7-4.7-12.3 0-17 1.3-1.3 2.8-2.2 4.4-2.8V53.2c-1.6-.6-3.1-1.5-4.4-2.8-3.6-3.6-4.5-8.9-2.7-13.4L38.4 18.8 3 54.2c-4 4-4 10.4 0 14.4L57.3 123c4 4 10.4 4 14.4 0L125 71.7c4-4 4-10.4 0-14.4z"
        fill="#f05032"
      />
    </svg>
  ),
  GitHub: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128" fill="#ffffff">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M64 5.3C28.7 5.3 0 34 0 69.4c0 28.3 18.4 52.3 43.8 60.8 3.2.6 4.4-1.4 4.4-3.1 0-1.5-.1-6.6-.1-12-17.8 3.9-21.6-7.6-21.6-7.6-2.9-7.4-7.1-9.4-7.1-9.4-5.8-4 .4-3.9.4-3.9 6.4.5 9.8 6.6 9.8 6.6 5.7 9.8 15 7 18.6 5.3.6-4.1 2.2-7 4-8.6-14.2-1.6-29.2-7.1-29.2-31.7 0-7 2.5-12.7 6.6-17.2-.7-1.6-2.9-8.2.6-17 0 0 5.4-1.7 17.7 6.6 5.1-1.4 10.6-2.1 16-2.1s10.9.7 16 2.1c12.3-8.3 17.7-6.6 17.7-6.6 3.5 8.8 1.3 15.4.6 17 4.1 4.5 6.6 10.2 6.6 17.2 0 24.7-15 30-29.3 31.6 2.3 2 4.3 5.9 4.3 11.9 0 8.6-.1 15.5-.1 17.6 0 1.7 1.2 3.7 4.4 3.1 25.4-8.5 43.8-32.5 43.8-60.8 0-35.4-28.7-64.1-64-64.1z"
      />
    </svg>
  ),
  "VS Code": ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128">
      <path
        d="M93.8 123.6c3.2 1.6 7.1.8 9.4-1.8l20.4-19.4c2.2-2.1 3.4-5.1 3.4-8.2V33.8c0-3.1-1.2-6.1-3.4-8.2L103.2 6.2c-2.3-2.6-6.2-3.4-9.4-1.8L38.4 32.5 18.5 17.3c-2.3-1.8-5.6-1.6-7.6.4L1.8 26.6c-2.4 2.4-2.4 6.3 0 8.7l23.5 22.8-23.5 22.8c-2.4 2.4-2.4 6.3 0 8.7l9.1 8.9c2 2 5.3 2.2 7.6.4l19.9-15.2 55.4 39.9z"
        fill="#007acc"
      />
      <path
        d="M103.2 6.2L38.4 56.1l17 13.1 47.8-36.4V6.2z"
        fill="#1f9cf0"
      />
      <path
        d="M103.2 121.8V95.2L55.4 58.8l-17 13.1 64.8 49.9z"
        fill="#0065a9"
      />
    </svg>
  ),
  Postman: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128">
      <circle cx="64" cy="64" r="58" fill="#ff6c37" />
      <path
        d="M89.4 67.2c-1.2-4.8-5.6-8.2-10.4-8.2h-3.4l8.2-16.4c.8-1.6.4-3.6-1-4.8s-3.4-1.2-4.8-.2L59 52H46c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4h26.4l4.8 11.2c.8 1.8 2.6 3 4.6 3h.2c2.2 0 4-1.6 4.4-3.8l3-19.2z"
        fill="#ffffff"
      />
      <circle cx="52" cy="42" r="5" fill="#ffffff" />
    </svg>
  ),

  // ── Languages ──
  English: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128">
      <rect width="128" height="128" rx="20" fill="#1e1b4b" stroke="rgba(99,102,241,0.4)" strokeWidth="3" />
      <circle cx="64" cy="64" r="42" fill="none" stroke="#6366f1" strokeWidth="3" />
      <ellipse cx="64" cy="64" rx="20" ry="42" fill="none" stroke="#818cf8" strokeWidth="2.5" />
      <line x1="22" y1="64" x2="106" y2="64" stroke="#818cf8" strokeWidth="2.5" />
      <rect x="42" y="46" width="44" height="36" rx="8" fill="#4338ca" />
      <text x="64" y="71" textAnchor="middle" fontFamily="sans-serif" fontSize="20" fontWeight="bold" fill="#ffffff">
        EN
      </text>
    </svg>
  ),
  Bengali: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128">
      <rect width="128" height="128" rx="20" fill="#2e1065" stroke="rgba(192,132,252,0.4)" strokeWidth="3" />
      <text x="64" y="86" textAnchor="middle" fontFamily="serif, sans-serif" fontSize="56" fontWeight="bold" fill="#c084fc">
        অ
      </text>
    </svg>
  ),
  Hindi: ({ className = "w-7 h-7" }) => (
    <svg className={className} viewBox="0 0 128 128">
      <rect width="128" height="128" rx="20" fill="#311302" stroke="rgba(251,146,60,0.4)" strokeWidth="3" />
      <text x="64" y="86" textAnchor="middle" fontFamily="serif, sans-serif" fontSize="56" fontWeight="bold" fill="#fb923c">
        अ
      </text>
    </svg>
  ),
};

// ─── Data Types ─────────────────────────────────────────────────────────────
interface SkillItem {
  name: string;
  category: string | string[];
  categoryLabel: string;
  proficiencySubtitle?: string;
  percentage: number;
  glowColor: string;
  badgeBorder: string;
  progressGradient: string;
  hasFloat?: boolean;
}

const ALL_SKILLS: SkillItem[] = [
  // ── 1. Frontend Development ──
  {
    name: "React",
    category: "frontend",
    categoryLabel: "Frontend",
    percentage: 90,
    glowColor: "rgba(0,216,255,0.4)",
    badgeBorder: "border-cyan-500/40",
    progressGradient: "bg-gradient-to-r from-cyan-500 to-blue-500",
    hasFloat: true,
  },
  {
    name: "TypeScript",
    category: "frontend",
    categoryLabel: "Frontend",
    percentage: 85,
    glowColor: "rgba(49,120,198,0.4)",
    badgeBorder: "border-blue-500/40",
    progressGradient: "bg-gradient-to-r from-blue-500 to-indigo-500",
    hasFloat: true,
  },
  {
    name: "JavaScript",
    category: "frontend",
    categoryLabel: "Frontend",
    percentage: 92,
    glowColor: "rgba(247,223,30,0.4)",
    badgeBorder: "border-yellow-500/40",
    progressGradient: "bg-gradient-to-r from-yellow-500 to-amber-500",
  },
  {
    name: "HTML5",
    category: "frontend",
    categoryLabel: "Frontend",
    percentage: 95,
    glowColor: "rgba(228,77,38,0.4)",
    badgeBorder: "border-orange-500/40",
    progressGradient: "bg-gradient-to-r from-orange-500 to-red-500",
  },
  {
    name: "CSS3",
    category: "frontend",
    categoryLabel: "Frontend",
    percentage: 90,
    glowColor: "rgba(21,114,182,0.4)",
    badgeBorder: "border-sky-500/40",
    progressGradient: "bg-gradient-to-r from-sky-500 to-blue-600",
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    categoryLabel: "Frontend",
    percentage: 92,
    glowColor: "rgba(56,189,248,0.4)",
    badgeBorder: "border-cyan-400/40",
    progressGradient: "bg-gradient-to-r from-teal-400 to-cyan-500",
  },

  // ── 2. Backend Development ──
  {
    name: "Python",
    category: "backend",
    categoryLabel: "Backend",
    percentage: 86,
    glowColor: "rgba(56,126,184,0.4)",
    badgeBorder: "border-blue-400/40",
    progressGradient: "bg-gradient-to-r from-blue-500 via-indigo-400 to-amber-400",
    hasFloat: true,
  },
  {
    name: "Flask",
    category: "backend",
    categoryLabel: "Backend",
    percentage: 80,
    glowColor: "rgba(168,85,247,0.4)",
    badgeBorder: "border-purple-400/40",
    progressGradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
  },
  {
    name: "Node.js",
    category: "backend",
    categoryLabel: "Backend",
    percentage: 85,
    glowColor: "rgba(51,153,51,0.4)",
    badgeBorder: "border-emerald-500/40",
    progressGradient: "bg-gradient-to-r from-emerald-500 to-green-400",
    hasFloat: true,
  },
  {
    name: "REST API",
    category: "backend",
    categoryLabel: "Backend",
    percentage: 90,
    glowColor: "rgba(34,211,238,0.4)",
    badgeBorder: "border-cyan-400/40",
    progressGradient: "bg-gradient-to-r from-cyan-400 to-indigo-400",
  },

  // ── 3. Core CS ──
  {
    name: "DSA",
    category: "core_cs",
    categoryLabel: "Core CS",
    proficiencySubtitle: "Data Structures & Algorithms",
    percentage: 88,
    glowColor: "rgba(192,132,252,0.4)",
    badgeBorder: "border-purple-400/40",
    progressGradient: "bg-gradient-to-r from-purple-500 to-cyan-400",
    hasFloat: true,
  },
  {
    name: "OOP",
    category: "core_cs",
    categoryLabel: "Core CS",
    proficiencySubtitle: "Object-Oriented Programming",
    percentage: 90,
    glowColor: "rgba(99,102,241,0.4)",
    badgeBorder: "border-indigo-400/40",
    progressGradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
  },
  {
    name: "DBMS",
    category: ["core_cs", "database"],
    categoryLabel: "Core CS / DB",
    proficiencySubtitle: "Database Management Systems",
    percentage: 88,
    glowColor: "rgba(14,165,233,0.4)",
    badgeBorder: "border-sky-400/40",
    progressGradient: "bg-gradient-to-r from-sky-500 to-indigo-500",
  },
  {
    name: "Operating Systems",
    category: "core_cs",
    categoryLabel: "Core CS",
    proficiencySubtitle: "Process, Threads & Memory",
    percentage: 84,
    glowColor: "rgba(168,85,247,0.4)",
    badgeBorder: "border-purple-400/40",
    progressGradient: "bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400",
  },
  {
    name: "Computer Networks",
    category: "core_cs",
    categoryLabel: "Core CS",
    proficiencySubtitle: "Protocols, OSI & TCP/IP",
    percentage: 82,
    glowColor: "rgba(6,182,212,0.4)",
    badgeBorder: "border-cyan-400/40",
    progressGradient: "bg-gradient-to-r from-cyan-500 to-blue-600",
  },

  // ── 4. Database ──
  {
    name: "SQL",
    category: "database",
    categoryLabel: "Database",
    proficiencySubtitle: "Relational Queries & Schema Design",
    percentage: 90,
    glowColor: "rgba(0,117,143,0.4)",
    badgeBorder: "border-cyan-500/40",
    progressGradient: "bg-gradient-to-r from-cyan-500 to-blue-500",
    hasFloat: true,
  },

  // ── 5. Tools ──
  {
    name: "Git",
    category: "tools",
    categoryLabel: "Tools",
    percentage: 88,
    glowColor: "rgba(240,80,50,0.4)",
    badgeBorder: "border-orange-500/40",
    progressGradient: "bg-gradient-to-r from-orange-500 to-red-500",
  },
  {
    name: "GitHub",
    category: "tools",
    categoryLabel: "Tools",
    percentage: 90,
    glowColor: "rgba(255,255,255,0.35)",
    badgeBorder: "border-white/40",
    progressGradient: "bg-gradient-to-r from-slate-200 to-purple-400",
    hasFloat: true,
  },
  {
    name: "VS Code",
    category: "tools",
    categoryLabel: "Tools",
    percentage: 94,
    glowColor: "rgba(0,122,204,0.4)",
    badgeBorder: "border-blue-500/40",
    progressGradient: "bg-gradient-to-r from-blue-500 to-cyan-400",
  },
  {
    name: "Postman",
    category: "tools",
    categoryLabel: "Tools",
    percentage: 86,
    glowColor: "rgba(255,108,55,0.4)",
    badgeBorder: "border-orange-400/40",
    progressGradient: "bg-gradient-to-r from-orange-500 to-amber-400",
  },

  // ── 6. Languages ──
  {
    name: "English",
    category: "languages",
    categoryLabel: "Language",
    proficiencySubtitle: "Professional Working Proficiency",
    percentage: 90,
    glowColor: "rgba(99,102,241,0.4)",
    badgeBorder: "border-indigo-400/40",
    progressGradient: "bg-gradient-to-r from-indigo-500 to-cyan-400",
    hasFloat: true,
  },
  {
    name: "Bengali",
    category: "languages",
    categoryLabel: "Native",
    proficiencySubtitle: "Native / Mother Tongue",
    percentage: 98,
    glowColor: "rgba(192,132,252,0.4)",
    badgeBorder: "border-purple-400/40",
    progressGradient: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    name: "Hindi",
    category: "languages",
    categoryLabel: "Language",
    proficiencySubtitle: "Full Professional Proficiency",
    percentage: 90,
    glowColor: "rgba(251,146,60,0.4)",
    badgeBorder: "border-orange-400/40",
    progressGradient: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
];

// The exact 6 categories requested by user (All Technologies removed)
const CATEGORY_TABS = [
  { id: "frontend", label: "Frontend", count: 6, icon: Cpu },
  { id: "backend", label: "Backend", count: 4, icon: Server },
  { id: "core_cs", label: "Core CS", count: 5, icon: Binary },
  { id: "database", label: "Database", count: 2, icon: Database },
  { id: "tools", label: "Tools", count: 4, icon: Wrench },
  { id: "languages", label: "Languages", count: 3, icon: Languages },
];

const CURRENTLY_LEARNING = [
  {
    name: "Next.js 15 & SSR",
    focus: "Full Stack React & App Router",
    status: "Active Learning",
    accent: "text-purple-400 border-purple-500/30 bg-purple-950/30",
  },
  {
    name: "Redis & Caching",
    focus: "In-memory Store & Performance",
    status: "Exploring",
    accent: "text-red-400 border-red-500/30 bg-red-950/30",
  },
  {
    name: "GraphQL & Apollo",
    focus: "Declarative Schema-first APIs",
    status: "Active Learning",
    accent: "text-pink-400 border-pink-500/30 bg-pink-950/30",
  },
  {
    name: "AWS Cloud & DevOps",
    focus: "S3, EC2 & Serverless Deployments",
    status: "Expanding",
    accent: "text-cyan-400 border-cyan-500/30 bg-cyan-950/30",
  },
];

// ─── Smooth Animated Number Counter ─────────────────────────────────────────
const AnimatedCounter: React.FC<{ value: number; inView: boolean }> = ({
  value,
  inView,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;

    let frameId: number;
    const duration = 1100;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo curve
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(easeProgress * value));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [inView, value, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <span>{value}%</span>;
  }

  return <span>{inView ? displayValue : 0}%</span>;
};

// ─── Main HomeSkills Component ──────────────────────────────────────────────
export const HomeSkills: React.FC = () => {
  // Default to the first category: Frontend
  const [selectedCategory, setSelectedCategory] = useState<string>("frontend");
  const [inView, setInView] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [skillsList, setSkillsList] = useState<SkillItem[]>(ALL_SKILLS);

  useEffect(() => {
    portfolioApi.getSkills().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        const mapped: SkillItem[] = res.data.map((dbSkill) => {
          const existing = ALL_SKILLS.find(
            (s) => s.name.toLowerCase() === dbSkill.name.toLowerCase()
          );
          return {
            name: dbSkill.name,
            category: dbSkill.category,
            categoryLabel: dbSkill.category_label || dbSkill.category,
            proficiencySubtitle: dbSkill.proficiency_subtitle,
            percentage: dbSkill.percentage,
            glowColor: existing?.glowColor || "rgba(168,85,247,0.4)",
            badgeBorder: existing?.badgeBorder || "border-purple-400/40",
            progressGradient:
              existing?.progressGradient || "bg-gradient-to-r from-purple-500 to-indigo-500",
            hasFloat: existing?.hasFloat ?? false,
          };
        });
        setSkillsList(mapped);
      }
    });
  }, []);

  const dynamicCategoryTabs = CATEGORY_TABS.map((tab) => {
    const count = skillsList.filter((s) =>
      Array.isArray(s.category) ? s.category.includes(tab.id) : s.category === tab.id
    ).length;
    return { ...tab, count };
  });

  const filteredSkills = skillsList.filter((skill) =>
    Array.isArray(skill.category)
      ? skill.category.includes(selectedCategory)
      : skill.category === selectedCategory
  );


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };

  const itemFadeUp = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section
      id="skills"
      className="relative w-full py-24 px-6 md:px-10 lg:px-16 overflow-hidden select-none bg-[#020617] scroll-mt-20"
    >
      {/* 1. Minimal Subtle Ambient Background Grid with Radial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 65% 50% at 50% 50%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 50% at 50% 50%, black 20%, transparent 80%)",
        }}
      />

      {/* 2. Soft Ambient Drift Orbs */}
      <motion.div
        className="absolute -top-20 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-cyan-600/8 blur-[130px] pointer-events-none"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, -30, 0],
                y: [0, 25, 0],
              }
        }
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 -left-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-purple-700/8 blur-[140px] pointer-events-none"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, 30, 0],
                y: [0, -25, 0],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 3. Section Container */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        onViewportEnter={() => setInView(true)}
        variants={containerVariants}
        className="relative z-10 mx-auto max-w-7xl"
      >
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-16">
          {/* Section Badge */}
          <motion.div variants={itemFadeUp} className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-[0.28em] uppercase text-cyan-300/90 bg-cyan-950/40 border border-cyan-500/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.2)] backdrop-blur-md">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              MY TECH STACK
            </span>
          </motion.div>

          {/* Heading with Animated Gradient Text */}
          <motion.h2
            variants={itemFadeUp}
            className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
          >
            Skills &{" "}
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 via-purple-400 to-cyan-400 bg-[length:200%_auto] glow-text-purple inline-block"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      backgroundPosition: ["0% center", "200% center"],
                    }
              }
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Technologies
            </motion.span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={itemFadeUp}
            className="mx-auto mt-4 max-w-2xl text-slate-400 text-base sm:text-lg leading-relaxed font-normal"
          >
            Technologies I use to build modern, scalable and interactive applications.
          </motion.p>

          {/* Category Filter Tabs: Frontend, Backend, Core CS, Database, Tools, Languages */}
          <motion.div
            variants={itemFadeUp}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-10"
          >
            {dynamicCategoryTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={cn(
                    "relative inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
                    isActive
                      ? "text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.4)] border border-purple-400/40"
                      : "text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800/60 border border-white/[0.08]"
                  )}
                >
                  <TabIcon className={cn("w-3.5 h-3.5", isActive ? "text-purple-200" : "text-slate-400")} />
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "text-[10px] font-mono px-1.5 py-0.5 rounded-full font-semibold",
                      isActive
                        ? "bg-purple-950/60 text-purple-200 border border-purple-400/30"
                        : "bg-white/5 text-slate-500"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* 4. Skills Responsive Grid (3-4 cards on desktop, 2 on tablet, 1 on small mobile) */}
        <motion.div
          layout={!prefersReducedMotion}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, idx) => {
              const IconComp = TechIcons[skill.name];
              return (
                <motion.div
                  key={skill.name}
                  layout={!prefersReducedMotion}
                  initial={{ opacity: 0, scale: 0.94, y: prefersReducedMotion ? 0 : 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                  transition={{
                    duration: 0.45,
                    delay: prefersReducedMotion ? 0 : idx * 0.03,
                    ease: "easeOut",
                  }}
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : {
                          y: -6,
                          scale: 1.015,
                          transition: { duration: 0.25, ease: "easeOut" },
                        }
                  }
                  className="group relative rounded-2xl p-5 sm:p-6 overflow-hidden cursor-default bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-purple-400/40 hover:shadow-[0_12px_35px_-8px_rgba(147,51,234,0.3)] transition-all duration-300 shadow-md shadow-black/30 flex flex-col justify-between"
                >
                  {/* Top Specular Shine */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                  {/* Internal Ambient Bloom on Hover */}
                  <div
                    className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${skill.glowColor} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Card Header: Icon + Category Badge */}
                  <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
                    {/* Technology Icon with subtle floating for selected technologies */}
                    <motion.div
                      animate={
                        skill.hasFloat && !prefersReducedMotion
                          ? {
                              y: [-2, 2, -2],
                            }
                          : {}
                      }
                      transition={{
                        duration: 4.5 + (idx % 3),
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={cn(
                        "p-3 rounded-xl bg-slate-950/80 border transition-all duration-300 group-hover:scale-110",
                        skill.badgeBorder,
                        "shadow-md group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)]"
                      )}
                      style={{
                        boxShadow: `0 0 15px -4px ${skill.glowColor}`,
                      }}
                    >
                      {IconComp ? (
                        <IconComp className="w-6 h-6 sm:w-7 sm:h-7" />
                      ) : (
                        <Cpu className="w-6 h-6 text-purple-400" />
                      )}
                    </motion.div>

                    {/* Category Label */}
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/5 group-hover:border-purple-500/20 group-hover:text-purple-300 transition-colors">
                      {skill.categoryLabel}
                    </span>
                  </div>

                  {/* Card Middle: Technology Name + Optional Subtitle + Animated Percentage Counter */}
                  <div className="relative z-10 mb-4">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-white font-semibold text-base sm:text-lg tracking-wide group-hover:text-purple-200 transition-colors">
                        {skill.name}
                      </h4>
                      <span className="text-sm font-bold font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-500/20">
                        <AnimatedCounter value={skill.percentage} inView={inView} />
                      </span>
                    </div>

                    {skill.proficiencySubtitle && (
                      <p className="mt-1 text-xs text-slate-400 font-normal leading-tight">
                        {skill.proficiencySubtitle}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom: Animated Progress Bar */}
                  <div className="relative z-10">
                    <div className="relative w-full h-2 rounded-full bg-slate-950/80 overflow-hidden border border-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.percentage}%` } : { width: 0 }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : 1.2,
                          delay: prefersReducedMotion ? 0 : 0.15 + (idx % 4) * 0.05,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className={cn("h-full rounded-full relative", skill.progressGradient)}
                      >
                        {/* Glowing Tip */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* 5. Currently Learning Area at Bottom */}
        <motion.div
          variants={itemFadeUp}
          className="mt-16 sm:mt-20 pt-10 border-t border-white/[0.08]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                Currently Learning & Exploring
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Expanding capabilities for large-scale engineering
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CURRENTLY_LEARNING.map((item) => (
              <motion.div
                key={item.name}
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: -4,
                        transition: { duration: 0.2 },
                      }
                }
                className="group relative rounded-xl p-4 bg-slate-900/40 backdrop-blur-md border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h5 className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {item.name}
                  </h5>
                  <span
                    className={cn(
                      "text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border",
                      item.accent
                    )}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {item.focus}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HomeSkills;
