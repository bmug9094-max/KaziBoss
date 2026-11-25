import { motion, useAnimationControls, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ScenarioCard } from '../../types';

const CATEGORY_LABEL: Record<ScenarioCard['category'], string> = {
  stock: 'Stock',
  change: 'Taux de change',
  credit: 'Crédit',
  energie: 'Énergie & imprévus',
  fournisseur: 'Fournisseur',
  marketing: 'Marketing local',
  caisse: 'Caisse perso/pro',
  famille: 'Famille & social',
  admin: 'Administration',
  'mobile-money': 'Mobile Money',
  equipe: 'Équipe',
  concurrence: 'Concurrence',
  securite: 'Sécurité',
  agri: 'Agri-business',
  import: 'Import-export',
};

const SWIPE_THRESHOLD = 110;

/**
 * Carte scénario : swipe gauche = choix A, swipe droite = choix B.
 * Boutons : 1er appui = prévisualisation, 2e appui = confirmation.
 */
export default function ScenarioSwipe({
  card,
  onChoose,
  onPreview,
}: {
  card: ScenarioCard;
  onChoose: (c: 'a' | 'b') => void;
  onPreview: (c: 'a' | 'b' | null) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-14, 14]);
  const aOpacity = useTransform(x, [-130, -30], [1, 0]);
  const bOpacity = useTransform(x, [30, 130], [0, 1]);
  const controls = useAnimationControls();
  const [armed, setArmed] = useState<'a' | 'b' | null>(null);
  const [locked, setLocked] = useState(false);

  // Entrée de la carte
  useEffect(() => {
    void controls.start({ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } });
  }, [controls]);

  const fly = async (c: 'a' | 'b') => {
    if (locked) return;
    setLocked(true);
    onPreview(c);
    await controls.start({ x: c === 'a' ? -520 : 520, opacity: 0, transition: { duration: 0.28, ease: 'easeIn' } });
    onChoose(c);
  };

  const onDrag = (_: unknown, info: PanInfo) => {
    const dir = info.offset.x < -40 ? 'a' : info.offset.x > 40 ? 'b' : null;
    onPreview(dir);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -700) void fly('a');
    else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 700) void fly('b');
    else {
      onPreview(armed);
      void controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
    }
  };

  const tap = (c: 'a' | 'b') => {
    if (armed === c) void fly(c);
    else {
      setArmed(c);
      onPreview(c);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-[21rem] select-none">
        <motion.div
          drag={locked ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.85}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          animate={controls}
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          style={{ x, rotate }}
          className="card absolute inset-0 flex cursor-grab touch-pan-y flex-col overflow-hidden active:cursor-grabbing"
        >
          {/* Étiquettes de swipe */}
          <motion.div style={{ opacity: aOpacity }} className="pointer-events-none absolute left-3 top-3 z-10 max-w-[70%] rounded-2xl bg-gold px-3 py-2 text-sm font-extrabold text-slate-900 shadow-card">
            A · {card.a.label}
          </motion.div>
          <motion.div style={{ opacity: bOpacity }} className="pointer-events-none absolute right-3 top-3 z-10 max-w-[70%] rounded-2xl bg-emerald px-3 py-2 text-right text-sm font-extrabold text-slate-900 shadow-card">
            B · {card.b.label}
          </motion.div>

          <div className="flex items-center gap-3 bg-gradient-to-br from-gold/20 via-transparent to-emerald/10 px-5 pb-4 pt-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-2 text-4xl">{card.avatar}</div>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold">{card.character}</p>
              <p className="truncate text-xs font-semibold text-muted">{card.role}</p>
              <span className="mt-1 inline-block rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
                {CATEGORY_LABEL[card.category]}
                {card.pack ? ' · Premium' : ''}
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col px-5 pb-5">
            <h3 className="text-xl font-extrabold leading-tight">{card.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{card.text}</p>
            <p className="mt-auto flex items-center justify-center gap-2 pt-3 text-[11px] font-semibold text-muted">
              <ArrowLeft size={12} /> Glisse la carte ou touche un choix <ArrowRight size={12} />
            </p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(['a', 'b'] as const).map((c) => {
          const on = armed === c;
          const accent = c === 'a' ? 'gold' : 'emerald';
          return (
            <button
              key={c}
              disabled={locked}
              onMouseEnter={() => onPreview(c)}
              onMouseLeave={() => onPreview(armed)}
              onFocus={() => onPreview(c)}
              onClick={() => tap(c)}
              className={`relative flex min-h-[5.5rem] flex-col items-start justify-between rounded-3xl border-2 p-3 text-left text-sm font-bold transition active:scale-[0.98] ${
                on
                  ? accent === 'gold'
                    ? 'border-gold bg-gold text-slate-900'
                    : 'border-emerald bg-emerald text-slate-900'
                  : 'border-line bg-surface hover:border-muted'
              }`}
            >
              <span className={`text-[11px] font-extrabold uppercase tracking-wide ${on ? 'text-slate-900/70' : accent === 'gold' ? 'text-gold' : 'text-emerald'}`}>
                {on ? (
                  <span className="inline-flex items-center gap-1">
                    <Check size={12} /> Touche pour confirmer
                  </span>
                ) : (
                  `Choix ${c.toUpperCase()}`
                )}
              </span>
              <span className="leading-snug">{card[c].label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
