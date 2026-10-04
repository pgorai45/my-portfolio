import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { adminApi } from "../../services/api";
import type { Skill } from "../../types/admin";
import { useToast } from "../../context/ToastContext";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

const SKILL_CATEGORIES = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "core_cs", label: "Core CS" },
  { id: "database", label: "Database" },
  { id: "tools", label: "Tools" },
  { id: "languages", label: "Languages" },
  { id: "other", label: "Other" },
];

export const AdminSkills: React.FC = () => {
  const toast = useToast();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [modalForm, setModalForm] = useState({
    name: "",
    category: "frontend",
    category_label: "Frontend",
    proficiency_subtitle: "",
    percentage: 85,
    display_order: 1,
    is_visible: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSkills();
      if (res.success && res.data) {
        setSkills(res.data);
      }
    } catch {
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const openCreateModal = () => {
    const nextOrder = skills.length > 0 ? Math.max(...skills.map((s) => s.display_order)) + 1 : 1;
    setEditingSkill(null);
    setModalForm({
      name: "",
      category: selectedCategory !== "all" ? selectedCategory : "frontend",
      category_label: selectedCategory !== "all" ? (SKILL_CATEGORIES.find((c) => c.id === selectedCategory)?.label || "Frontend") : "Frontend",
      proficiency_subtitle: "",
      percentage: 85,
      display_order: nextOrder,
      is_visible: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setModalForm({
      name: skill.name,
      category: skill.category,
      category_label: skill.category_label || skill.category,
      proficiency_subtitle: skill.proficiency_subtitle || "",
      percentage: skill.percentage,
      display_order: skill.display_order,
      is_visible: skill.is_visible,
    });
    setModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.name.trim()) {
      toast.error("Skill name is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingSkill) {
        const res = await adminApi.updateSkill(editingSkill.id, modalForm);
        if (res.success && res.data) {
          setSkills((prev) => prev.map((s) => (s.id === editingSkill.id ? res.data! : s)));
          toast.success(`Skill '${modalForm.name}' updated!`);
          setModalOpen(false);
        } else {
          toast.error(res.message || "Failed to update skill");
        }
      } else {
        const res = await adminApi.createSkill(modalForm);
        if (res.success && res.data) {
          setSkills((prev) => [...prev, res.data!].sort((a, b) => a.display_order - b.display_order));
          toast.success(`Skill '${modalForm.name}' created!`);
          setModalOpen(false);
        } else {
          toast.error(res.message || "Failed to create skill");
        }
      }
    } catch {
      toast.error("Network error while saving skill");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleVisibility = async (skill: Skill) => {
    try {
      const res = await adminApi.updateSkill(skill.id, { is_visible: !skill.is_visible });
      if (res.success && res.data) {
        setSkills((prev) => prev.map((s) => (s.id === skill.id ? res.data! : s)));
        toast.info(`Skill '${skill.name}' is now ${!skill.is_visible ? "visible" : "hidden"}`);
      }
    } catch {
      toast.error("Failed to toggle visibility");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await adminApi.deleteSkill(deleteTarget.id);
      if (res.success) {
        setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        toast.success(`Skill '${deleteTarget.name}' deleted`);
        setDeleteTarget(null);
      } else {
        toast.error(res.message || "Failed to delete skill");
      }
    } catch {
      toast.error("Network error while deleting skill");
    } finally {
      setDeleting(false);
    }
  };

  // Filter skills
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesCategory =
        selectedCategory === "all" ||
        skill.category === selectedCategory ||
        (Array.isArray(skill.category) && skill.category.includes(selectedCategory));

      const matchesSearch =
        !searchQuery.trim() ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (skill.proficiency_subtitle &&
          skill.proficiency_subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [skills, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Skills Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add, update, reorder and control visibility for all technologies on the public site
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-purple-600 text-white shadow-md shadow-purple-950/40"
                : "bg-slate-950/60 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            All ({skills.length})
          </button>

          {SKILL_CATEGORIES.map((cat) => {
            const count = skills.filter((s) => s.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-purple-600 text-white shadow-md shadow-purple-950/40"
                    : "bg-slate-950/60 text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Skills Table / Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
          <p className="text-sm">Loading skills from database...</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-white/5 p-8">
          <Cpu className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No skills found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or add a new skill to this category.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 border-b border-white/[0.08] text-slate-400 uppercase font-mono tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Order</th>
                  <th className="py-3.5 px-4 sm:px-6">Skill Name</th>
                  <th className="py-3.5 px-4 sm:px-6">Category</th>
                  <th className="py-3.5 px-4 sm:px-6">Proficiency</th>
                  <th className="py-3.5 px-4 sm:px-6">Visibility</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredSkills.map((skill) => (
                  <tr
                    key={skill.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Display Order */}
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-400 text-xs">
                      #{skill.display_order}
                    </td>

                    {/* Skill Name & Subtitle */}
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">
                      <div>{skill.name}</div>
                      {skill.proficiency_subtitle && (
                        <div className="text-[11px] text-slate-400 font-normal">
                          {skill.proficiency_subtitle}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-purple-950/50 text-purple-300 border border-purple-500/30">
                        {skill.category_label || skill.category}
                      </span>
                    </td>

                    {/* Proficiency Bar */}
                    <td className="py-3.5 px-4 sm:px-6 min-w-[140px]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                            style={{ width: `${skill.percentage}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-slate-300 w-9 text-right font-medium">
                          {skill.percentage}%
                        </span>
                      </div>
                    </td>

                    {/* Visibility Toggle */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(skill)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          skill.is_visible
                            ? "bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40"
                            : "bg-slate-800 text-slate-400 border border-white/10 hover:bg-slate-700"
                        }`}
                        title="Click to toggle visibility"
                      >
                        {skill.is_visible ? (
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
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 sm:px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(skill)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-950/50 transition-colors"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(skill)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/50 transition-colors"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              className="relative z-10 w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-400" />
                  {editingSkill ? "Edit Skill" : "Add New Skill"}
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
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.name}
                    onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                    placeholder="e.g. React, PostgreSQL, Docker"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Category *
                    </label>
                    <select
                      value={modalForm.category}
                      onChange={(e) => {
                        const cat = e.target.value;
                        const label = SKILL_CATEGORIES.find((c) => c.id === cat)?.label || cat;
                        setModalForm({ ...modalForm, category: cat, category_label: label });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      {SKILL_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                    Proficiency Subtitle (Optional)
                  </label>
                  <input
                    type="text"
                    value={modalForm.proficiency_subtitle}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, proficiency_subtitle: e.target.value })
                    }
                    placeholder="e.g. Relational Queries & Schema Design"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Proficiency Percentage Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase text-slate-300">
                      Proficiency Level: {modalForm.percentage}%
                    </label>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    value={modalForm.percentage}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, percentage: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                {/* Visibility Toggle */}
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
                    <span>{editingSkill ? "Save Changes" : "Create Skill"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Skill"
        message={`Are you sure you want to delete '${deleteTarget?.name}'? This will permanently remove it from the database and the public Skills section.`}
        confirmLabel="Delete Skill"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminSkills;
