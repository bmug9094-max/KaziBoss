import { Loader2, Lock } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import Sheet from '../../components/Sheet';
import { loadJSON, saveJSON } from '../../lib/storage';
import type { CheckoutBuyer } from '../../state/PlayerContext';

/** Informations exigées par le checkout Chariow (first_name, last_name, phone). */
export type BuyerInfo = CheckoutBuyer;

/** Pays proposés en premier (Afrique francophone), puis quelques pays de la diaspora. */
export const COUNTRIES: { code: string; name: string; dial: string }[] = [
  { code: 'CD', name: 'RD Congo', dial: '+243' },
  { code: 'CG', name: 'Congo-Brazzaville', dial: '+242' },
  { code: 'CI', name: "Côte d'Ivoire", dial: '+225' },
  { code: 'SN', name: 'Sénégal', dial: '+221' },
  { code: 'CM', name: 'Cameroun', dial: '+237' },
  { code: 'BJ', name: 'Bénin', dial: '+229' },
  { code: 'TG', name: 'Togo', dial: '+228' },
  { code: 'BF', name: 'Burkina Faso', dial: '+226' },
  { code: 'ML', name: 'Mali', dial: '+223' },
  { code: 'NE', name: 'Niger', dial: '+227' },
  { code: 'GN', name: 'Guinée', dial: '+224' },
  { code: 'GA', name: 'Gabon', dial: '+241' },
  { code: 'BI', name: 'Burundi', dial: '+257' },
  { code: 'RW', name: 'Rwanda', dial: '+250' },
  { code: 'MG', name: 'Madagascar', dial: '+261' },
  { code: 'FR', name: 'France', dial: '+33' },
  { code: 'BE', name: 'Belgique', dial: '+32' },
  { code: 'CA', name: 'Canada', dial: '+1' },
];

const STORAGE_KEY = 'buyer';

export function loadBuyer(): BuyerInfo | null {
  const b = loadJSON<BuyerInfo | null>(STORAGE_KEY, null);
  return b && b.firstName && b.lastName && b.phone && b.country ? b : null;
}

export default function BuyerSheet({
  open,
  packName,
  price,
  onClose,
  onConfirm,
}: {
  open: boolean;
  packName: string;
  price: string;
  onClose: () => void;
  onConfirm: (buyer: BuyerInfo) => Promise<void>;
}) {
  const saved = loadBuyer();
  const [firstName, setFirstName] = useState(saved?.firstName ?? '');
  const [lastName, setLastName] = useState(saved?.lastName ?? '');
  const [country, setCountry] = useState(saved?.country ?? 'CD');
  const [phone, setPhone] = useState(saved?.phone ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dial = COUNTRIES.find((c) => c.code === country)?.dial ?? '';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/[^\d]/g, '');
    if (digits.length < 6) return setError('Numéro de téléphone incomplet.');
    const buyer = { firstName: firstName.trim(), lastName: lastName.trim(), phone: digits, country };
    saveJSON(STORAGE_KEY, buyer);
    setError(null);
    setBusy(true);
    await onConfirm(buyer);
    setBusy(false);
  };

  return (
    <Sheet open={open} onClose={onClose} title="Paiement">
      <p className="mb-4 text-sm text-muted">
        <b className="text-ink">{packName}</b> · {price}. Ces informations sont demandées par notre service de paiement Chariow, et préremplies pour toi.
      </p>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className="label">Prénom</span>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input" required maxLength={60} autoComplete="given-name" />
          </label>
          <label>
            <span className="label">Nom</span>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="input" required maxLength={60} autoComplete="family-name" />
          </label>
        </div>
        <label className="block">
          <span className="label">Pays</span>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="input" autoComplete="country">
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">Téléphone</span>
          <div className="flex gap-2">
            <span className="input w-20 shrink-0 text-center text-muted">{dial}</span>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input flex-1"
              required
              placeholder="81 234 5678"
              autoComplete="tel-national"
            />
          </div>
        </label>
        {error && <p className="rounded-2xl bg-coral/15 p-3 text-sm text-coral">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full py-3.5">
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />} Continuer vers le paiement sécurisé
        </button>
      </form>
    </Sheet>
  );
}
