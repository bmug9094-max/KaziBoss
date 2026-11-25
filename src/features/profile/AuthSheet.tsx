import { Loader2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import Sheet from '../../components/Sheet';
import { usePlayer } from '../../state/PlayerContext';

export default function AuthSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn, signUp, notify, profile } = usePlayer();
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(profile.username === 'Invité' ? '' : profile.username);
  const [city, setCity] = useState(profile.city);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (mode === 'signup' && username.trim().length < 3) return setMessage({ text: 'Pseudo : 3 caractères minimum.', error: true });
    if (password.length < 6) return setMessage({ text: 'Mot de passe : 6 caractères minimum.', error: true });
    setBusy(true);
    const res = mode === 'signup' ? await signUp(email.trim(), password, username.trim(), city.trim()) : await signIn(email.trim(), password);
    setBusy(false);
    if (res.error) return setMessage({ text: res.error, error: true });
    if (res.info) return setMessage({ text: res.info, error: false });
    notify(mode === 'signup' ? '🎉 Compte créé, progression sauvegardée !' : 'Bon retour, boss !', 'success');
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={mode === 'signup' ? 'Créer mon compte' : 'Me connecter'}>
      <p className="mb-4 text-sm text-muted">Sauvegarde ta progression, protège ton streak et entre dans le classement de ta ville.</p>
      <form onSubmit={submit} className="space-y-3">
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="label">Pseudo</span>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="input" maxLength={24} required autoComplete="nickname" />
            </label>
            <label>
              <span className="label">Ville</span>
              <input value={city} onChange={(e) => setCity(e.target.value)} className="input" maxLength={40} placeholder="Kinshasa" />
            </label>
          </div>
        )}
        <label className="block">
          <span className="label">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required autoComplete="email" />
        </label>
        <label className="block">
          <span className="label">Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />
        </label>
        {message && <p className={`rounded-2xl p-3 text-sm ${message.error ? 'bg-coral/15 text-coral' : 'bg-emerald/15 text-emerald'}`}>{message.text}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full py-3.5">
          {busy && <Loader2 size={18} className="animate-spin" />}
          {mode === 'signup' ? 'Créer mon compte' : 'Me connecter'}
        </button>
      </form>
      <button onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')} className="mt-4 w-full text-center text-sm font-bold text-gold">
        {mode === 'signup' ? "J'ai déjà un compte" : 'Créer un nouveau compte'}
      </button>
    </Sheet>
  );
}
