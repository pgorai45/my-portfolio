import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, Mail, Eye, EyeOff, Sparkles, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading: authLoading } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const isExpired = searchParams.get("expired") === "1";

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        setErrorMessage(res.message || "Invalid email or password.");
      }
    } catch {
      setErrorMessage("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-purple-900/25 via-indigo-900/15 to-transparent rounded-full blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/10 transition-colors backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Public Portfolio</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-purple-950/40 overflow-hidden"
      >
        {/* Top Edge Specular Shine */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent pointer-events-none" />

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-purple-950/80 border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.3)] mb-4">
            <Sparkles className="w-7 h-7 text-purple-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 font-normal">
            Sign in to manage your portfolio CMS and content
          </p>
        </div>

        {/* Expired Notification */}
        {isExpired && (
          <div className="mb-6 p-3 rounded-2xl bg-amber-950/50 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Your session has expired. Please sign in again.</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-950/50 border border-red-500/30 flex items-start gap-3 text-xs text-red-200 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portfolio.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] hover:bg-right shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-purple-400/30"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
          <p className="text-[11px] text-slate-500">
            Protected area. Authorized administrator access only.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
