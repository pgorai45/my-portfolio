import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  UserCheck,
  Cpu,
  GraduationCap,
  Briefcase,
  FolderCode,
  FileText,
  Mail,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Bell,
  Sparkles,
  ChevronRight,
  Database,
  ArrowUpRight,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { adminApi } from "../services/api";
import type { DashboardStats } from "../types/admin";

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: "unreadContacts" | "pendingAppointments";
}

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Profile", path: "/admin/profile", icon: UserCheck },
  { name: "Skills", path: "/admin/skills", icon: Cpu },
  { name: "Education", path: "/admin/education", icon: GraduationCap },
  { name: "Experience", path: "/admin/experience", icon: Briefcase },
  { name: "Projects", path: "/admin/projects", icon: FolderCode },
  { name: "Resume", path: "/admin/resume", icon: FileText },
  { name: "Contacts", path: "/admin/contacts", icon: Mail, badgeKey: "unreadContacts" },
  { name: "Appointments", path: "/admin/appointments", icon: Calendar, badgeKey: "pendingAppointments" },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Prevent browser/body from becoming the main scroll container
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch quick stats for badges and notification bell
  useEffect(() => {
    adminApi.getStats().then((res) => {
      if (res.success && res.data) {
        setStats(res.data);
      }
    });
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  const getPageTitle = () => {
    const active = NAV_ITEMS.find((item) => item.path === location.pathname);
    return active ? active.name : "Admin Portal";
  };

  const totalNotifications =
    (stats?.counts.unreadContacts || 0) + (stats?.counts.pendingAppointments || 0);

  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden bg-[#020617] text-slate-100 flex antialiased selection:bg-purple-500/30 selection:text-purple-200 relative">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-purple-900/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[350px] bg-indigo-950/15 rounded-full blur-[140px]" />
      </div>

      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden lg:flex flex-col w-72 h-full bg-slate-950/80 backdrop-blur-2xl border-r border-white/[0.08] shadow-2xl shrink-0 z-10 relative">
        {/* Logo / Brand Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 p-[1px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-wide block">
                Portfolio CMS
              </span>
              <span className="text-[11px] text-purple-300 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Control Center
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-1.5 no-scrollbar">
            <div className="px-3 pb-2 text-[10px] font-mono tracking-widest uppercase text-slate-400 font-semibold">
              Management
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const badgeCount = item.badgeKey ? stats?.counts[item.badgeKey] || 0 : 0;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-white bg-gradient-to-r from-purple-600/30 to-indigo-600/20 border border-purple-500/40 shadow-lg shadow-purple-950/40"
                        : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? "text-purple-400" : "text-slate-400 group-hover:text-slate-200"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>

                      {badgeCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">
                          {badgeCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick View Portfolio Link & Admin User Footer */}
          <div className="p-4 border-t border-white/[0.08] space-y-3 shrink-0">
            <a
              href="/home"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-white/[0.06] hover:border-purple-400/30 transition-all duration-200 group"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                View Public Portfolio
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Admin User Info Card */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md">
                  {user?.username ? user.username.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {user?.username || "Admin"}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                title="Log Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ─── MAIN CONTENT AREA ─── */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
          {/* Top Navbar */}
          <header className="h-18 px-6 lg:px-8 border-b border-white/[0.08] bg-slate-950/60 backdrop-blur-xl flex items-center justify-between z-20 shrink-0">
            {/* Left: Mobile Toggle & Breadcrumbs */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-white/10"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Admin</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="font-semibold text-white">{getPageTitle()}</span>
              </div>
            </div>

            {/* Right: DB Status, Notifications, Profile Dropdown */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* DB Status Badge */}
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-emerald-500/30 text-xs font-mono text-emerald-400 shadow-sm">
                <Database className="w-3.5 h-3.5" />
                <span>PostgreSQL Online</span>
              </div>

              {/* Notifications Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/10 transition-colors cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {totalNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-md">
                      {totalNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setNotificationsOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-slate-900/95 border border-white/10 p-4 shadow-2xl backdrop-blur-2xl z-50 overflow-hidden"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Bell className="w-4 h-4 text-purple-400" />
                            Notifications
                          </h4>
                          <span className="text-xs text-slate-400 font-mono">
                            {totalNotifications} pending
                          </span>
                        </div>

                        <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                          {stats?.counts.unreadContacts ? (
                            <Link
                              to="/admin/contacts?status=unread"
                              onClick={() => setNotificationsOpen(false)}
                              className="p-3 rounded-xl bg-slate-950/60 hover:bg-purple-950/30 border border-white/5 hover:border-purple-500/30 flex items-start gap-3 transition-colors block"
                            >
                              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                                <Mail className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-white">
                                  {stats.counts.unreadContacts} Unread Contact Message(s)
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Click to view visitor messages
                                </p>
                              </div>
                            </Link>
                          ) : null}

                          {stats?.counts.pendingAppointments ? (
                            <Link
                              to="/admin/appointments?status=pending"
                              onClick={() => setNotificationsOpen(false)}
                              className="p-3 rounded-xl bg-slate-950/60 hover:bg-cyan-950/30 border border-white/5 hover:border-cyan-500/30 flex items-start gap-3 transition-colors block"
                            >
                              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                                <Calendar className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-white">
                                  {stats.counts.pendingAppointments} Pending Appointment(s)
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Requires confirmation or rescheduling
                                </p>
                              </div>
                            </Link>
                          ) : null}

                          {!stats?.counts.unreadContacts && !stats?.counts.pendingAppointments && (
                            <div className="py-6 text-center text-xs text-slate-400">
                              All caught up! No pending notifications.
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* View Public Site Button */}
              <a
                href="/home"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 transition-all duration-200"
              >
                <span>Live Site</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              {/* Admin Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
                {user?.username ? user.username.charAt(0).toUpperCase() : "A"}
              </div>
            </div>
          </header>

          {/* Main Viewport Container */}
          <main className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 custom-scrollbar">
            <Outlet />
          </main>
        </div>

      {/* ─── MOBILE DRAWER NAVIGATION ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md cursor-pointer"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-80 max-w-[85vw] bg-slate-950/95 border-r border-white/10 p-6 flex flex-col z-10 shadow-2xl overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5 text-purple-200" />
                  </div>
                  <span className="font-bold text-white">Portfolio CMS</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-6 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const badgeCount = item.badgeKey ? stats?.counts[item.badgeKey] || 0 : 0;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "text-white bg-purple-600/30 border border-purple-500/40"
                            : "text-slate-400 hover:text-white hover:bg-slate-900"
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {badgeCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          {badgeCount}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-white/[0.08] space-y-3">
                <a
                  href="/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-900 border border-white/10"
                >
                  <span>View Public Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                </a>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-300 bg-red-950/40 border border-red-500/30 hover:bg-red-900/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
