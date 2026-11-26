import { Loader2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import Sheet from '../../components/Sheet';
import { usePlayer } from '../../state/PlayerContext';

/** S'ouvre automatiquement quand le joueur revient du lien « mot de passe oublié ». */
export default function PasswordRecoverySheet() {
  const { passwordRecovery, updatePassword } = usePlayer();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError('8 caractères minimum.');
    setBusy(true);
    const res = await updatePassword(password);
    setBusy(false);
    if (res.error) setError(res.error);
  };

  return (
    <Sheet open={passwordRecovery && !dismissed} onClose={() => setDismissed(true)} title="Nouveau mot de passe">
      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="label">Choisis un nouveau mot de passe</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required minLength={8} autoComplete="new-password" />
        </label>
        {error && <p className="rounded-2xl bg-coral/15 p-3 text-sm text-coral">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full py-3.5">
          {busy && <Loader2 size={18} className="animate-spin" />}
          Enregistrer
        </button>
      </form>
    </Sheet>
  );
}
