import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  KeyRound,
  Database,
  Save,
  Loader2,
  ShieldCheck,
  Server,
} from "lucide-react";
import { adminApi } from "../../services/api";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useToast } from "../../context/ToastContext";

export const AdminSettings: React.FC = () => {
  const { user, refreshUser } = useAdminAuth();
  const toast = useToast();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const [dbHealth, setDbHealth] = useState<{
    status: "checking" | "connected" | "error";
    time?: string;
  }>({ status: "checking" });

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Check PostgreSQL Backend Health
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setDbHealth({ status: "connected", time: data.time });
        } else {
          setDbHealth({ status: "error" });
        }
      })
      .catch(() => setDbHealth({ status: "error" }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword) {
      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("New password and confirmation do not match.");
        return;
      }
      if (!currentPassword) {
        toast.error("Please enter your current password to set a new password.");
        return;
      }
    }

    setSaving(true);
    try {
      const res = await adminApi.updateSettings({
        username: username.trim(),
        email: email.trim(),
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      if (res.success) {
        toast.success("Settings updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        await refreshUser();
      } else {
        toast.error(res.message || "Failed to update settings");
      }
    } catch {
      toast.error("Network error while updating settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Admin Portal Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage administrator credentials, security preferences, and view system health
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Form (Span 2) */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Credentials */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <User className="w-4 h-4 text-purple-400" />
                Administrator Account
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Prasanta Gorai"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Admin Login Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@portfolio.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <KeyRound className="w-4 h-4 text-purple-400" />
                Change Password
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] hover:bg-right shadow-lg shadow-purple-950/50 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Settings</span>
            </button>
          </form>
        </div>

        {/* Right Column: System Status Card (Span 1) */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <Server className="w-4 h-4 text-purple-400" />
              System Status
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium block">
                  Database Engine
                </span>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold text-white">PostgreSQL</span>
                  {dbHealth.status === "connected" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                      Connected
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium block">
                  Authentication Scheme
                </span>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">JWT + bcrypt</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium block">
                  Current Session
                </span>
                <span className="text-xs font-mono text-purple-300">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
