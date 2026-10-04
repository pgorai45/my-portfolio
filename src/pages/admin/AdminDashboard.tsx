import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  FolderCode,
  Cpu,
  GraduationCap,
  Briefcase,
  Mail,
  Calendar,
  Activity,
  ArrowRight,
  RefreshCw,
  Plus,
} from "lucide-react";
import { adminApi } from "../../services/api";
import type { DashboardStats } from "../../types/admin";
import { useToast } from "../../context/ToastContext";

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  const fetchStats = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await adminApi.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        toast.error("Failed to load dashboard metrics");
      }
    } catch {
      toast.error("Network error while loading metrics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      title: "Total Projects",
      value: stats?.counts.totalProjects ?? "-",
      icon: FolderCode,
      color: "from-blue-500 to-indigo-500",
      accent: "text-blue-400 border-blue-500/30 bg-blue-950/40",
      link: "/admin/projects",
    },
    {
      title: "Total Skills",
      value: stats?.counts.totalSkills ?? "-",
      icon: Cpu,
      color: "from-purple-500 to-pink-500",
      accent: "text-purple-400 border-purple-500/30 bg-purple-950/40",
      link: "/admin/skills",
    },
    {
      title: "Education Entries",
      value: stats?.counts.totalEducation ?? "-",
      icon: GraduationCap,
      color: "from-cyan-500 to-teal-500",
      accent: "text-cyan-400 border-cyan-500/30 bg-cyan-950/40",
      link: "/admin/education",
    },
    {
      title: "Experience Entries",
      value: stats?.counts.totalExperience ?? "-",
      icon: Briefcase,
      color: "from-emerald-500 to-teal-500",
      accent: "text-emerald-400 border-emerald-500/30 bg-emerald-950/40",
      link: "/admin/experience",
    },
    {
      title: "Total Contacts",
      value: stats?.counts.totalContacts ?? "-",
      icon: Mail,
      color: "from-amber-500 to-orange-500",
      accent: "text-amber-400 border-amber-500/30 bg-amber-950/40",
      subtext: `${stats?.counts.unreadContacts || 0} unread`,
      link: "/admin/contacts",
    },
    {
      title: "Total Appointments",
      value: stats?.counts.totalAppointments ?? "-",
      icon: Calendar,
      color: "from-indigo-500 to-purple-500",
      accent: "text-indigo-400 border-indigo-500/30 bg-indigo-950/40",
      subtext: `${stats?.counts.pendingAppointments || 0} pending`,
      link: "/admin/appointments",
    },
  ];

  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time portfolio metrics, visitor activity, and recent CMS updates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchStats(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-purple-400" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950/50 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* ─── 1. METRICS GRID ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="group relative rounded-2xl p-6 bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-950/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
                    {card.title}
                  </span>
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {loading ? (
                      <span className="inline-block w-12 h-8 bg-slate-800 rounded-lg animate-pulse" />
                    ) : (
                      card.value
                    )}
                  </div>
                  {card.subtext && (
                    <span className="text-xs text-purple-300 font-mono mt-1 block">
                      {card.subtext}
                    </span>
                  )}
                </div>

                <div className={`p-3 rounded-xl border ${card.accent} shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <Link
                  to={card.link}
                  className="text-xs font-semibold text-slate-300 group-hover:text-purple-300 inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Manage section</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── 2. RECENT CONTACTS & APPOINTMENTS GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Recent Contacts</h3>
                  <p className="text-xs text-slate-400">Latest messages sent through the portfolio</p>
                </div>
              </div>

              <Link
                to="/admin/contacts"
                className="text-xs font-semibold text-purple-300 hover:text-purple-200 transition-colors"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {stats?.recentContacts && stats.recentContacts.length > 0 ? (
                stats.recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 hover:border-white/15 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">
                          {contact.name}
                        </span>
                        {!contact.is_read && (
                          <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{contact.email}</p>
                      <p className="text-xs text-slate-300/80 mt-1 line-clamp-1">
                        {contact.message}
                      </p>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
                      {formatTime(contact.created_at)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-slate-500">
                  No contact messages received yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <Link
              to="/admin/contacts"
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-between"
            >
              <span>Manage all inquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Recent Appointments</h3>
                  <p className="text-xs text-slate-400">Scheduled calls and bookings</p>
                </div>
              </div>

              <Link
                to="/admin/appointments"
                className="text-xs font-semibold text-purple-300 hover:text-purple-200 transition-colors"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
                stats.recentAppointments.map((appt) => {
                  const isPending = appt.status.toLowerCase() === "pending";
                  const isConfirmed = appt.status.toLowerCase() === "confirmed";

                  return (
                    <div
                      key={appt.id}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 hover:border-white/15 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">{appt.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                              isPending
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : isConfirmed
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-slate-800 text-slate-400 border border-white/10"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono truncate">{appt.email}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs font-mono font-semibold text-slate-200">
                          {appt.date}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">{appt.time}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-xs text-slate-500">
                  No appointments scheduled yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <Link
              to="/admin/appointments"
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-between"
            >
              <span>Manage appointment schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 3. RECENT PORTFOLIO CHANGES (AUDIT LOGS) ─── */}
      <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Recent Portfolio Changes</h3>
              <p className="text-xs text-slate-400">
                Audited modifications stored directly in PostgreSQL
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {stats?.recentChanges && stats.recentChanges.length > 0 ? (
            stats.recentChanges.map((change) => (
              <div
                key={change.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white block truncate">
                      {change.details || change.action}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">
                      {change.entity_type} • {change.action}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
                  {formatTime(change.created_at)}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No recent changes recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
