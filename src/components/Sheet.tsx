import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

/** Panneau plein écran / bottom-sheet animé. */
export default function Sheet({
  open,
  onClose,
  title,
  children,
  full = false,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  full?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-40 flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className={`pb-safe relative flex w-full max-w-md flex-col overflow-hidden rounded-t-[2rem] border border-line bg-bg ${full ? 'h-[100dvh] rounded-t-none' : 'max-h-[90dvh]'}`}
          >
            <div className="pt-safe flex items-center justify-between px-5 pb-2 pt-4">
              <h2 className="text-lg font-extrabold">{title}</h2>
              <button onClick={onClose} className="rounded-full bg-surface-2 p-2 text-muted hover:text-ink" aria-label="Fermer">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
