import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Save,
  Loader2,
  RefreshCw,
  Globe,
  MapPin,
  Mail,
  Phone,
  Upload,
} from "lucide-react";
import { adminApi } from "../../services/api";
import type { PortfolioProfile } from "../../types/admin";
import { useToast } from "../../context/ToastContext";
import { GithubIcon, LinkedinIcon } from "../../components/common/SocialIcons";

export const AdminProfile: React.FC = () => {
  const toast = useToast();

  const [profile, setProfile] = useState<PortfolioProfile>({
    name: "",
    title: "",
    bio: "",
    about_intro: "",
    about_details: "",
    profile_image: "",
    location: "",
    email: "",
    phone: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    website_url: "",
    available_for_work: true,
    is_visible: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProfile();
      if (res.success && res.data) {
        setProfile({
          ...res.data,
          available_for_work: res.data.available_for_work ?? true,
          is_visible: res.data.is_visible ?? true,
        });
      }
    } catch {
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (
    field: keyof PortfolioProfile,
    value: string | boolean | undefined
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
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
        handleChange("profile_image", res.data.url);
        toast.success("Profile photo uploaded!");
      } else {
        toast.error(res.message || "Failed to upload photo");
      }
    } catch {
      toast.error("Network error during photo upload");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.title.trim()) {
      toast.error("Name and Professional Title are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await adminApi.updateProfile(profile);
      if (res.success && res.data) {
        setProfile(res.data);
        toast.success("Portfolio profile updated successfully!");
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch {
      toast.error("Network error while updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
        <p className="text-sm font-medium">Loading portfolio profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Portfolio Profile Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your personal branding, titles, bio text, social links, and public visibility
          </p>
        </div>

        <button
          type="button"
          onClick={fetchProfile}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-white/10"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Visibility & Availability Bar */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Visibility Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.is_visible}
                onChange={(e) => handleChange("is_visible", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 relative" />
              <div>
                <span className="text-xs sm:text-sm font-semibold text-white block">
                  Public Visibility
                </span>
                <span className="text-[11px] text-slate-400">
                  {profile.is_visible ? "Visible on portfolio" : "Hidden from public view"}
                </span>
              </div>
            </label>

            {/* Available for Work Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.available_for_work}
                onChange={(e) => handleChange("available_for_work", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 relative" />
              <div>
                <span className="text-xs sm:text-sm font-semibold text-white block">
                  Available for Work
                </span>
                <span className="text-[11px] text-slate-400">
                  {profile.available_for_work ? "Pill shows Available" : "Pill shows Busy/Offline"}
                </span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-950/50 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile</span>
          </button>
        </div>

        {/* ─── 1. Core Profile Details ─── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-xl space-y-6">
          <div className="border-b border-white/[0.08] pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-purple-400" />
              Personal & Hero Information
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Controls main headings and labels in the Hero & Navigation sections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Prasanta Gorai"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Professional Title *
              </label>
              <input
                type="text"
                required
                value={profile.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Full Stack Developer"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Short Bio (Hero supporting text) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Hero Tagline / Short Bio
            </label>
            <textarea
              rows={2}
              value={profile.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="I build modern, scalable and interactive web applications with clean code and great user experiences."
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Profile Photo / Avatar URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Profile Image URL or Upload
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={profile.profile_image || ""}
                onChange={(e) => handleChange("profile_image", e.target.value)}
                placeholder="/assets/images/prasanta-hero.png or https://..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors font-mono"
              />

              <label className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/30 transition-colors cursor-pointer shrink-0">
                {uploadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>Upload New</span>
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
        </div>

        {/* ─── 2. About Section Descriptions ─── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-xl space-y-6">
          <div className="border-b border-white/[0.08] pb-4">
            <h3 className="text-lg font-bold text-white">About Me Section Content</h3>
            <p className="text-xs text-slate-400 mt-1">
              Configures the subheadings and paragraphs under the &quot;Who I Am&quot; section on the public site
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              About Section Intro
            </label>
            <textarea
              rows={2}
              value={profile.about_intro || ""}
              onChange={(e) => handleChange("about_intro", e.target.value)}
              placeholder="I'm Prasanta Gorai, a Computer Science student and aspiring Full Stack Developer..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              About Section Detailed Body
            </label>
            <textarea
              rows={4}
              value={profile.about_details || ""}
              onChange={(e) => handleChange("about_details", e.target.value)}
              placeholder="I enjoy learning how modern web applications work..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* ─── 3. Contact & Social Links ─── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-xl space-y-6">
          <div className="border-b border-white/[0.08] pb-4">
            <h3 className="text-lg font-bold text-white">Contact &amp; Social Links</h3>
            <p className="text-xs text-slate-400 mt-1">
              Links shown in the navbar, footer, and contact sections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                Location
              </label>
              <input
                type="text"
                value={profile.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="West Bengal, India"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                Public Contact Email
              </label>
              <input
                type="email"
                value={profile.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="prasantagorai.dev@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-purple-400" />
                Phone Number
              </label>
              <input
                type="text"
                value={profile.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-purple-400" />
                GitHub URL
              </label>
              <input
                type="url"
                value={profile.github_url || ""}
                onChange={(e) => handleChange("github_url", e.target.value)}
                placeholder="https://github.com/pgorai45"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <LinkedinIcon className="w-3.5 h-3.5 text-purple-400" />
                LinkedIn URL
              </label>
              <input
                type="url"
                value={profile.linkedin_url || ""}
                onChange={(e) => handleChange("linkedin_url", e.target.value)}
                placeholder="https://www.linkedin.com/in/prasanta-gorai-8a77813a6/"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                Website URL
              </label>
              <input
                type="url"
                value={profile.website_url || ""}
                onChange={(e) => handleChange("website_url", e.target.value)}
                placeholder="https://portfolio.dev"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Bar Bottom */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] hover:bg-right shadow-xl shadow-purple-950/50 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
