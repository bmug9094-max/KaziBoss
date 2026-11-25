/** Utilitaires partagés par les outils */
export const num = (s: string) => {
  const v = parseFloat(s.replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(v) ? v : 0;
};

export function fmt(v: number, currency: string, decimals?: number) {
  const d = decimals ?? (currency === '$' ? 2 : 0);
  const s = v.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
  return currency === '$' ? `${s} $` : `${s} ${currency}`;
}

export function Field({
  label,
  value,
  onChange,
  suffix,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <div className="relative">
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.,\s]/g, ''))}
          className="input pr-12"
          placeholder="0"
        />
        {suffix && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">{suffix}</span>}
      </div>
      {hint && <span className="mt-1 block text-[11px] text-muted">{hint}</span>}
    </label>
  );
}

export function ResultRow({ label, value, strong, tone }: { label: string; value: string; strong?: boolean; tone?: 'gold' | 'emerald' | 'coral' }) {
  const color = tone === 'gold' ? 'text-gold' : tone === 'emerald' ? 'text-emerald' : tone === 'coral' ? 'text-coral' : '';
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className="text-sm text-muted">{label}</span>
      <span className={`${strong ? 'text-xl font-extrabold' : 'font-bold'} ${color}`}>{value}</span>
    </div>
  );
}
