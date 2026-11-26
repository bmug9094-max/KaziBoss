import { ArrowDownUp, ShieldCheck, TrendingDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { loadJSON, saveJSON } from '../../lib/storage';
import { usePlayer } from '../../state/PlayerContext';
import { Field, ResultRow, fmt, num } from './ui';
import { L } from '../../i18n';

/** Taux indicatifs : l'utilisateur saisit le taux du jour. */
const CURRENCIES = [
  { code: 'FC', name: L('Franc congolais (CDF)', 'Congolese franc (CDF)'), rate: '2850' },
  { code: 'FCFA', name: L('Franc CFA (XAF / XOF)', 'CFA franc (XAF / XOF)'), rate: '565' },
  { code: 'GNF', name: L('Franc guinéen (GNF)', 'Guinean franc (GNF)'), rate: '8650' },
] as const;

interface ExchangeForm {
  currency: (typeof CURRENCIES)[number]['code'];
  rate: string;
  usd: string;
  local: string;
  cost: string;
  margin: string;
  depreciation: string;
  days: string;
}

const DEFAULT: ExchangeForm = { currency: 'FC', rate: '2850', usd: '10', local: '', cost: '2', margin: '25', depreciation: '3', days: '30' };

export default function ExchangeSimulator() {
  const { markToolUsed } = usePlayer();
  const [f, setF] = useState<ExchangeForm>(() => loadJSON('tool.exchange', DEFAULT));
  const set = (k: keyof ExchangeForm) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const cur = f.currency;
  const rate = num(f.rate);

  useEffect(() => saveJSON('tool.exchange', f), [f]);

  const protection = useMemo(() => {
    const cost = num(f.cost);
    const m = Math.min(num(f.margin), 90) / 100;
    const dep = num(f.depreciation) / 100;
    const days = num(f.days);
    if (!rate || !cost) return null;
    const projectedRate = rate * Math.pow(1 + dep, days / 30);
    const priceToday = (cost * rate) / (1 - m);
    const priceProtected = (cost * projectedRate) / (1 - m);
    // Si on garde le prix d'aujourd'hui, quelle marge reste au réachat ?
    const marginLeft = 1 - (cost * projectedRate) / priceToday;
    const valueLostPer100 = 100 * (1 - rate / projectedRate);
    return { projectedRate, priceToday, priceProtected, marginLeft, valueLostPer100 };
  }, [f, rate]);

  useEffect(() => {
    if (protection) markToolUsed('exchange');
  }, [protection, markToolUsed]);

  const onCurrency = (code: ExchangeForm['currency']) => {
    const c = CURRENCIES.find((x) => x.code === code)!;
    setF((s) => ({ ...s, currency: code, rate: c.rate, local: '' }));
  };

  const localFromUsd = num(f.usd) * rate;
  const usdFromLocal = rate ? num(f.local) / rate : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="card space-y-4 p-5">
        <h2 className="flex items-center gap-2 font-extrabold">
          <ArrowDownUp size={18} className="text-gold" /> {L('Convertisseur', 'Converter')}
        </h2>
        <label className="block">
          <span className="label">{L('Monnaie locale', 'Local currency')}</span>
          <select value={cur} onChange={(e) => onCurrency(e.target.value as ExchangeForm['currency'])} className="input">
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <Field
          label={L('Taux du jour : 1 $ =', "Today's rate: $1 =")}
          value={f.rate}
          onChange={set('rate')}
          suffix={cur}
          hint={L("Taux indicatif : saisis celui de ton cambiste aujourd'hui.", "Indicative rate: enter your money changer's rate for today.")}
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Field label={L('Prix en dollars', 'Price in dollars')} value={f.usd} onChange={set('usd')} suffix="$" />
            <p className="mt-1.5 text-sm font-extrabold text-gold">= {fmt(localFromUsd, cur)}</p>
          </div>
          <div>
            <Field label={`${L('Prix en', 'Price in')} ${cur}`} value={f.local} onChange={set('local')} suffix={cur} />
            <p className="mt-1.5 text-sm font-extrabold text-emerald">= {fmt(usdFromLocal, '$')}</p>
          </div>
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h2 className="flex items-center gap-2 font-extrabold">
          <ShieldCheck size={18} className="text-emerald" /> {L("Protection contre l'inflation", 'Inflation protection')}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label={L("Coût d'achat unitaire", 'Unit purchase cost')} value={f.cost} onChange={set('cost')} suffix="$" />
          <Field label={L('Marge visée', 'Target margin')} value={f.margin} onChange={set('margin')} suffix="%" />
          <Field label={L('Dépréciation / mois', 'Depreciation / month')} value={f.depreciation} onChange={set('depreciation')} suffix="%" hint={L('Perte de valeur attendue de la monnaie', "Expected loss of the currency's value")} />
          <Field label={L('Délai de réachat', 'Time to restock')} value={f.days} onChange={set('days')} suffix={L('j', 'd')} hint={L('Temps avant de racheter le stock', 'Time before you buy stock again')} />
        </div>
        {protection && (
          <div className="rounded-2xl bg-surface-2/50 p-4">
            <ResultRow label={L('Taux estimé au réachat', 'Estimated rate at restock')} value={`${fmt(protection.projectedRate, cur)} / $`} />
            <ResultRow label={L('Prix au taux du jour', "Price at today's rate")} value={fmt(protection.priceToday, cur)} />
            <ResultRow label={L('Prix protégé conseillé', 'Recommended protected price')} value={fmt(protection.priceProtected, cur)} strong tone="gold" />
            <div className="my-2 h-px bg-line" />
            <ResultRow
              label={L('Marge réelle si tu ne bouges pas', "Real margin if you don't adjust")}
              value={`${(protection.marginLeft * 100).toFixed(1)} %`}
              tone={protection.marginLeft < 0.1 ? 'coral' : 'emerald'}
            />
            <p className="mt-2 flex gap-2 text-xs text-muted">
              <TrendingDown size={14} className="mt-0.5 shrink-0 text-coral" />
              {L(
                `Sur 100 $ de recette gardée en ${cur} pendant ${num(f.days)} jours, tu perds environ ${protection.valueLostPer100.toFixed(1)} $ de pouvoir d'achat. Convertis la part destinée au réachat de stock.`,
                `On $100 of takings kept in ${cur} for ${num(f.days)} days, you lose about $${protection.valueLostPer100.toFixed(1)} of buying power. Convert the share meant for restocking.`,
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
