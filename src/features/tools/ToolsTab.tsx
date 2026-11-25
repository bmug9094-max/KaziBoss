import { motion } from 'framer-motion';
import { ArrowLeftRight, BookOpen, Calculator, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import type { ToolId } from '../../types';
import CashJournal from './CashJournal';
import ExchangeSimulator from './ExchangeSimulator';
import PriceCalculator from './PriceCalculator';

const TOOLS: { id: ToolId; label: string; icon: LucideIcon }[] = [
  { id: 'pricing', label: 'Prix & Marge', icon: Calculator },
  { id: 'exchange', label: 'Change', icon: ArrowLeftRight },
  { id: 'journal', label: 'Journal', icon: BookOpen },
];

export default function ToolsTab() {
  const [tool, setTool] = useState<ToolId>('pricing');
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-extrabold">Outils du patron</h1>
        <p className="text-sm text-muted">Gratuits, utilisables hors-ligne, pour ta vraie boutique.</p>
      </div>
      <div className="grid grid-cols-3 gap-1 rounded-2xl bg-surface p-1">
        {TOOLS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTool(id)}
            className={`relative flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-bold transition ${tool === id ? 'text-slate-900' : 'text-muted hover:text-ink'}`}
          >
            {tool === id && <motion.span layoutId="tool-pill" className="absolute inset-0 rounded-xl bg-gold" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
            <span className="relative flex items-center gap-1.5">
              <Icon size={15} /> {label}
            </span>
          </button>
        ))}
      </div>
      {tool === 'pricing' && <PriceCalculator />}
      {tool === 'exchange' && <ExchangeSimulator />}
      {tool === 'journal' && <CashJournal />}
    </div>
  );
}
