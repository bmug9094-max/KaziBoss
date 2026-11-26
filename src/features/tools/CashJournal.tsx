import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, Minus, Plus, Trash2, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { loadJSON, saveJSON, todayISO, uid } from '../../lib/storage';
import { usePlayer } from '../../state/PlayerContext';
import { fmt, num } from './ui';
import { L, LOCALE } from '../../i18n';

interface Entry {
  id: string;
  date: string;
  type: 'in' | 'out';
  amount: number;
  label: string;
  /** retrait personnel du patron */
  personal: boolean;
}

interface JournalState {
  currency: '$' | 'FC';
  entries: Entry[];
}

const QUICK_IN = L(['Ventes', 'Paiement ardoise', 'Mobile Money'], ['Sales', 'Credit repaid', 'Mobile Money']);
const QUICK_OUT = L(['Achat stock', 'Transport', 'Loyer', 'Électricité', 'Salaire'], ['Stock purchase', 'Transport', 'Rent', 'Electricity', 'Salary']);

function shiftDate(iso: string, days: number) {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return todayISO(d);
}

export default function CashJournal() {
  const { markToolUsed, notify } = usePlayer();
  const [state, setState] = useState<JournalState>(() => loadJSON('journal', { currency: '$', entries: [] }));
  const [date, setDate] = useState(todayISO());
  const [type, setType] = useState<'in' | 'out'>('in');
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [personal, setPersonal] = useState(false);
  const c = state.currency;

  useEffect(() => saveJSON('journal', state), [state]);

  const day = useMemo(() => state.entries.filter((e) => e.date === date), [state.entries, date]);
  const totals = useMemo(() => {
    const inn = day.filter((e) => e.type === 'in').reduce((s, e) => s + e.amount, 0);
    const out = day.filter((e) => e.type === 'out').reduce((s, e) => s + e.amount, 0);
    const perso = day.filter((e) => e.personal).reduce((s, e) => s + e.amount, 0);
    return { inn, out, net: inn - out, perso };
  }, [day]);

  const add = () => {
    const v = num(amount);
    if (v <= 0) return notify(L('Saisis un montant.', 'Enter an amount.'), 'error');
    const entry: Entry = {
      id: uid(),
      date,
      type,
      amount: v,
      label: label.trim() || (type === 'in' ? L('Entrée', 'Money in') : personal ? L('Retrait perso', 'Personal withdrawal') : L('Sortie', 'Money out')),
      personal: type === 'out' && personal,
    };
    setState((s) => ({ ...s, entries: [entry, ...s.entries] }));
    setAmount('');
    setLabel('');
    setPersonal(false);
    markToolUsed('journal');
  };

  const remove = (id: string) => setState((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== id) }));

  const exportCsv = () => {
    const head = L(['date', 'type', 'montant', 'devise', 'libelle', 'perso'], ['date', 'type', 'amount', 'currency', 'label', 'personal']);
    const rows = [
      head,
      ...state.entries.map((e) => [
        e.date,
        e.type === 'in' ? L('entree', 'in') : L('sortie', 'out'),
        String(e.amount),
        c,
        `"${e.label.replace(/"/g, '""')}"`,
        e.personal ? L('oui', 'yes') : L('non', 'no'),
      ]),
    ];
    const blob = new Blob([rows.map((r) => r.join(';')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `kaziboss-journal-${todayISO()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const isToday = date === todayISO();

  return (
    <div className="flex flex-col gap-4">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setDate(shiftDate(date, -1))} className="rounded-full p-2 hover:bg-surface-2" aria-label={L('Jour précédent', 'Previous day')}>
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <p className="font-extrabold capitalize">
              {isToday ? L("Aujourd'hui", 'Today') : new Date(date + 'T12:00:00').toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <div className="mt-1 inline-flex rounded-lg bg-surface-2 p-0.5 text-[11px] font-bold">
              {(['$', 'FC'] as const).map((cur) => (
                <button key={cur} onClick={() => setState((s) => ({ ...s, currency: cur }))} className={`rounded-md px-2.5 py-0.5 ${c === cur ? 'bg-gold text-slate-900' : 'text-muted'}`}>
                  {cur}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setDate(shiftDate(date, 1))} disabled={isToday} className="rounded-full p-2 hover:bg-surface-2 disabled:opacity-30" aria-label={L('Jour suivant', 'Next day')}>
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-emerald/10 p-2">
            <p className="text-sm font-extrabold text-emerald">{fmt(totals.inn, c)}</p>
            <p className="text-[10px] font-bold uppercase text-muted">{L('Entrées', 'In')}</p>
          </div>
          <div className="rounded-2xl bg-coral/10 p-2">
            <p className="text-sm font-extrabold text-coral">{fmt(totals.out, c)}</p>
            <p className="text-[10px] font-bold uppercase text-muted">{L('Sorties', 'Out')}</p>
          </div>
          <div className="rounded-2xl bg-gold/10 p-2">
            <p className={`text-sm font-extrabold ${totals.net >= 0 ? 'text-gold' : 'text-coral'}`}>{fmt(totals.net, c)}</p>
            <p className="text-[10px] font-bold uppercase text-muted">{L('Solde', 'Balance')}</p>
          </div>
        </div>
        {totals.perso > 0 && (
          <p className="mt-2 text-center text-xs text-muted">
            {L('dont', 'including')} <b className="text-coral">{fmt(totals.perso, c)}</b> {L('de retraits personnels', 'in personal withdrawals')}
          </p>
        )}
      </div>

      <div className="card space-y-3 p-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setType('in')} className={`btn ${type === 'in' ? 'bg-emerald text-slate-900' : 'btn-ghost'}`}>
            <Plus size={16} /> {L('Entrée', 'Money in')}
          </button>
          <button onClick={() => setType('out')} className={`btn ${type === 'out' ? 'bg-coral text-white' : 'btn-ghost'}`}>
            <Minus size={16} /> {L('Sortie', 'Money out')}
          </button>
        </div>
        <div className="grid grid-cols-[1fr_1.4fr] gap-2">
          <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))} placeholder={`${L('Montant', 'Amount')} (${c})`} className="input" />
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder={L('Libellé', 'Description')} className="input" maxLength={60} />
        </div>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          {(type === 'in' ? QUICK_IN : QUICK_OUT).map((q) => (
            <button key={q} onClick={() => setLabel(q)} className="chip shrink-0 text-muted hover:text-ink">
              {q}
            </button>
          ))}
        </div>
        {type === 'out' && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={personal} onChange={(e) => setPersonal(e.target.checked)} className="h-4 w-4 accent-coral" />
            {L('Retrait personnel (caisse perso)', 'Personal withdrawal (personal cash)')}
          </label>
        )}
        <button onClick={add} className="btn-primary w-full">
          {L('Enregistrer', 'Save')}
        </button>
      </div>

      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {day.map((e) => (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3"
            >
              <span className="flex min-w-0 items-center gap-2">
                {e.personal && <User size={14} className="shrink-0 text-coral" />}
                <span className="truncate text-sm font-semibold">{e.label}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className={`font-extrabold ${e.type === 'in' ? 'text-emerald' : 'text-coral'}`}>
                  {e.type === 'in' ? '+' : '−'}
                  {fmt(e.amount, c)}
                </span>
                <button onClick={() => remove(e.id)} className="text-muted hover:text-coral" aria-label={L('Supprimer', 'Delete')}>
                  <Trash2 size={16} />
                </button>
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
        {day.length === 0 && <li className="py-4 text-center text-sm text-muted">{L('Aucun mouvement ce jour-là.', 'No entries on this day.')}</li>}
      </ul>

      {state.entries.length > 0 && (
        <button onClick={exportCsv} className="btn-ghost">
          <Download size={16} /> {L('Exporter tout le journal (CSV)', 'Export the whole cash book (CSV)')}
        </button>
      )}
    </div>
  );
}
