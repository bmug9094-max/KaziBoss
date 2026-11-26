import { MotionConfig, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import BottomNav, { type TabId } from './components/BottomNav';
import Toasts from './components/Toasts';
import TopBar from './components/TopBar';
import LearnTab from './features/learn/LearnTab';
import PlayTab from './features/play/PlayTab';
import AuthSheet from './features/profile/AuthSheet';
import PasswordRecoverySheet from './features/profile/PasswordRecoverySheet';
import ProfileTab from './features/profile/ProfileTab';
import ToolsTab from './features/tools/ToolsTab';
import FeedbackSheet from './features/feedback/FeedbackSheet';
import { onGoTo, onOpenAuth, type AuthReason } from './lib/ui';

const TABS: TabId[] = ['play', 'learn', 'tools', 'profile'];

function initialTab(): TabId {
  const t = new URLSearchParams(window.location.search).get('tab') as TabId | null;
  return t && TABS.includes(t) ? t : 'play';
}

export default function App() {
  const [tab, setTab] = useState<TabId>(initialTab);
  // Ancre à atteindre après un changement d'onglet (ex. une carte de pack) + compteur pour
  // relancer l'effet même si l'onglet ne change pas.
  const pendingAnchor = useRef<string | null>(null);
  const [navTick, setNavTick] = useState(0);
  const [auth, setAuth] = useState<{ open: boolean; reason: AuthReason }>({ open: false, reason: 'default' });

  // Navigation demandée depuis n'importe quel écran (ex. offre affichée après une faillite).
  useEffect(
    () =>
      onGoTo((t, a) => {
        pendingAnchor.current = a ?? null;
        setTab(t);
        setNavTick((n) => n + 1);
      }),
    [],
  );
  useEffect(() => onOpenAuth((reason) => setAuth({ open: true, reason })), []);

  // Haut de page à chaque onglet, ou défilement jusqu'à l'ancre demandée.
  useEffect(() => {
    const target = pendingAnchor.current;
    if (!target) {
      window.scrollTo({ top: 0 });
      return;
    }
    const t = window.setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      pendingAnchor.current = null;
    }, 150);
    return () => window.clearTimeout(t);
  }, [tab, navTick]);

  return (
    // reducedMotion="user" : animations coupées si le téléphone demande « réduire les animations ».
    <MotionConfig reducedMotion="user">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-bg md:max-w-lg">
        <TopBar onOpenProfile={() => setTab('profile')} />
        <main className="flex-1 px-4 pb-28 pt-2">
          {/* Pas d'AnimatePresence : une simple entrée suffit, et rien ne peut rester bloqué
              en attente d'une animation de sortie (cf. correctif du swipe). */}
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
            {tab === 'play' && <PlayTab />}
            {tab === 'learn' && <LearnTab />}
            {tab === 'tools' && <ToolsTab />}
            {tab === 'profile' && <ProfileTab />}
          </motion.div>
        </main>
        <BottomNav active={tab} onChange={setTab} />
        <Toasts />
        <AuthSheet open={auth.open} reason={auth.reason} onClose={() => setAuth((a) => ({ ...a, open: false }))} />
        <PasswordRecoverySheet />
        <FeedbackSheet />
      </div>
    </MotionConfig>
  );
}
