import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Search,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  X,
  Reply,
  ArrowUpDown,
} from "lucide-react";
import { adminApi } from "../../services/api";
import type { ContactMessage } from "../../types/admin";
import { useToast } from "../../context/ToastContext";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

export const AdminContacts: React.FC = () => {
  const toast = useToast();

  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Selected Detail Modal
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getContacts({
        search: searchQuery,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sort: sortOrder,
      });
      if (res.success && res.data) {
        setContacts(res.data);
      }
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, sortOrder, toast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleToggleRead = async (contact: ContactMessage) => {
    try {
      const res = await adminApi.toggleContactRead(contact.id, !contact.is_read);
      if (res.success && res.data) {
        setContacts((prev) =>
          prev.map((c) => (c.id === contact.id ? { ...c, is_read: res.data!.is_read } : c))
        );
        if (selectedContact?.id === contact.id) {
          setSelectedContact((prev) => prev ? { ...prev, is_read: res.data!.is_read } : null);
        }
        toast.info(`Marked as ${res.data.is_read ? "read" : "unread"}`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleOpenDetail = (contact: ContactMessage) => {
    setSelectedContact(contact);
    if (!contact.is_read) {
      handleToggleRead(contact);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await adminApi.deleteContact(deleteTarget.id);
      if (res.success) {
        setContacts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        if (selectedContact?.id === deleteTarget.id) {
          setSelectedContact(null);
        }
        toast.success("Contact message deleted");
        setDeleteTarget(null);
      } else {
        toast.error(res.message || "Failed to delete contact");
      }
    } catch {
      toast.error("Network error while deleting contact");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Contact Messages
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review visitor feedback, collaboration inquiries, and messages sent via the contact modal
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Messages" },
            { id: "unread", label: "Unread" },
            { id: "read", label: "Read" },
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

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, message..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-950/80 border border-white/10 transition-colors cursor-pointer shrink-0"
            title="Toggle Sort Order"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === "newest" ? "Newest" : "Oldest"}</span>
          </button>
        </div>
      </div>

      {/* Messages List / Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
          <p className="text-sm">Loading messages from database...</p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-white/5 p-8">
          <Mail className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No contact messages</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            When visitors send messages via the Contact modal, they will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-xl overflow-hidden">
          <div className="divide-y divide-white/[0.05]">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-5 sm:p-6 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/40 ${
                  !contact.is_read ? "bg-purple-950/15" : ""
                }`}
              >
                <div
                  onClick={() => handleOpenDetail(contact)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    {!contact.is_read ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700 shrink-0" />
                    )}
                    <span className="font-bold text-white text-sm sm:text-base truncate">
                      {contact.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono truncate">
                      {contact.email}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300/80 line-clamp-2 pl-5.5">
                    {contact.message}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                    {formatDate(contact.created_at)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleRead(contact)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    title={contact.is_read ? "Mark as Unread" : "Mark as Read"}
                  >
                    {contact.is_read ? (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-purple-400" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(contact)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/50 transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── CONTACT DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContact(null)}
              className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
                    {selectedContact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedContact.name}</h3>
                    <p className="text-xs text-purple-300 font-mono">{selectedContact.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedContact(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Sent on:</span>
                  <span>{formatDate(selectedContact.created_at)}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 text-sm text-slate-200 leading-relaxed max-h-60 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(selectedContact)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: Inquiry from ${encodeURIComponent(
                      selectedContact.name
                    )}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950/50 transition-all"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Contact Message"
        message={`Are you sure you want to delete the message from '${deleteTarget?.name}'?`}
        confirmLabel="Delete Message"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminContacts;
