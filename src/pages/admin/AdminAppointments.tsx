import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Loader2,
  X,
  Mail,
} from "lucide-react";
import { adminApi } from "../../services/api";
import type { Appointment } from "../../types/admin";
import { useToast } from "../../context/ToastContext";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

export const AdminAppointments: React.FC = () => {
  const toast = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected Detail Modal
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAppointments({
        search: searchQuery,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      if (res.success && res.data) {
        setAppointments(res.data);
      }
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, toast]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleUpdateStatus = async (
    appt: Appointment,
    newStatus: "pending" | "confirmed" | "cancelled"
  ) => {
    try {
      const res = await adminApi.updateAppointmentStatus(appt.id, newStatus);
      if (res.success && res.data) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === appt.id ? { ...a, status: res.data!.status } : a))
        );
        if (selectedAppt?.id === appt.id) {
          setSelectedAppt((prev) => prev ? { ...prev, status: res.data!.status } : null);
        }
        toast.success(`Appointment status updated to ${newStatus}`);
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch {
      toast.error("Network error while updating status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await adminApi.deleteAppointment(deleteTarget.id);
      if (res.success) {
        setAppointments((prev) => prev.filter((a) => a.id !== deleteTarget.id));
        if (selectedAppt?.id === deleteTarget.id) {
          setSelectedAppt(null);
        }
        toast.success("Appointment deleted");
        setDeleteTarget(null);
      } else {
        toast.error(res.message || "Failed to delete appointment");
      }
    } catch {
      toast.error("Network error while deleting appointment");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Confirmed</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-red-950/60 text-red-300 border border-red-500/40">
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/40 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Appointment Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review, confirm, cancel, and manage booking requests from the interactive portfolio calendar
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Bookings" },
            { id: "pending", label: "Pending" },
            { id: "confirmed", label: "Confirmed" },
            { id: "cancelled", label: "Cancelled" },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === st.id
                  ? "bg-purple-600 text-white shadow-md shadow-purple-950/40"
                  : "bg-slate-950/60 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search visitor, email, notes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
          <p className="text-sm">Loading appointment requests...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-white/5 p-8">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No appointments found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Bookings made through the interactive calendar in the Contact section will show here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appt) => (
            <motion.div
              key={appt.id}
              layout
              className="rounded-3xl p-6 bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-purple-400/40 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Header: Date, Time & Status */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-purple-300 bg-purple-950/50 border border-purple-500/30 px-3 py-1 rounded-full">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{appt.date}</span>
                  </div>

                  {getStatusBadge(appt.status)}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-3">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Scheduled Time: {appt.time}</span>
                </div>

                {/* Visitor Info */}
                <h4 className="text-lg font-bold text-white mb-0.5">{appt.name}</h4>
                <p className="text-xs text-slate-400 font-mono truncate mb-4">{appt.email}</p>

                {/* Notes */}
                {appt.message && (
                  <p className="text-xs text-slate-300/80 line-clamp-3 bg-slate-950/60 p-3 rounded-xl border border-white/5 mb-4">
                    &quot;{appt.message}&quot;
                  </p>
                )}
              </div>

              {/* Bottom Actions Bar */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {appt.status !== "confirmed" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(appt, "confirmed")}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 transition-colors"
                      title="Confirm Appointment"
                    >
                      Confirm
                    </button>
                  )}

                  {appt.status !== "cancelled" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(appt, "cancelled")}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-red-300 bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 transition-colors"
                      title="Cancel Appointment"
                    >
                      Cancel
                    </button>
                  )}

                  {appt.status !== "pending" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(appt, "pending")}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/30 transition-colors"
                      title="Reset to Pending"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedAppt(appt)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-950/50 transition-colors"
                    title="View Details"
                  >
                    <Mail className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(appt)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/50 transition-colors"
                    title="Delete Appointment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── APPOINTMENT DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedAppt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAppt(null)}
              className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Appointment Details</h3>
                  <p className="text-xs text-slate-400 font-mono">ID: #{selectedAppt.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAppt(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Current Status:</span>
                  <div>{getStatusBadge(selectedAppt.status)}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Visitor Name:</span>
                    <span className="text-white font-semibold">{selectedAppt.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Email / Contact:</span>
                    <span className="text-purple-300 font-mono">{selectedAppt.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Date:</span>
                    <span className="text-white font-mono">{selectedAppt.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Time:</span>
                    <span className="text-white font-mono">{selectedAppt.time}</span>
                  </div>
                </div>

                {selectedAppt.message && (
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                      Visitor Discussion Notes
                    </span>
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-slate-200 whitespace-pre-wrap">
                      {selectedAppt.message}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between">
                <a
                  href={`mailto:${selectedAppt.email}?subject=Confirmation: Meeting on ${selectedAppt.date} at ${selectedAppt.time}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Visitor</span>
                </a>

                <div className="flex items-center gap-2">
                  {selectedAppt.status !== "confirmed" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedAppt, "confirmed")}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer"
                    >
                      Confirm
                    </button>
                  )}
                  {selectedAppt.status !== "cancelled" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedAppt, "cancelled")}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Appointment"
        message={`Are you sure you want to delete the appointment for '${deleteTarget?.name}' on ${deleteTarget?.date}?`}
        confirmLabel="Delete Appointment"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminAppointments;
