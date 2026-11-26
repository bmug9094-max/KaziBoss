import { motion, useAnimationControls, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSector } from '../../config/sectors';
import { isSoundOn, playSwipe } from '../../lib/sound';
import { haptic } from '../../lib/ui';
import type { ScenarioCard } from '../../types';
import { L } from '../../i18n';

const CATEGORY_LABEL: Record<ScenarioCard['category'], string> = L(
  {
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
    digital: 'Digital & réseaux',
    transformation: 'Transformation',
  },
  {
    stock: 'Stock',
    change: 'Exchange rate',
    credit: 'Credit',
    energie: 'Energy & surprises',
    fournisseur: 'Supplier',
    marketing: 'Local marketing',
    caisse: 'Personal/business cash',
    famille: 'Family & social',
    admin: 'Paperwork',
    'mobile-money': 'Mobile Money',
    equipe: 'Team',
    concurrence: 'Competition',
    securite: 'Security',
    agri: 'Agri-business',
    import: 'Import-export',
    digital: 'Digital & social media',
    transformation: 'Processing',
  },
);

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
    // Ressort court : la carte est lisible en ~0,25 s (avant : ~0,6 s).
    void controls.start({ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 520, damping: 36, mass: 0.8 } });
  }, [controls]);

  const fly = async (c: 'a' | 'b') => {
    if (locked) return;
    setLocked(true);
    onPreview(c);
    playSwipe();
    if (isSoundOn()) haptic();
    await controls.start({ x: c === 'a' ? -520 : 520, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } });
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
    <div className="flex flex-col gap-4 short:gap-2.5">
      {/* Hauteur adaptée à l'écran : sur un petit téléphone, la carte se compacte pour que
          les boutons de choix restent visibles sans défiler. */}
      <div className="relative h-[21rem] select-none short:h-[clamp(12.5rem,calc(100dvh-25rem),19rem)]">
        <motion.div
          drag={locked ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.85}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          animate={controls}
          initial={{ scale: 0.97, opacity: 0, y: 8 }}
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

          <div className="flex items-center gap-3 bg-gradient-to-br from-gold/20 via-transparent to-emerald/10 px-5 pb-4 pt-5 short:px-4 short:pb-2.5 short:pt-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-2 text-4xl short:h-11 short:w-11 short:text-2xl">
              {card.avatar}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold">{card.character}</p>
              <p className="truncate text-xs font-semibold text-muted">{card.role}</p>
              <span className="mt-1 inline-block rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
                {CATEGORY_LABEL[card.category]}
                {card.pack ? ' · Premium' : ''}
                {card.sector ? ` · ${getSector(card.sector)?.emoji ?? ''}` : ''}
              </span>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 short:px-4 short:pb-3">
            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
              <h3 className="text-xl font-extrabold leading-tight short:text-lg">{card.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/85 short:mt-1 short:text-sm short:leading-snug">{card.text}</p>
            </div>
            <p className="flex items-center justify-center gap-2 pt-3 text-[11px] font-semibold text-muted short:hidden">
              <ArrowLeft size={12} /> {L('Glisse la carte ou touche un choix', 'Swipe the card or tap a choice')} <ArrowRight size={12} />
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
              className={`relative flex min-h-[5.5rem] flex-col items-start justify-between rounded-3xl border-2 p-3 text-left text-sm font-bold transition active:scale-[0.98] short:min-h-[4.25rem] short:rounded-2xl short:p-2.5 short:text-[13px] ${
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
                    <Check size={12} /> {L('Touche pour confirmer', 'Tap to confirm')}
                  </span>
                ) : (
                  `${L('Choix', 'Choice')} ${c.toUpperCase()}`
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
