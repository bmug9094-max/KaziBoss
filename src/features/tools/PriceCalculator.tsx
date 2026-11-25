import { Info } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { loadJSON, saveJSON } from '../../lib/storage';
import { usePlayer } from '../../state/PlayerContext';
import { Field, ResultRow, fmt, num } from './ui';

interface PricingForm {
  currency: '$' | 'FC';
  purchase: string;
  quantity: string;
  transport: string;
  fixed: string;
  losses: string;
  margin: string;
}

const DEFAULT: PricingForm = { currency: '$', purchase: '40', quantity: '100', transport: '5', fixed: '3', losses: '3', margin: '25' };

/** Arrondi commercial vers le haut (0,05 $ ou 50 FC) */
const roundUp = (v: number, currency: string) => {
  const step = currency === '$' ? 0.05 : 50;
  return Math.ceil(v / step - 1e-9) * step;
};

export default function PriceCalculator() {
  const { markToolUsed } = usePlayer();
  const [f, setF] = useState<PricingForm>(() => loadJSON('tool.pricing', DEFAULT));
  const set = (k: keyof PricingForm) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  useEffect(() => saveJSON('tool.pricing', f), [f]);

  const r = useMemo(() => {
    const qty = num(f.quantity);
    const losses = Math.min(num(f.losses), 90) / 100;
    const margin = Math.min(num(f.margin), 90) / 100;
    const totalCost = num(f.purchase) + num(f.transport) + num(f.fixed);
    const sellable = qty * (1 - losses);
    if (qty <= 0 || sellable <= 0 || totalCost <= 0) return null;
    const unitCost = totalCost / sellable;
    const rawPrice = unitCost / (1 - margin);
    const price = roundUp(rawPrice, f.currency);
    const unitProfit = price - unitCost;
    return {
      totalCost,
      sellable,
      unitCost,
      rawPrice,
      price,
      unitProfit,
      lotProfit: unitProfit * sellable,
      realMargin: unitProfit / price,
      markup: unitProfit / unitCost,
    };
  }, [f]);

  useEffect(() => {
    if (r) markToolUsed('pricing');
  }, [r, markToolUsed]);

  const c = f.currency;

  return (
    <div className="flex flex-col gap-4">
      <div className="card space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold">Calculateur de prix de vente</h2>
          <div className="flex rounded-xl bg-surface-2 p-0.5 text-xs font-bold">
            {(['$', 'FC'] as const).map((cur) => (
              <button key={cur} onClick={() => setF((s) => ({ ...s, currency: cur }))} className={`rounded-lg px-3 py-1 ${c === cur ? 'bg-gold text-slate-900' : 'text-muted'}`}>
                {cur}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Coût d'achat du lot" value={f.purchase} onChange={set('purchase')} suffix={c} />
          <Field label="Nombre d'unités" value={f.quantity} onChange={set('quantity')} suffix="u." />
          <Field label="Transport" value={f.transport} onChange={set('transport')} suffix={c} />
          <Field label="Frais fixes alloués" value={f.fixed} onChange={set('fixed')} suffix={c} hint="Part de loyer, électricité…" />
          <Field label="Pertes estimées" value={f.losses} onChange={set('losses')} suffix="%" hint="Casse, périmés, vols" />
          <Field label="Marge souhaitée" value={f.margin} onChange={set('margin')} suffix="%" hint="Sur le prix de vente" />
        </div>
      </div>

      {r ? (
        <div className="card p-5">
          <ResultRow label="Coût total du lot" value={fmt(r.totalCost, c)} />
          <ResultRow label="Unités réellement vendables" value={`${Math.floor(r.sellable)} u.`} />
          <ResultRow label="Coût de revient unitaire" value={fmt(r.unitCost, c)} tone="coral" />
          <div className="my-2 h-px bg-line" />
          <ResultRow label="Prix de vente conseillé" value={fmt(r.price, c)} strong tone="gold" />
          <p className="-mt-1 text-right text-[11px] text-muted">calcul exact : {fmt(r.rawPrice, c, c === '$' ? 3 : 0)} → arrondi commercial</p>
          <ResultRow label="Bénéfice net par unité" value={fmt(r.unitProfit, c)} tone="emerald" />
          <ResultRow label="Bénéfice net sur le lot" value={fmt(r.lotProfit, c)} strong tone="emerald" />
          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-2xl bg-surface-2/70 p-2">
              <p className="font-extrabold">{(r.realMargin * 100).toFixed(1)} %</p>
              <p className="text-[10px] font-bold uppercase text-muted">Marge réelle</p>
            </div>
            <div className="rounded-2xl bg-surface-2/70 p-2">
              <p className="font-extrabold">{(r.markup * 100).toFixed(1)} %</p>
              <p className="text-[10px] font-bold uppercase text-muted">Majoration</p>
            </div>
          </div>
          <p className="mt-3 flex gap-2 text-xs text-muted">
            <Info size={14} className="mt-0.5 shrink-0 text-sky" />
            Ne vends jamais en dessous de {fmt(r.unitCost, c)} : c'est ton seuil de perte. Marge et majoration ne sont pas le même chiffre.
          </p>
        </div>
      ) : (
        <p className="text-center text-sm text-muted">Renseigne au moins le coût d'achat et le nombre d'unités.</p>
      )}
    </div>
  );
}
