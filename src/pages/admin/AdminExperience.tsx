import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  Eye,
  EyeOff,
  MapPin,
} from "lucide-react";
import { adminApi } from "../../services/api";
import type { Experience } from "../../types/admin";
import { useToast } from "../../context/ToastContext";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

const ACCENT_COLORS = [
  { id: "purple", label: "Purple", class: "bg-purple-500" },
  { id: "cyan", label: "Cyan", class: "bg-cyan-500" },
  { id: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { id: "emerald", label: "Emerald", class: "bg-emerald-500" },
];

export const AdminExperience: React.FC = () => {
  const toast = useToast();

  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [modalForm, setModalForm] = useState({
    company: "",
    position: "",
    location: "",
    start_date: "",
    end_date: "",
    currently_working: false,
    description: "",
    technologies: "",
    accent_color: "purple" as const,
    display_order: 1,
    is_visible: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchExperience = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getExperience();
      if (res.success && res.data) {
        setExperienceList(res.data);
      }
    } catch {
      toast.error("Failed to load experience records");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  const openCreateModal = () => {
    const nextOrder =
      experienceList.length > 0 ? Math.max(...experienceList.map((e) => e.display_order)) + 1 : 1;
    setEditingItem(null);
    setModalForm({
      company: "",
      position: "",
      location: "",
      start_date: "",
      end_date: "",
      currently_working: false,
      description: "",
      technologies: "",
      accent_color: "purple",
      display_order: nextOrder,
      is_visible: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: Experience) => {
    setEditingItem(item);
    const tech = Array.isArray(item.technologies)
      ? item.technologies.join(", ")
      : typeof item.technologies === "string"
      ? item.technologies
      : "";

    setModalForm({
      company: item.company,
      position: item.position,
      location: item.location || "",
      start_date: item.start_date,
      end_date: item.end_date || "",
      currently_working: item.currently_working,
      description: item.description || "",
      technologies: tech,
      accent_color: (item.accent_color as any) || "purple",
      display_order: item.display_order,
      is_visible: item.is_visible,
    });
    setModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.company.trim() || !modalForm.position.trim() || !modalForm.start_date.trim()) {
      toast.error("Company, position, and start date are required.");
      return;
    }

    setSubmitting(true);
    try {
      const techArray = modalForm.technologies
        ? modalForm.technologies.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        ...modalForm,
        technologies: techArray,
      };

      if (editingItem) {
        const res = await adminApi.updateExperience(editingItem.id, payload);
        if (res.success && res.data) {
          setExperienceList((prev) =>
            prev.map((item) => (item.id === editingItem.id ? res.data! : item))
          );
          toast.success("Experience updated!");
          setModalOpen(false);
        } else {
          toast.error(res.message || "Failed to update experience");
        }
      } else {
        const res = await adminApi.createExperience(payload);
        if (res.success && res.data) {
          setExperienceList((prev) => [...prev, res.data!].sort((a, b) => a.display_order - b.display_order));
          toast.success("Experience added!");
          setModalOpen(false);
        } else {
          toast.error(res.message || "Failed to add experience");
        }
      }
    } catch {
      toast.error("Network error while saving experience");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleVisibility = async (item: Experience) => {
    try {
      const res = await adminApi.updateExperience(item.id, { is_visible: !item.is_visible });
      if (res.success && res.data) {
        setExperienceList((prev) =>
          prev.map((e) => (e.id === item.id ? res.data! : e))
        );
        toast.info(`'${item.position}' is now ${!item.is_visible ? "visible" : "hidden"}`);
      }
    } catch {
      toast.error("Failed to toggle visibility");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await adminApi.deleteExperience(deleteTarget.id);
      if (res.success) {
        setExperienceList((prev) => prev.filter((e) => e.id !== deleteTarget.id));
        toast.success("Experience entry deleted");
        setDeleteTarget(null);
      } else {
        toast.error(res.message || "Failed to delete entry");
      }
    } catch {
      toast.error("Network error while deleting entry");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Experience &amp; Journey Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your development milestones, internships, employment roles, and technical journey
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
          <p className="text-sm">Loading experience records...</p>
        </div>
      ) : experienceList.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-white/5 p-8">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No experience entries found</h3>
          <p className="text-xs text-slate-400 mt-1">Click &quot;Add Experience&quot; to add roles or milestones.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experienceList.map((item) => {
            const techList = Array.isArray(item.technologies)
              ? item.technologies
              : typeof item.technologies === "string"
              ? JSON.parse(item.technologies || "[]")
              : [];

            return (
              <motion.div
                key={item.id}
                layout
                className="rounded-3xl p-6 sm:p-7 bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-purple-400/40 transition-all shadow-xl flex flex-col sm:flex-row items-start justify-between gap-6"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-950/60 text-purple-300 border border-purple-500/30">
                      {item.start_date} – {item.currently_working ? "Present" : item.end_date || "Present"}
                    </span>

                    {item.currently_working && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        In Progress / Current
                      </span>
                    )}

                    <span className="text-xs text-slate-500 font-mono">#{item.display_order}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{item.position}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-300 font-medium mb-3">
                    <span className="text-purple-300 font-semibold">{item.company}</span>
                    {item.location && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400 text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.location}
                        </span>
                      </>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-sm text-slate-300/85 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  )}

                  {techList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {techList.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-950/80 border border-white/5 text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Actions */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(item)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      item.is_visible
                        ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border border-white/10"
                    }`}
                  >
                    {item.is_visible ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-purple-950/50 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ─── ADD / EDIT MODAL ─── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-xl rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  {editingItem ? "Edit Experience" : "Add Experience"}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Position / Role Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={modalForm.position}
                      onChange={(e) => setModalForm({ ...modalForm, position: e.target.value })}
                      placeholder="e.g. Full Stack Developer, Intern"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={modalForm.company}
                      onChange={(e) => setModalForm({ ...modalForm, company: e.target.value })}
                      placeholder="e.g. Acme Corp, Self-Directed"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Start Date / Year *
                    </label>
                    <input
                      type="text"
                      required
                      value={modalForm.start_date}
                      onChange={(e) => setModalForm({ ...modalForm, start_date: e.target.value })}
                      placeholder="e.g. 2025"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      End Date / Year
                    </label>
                    <input
                      type="text"
                      disabled={modalForm.currently_working}
                      value={modalForm.currently_working ? "Present" : modalForm.end_date}
                      onChange={(e) => setModalForm({ ...modalForm, end_date: e.target.value })}
                      placeholder="e.g. 2026"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={modalForm.location}
                      onChange={(e) => setModalForm({ ...modalForm, location: e.target.value })}
                      placeholder="e.g. Remote, India"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modalForm.currently_working}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          currently_working: e.target.checked,
                          end_date: e.target.checked ? "Present" : "",
                        })
                      }
                      className="rounded bg-slate-800 border-white/20 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-xs text-slate-300">
                      Currently working in this role / ongoing milestone
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={modalForm.description}
                    onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                    placeholder="Milestone achievements, responsibilities..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                    Technologies / Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={modalForm.technologies}
                    onChange={(e) => setModalForm({ ...modalForm, technologies: e.target.value })}
                    placeholder="React, Node.js, TypeScript, PostgreSQL"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      {ACCENT_COLORS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setModalForm({ ...modalForm, accent_color: c.id as any })}
                          className={`w-7 h-7 rounded-full ${c.class} transition-transform ${
                            modalForm.accent_color === c.id
                              ? "scale-125 ring-2 ring-white"
                              : "opacity-60 hover:opacity-100"
                          }`}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={modalForm.display_order}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, display_order: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modalForm.is_visible}
                      onChange={(e) => setModalForm({ ...modalForm, is_visible: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 relative" />
                    <span className="text-xs text-slate-300 font-medium">
                      Publish to public portfolio
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950/50 cursor-pointer disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingItem ? "Save Changes" : "Create Entry"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Experience Entry"
        message={`Are you sure you want to delete '${deleteTarget?.position}' at '${deleteTarget?.company}'? This will remove it from the public timeline.`}
        confirmLabel="Delete Entry"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminExperience;
