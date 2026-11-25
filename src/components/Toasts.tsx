import { AnimatePresence, motion } from 'framer-motion';
import { usePlayer, type ToastTone } from '../state/PlayerContext';

const TONES: Record<ToastTone, string> = {
  info: 'bg-surface border-line text-ink',
  success: 'bg-emerald text-slate-900 border-emerald',
  error: 'bg-coral text-white border-coral',
  gold: 'bg-gold text-slate-900 border-gold',
};

export default function Toasts() {
  const { toasts } = usePlayer();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-50 mx-auto flex max-w-md flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            role="status"
            className={`rounded-2xl border px-4 py-2.5 text-sm font-bold shadow-card ${TONES[t.tone]}`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
