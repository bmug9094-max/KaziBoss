import { Gift, Loader2 } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import Sheet from '../../components/Sheet';
import { LEGAL_LINKS } from '../../config/legal';
import { REFERRAL_BONUS, SIGNUP_BONUS } from '../../config/shop';
import type { AuthReason } from '../../lib/ui';
import { usePlayer } from '../../state/PlayerContext';
import { L } from '../../i18n';

type Mode = 'signup' | 'signin' | 'reset';

const TITLES: Record<Mode, string> = {
  signup: L('Créer mon compte', 'Create my account'),
  signin: L('Me connecter', 'Log in'),
  reset: L('Mot de passe oublié', 'Forgot password'),
};

/** Accroche adaptée au moment où l'inscription est proposée. */
const HOOKS: Record<AuthReason, { title: string; text: string }> = L<Record<AuthReason, { title: string; text: string }>>({
  save: { title: 'Ne perds pas ta progression', text: "Pour l'instant, tout est enregistré seulement sur ce téléphone. Un compte la met à l'abri en 30 secondes." },
  buy: { title: 'Un compte pour ton achat', text: 'Ton pack sera lié à ton compte et restera à toi, même si tu changes de téléphone.' },
  leaderboard: { title: 'Entre dans le classement', text: 'Mesure-toi aux autres boss de ta ville et grimpe chaque semaine.' },
  referral: { title: 'Ton lien de parrainage', text: `Invite tes amis et gagne ${REFERRAL_BONUS} KaziCoins pour chaque ami qui joue.` },
  default: { title: 'Rejoins les KaziBoss', text: 'Sauvegarde ta progression, protège ton streak et entre dans le classement de ta ville.' },
}, {
  save: { title: "Don't lose your progress", text: 'Right now, everything is saved only on this phone. An account keeps it safe in 30 seconds.' },
  buy: { title: 'An account for your purchase', text: 'Your pack will be linked to your account and stay yours, even if you change phones.' },
  leaderboard: { title: 'Join the leaderboard', text: 'Compete with the other bosses in your city and climb every week.' },
  referral: { title: 'Your referral link', text: `Invite your friends and earn ${REFERRAL_BONUS} KaziCoins for every friend who plays.` },
  default: { title: 'Join the KaziBosses', text: 'Save your progress, protect your streak and join your city leaderboard.' },
});

const PERKS = [
  { emoji: '🎁', text: L(`${SIGNUP_BONUS} KaziCoins offerts tout de suite`, `${SIGNUP_BONUS} free KaziCoins right away`) },
  { emoji: '☁️', text: L('Ta progression sur tous tes téléphones', 'Your progress on all your phones') },
  { emoji: '🏆', text: L('Le classement de ta ville', 'Your city leaderboard') },
  { emoji: '🤝', text: L(`Ton lien de parrainage : +${REFERRAL_BONUS} par ami`, `Your referral link: +${REFERRAL_BONUS} per friend`) },
];

export default function AuthSheet({ open, reason = 'default', onClose }: { open: boolean; reason?: AuthReason; onClose: () => void }) {
  const { signIn, signUp, requestPasswordReset, notify, profile } = usePlayer();
  const [mode, setMode] = useState<Mode>('signup');
  const hook = HOOKS[reason];

  // Chaque ouverture repart sur l'inscription, sans ancien message.
  useEffect(() => {
    if (open) {
      setMode('signup');
      setMessage(null);
    }
  }, [open]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(profile.username === 'Invité' || profile.username === 'Guest' ? '' : profile.username);
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
    if (mode === 'signup' && username.trim().length < 3) return setMessage({ text: L('Pseudo : 3 caractères minimum.', 'Username: at least 3 characters.'), error: true });
    if (mode === 'signup' && password.length < 8) return setMessage({ text: L('Mot de passe : 8 caractères minimum.', 'Password: at least 8 characters.'), error: true });
    setBusy(true);
    const res = mode === 'signup' ? await signUp(email.trim(), password, username.trim(), city.trim()) : await signIn(email.trim(), password);
    setBusy(false);
    if (res.error) return setMessage({ text: res.error, error: true });
    if (res.info) return setMessage({ text: res.info, error: false });
    notify(mode === 'signup' ? L('🎉 Compte créé, progression sauvegardée !', '🎉 Account created, progress saved!') : L('Bon retour, boss !', 'Welcome back, boss!'), 'success');
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={mode === 'signup' ? hook.title : TITLES[mode]}>
      {mode === 'signup' ? (
        <div className="mb-4">
          <p className="text-sm text-muted">{hook.text}</p>
          <ul className="mt-3 grid grid-cols-1 gap-1.5 rounded-2xl bg-gold/10 p-3">
            {PERKS.map((p) => (
              <li key={p.text} className="flex items-start gap-2 text-xs font-semibold leading-snug">
                <span className="text-base leading-none">{p.emoji}</span> {p.text}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mb-4 text-sm text-muted">
          {mode === 'reset'
            ? L("Indique l'email de ton compte : nous t'envoyons un lien pour choisir un nouveau mot de passe.", "Enter your account email: we'll send you a link to choose a new password.")
            : L('Content de te revoir, boss !', 'Good to see you again, boss!')}
        </p>
      )}
      <form onSubmit={submit} className="space-y-3">
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="label">{L('Pseudo', 'Username')}</span>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="input" maxLength={24} required autoComplete="nickname" />
            </label>
            <label>
              <span className="label">{L('Ville', 'City')}</span>
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
            <span className="label">{L('Mot de passe', 'Password')}</span>
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
            {L('Mot de passe oublié ?', 'Forgot password?')}
          </button>
        )}
        {mode === 'signup' && (
          <p className="text-[11px] leading-snug text-muted">
            {L('En créant un compte, tu acceptes les', 'By creating an account, you accept the')}{' '}
            <a href={LEGAL_LINKS.terms} target="_blank" rel="noopener" className="font-bold text-gold">
              {L("conditions d'utilisation et de vente", 'terms of use and sale')}
            </a>{' '}
            {L('et la', 'and the')}{' '}
            <a href={LEGAL_LINKS.privacy} target="_blank" rel="noopener" className="font-bold text-gold">
              {L('politique de confidentialité', 'privacy policy')}
            </a>
            .
          </p>
        )}
        {message && <p className={`rounded-2xl p-3 text-sm ${message.error ? 'bg-coral/15 text-coral' : 'bg-emerald/15 text-emerald'}`}>{message.text}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full py-3.5">
          {busy && <Loader2 size={18} className="animate-spin" />}
          {mode === 'reset' ? (
            L('Envoyer le lien', 'Send the link')
          ) : mode === 'signup' ? (
            <>
              {L('Créer mon compte gratuit', 'Create my free account')} · +{SIGNUP_BONUS} <Gift size={16} />
            </>
          ) : (
            TITLES[mode]
          )}
        </button>
      </form>
      <button onClick={() => switchTo(mode === 'signup' ? 'signin' : 'signup')} className="mt-4 w-full text-center text-sm font-bold text-gold">
        {mode === 'signup' ? L("J'ai déjà un compte", 'I already have an account') : L('Créer un nouveau compte', 'Create a new account')}
      </button>
    </Sheet>
  );
}
