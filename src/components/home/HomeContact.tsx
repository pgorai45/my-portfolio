import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  X,
  Calendar as CalendarIcon,
  MessageCircle,
  Sparkles,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import prasantaPhoto from "../../assets/images/prasanta-hero.png";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { sendAppointmentConfirmationEmail } from "../../services/emailService";
import { portfolioApi } from "../../services/api";

interface BookingInfo {
  name: string;
  emailOrPhone: string;
  notes: string;
}

const TIME_SLOTS = [
  "09:30 AM",
  "10:30 AM",
  "11:30 AM",
  "01:30 PM",
  "02:30 PM",
  "03:30 PM",
  "04:30 PM",
  "05:30 PM",
  "06:30 PM",
  "07:30 PM",
];

const WEEKDAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const HomeContact: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Current navigated month state
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // Selected date & time slot
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    // Default to today
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Confirmation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo>({
    name: "",
    emailOrPhone: "",
    notes: "",
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string; contact?: string }>({});
  const [emailSendStatus, setEmailSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  const hasSentAppointmentEmailRef = useRef<boolean>(false);

  // Calendar calculations
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const firstDayOfWeek = useMemo(() => {
    return new Date(year, month, 1).getDay();
  }, [year, month]);

  // Navigate months
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Check if a date is in the past
  const isPastDate = (day: number) => {
    const candidateDate = new Date(year, month, day, 23, 59, 59);
    return candidateDate < today;
  };

  // Check if a day is the currently selected date
  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const handleDateClick = (day: number) => {
    if (isPastDate(day)) return;
    const newSelected = new Date(year, month, day);
    setSelectedDate(newSelected);
    // Reset or keep slot
    setSelectedSlot(null);
  };

  const handleSlotClick = (slot: string) => {
    setSelectedSlot(slot);
  };

  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  // Handle Booking Confirmation
  const handleOpenBookingModal = () => {
    if (!selectedDate || !selectedSlot) return;
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; contact?: string } = {};

    if (!bookingInfo.name.trim()) {
      errors.name = "Please enter your name";
    }
    if (!bookingInfo.emailOrPhone.trim()) {
      errors.contact = "Please provide your email or WhatsApp number";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Success confirmation: confirm appointment first so booking is guaranteed
    setBookingConfirmed(true);

    // Store appointment directly in PostgreSQL database
    portfolioApi.submitAppointment({
      name: bookingInfo.name.trim(),
      email: bookingInfo.emailOrPhone.includes("@") ? bookingInfo.emailOrPhone.trim() : "visitor@portfolio.com",
      date: formattedSelectedDate,
      time: selectedSlot || "",
      message: bookingInfo.notes.trim() || undefined,
    }).catch((err) => console.warn("Failed to store appointment in DB:", err));

    // Prevent duplicate emails if confirmation is triggered multiple times
    if (hasSentAppointmentEmailRef.current) {
      return;
    }
    hasSentAppointmentEmailRef.current = true;
    setEmailSendStatus("sending");
    setEmailErrorMessage("");

    // Send confirmation email asynchronously via EmailJS
    sendAppointmentConfirmationEmail({
      name: bookingInfo.name.trim(),
      email: bookingInfo.emailOrPhone.trim(),
      appointment_date: formattedSelectedDate,
      appointment_time: selectedSlot || "",
      duration: "15 minutes",
      timezone: "IST (GMT+5:30)",
      status: "Confirmed",
      notes: bookingInfo.notes,
    })
      .then((res) => {
        if (res.success) {
          setEmailSendStatus("sent");
        } else {
          setEmailSendStatus("error");
          setEmailErrorMessage(res.error || "Email delivery failed");
        }
      })
      .catch(() => {
        setEmailSendStatus("error");
        setEmailErrorMessage("Network error while sending appointment confirmation email");
      });
  };

  const handleResetBooking = () => {
    setBookingConfirmed(false);
    setIsModalOpen(false);
    setBookingInfo({ name: "", emailOrPhone: "", notes: "" });
    setSelectedSlot(null);
    hasSentAppointmentEmailRef.current = false;
    setEmailSendStatus("idle");
    setEmailErrorMessage("");
  };

  // WhatsApp direct link generator
  const getWhatsAppBookingLink = () => {
    const text = `Hi Prasanta, I'd like to schedule a 15-minute meeting on ${formattedSelectedDate} at ${selectedSlot}. My name is ${bookingInfo.name || "a visitor"}. Topic: ${bookingInfo.notes || "Discussing an opportunity/project"}.`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // Google Calendar event URL generator
  const getGoogleCalendarLink = () => {
    if (!selectedDate || !selectedSlot) return "#";
    const title = encodeURIComponent(`Meeting with Prasanta Gorai: ${bookingInfo.notes || "Discussion"}`);
    const details = encodeURIComponent(
      `Appointment scheduled with Prasanta Gorai (Full Stack Developer).\nName: ${bookingInfo.name}\nNotes: ${bookingInfo.notes || "None"}`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
  };

  // Motion variants
  const itemFadeUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="contact"
      className="relative w-full py-28 md:py-36 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden bg-[#020617] select-none scroll-mt-20"
    >
      {/* ─── 1. Background Grid & Ambient Neon Waves ───────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)",
        }}
      />

      {/* Left Flowing Neon Wave SVG */}
      <div className="absolute -left-20 bottom-10 w-[420px] sm:w-[560px] h-[460px] pointer-events-none opacity-40 blur-[1px]">
        <svg viewBox="0 0 500 500" fill="none" className="w-full h-full">
          <path
            d="M-50 480 C 120 460, 240 380, 280 260 C 320 140, 200 60, 100 20"
            stroke="url(#neon-left-cyan)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M-40 490 C 140 450, 260 360, 300 240 C 340 120, 220 50, 120 10"
            stroke="url(#neon-left-purple)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <defs>
            <linearGradient id="neon-left-cyan" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="neon-left-purple" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Right Flowing Neon Wave SVG */}
      <div className="absolute -right-20 bottom-10 w-[420px] sm:w-[560px] h-[460px] pointer-events-none opacity-40 blur-[1px]">
        <svg viewBox="0 0 500 500" fill="none" className="w-full h-full">
          <path
            d="M550 480 C 380 460, 260 380, 220 260 C 180 140, 300 60, 400 20"
            stroke="url(#neon-right-blue)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M540 490 C 360 450, 240 360, 200 240 C 160 120, 280 50, 380 10"
            stroke="url(#neon-right-cyan)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <defs>
            <linearGradient id="neon-right-blue" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="neon-right-cyan" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Glowing Neon Particles / Ambient Orbs */}
      <div className="absolute top-24 left-1/6 w-3 h-3 rounded-full bg-purple-400 blur-[2px] shadow-[0_0_16px_#a855f7] pointer-events-none animate-pulse" />
      <div className="absolute top-36 right-1/6 w-3.5 h-3.5 rounded-full bg-indigo-400 blur-[2px] shadow-[0_0_18px_#818cf8] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-8 w-2.5 h-2.5 rounded-full bg-cyan-400 blur-[2px] shadow-[0_0_14px_#22d3ee] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-3 h-3 rounded-full bg-blue-400 blur-[2px] shadow-[0_0_16px_#60a5fa] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-purple-300 blur-[1px] shadow-[0_0_12px_#c084fc] pointer-events-none" />

      {/* ─── 2. Section Header ────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-4xl text-center mb-12 sm:mb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={itemFadeUp}
          className="flex flex-col items-center"
        >
          {/* Top Pill Badge */}
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-purple-300 bg-purple-950/40 border border-purple-500/40 px-5 py-1.5 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.25)] backdrop-blur-md">
              <Send className="w-3.5 h-3.5 text-purple-400" />
              GET IN TOUCH
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Let&apos;s Build{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 glow-text-purple inline-block">
              Something Great
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-4 max-w-2xl text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
            Have an opportunity or project in mind? Reach out and let&apos;s start a conversation.
          </p>
        </motion.div>
      </div>

      {/* ─── 3. Main Center Booking Card (Matches Exact Reference Image) ───── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={itemFadeUp}
        className="relative z-10 mx-auto max-w-4xl rounded-3xl bg-[#080d1a]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(99,102,241,0.12)] overflow-hidden"
      >
        {/* Top Banner Area with Developer Code Background */}
        <div className="relative w-full h-44 sm:h-52 bg-slate-950 overflow-hidden flex flex-col items-center justify-center border-b border-white/[0.06]">
          {/* Stylized IDE Code Graphic in background */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-90 select-none pointer-events-none font-mono text-[11px] sm:text-xs leading-relaxed text-emerald-400/80 p-4 overflow-hidden blur-[0.5px]"
          >
            <p className="text-purple-400/70">
              import &#123; createConnection &#125; from &quot;@developer/portfolio&quot;;
            </p>
            <p className="text-cyan-400/70">
              const app = await initializeApp(&#123; service: &quot;full-stack-web&quot;, speed: 100 &#125;);
            </p>
            <p className="text-slate-400/60">
              html_msg: header &gt; room_checked=&quot;true&quot; class=&quot;text-purple-300 font-bold&quot;
            </p>
            <p className="text-amber-300/70">
              async function scheduleMeeting(date, slot) &#123; return await connect(date, slot); &#125;
            </p>
            <p className="text-emerald-400/70">
              // verified full-stack architecture &amp; responsive interactive systems
            </p>
            <p className="text-indigo-400/70">
              export default createProductionBuild(&#123; clean: true, responsive: true &#125;);
            </p>
          </div>

          {/* Dark Radial Overlay for Banner */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-[#080d1a]" />

          {/* Banner Center Text */}
          <div className="relative z-10 text-center px-4 -mt-2">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-[0.22em] uppercase font-mono drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              PRASANTA GORAI
            </h3>
            <p className="mt-1.5 text-[11px] sm:text-xs md:text-sm font-semibold text-slate-300 tracking-[0.38em] uppercase font-mono">
              FULL STACK DEVELOPER
            </p>
          </div>
        </div>

        {/* Profile Details & Avatar Area */}
        <div className="relative px-6 sm:px-10 pb-6 text-center -mt-12 sm:-mt-14 z-20">
          {/* Avatar Picture */}
          <div className="inline-block relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_20px_rgba(168,85,247,0.3)] bg-slate-900 mx-auto">
              <img
                src={prasantaPhoto}
                alt="Prasanta Gorai"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Profile Name & Explanatory Text */}
          <h4 className="mt-3 text-xl sm:text-2xl font-bold text-white tracking-tight">
            Prasanta Gorai
          </h4>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Select an available date and time slot below to schedule your appointment. You can confirm instantly via WhatsApp.
          </p>

          {/* Timezone & Verification Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="inline-flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Times in GMT+5:30</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-semibold tracking-wider uppercase shadow-[0_0_12px_rgba(16,185,129,0.15)]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>BOOKCLIPY VERIFIED CHECKOUT</span>
            </div>
          </div>
        </div>

        {/* ─── 4. Booking Interface (Two Column Layout) ────────────────────── */}
        <div className="p-4 sm:p-6 md:p-8 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 border-t border-white/[0.06]">
          {/* Left Column: 1. Choose Booking Date */}
          <div className="rounded-2xl p-5 sm:p-6 bg-slate-950/70 border border-white/[0.06] flex flex-col justify-between">
            <div>
              {/* Calendar Header */}
              <div className="flex items-center justify-between gap-2 mb-6">
                <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                  1. Choose Booking Date
                </span>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs sm:text-sm font-semibold text-slate-200 min-w-[110px] text-center">
                    {MONTH_NAMES[month]} {year}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Next Month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Weekday Row */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {WEEKDAYS.map((wd) => (
                  <span key={wd} className="text-[11px] font-semibold text-slate-500 py-1">
                    {wd}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Empty padding days before day 1 */}
                {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-9 sm:h-10" />
                ))}

                {/* Actual month days */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const past = isPastDate(day);
                  const selected = isSelectedDate(day);

                  return (
                    <button
                      key={`day-${day}`}
                      type="button"
                      disabled={past}
                      onClick={() => handleDateClick(day)}
                      className={`h-9 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 relative ${
                        past
                          ? "text-slate-600 cursor-not-allowed opacity-5"
                          : selected
                          ? "bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-600 text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.7)] scale-105 z-10"
                          : "text-slate-300 hover:bg-purple-950/60 hover:text-white cursor-pointer"
                      }`}
                      aria-label={`Select ${MONTH_NAMES[month]} ${day}, ${year}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calendar Bottom Bar */}
            <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                <span>Slot duration: 15m</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                Hours: 9:00 AM - 8:00 PM
              </span>
            </div>
          </div>

          {/* Right Column: 2. Select Hour Slot */}
          <div className="rounded-2xl p-5 sm:p-6 bg-slate-950/70 border border-white/[0.06] flex flex-col justify-between">
            <div>
              {/* Slot Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                  2. Select Hour Slot
                </span>
                {selectedDate && (
                  <span className="text-xs font-semibold text-purple-300 bg-purple-950/50 px-2.5 py-1 rounded-full border border-purple-500/30">
                    {formattedSelectedDate}
                  </span>
                )}
              </div>

              {/* Slots Content Area */}
              {!selectedDate ? (
                // Empty state when no date is picked
                <div className="py-12 sm:py-16 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-slate-500 mb-3 bg-slate-900/50">
                    <Clock className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-[220px] leading-relaxed">
                    Please pick a day from the calendar to generate operating slots.
                  </p>
                </div>
              ) : (
                // Available Time Slots Grid
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5 max-h-[220px] sm:max-h-[240px] overflow-y-auto pr-1">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSlotClick(slot)}
                          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border ${
                            isSelected
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-[1.02]"
                              : "bg-slate-900/60 border-white/[0.08] text-slate-300 hover:border-purple-500/50 hover:bg-purple-950/30 hover:text-white"
                          }`}
                        >
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-400"}`} />
                          <span>{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Booking CTA */}
            <div className="pt-4 mt-4 border-t border-white/[0.06]">
              <motion.button
                type="button"
                disabled={!selectedDate || !selectedSlot}
                onClick={handleOpenBookingModal}
                whileHover={
                  prefersReducedMotion || !selectedDate || !selectedSlot
                    ? {}
                    : {
                        scale: 1.02,
                        boxShadow: "0 0 25px rgba(168, 85, 247, 0.45)",
                      }
                }
                whileTap={
                  prefersReducedMotion || !selectedDate || !selectedSlot
                    ? {}
                    : { scale: 0.98 }
                }
                className="w-full relative inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] hover:bg-right shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-purple-400/30 overflow-hidden"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>
                  {selectedSlot
                    ? `Confirm Booking (${selectedSlot})`
                    : "Confirm Booking"}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── 5. Polished Booking Confirmation Modal ──────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.95, y: 16 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.95, y: 16 }
              }
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl shadow-purple-950/70 p-6 sm:p-8 overflow-hidden"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-400">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Confirm Appointment
                    </h3>
                    <p className="text-xs text-slate-400">
                      15-minute 1-on-1 with Prasanta Gorai
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!bookingConfirmed ? (
                // Booking Form
                <form onSubmit={handleConfirmSubmit} className="space-y-4">
                  {/* Selected Slot Highlight Badge */}
                  <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-300 font-medium">Selected Slot:</span>
                    <span className="font-bold text-purple-300 font-mono">
                      {formattedSelectedDate} @ {selectedSlot} (GMT+5:30)
                    </span>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="booking-name"
                      className="block text-xs font-semibold text-slate-300 mb-1.5"
                    >
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="booking-name"
                        value={bookingInfo.name}
                        onChange={(e) =>
                          setBookingInfo({ ...bookingInfo, name: e.target.value })
                        }
                        placeholder="e.g. John Doe"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none transition-colors ${
                          formErrors.name
                            ? "border-rose-500 focus:border-rose-500"
                            : "border-white/10 focus:border-purple-500"
                        }`}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="mt-1 text-xs text-rose-400 font-medium">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Contact Input */}
                  <div>
                    <label
                      htmlFor="booking-contact"
                      className="block text-xs font-semibold text-slate-300 mb-1.5"
                    >
                      Email or WhatsApp Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="booking-contact"
                      value={bookingInfo.emailOrPhone}
                      onChange={(e) =>
                        setBookingInfo({
                          ...bookingInfo,
                          emailOrPhone: e.target.value,
                        })
                      }
                      placeholder="e.g. john@example.com or +91 9876543210"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none transition-colors ${
                        formErrors.contact
                          ? "border-rose-500 focus:border-rose-500"
                            : "border-white/10 focus:border-purple-500"
                      }`}
                    />
                    {formErrors.contact && (
                      <p className="mt-1 text-xs text-rose-400 font-medium">
                        {formErrors.contact}
                      </p>
                    )}
                  </div>

                  {/* Topic / Notes */}
                  <div>
                    <label
                      htmlFor="booking-notes"
                      className="block text-xs font-semibold text-slate-300 mb-1.5"
                    >
                      Project / Meeting Topic (Optional)
                    </label>
                    <textarea
                      id="booking-notes"
                      rows={2}
                      value={bookingInfo.notes}
                      onChange={(e) =>
                        setBookingInfo({ ...bookingInfo, notes: e.target.value })
                      }
                      placeholder="e.g. Discussing a full-stack project or job opportunity..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:brightness-110 transition-all cursor-pointer"
                    >
                      Confirm &amp; Schedule Appointment
                    </button>
                  </div>
                </form>
              ) : (
                // Success State
                <div className="py-4 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white">
                      Appointment Confirmed!
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Scheduled for{" "}
                      <span className="text-purple-300 font-bold">
                        {formattedSelectedDate} at {selectedSlot}
                      </span>
                    </p>
                  </div>

                  {/* Small Email Notification Status */}
                  {emailSendStatus === "sending" && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-[11px] font-medium text-purple-300 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
                      <span>Sending confirmation email to host...</span>
                    </div>
                  )}
                  {emailSendStatus === "sent" && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-medium text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Host notified via email</span>
                    </div>
                  )}
                  {emailSendStatus === "error" && (
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-500/30 text-[11px] font-medium text-rose-300"
                      title={emailErrorMessage || "Email notification delivery issue"}
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Email delivery issue (Booking is confirmed)</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    A confirmation has been prepared for {bookingInfo.name}. You can also instantly send this appointment directly to WhatsApp or add to your Google Calendar:
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                    <a
                      href={getWhatsAppBookingLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs inline-flex items-center justify-center gap-1.5 shadow-md transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirm via WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <a
                      href={getGoogleCalendarLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs inline-flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
                    >
                      <CalendarIcon className="w-4 h-4 text-purple-400" />
                      <span>Add to Calendar</span>
                    </a>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={handleResetBooking}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Schedule another time slot
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HomeContact;
