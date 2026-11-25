import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import BottomNav, { type TabId } from './components/BottomNav';
import Toasts from './components/Toasts';
import TopBar from './components/TopBar';
import LearnTab from './features/learn/LearnTab';
import PlayTab from './features/play/PlayTab';
import ProfileTab from './features/profile/ProfileTab';
import ToolsTab from './features/tools/ToolsTab';

const TABS: TabId[] = ['play', 'learn', 'tools', 'profile'];

function initialTab(): TabId {
  const t = new URLSearchParams(window.location.search).get('tab') as TabId | null;
  return t && TABS.includes(t) ? t : 'play';
}

export default function App() {
  const [tab, setTab] = useState<TabId>(initialTab);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-bg">
      <TopBar onOpenProfile={() => setTab('profile')} />
      <main className="flex-1 px-4 pb-28 pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {tab === 'play' && <PlayTab />}
            {tab === 'learn' && <LearnTab onGoShop={() => setTab('profile')} />}
            {tab === 'tools' && <ToolsTab />}
            {tab === 'profile' && <ProfileTab />}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav active={tab} onChange={setTab} />
      <Toasts />
    </div>
  );
}
