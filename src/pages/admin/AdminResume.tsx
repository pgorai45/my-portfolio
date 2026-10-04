import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Calendar,
  HardDrive,
  Check,
} from "lucide-react";
import { adminApi } from "../../services/api";
import type { Resume } from "../../types/admin";
import { useToast } from "../../context/ToastContext";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

export const AdminResume: React.FC = () => {
  const toast = useToast();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Upload Form State
  const [resumeTitle, setResumeTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [setActiveNow, setSetActiveNow] = useState(true);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getResumes();
      if (res.success && res.data) {
        setResumes(res.data);
      }
    } catch {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        toast.error("Only PDF files are supported for resumes.");
        return;
      }
      setSelectedFile(file);
      if (!resumeTitle) {
        setResumeTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a PDF file to upload.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("title", resumeTitle || selectedFile.name);
      formData.append("set_active", String(setActiveNow));

      const res = await adminApi.uploadResume(formData);
      if (res.success && res.data) {
        toast.success("Resume uploaded successfully!");
        setSelectedFile(null);
        setResumeTitle("");
        fetchResumes();
      } else {
        toast.error(res.message || "Failed to upload resume");
      }
    } catch {
      toast.error("Network error while uploading resume");
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (resume: Resume) => {
    try {
      const res = await adminApi.setActiveResume(resume.id);
      if (res.success) {
        setResumes((prev) =>
          prev.map((r) => ({
            ...r,
            is_active: r.id === resume.id,
          }))
        );
        toast.success(`'${resume.title}' is now the active resume on the public site!`);
      } else {
        toast.error(res.message || "Failed to set active resume");
      }
    } catch {
      toast.error("Failed to set active resume");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await adminApi.deleteResume(deleteTarget.id);
      if (res.success) {
        toast.success("Resume deleted");
        setDeleteTarget(null);
        fetchResumes();
      } else {
        toast.error(res.message || "Failed to delete resume");
      }
    } catch {
      toast.error("Network error while deleting resume");
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Resume Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Upload and activate resumes. The active resume is served across the public site (Hero &amp; Resume section).
        </p>
      </div>

      {/* ─── UPLOAD NEW RESUME CARD ─── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Upload className="w-4 h-4 text-purple-400" />
          Upload New Resume (PDF)
        </h3>

        <form onSubmit={handleUploadSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Resume Label / Title
              </label>
              <input
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                placeholder="e.g. Prasanta Gorai — Software Developer 2026"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Choose PDF File *
              </label>
              <label className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-950/80 border border-dashed border-purple-500/40 hover:border-purple-400 text-sm text-slate-300 cursor-pointer transition-colors">
                <span className="truncate">
                  {selectedFile ? selectedFile.name : "Select PDF file from computer..."}
                </span>
                <span className="px-3 py-1 rounded-lg bg-purple-950/60 text-purple-300 text-xs font-semibold shrink-0 ml-3 border border-purple-500/30">
                  Browse
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/[0.06]">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={setActiveNow}
                onChange={(e) => setSetActiveNow(e.target.checked)}
                className="rounded bg-slate-800 border-white/20 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-xs text-slate-300 font-medium">
                Make this the active resume on the public site immediately
              </span>
            </label>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950/50 cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>Upload Resume</span>
            </button>
          </div>
        </form>
      </div>

      {/* ─── RESUMES LIST ─── */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" />
          Uploaded Resumes ({resumes.length})
        </h3>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
            <p className="text-sm">Loading resumes from database...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-16 rounded-3xl bg-slate-900/40 border border-white/5 p-8">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-white">No resumes uploaded yet</h4>
            <p className="text-xs text-slate-400 mt-1">Upload a PDF resume above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {resumes.map((resume) => {
              const fileHref = resume.file_path;

              return (
                <motion.div
                  key={resume.id}
                  layout
                  className={`rounded-3xl p-6 bg-slate-900/60 backdrop-blur-xl border transition-all shadow-xl flex flex-col justify-between ${
                    resume.is_active
                      ? "border-emerald-500/50 shadow-emerald-950/20"
                      : "border-white/[0.08] hover:border-white/20"
                  }`}
                >
                  <div>
                    {/* Top Status */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      {resume.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 shadow-sm shadow-emerald-950/40">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Active Public Resume</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-slate-400 bg-slate-800/80 border border-white/5">
                          Archived / Inactive
                        </span>
                      )}

                      <span className="text-xs text-slate-500 font-mono">
                        {formatFileSize(resume.file_size)}
                      </span>
                    </div>

                    {/* Title & File Name */}
                    <h4 className="text-lg font-bold text-white mb-1">{resume.title}</h4>
                    <p className="text-xs text-slate-400 font-mono truncate mb-4">
                      {resume.file_name}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 font-mono mb-6">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                        PDF Document
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {resume.created_at
                          ? new Date(resume.created_at).toLocaleDateString()
                          : "Saved"}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* View In Browser */}
                      <a
                        href={fileHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>

                      {/* Download */}
                      <a
                        href={fileHref}
                        download={resume.file_name}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-950/80 hover:bg-slate-800 border border-white/5 transition-colors"
                        title="Download Resume PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      {!resume.is_active && (
                        <button
                          type="button"
                          onClick={() => handleSetActive(resume)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Set Active</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(resume)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/50 transition-colors"
                        title="Delete Resume"
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
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Resume"
        message={`Are you sure you want to delete '${deleteTarget?.title}'? This will remove the file from storage and database.`}
        confirmLabel="Delete Resume"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminResume;
