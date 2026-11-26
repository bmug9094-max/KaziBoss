import { AnimatePresence, motion } from 'framer-motion';
import { Package, Star, Wallet, Zap, type LucideIcon } from 'lucide-react';
import { GAUGE_KEYS, GAUGE_META } from '../../lib/game';
import type { Effects, Gauge, Gauges } from '../../types';

const ICONS: Record<Gauge, LucideIcon> = { cash: Wallet, stock: Package, reputation: Star, energy: Zap };
const CASH_SCALE = 250;

/**
 * Jauges façon Reigns : l'icône se remplit par le bas.
 * `preview` affiche un point (petit/grand) sur les jauges impactées, sans révéler le chiffre ni le sens.
 */
export default function GaugeBar({ gauges, preview, delta }: { gauges: Gauges; preview?: Effects | null; delta?: Effects | null }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {GAUGE_KEYS.map((k) => {
        const Icon = ICONS[k];
        const value = gauges[k];
        const pct = k === 'cash' ? Math.min(1, Math.max(0, value) / CASH_SCALE) : value / 100;
        const danger = value < 25;
        const p = preview?.[k] ?? 0;
        const d = delta?.[k] ?? 0;
        return (
          <div key={k} className="flex flex-col items-center gap-1">
            {/* point de prévisualisation */}
            <div className="flex h-3 items-center justify-center">
              <AnimatePresence>
                {p !== 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="rounded-full bg-ink"
                    style={{ width: Math.abs(p) >= 15 ? 11 : 6, height: Math.abs(p) >= 15 ? 11 : 6 }}
                  />
                )}
              </AnimatePresence>
            </div>
            <div className={`relative h-16 w-full overflow-hidden rounded-2xl border short:h-12 ${danger ? 'border-coral/70' : 'border-line'} bg-surface`}>
              <motion.div
                className="absolute inset-x-0 bottom-0"
                style={{ backgroundColor: GAUGE_META[k].color, opacity: 0.85 }}
                initial={false}
                animate={{ height: `${pct * 100}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              />
              <div className="relative flex h-full items-center justify-center">
                <Icon size={24} className="text-ink drop-shadow" strokeWidth={2.4} />
              </div>
              <AnimatePresence>
                {d !== 0 && (
                  <motion.span
                    key={`${k}-${d}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`absolute right-1 top-1 rounded-full px-1.5 text-[10px] font-extrabold ${d > 0 ? 'bg-emerald text-slate-900' : 'bg-coral text-white'}`}
                  >
                    {d > 0 ? '+' : ''}
                    {k === 'cash' ? `${Math.round(d)}$` : d}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span className={`text-[11px] font-bold ${danger ? 'text-coral' : 'text-muted'}`}>
              {k === 'cash' ? `${Math.round(value)} $` : GAUGE_META[k].label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
