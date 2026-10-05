import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import {
  sendContactMessage,
  getMailtoFallbackLink,
  TARGET_EMAIL,
} from "../../services/emailService";
import { portfolioApi } from "../../services/api";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormFields {
  name: string;
  email: string;
  message: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormFields>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isConfigError, setIsConfigError] = useState<boolean>(false);

  // Focus management and body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus first input after slight delay for animation
    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (status === "loading") return;

    if (status === "success") {
      setStatus("idle");
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
      setTouched({});
      setErrorMessage("");
    } else {
      setErrors({});
      setErrorMessage("");
    }
    onClose();
  }, [status, onClose]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && status !== "loading") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, status, handleClose]);

  // Validation function
  const validateField = (
    field: keyof FormFields,
    value: string,
  ): string | undefined => {
    const trimmed = value.trim();
    if (field === "name") {
      if (!trimmed) return "Your Name is required.";
      if (trimmed.length < 2) return "Name must be at least 2 characters.";
    }
    if (field === "email") {
      if (!trimmed) return "Your Email is required.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed))
        return "Please enter a valid email address.";
    }
    if (field === "message") {
      if (!trimmed) return "Message cannot be empty.";
      if (trimmed.length < 5) return "Message must be at least 5 characters.";
    }
    return undefined;
  };

  const validateAll = (): boolean => {
    const newErrors: FieldErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });
    return !newErrors.name && !newErrors.email && !newErrors.message;
  };

  const handleInputChange = (field: keyof FormFields, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const fieldError = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleBlur = (field: keyof FormFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    if (!validateAll()) {
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    setIsConfigError(false);

    try {
      let dbSuccess = false;
      try {
        const dbRes = await portfolioApi.submitContact({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        });
        if (dbRes.success) dbSuccess = true;
      } catch (dbErr) {
        console.warn("DB save note:", dbErr);
      }

      let emailRes: {
        success: boolean;
        error?: string;
        isConfigurationError?: boolean;
      } = { success: false };
      try {
        emailRes = await sendContactMessage(formData);
      } catch (mailErr) {
        console.warn("EmailJS note:", mailErr);
      }

      if (dbSuccess || emailRes.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
        setTouched({});
      } else {
        setStatus("error");
        setErrorMessage(
          emailRes.error ||
            "An error occurred while sending your message. Please try again.",
        );
        setIsConfigError(Boolean(emailRes.isConfigurationError));
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        "Network error: Could not send your message. Please try again.",
      );
    }
  };

  const handleResetForNewMessage = () => {
    setStatus("idle");
    setFormData({ name: "", email: "", message: "" });
    setErrors({});
    setTouched({});
    setErrorMessage("");
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Modal Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Centered Modal Card */}
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: 16 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: 16 }
            }
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 350,
              duration: 0.3,
            }}
            className="relative z-10 w-full max-w-lg rounded-3xl bg-[#0a0f24]/95 border border-purple-500/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_-5px_rgba(168,85,247,0.25)] p-5 sm:p-8 backdrop-blur-xl overflow-hidden my-auto max-h-[92dvh] overflow-y-auto custom-scrollbar"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            {/* Ambient Background Gradient Lights */}
            <div className="absolute -top-24 -left-24 w-52 h-52 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 inset-x-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-70" />

            {/* Modal Top Bar */}
            <div className="relative flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="contact-modal-title"
                    className="text-lg sm:text-xl font-bold text-white tracking-tight"
                  >
                    Send a Message
                  </h3>
                  <p className="text-xs text-slate-400">
                    Direct to{" "}
                    <span className="text-purple-300 font-medium">
                      {TARGET_EMAIL}
                    </span>
                  </p>
                </div>
              </div>

              {/* Close (X) button */}
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content: Form or Success State */}
            {status === "success" ? (
              /* Success Animation State */
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.92 }
                }
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="py-6 text-center space-y-4"
              >
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    damping: 14,
                    stiffness: 220,
                    delay: 0.08,
                  }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.35)]"
                >
                  <CheckCircle2 className="w-9 h-9" />
                </motion.div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white">
                    Message sent successfully!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. Your message has been dispatched
                    to{" "}
                    <span className="text-purple-300 font-medium">
                      {TARGET_EMAIL}
                    </span>
                    . I will get back to you shortly!
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetForNewMessage}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 bg-slate-900 border border-white/10 hover:border-purple-500/40 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-purple-400" />
                    <span>Send another message</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Contact Form */
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Error Banner */}
                {status === "error" && errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex flex-col gap-2 shadow-lg"
                    role="alert"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                      <div className="flex-1 font-medium leading-relaxed">
                        {errorMessage}
                      </div>
                    </div>
                    {isConfigError && (
                      <div className="pt-1 border-t border-rose-500/20 flex items-center justify-between">
                        <span className="text-[11px] text-rose-300">
                          Or reach out directly via your email client:
                        </span>
                        <a
                          href={getMailtoFallbackLink(formData)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 hover:text-white underline cursor-pointer"
                        >
                          Open Email App
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Field 1: Your Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                  >
                    Your Name <span className="text-purple-400">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    disabled={status === "loading"}
                    placeholder="e.g. Alex Morgan"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                      errors.name && touched.name
                        ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-invalid={Boolean(errors.name && touched.name)}
                    aria-describedby={
                      errors.name && touched.name ? "name-error" : undefined
                    }
                  />
                  {errors.name && touched.name && (
                    <p
                      id="name-error"
                      className="mt-1 text-xs text-rose-400 font-medium"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Field 2: Your Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                  >
                    Your Email <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    disabled={status === "loading"}
                    placeholder="name@company.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                      errors.email && touched.email
                        ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-invalid={Boolean(errors.email && touched.email)}
                    aria-describedby={
                      errors.email && touched.email ? "email-error" : undefined
                    }
                  />
                  {errors.email && touched.email && (
                    <p
                      id="email-error"
                      className="mt-1 text-xs text-rose-400 font-medium"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Field 3: Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                  >
                    Message <span className="text-purple-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    onBlur={() => handleBlur("message")}
                    disabled={status === "loading"}
                    placeholder="Hi Prasanta, I'd like to discuss a project..."
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none transition-all resize-none ${
                      errors.message && touched.message
                        ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-invalid={Boolean(errors.message && touched.message)}
                    aria-describedby={
                      errors.message && touched.message
                        ? "message-error"
                        : undefined
                    }
                  />
                  {errors.message && touched.message && (
                    <p
                      id="message-error"
                      className="mt-1 text-xs text-rose-400 font-medium"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Field 4: Send Message Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3.5 px-5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:brightness-110 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-purple-200" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
