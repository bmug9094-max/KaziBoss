import { Info } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { loadJSON, saveJSON } from '../../lib/storage';
import { usePlayer } from '../../state/PlayerContext';
import { Field, ResultRow, fmt, num } from './ui';
import { L } from '../../i18n';

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
          <h2 className="font-extrabold">{L('Calculateur de prix de vente', 'Selling price calculator')}</h2>
          <div className="flex rounded-xl bg-surface-2 p-0.5 text-xs font-bold">
            {(['$', 'FC'] as const).map((cur) => (
              <button key={cur} onClick={() => setF((s) => ({ ...s, currency: cur }))} className={`rounded-lg px-3 py-1 ${c === cur ? 'bg-gold text-slate-900' : 'text-muted'}`}>
                {cur}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={L("Coût d'achat du lot", 'Purchase cost of the batch')} value={f.purchase} onChange={set('purchase')} suffix={c} />
          <Field label={L("Nombre d'unités", 'Number of units')} value={f.quantity} onChange={set('quantity')} suffix={L('u.', 'pcs')} />
          <Field label="Transport" value={f.transport} onChange={set('transport')} suffix={c} />
          <Field label={L('Frais fixes alloués', 'Allocated fixed costs')} value={f.fixed} onChange={set('fixed')} suffix={c} hint={L('Part de loyer, électricité…', 'Share of rent, electricity…')} />
          <Field label={L('Pertes estimées', 'Estimated losses')} value={f.losses} onChange={set('losses')} suffix="%" hint={L('Casse, périmés, vols', 'Breakage, expired goods, theft')} />
          <Field label={L('Marge souhaitée', 'Target margin')} value={f.margin} onChange={set('margin')} suffix="%" hint={L('Sur le prix de vente', 'On the selling price')} />
        </div>
      </div>

      {r ? (
        <div className="card p-5">
          <ResultRow label={L('Coût total du lot', 'Total batch cost')} value={fmt(r.totalCost, c)} />
          <ResultRow label={L('Unités réellement vendables', 'Units you can actually sell')} value={`${Math.floor(r.sellable)} ${L('u.', 'pcs')}`} />
          <ResultRow label={L('Coût de revient unitaire', 'Unit cost price')} value={fmt(r.unitCost, c)} tone="coral" />
          <div className="my-2 h-px bg-line" />
          <ResultRow label={L('Prix de vente conseillé', 'Recommended selling price')} value={fmt(r.price, c)} strong tone="gold" />
          <p className="-mt-1 text-right text-[11px] text-muted">{L('calcul exact :', 'exact figure:')} {fmt(r.rawPrice, c, c === '$' ? 3 : 0)} → {L('arrondi commercial', 'rounded up for sale')}</p>
          <ResultRow label={L('Bénéfice net par unité', 'Net profit per unit')} value={fmt(r.unitProfit, c)} tone="emerald" />
          <ResultRow label={L('Bénéfice net sur le lot', 'Net profit on the batch')} value={fmt(r.lotProfit, c)} strong tone="emerald" />
          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-2xl bg-surface-2/70 p-2">
              <p className="font-extrabold">{(r.realMargin * 100).toFixed(1)} %</p>
              <p className="text-[10px] font-bold uppercase text-muted">{L('Marge réelle', 'Real margin')}</p>
            </div>
            <div className="rounded-2xl bg-surface-2/70 p-2">
              <p className="font-extrabold">{(r.markup * 100).toFixed(1)} %</p>
              <p className="text-[10px] font-bold uppercase text-muted">{L('Majoration', 'Markup')}</p>
            </div>
          </div>
          <p className="mt-3 flex gap-2 text-xs text-muted">
            <Info size={14} className="mt-0.5 shrink-0 text-sky" />
            {L('Ne vends jamais en dessous de', 'Never sell below')} {fmt(r.unitCost, c)}
            {L(" : c'est ton seuil de perte. Marge et majoration ne sont pas le même chiffre.", ': that is your break-even point. Margin and markup are not the same number.')}
          </p>
        </div>
      ) : (
        <p className="text-center text-sm text-muted">{L("Renseigne au moins le coût d'achat et le nombre d'unités.", 'Enter at least the purchase cost and the number of units.')}</p>
      )}
    </div>
  );
}
