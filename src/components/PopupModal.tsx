import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

export function PopupModal({ isOpen, onClose, title, children, variant = 'default' }: PopupModalProps) {
  const variants = {
    default: 'bg-white border-slate-200',
    success: 'bg-green-50 border-green-200',
    danger: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
  };

  const titleColors = {
    default: 'text-slate-700',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-700',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={clsx(
              "relative w-full max-w-md rounded-3xl border-b-8 shadow-2xl overflow-hidden z-10",
              variants[variant]
            )}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                {title && (
                  <h3 className={clsx("text-2xl font-black uppercase tracking-tight", titleColors[variant])}>
                    {title}
                  </h3>
                )}
                <button
                  onClick={onClose}
                  className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>
              <div className="font-medium text-slate-700">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
