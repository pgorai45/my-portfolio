import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onCancel}
            className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md cursor-pointer"
          />

          {/* Dialog Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md rounded-3xl bg-slate-900/95 border border-white/10 p-6 sm:p-7 shadow-2xl shadow-black/60 backdrop-blur-xl overflow-hidden"
          >
            {/* Ambient Red Glow for destructive */}
            {isDestructive && (
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
            )}

            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl shrink-0 border ${
                  isDestructive
                    ? "bg-red-950/60 border-red-500/30 text-red-400"
                    : "bg-purple-950/60 border-purple-500/30 text-purple-400"
                }`}
              >
                {isDestructive ? (
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                ) : (
                  <Trash2 className="w-6 h-6 text-purple-400" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-white leading-snug">{title}</h3>
                <p className="mt-2 text-sm text-slate-300/90 leading-relaxed font-normal">
                  {message}
                </p>
              </div>

              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-7 flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 transition-colors cursor-pointer disabled:opacity-50"
              >
                {cancelLabel}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 ${
                  isDestructive
                    ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-950/50"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-950/50"
                }`}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{confirmLabel}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
