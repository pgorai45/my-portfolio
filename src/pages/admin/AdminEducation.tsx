import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  Eye,
  EyeOff,
  School,
} from "lucide-react";
import { adminApi } from "../../services/api";
import type { Education } from "../../types/admin";
import { useToast } from "../../context/ToastContext";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

export const AdminEducation: React.FC = () => {
  const toast = useToast();

  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [modalForm, setModalForm] = useState({
    institution: "",
    degree: "",
    stream: "",
    start_year: "",
    end_year: "",
    grade: "",
    description: "",
    coursework: "",
    display_order: 1,
    is_visible: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEducation = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getEducation();
      if (res.success && res.data) {
        setEducationList(res.data);
      }
    } catch {
      toast.error("Failed to load education entries");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  const openCreateModal = () => {
    const nextOrder =
      educationList.length > 0 ? Math.max(...educationList.map((e) => e.display_order)) + 1 : 1;
    setEditingItem(null);
    setModalForm({
      institution: "",
      degree: "",
      stream: "",
      start_year: "",
      end_year: "",
      grade: "",
      description: "",
      coursework: "",
      display_order: nextOrder,
      is_visible: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: Education) => {
    setEditingItem(item);
    const cw = Array.isArray(item.coursework)
      ? item.coursework.join(", ")
      : typeof item.coursework === "string"
      ? item.coursework
      : "";

    setModalForm({
      institution: item.institution,
      degree: item.degree,
      stream: item.stream || "",
      start_year: item.start_year,
      end_year: item.end_year || "",
      grade: item.grade || "",
      description: item.description || "",
      coursework: cw,
      display_order: item.display_order,
      is_visible: item.is_visible,
    });
    setModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.institution.trim() || !modalForm.degree.trim() || !modalForm.start_year.trim()) {
      toast.error("Institution, degree, and start year are required.");
      return;
    }

    setSubmitting(true);
    try {
      const cwArray = modalForm.coursework
        ? modalForm.coursework.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        ...modalForm,
        coursework: cwArray,
      };

      if (editingItem) {
        const res = await adminApi.updateEducation(editingItem.id, payload);
        if (res.success && res.data) {
          setEducationList((prev) =>
            prev.map((item) => (item.id === editingItem.id ? res.data! : item))
          );
          toast.success("Education entry updated!");
          setModalOpen(false);
        } else {
          toast.error(res.message || "Failed to update entry");
        }
      } else {
        const res = await adminApi.createEducation(payload);
        if (res.success && res.data) {
          setEducationList((prev) => [...prev, res.data!].sort((a, b) => a.display_order - b.display_order));
          toast.success("Education entry created!");
          setModalOpen(false);
        } else {
          toast.error(res.message || "Failed to create entry");
        }
      }
    } catch {
      toast.error("Network error while saving education entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleVisibility = async (item: Education) => {
    try {
      const res = await adminApi.updateEducation(item.id, { is_visible: !item.is_visible });
      if (res.success && res.data) {
        setEducationList((prev) =>
          prev.map((e) => (e.id === item.id ? res.data! : e))
        );
        toast.info(`'${item.degree}' is now ${!item.is_visible ? "visible" : "hidden"}`);
      }
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await adminApi.deleteEducation(deleteTarget.id);
      if (res.success) {
        setEducationList((prev) => prev.filter((e) => e.id !== deleteTarget.id));
        toast.success("Education entry deleted");
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Education Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage academic degrees, institutions, grades, coursework, and credentials
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
          <p className="text-sm">Loading education records...</p>
        </div>
      ) : educationList.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-white/5 p-8">
          <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No education entries found</h3>
          <p className="text-xs text-slate-400 mt-1">Click &quot;Add Education&quot; to add your academic degrees.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationList.map((item) => {
            const courseworkList = Array.isArray(item.coursework)
              ? item.coursework
              : typeof item.coursework === "string"
              ? JSON.parse(item.coursework || "[]")
              : [];

            return (
              <motion.div
                key={item.id}
                layout
                className="group relative rounded-3xl p-6 bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-purple-400/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-purple-950/60 text-purple-300 border border-purple-500/30">
                      {item.start_year} – {item.end_year || "Present"}
                    </span>

                    {item.grade && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
                        {item.grade}
                      </span>
                    )}
                  </div>

                  {/* Degree & Institution */}
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
                    {item.degree}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-3">
                    <School className="w-3.5 h-3.5 text-purple-400" />
                    <span>{item.institution}</span>
                    {item.stream && <span className="text-slate-500">• {item.stream}</span>}
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs text-slate-300/80 leading-relaxed mb-4 line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  {/* Coursework Tags */}
                  {courseworkList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {courseworkList.map((cw: string) => (
                        <span
                          key={cw}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-950/70 border border-white/5 text-slate-400"
                        >
                          {cw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(item)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
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
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-950/50 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/50 transition-colors"
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
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  {editingItem ? "Edit Education" : "Add Education"}
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
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                    Degree / Qualification *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.degree}
                    onChange={(e) => setModalForm({ ...modalForm, degree: e.target.value })}
                    placeholder="e.g. B.Tech in Computer Science & Engineering"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Institution / University *
                    </label>
                    <input
                      type="text"
                      required
                      value={modalForm.institution}
                      onChange={(e) => setModalForm({ ...modalForm, institution: e.target.value })}
                      placeholder="e.g. Brainware University"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Course / Stream
                    </label>
                    <input
                      type="text"
                      value={modalForm.stream}
                      onChange={(e) => setModalForm({ ...modalForm, stream: e.target.value })}
                      placeholder="e.g. Computer Science, Science"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Start Year *
                    </label>
                    <input
                      type="text"
                      required
                      value={modalForm.start_year}
                      onChange={(e) => setModalForm({ ...modalForm, start_year: e.target.value })}
                      placeholder="e.g. 2024"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      End Year
                    </label>
                    <input
                      type="text"
                      value={modalForm.end_year}
                      onChange={(e) => setModalForm({ ...modalForm, end_year: e.target.value })}
                      placeholder="e.g. Present, 2028"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Grade / CGPA
                    </label>
                    <input
                      type="text"
                      value={modalForm.grade}
                      onChange={(e) => setModalForm({ ...modalForm, grade: e.target.value })}
                      placeholder="e.g. 8.7 CGPA, 74%"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={modalForm.description}
                    onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                    placeholder="Focus areas, learning highlights..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                    Core Coursework (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={modalForm.coursework}
                    onChange={(e) => setModalForm({ ...modalForm, coursework: e.target.value })}
                    placeholder="DSA, DBMS, OOP, Operating Systems, Networks"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 items-center pt-2">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="pt-5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modalForm.is_visible}
                        onChange={(e) => setModalForm({ ...modalForm, is_visible: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 relative" />
                      <span className="text-xs text-slate-300 font-medium">
                        Visible on portfolio
                      </span>
                    </label>
                  </div>
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
        title="Delete Education Entry"
        message={`Are you sure you want to delete '${deleteTarget?.degree}' from '${deleteTarget?.institution}'? This cannot be undone.`}
        confirmLabel="Delete Entry"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminEducation;
