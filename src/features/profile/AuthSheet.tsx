import { Loader2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import Sheet from '../../components/Sheet';
import { LEGAL_LINKS } from '../../config/legal';
import { usePlayer } from '../../state/PlayerContext';

type Mode = 'signup' | 'signin' | 'reset';

const TITLES: Record<Mode, string> = {
  signup: 'Créer mon compte',
  signin: 'Me connecter',
  reset: 'Mot de passe oublié',
};

export default function AuthSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn, signUp, requestPasswordReset, notify, profile } = usePlayer();
  const [mode, setMode] = useState<Mode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(profile.username === 'Invité' ? '' : profile.username);
  const [city, setCity] = useState(profile.city);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  const switchTo = (m: Mode) => {
    setMode(m);
    setMessage(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (mode === 'reset') {
      setBusy(true);
      const res = await requestPasswordReset(email.trim());
      setBusy(false);
      return setMessage(res.error ? { text: res.error, error: true } : { text: res.info ?? '', error: false });
    }
    if (mode === 'signup' && username.trim().length < 3) return setMessage({ text: 'Pseudo : 3 caractères minimum.', error: true });
    if (mode === 'signup' && password.length < 8) return setMessage({ text: 'Mot de passe : 8 caractères minimum.', error: true });
    setBusy(true);
    const res = mode === 'signup' ? await signUp(email.trim(), password, username.trim(), city.trim()) : await signIn(email.trim(), password);
    setBusy(false);
    if (res.error) return setMessage({ text: res.error, error: true });
    if (res.info) return setMessage({ text: res.info, error: false });
    notify(mode === 'signup' ? '🎉 Compte créé, progression sauvegardée !' : 'Bon retour, boss !', 'success');
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={TITLES[mode]}>
      <p className="mb-4 text-sm text-muted">
        {mode === 'reset'
          ? "Indique l'email de ton compte : nous t'envoyons un lien pour choisir un nouveau mot de passe."
          : 'Sauvegarde ta progression, protège ton streak et entre dans le classement de ta ville.'}
      </p>
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
        {mode !== 'reset' && (
          <label className="block">
            <span className="label">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              minLength={mode === 'signup' ? 8 : undefined}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </label>
        )}
        {mode === 'signin' && (
          <button type="button" onClick={() => switchTo('reset')} className="text-xs font-bold text-muted underline-offset-2 hover:underline">
            Mot de passe oublié ?
          </button>
        )}
        {mode === 'signup' && (
          <p className="text-[11px] leading-snug text-muted">
            En créant un compte, tu acceptes les{' '}
            <a href={LEGAL_LINKS.terms} target="_blank" rel="noopener" className="font-bold text-gold">
              conditions d'utilisation et de vente
            </a>{' '}
            et la{' '}
            <a href={LEGAL_LINKS.privacy} target="_blank" rel="noopener" className="font-bold text-gold">
              politique de confidentialité
            </a>
            .
          </p>
        )}
        {message && <p className={`rounded-2xl p-3 text-sm ${message.error ? 'bg-coral/15 text-coral' : 'bg-emerald/15 text-emerald'}`}>{message.text}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full py-3.5">
          {busy && <Loader2 size={18} className="animate-spin" />}
          {mode === 'reset' ? 'Envoyer le lien' : TITLES[mode]}
        </button>
      </form>
      <button onClick={() => switchTo(mode === 'signup' ? 'signin' : 'signup')} className="mt-4 w-full text-center text-sm font-bold text-gold">
        {mode === 'signup' ? "J'ai déjà un compte" : 'Créer un nouveau compte'}
      </button>
    </Sheet>
  );
}
