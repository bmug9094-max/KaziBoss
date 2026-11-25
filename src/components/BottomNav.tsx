import { motion } from 'framer-motion';
import { Gamepad2, GraduationCap, Store, Wrench, type LucideIcon } from 'lucide-react';

export type TabId = 'play' | 'learn' | 'tools' | 'profile';

const ITEMS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'play', label: 'Jouer', icon: Gamepad2 },
  { id: 'learn', label: 'Apprendre', icon: GraduationCap },
  { id: 'tools', label: 'Outils', icon: Wrench },
  { id: 'profile', label: 'Boutique', icon: Store },
];

export default function BottomNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-bg/90 backdrop-blur-lg">
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-1.5">
        {ITEMS.map(({ id, label, icon: Icon }) => {
          const on = id === active;
          return (
            <li key={id} className="flex-1">
              <button
                onClick={() => onChange(id)}
                aria-current={on ? 'page' : undefined}
                className={`relative flex w-full flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-bold transition ${on ? 'text-gold' : 'text-muted hover:text-ink'}`}
              >
                {on && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-x-3 inset-y-0 -z-10 rounded-2xl"
                    style={{ backgroundColor: 'rgb(245 158 11 / 0.12)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon size={22} strokeWidth={on ? 2.5 : 2} />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
