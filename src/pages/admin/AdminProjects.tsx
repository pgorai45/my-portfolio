import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FolderCode,
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  X,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  Upload,
} from "lucide-react";
import { adminApi } from "../../services/api";
import type { Project } from "../../types/admin";
import { useToast } from "../../context/ToastContext";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";
import { GithubIcon } from "../../components/common/SocialIcons";

const ACCENT_OPTIONS = [
  { id: "amber", label: "Amber", badge: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { id: "purple", label: "Purple", badge: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  { id: "cyan", label: "Cyan", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
  { id: "emerald", label: "Emerald", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "indigo", label: "Indigo", badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
];

const PREVIEW_TYPES = [
  { id: "assistant", label: "AI / Code Assistant" },
  { id: "furniture", label: "E-Commerce / Catalog" },
  { id: "resume", label: "AI Scanner / Document" },
  { id: "flood", label: "Telemetry / Hydro Wave" },
  { id: "quiz", label: "Interactive Quiz / Game" },
];

export const AdminProjects: React.FC = () => {
  const toast = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [modalForm, setModalForm] = useState({
    title: "",
    slug: "",
    category: "",
    short_description: "",
    description: "",
    image_url: "",
    technologies: "",
    github_url: "",
    live_demo_url: "",
    accent: "purple" as const,
    preview_type: "assistant" as const,
    display_order: 1,
    is_featured: true,
    is_published: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProjects();
      if (res.success && res.data) {
        setProjects(res.data);
      }
    } catch {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openCreateModal = () => {
    const nextOrder =
      projects.length > 0 ? Math.max(...projects.map((p) => p.display_order)) + 1 : 1;
    setEditingProject(null);
    setModalForm({
      title: "",
      slug: "",
      category: "Full Stack Web Application",
      short_description: "",
      description: "",
      image_url: "",
      technologies: "React, Node.js, TypeScript, Tailwind CSS",
      github_url: "",
      live_demo_url: "",
      accent: "purple",
      preview_type: "assistant",
      display_order: nextOrder,
      is_featured: true,
      is_published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    const tech = Array.isArray(proj.technologies)
      ? proj.technologies.join(", ")
      : typeof proj.technologies === "string"
      ? proj.technologies
      : "";

    setModalForm({
      title: proj.title,
      slug: proj.slug || "",
      category: proj.category,
      short_description: proj.short_description || "",
      description: proj.description,
      image_url: proj.image_url || "",
      technologies: tech,
      github_url: proj.github_url || "",
      live_demo_url: proj.live_demo_url || "",
      accent: (proj.accent as any) || "purple",
      preview_type: (proj.preview_type as any) || "assistant",
      display_order: proj.display_order,
      is_featured: proj.is_featured,
      is_published: proj.is_published,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    try {
      const res = await adminApi.uploadImage(formData);
      if (res.success && res.data?.url) {
        setModalForm((prev) => ({ ...prev, image_url: res.data!.url }));
        toast.success("Image uploaded!");
      } else {
        toast.error(res.message || "Failed to upload image");
      }
    } catch {
      toast.error("Network error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.title.trim() || !modalForm.category.trim() || !modalForm.description.trim()) {
      toast.error("Title, category and full description are required.");
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

      if (editingProject) {
        const res = await adminApi.updateProject(editingProject.id, payload);
        if (res.success && res.data) {
          setProjects((prev) =>
            prev.map((p) => (p.id === editingProject.id ? res.data! : p))
          );
          toast.success(`Project '${modalForm.title}' updated!`);
          setModalOpen(false);
        } else {
          toast.error(res.message || "Failed to update project");
        }
      } else {
        const res = await adminApi.createProject(payload);
        if (res.success && res.data) {
          setProjects((prev) => [...prev, res.data!].sort((a, b) => a.display_order - b.display_order));
          toast.success(`Project '${modalForm.title}' created and published!`);
          setModalOpen(false);
        } else {
          toast.error(res.message || "Failed to create project");
        }
      }
    } catch {
      toast.error("Network error while saving project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (proj: Project) => {
    try {
      const res = await adminApi.togglePublishProject(proj.id);
      if (res.success && res.data) {
        setProjects((prev) =>
          prev.map((p) => (p.id === proj.id ? { ...p, is_published: res.data!.is_published } : p))
        );
        toast.info(
          `Project '${proj.title}' is now ${res.data.is_published ? "published" : "unpublished"}`
        );
      }
    } catch {
      toast.error("Failed to update publish state");
    }
  };

  const handleToggleFeature = async (proj: Project) => {
    try {
      const res = await adminApi.toggleFeatureProject(proj.id);
      if (res.success && res.data) {
        setProjects((prev) =>
          prev.map((p) => (p.id === proj.id ? { ...p, is_featured: res.data!.is_featured } : p))
        );
        toast.info(
          `Project '${proj.title}' is now ${res.data.is_featured ? "featured" : "unfeatured"}`
        );
      }
    } catch {
      toast.error("Failed to update feature state");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await adminApi.deleteProject(deleteTarget.id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        toast.success(`Project '${deleteTarget.title}' deleted`);
        setDeleteTarget(null);
      } else {
        toast.error(res.message || "Failed to delete project");
      }
    } catch {
      toast.error("Network error while deleting project");
    } finally {
      setDeleting(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const matchesSearch =
        !searchQuery.trim() ||
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && proj.is_published) ||
        (statusFilter === "draft" && !proj.is_published) ||
        (statusFilter === "featured" && proj.is_featured);

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Projects Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete CRUD control for featured portfolio works, links, tags, and showcase visuals
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Projects" },
            { id: "published", label: "Published" },
            { id: "draft", label: "Drafts / Hidden" },
            { id: "featured", label: "Featured" },
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
            placeholder="Search projects or technologies..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
          <p className="text-sm">Loading projects from PostgreSQL...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-white/5 p-8">
          <FolderCode className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No projects found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or add a new project.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const techList = Array.isArray(project.technologies)
              ? project.technologies
              : typeof project.technologies === "string"
              ? JSON.parse(project.technologies || "[]")
              : [];

            return (
              <motion.div
                key={project.id}
                layout
                className="group relative rounded-3xl p-6 bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-purple-400/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Order, Featured Star, Published Pill */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        #{project.display_order}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(project)}
                        className={`p-1 rounded-lg transition-colors ${
                          project.is_featured
                            ? "text-amber-400 hover:text-amber-300"
                            : "text-slate-600 hover:text-slate-400"
                        }`}
                        title={project.is_featured ? "Featured Project" : "Not Featured"}
                      >
                        <Star className={`w-4 h-4 ${project.is_featured ? "fill-amber-400" : ""}`} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePublish(project)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold cursor-pointer transition-colors ${
                        project.is_published
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border border-white/10"
                      }`}
                    >
                      {project.is_published ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-400" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-slate-400" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Category */}
                  <span className="text-[11px] font-mono uppercase tracking-wider text-purple-300 font-semibold block mb-1">
                    {project.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300/85 leading-relaxed mb-4 line-clamp-3">
                    {project.short_description || project.description}
                  </p>

                  {/* Tech Tags */}
                  {techList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {techList.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-950/80 border border-white/5 text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Bar: Links & Action Buttons */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 transition-colors"
                        title="GitHub Repo"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.live_demo_url && (
                      <a
                        href={project.live_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(project)}
                      className="p-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-purple-950/50 transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(project)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/50 transition-colors"
                      title="Delete Project"
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

      {/* ─── ADD / EDIT PROJECT MODAL ─── */}
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
              className="relative z-10 w-full max-w-2xl rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FolderCode className="w-5 h-5 text-purple-400" />
                  {editingProject ? "Edit Project" : "Add New Project"}
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
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={modalForm.title}
                      onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
                      placeholder="e.g. HireIQ, Wood Furniture"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Category *
                    </label>
                    <input
                      type="text"
                      required
                      value={modalForm.category}
                      onChange={(e) => setModalForm({ ...modalForm, category: e.target.value })}
                      placeholder="e.g. Full Stack Web Application"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                    Short Description (Summary)
                  </label>
                  <input
                    type="text"
                    value={modalForm.short_description}
                    onChange={(e) => setModalForm({ ...modalForm, short_description: e.target.value })}
                    placeholder="Brief 1-sentence punchy tagline"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                    Full Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={modalForm.description}
                    onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                    placeholder="Detailed explanation of features, architecture, and achievements..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                    Technologies / Stack (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={modalForm.technologies}
                    onChange={(e) => setModalForm({ ...modalForm, technologies: e.target.value })}
                    placeholder="React, TypeScript, Node.js, Express, PostgreSQL"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={modalForm.github_url}
                      onChange={(e) => setModalForm({ ...modalForm, github_url: e.target.value })}
                      placeholder="https://github.com/pgorai45/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={modalForm.live_demo_url}
                      onChange={(e) => setModalForm({ ...modalForm, live_demo_url: e.target.value })}
                      placeholder="https://my-demo-app.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                </div>

                {/* Image Upload or URL */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                    Project Screenshot / Image (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={modalForm.image_url}
                      onChange={(e) => setModalForm({ ...modalForm, image_url: e.target.value })}
                      placeholder="/uploads/projects/... or https://..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
                    />
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/30 transition-colors cursor-pointer shrink-0">
                      {uploadingImage ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>

                {/* Accent Style & Preview Visual Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Visual Showcase Style
                    </label>
                    <select
                      value={modalForm.preview_type}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, preview_type: e.target.value as any })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      {PREVIEW_TYPES.map((pt) => (
                        <option key={pt.id} value={pt.id}>
                          {pt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Accent Color Theme
                    </label>
                    <select
                      value={modalForm.accent}
                      onChange={(e) => setModalForm({ ...modalForm, accent: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      {ACCENT_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Display Order & Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-2">
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

                  <div className="sm:pt-4">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modalForm.is_featured}
                        onChange={(e) => setModalForm({ ...modalForm, is_featured: e.target.checked })}
                        className="rounded bg-slate-800 border-white/20 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-xs text-slate-300 font-medium">Featured project</span>
                    </label>
                  </div>

                  <div className="sm:pt-4">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modalForm.is_published}
                        onChange={(e) =>
                          setModalForm({ ...modalForm, is_published: e.target.checked })
                        }
                        className="rounded bg-slate-800 border-white/20 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-xs text-slate-300 font-medium">Publish to public</span>
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
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950/50 cursor-pointer disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingProject ? "Save Project" : "Publish Project"}</span>
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
        title="Delete Project"
        message={`Are you sure you want to delete '${deleteTarget?.title}'? It will immediately disappear from the public portfolio.`}
        confirmLabel="Delete Project"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminProjects;
