import { Bug, Lightbulb, Loader2, MessageCircle, Send, Star, type LucideIcon } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import Sheet from '../../components/Sheet';
import { L } from '../../i18n';
import {
  FEEDBACK_REWARD,
  feedbackRewardAvailable,
  markFeedbackRewarded,
  sendFeedback,
  type FeedbackKind,
} from '../../lib/feedback';
import { onOpenFeedback, type FeedbackRequest } from '../../lib/ui';
import { usePlayer } from '../../state/PlayerContext';

const KINDS: { id: Extract<FeedbackKind, 'idea' | 'bug' | 'other'>; label: string; icon: LucideIcon; placeholder: string }[] = [
  {
    id: 'idea',
    label: L('Une idée', 'An idea'),
    icon: Lightbulb,
    placeholder: L(
      'Ce qui te manque, ce que tu aimerais apprendre, un scénario de ta vraie vie…',
      'What is missing, what you would like to learn, a scenario from your real life…',
    ),
  },
  {
    id: 'bug',
    label: L('Un problème', 'A problem'),
    icon: Bug,
    placeholder: L(
      'Ce qui ne marche pas : sur quel écran, après quelle action, ce que tu voyais…',
      'What is not working: on which screen, after which action, what you saw…',
    ),
  },
  {
    id: 'other',
    label: L('Autre', 'Other'),
    icon: MessageCircle,
    placeholder: L('Dis-nous tout, on lit chaque message.', 'Tell us anything, we read every message.'),
  },
];

/** Formulaire « Donner mon avis » : ouvert depuis les Réglages ou n'importe quel écran via openFeedback(). */
export default function FeedbackSheet() {
  const { reward, notify } = usePlayer();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<(typeof KINDS)[number]['id']>('idea');
  const [stars, setStars] = useState(0);
  const [message, setMessage] = useState('');
  const [context, setContext] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);

  useEffect(
    () =>
      onOpenFeedback((req: FeedbackRequest) => {
        setKind(req.kind ?? 'idea');
        setContext(req.context ?? {});
        setStars(0);
        setMessage('');
        setOpen(true);
      }),
    [],
  );

  const current = KINDS.find((k) => k.id === kind)!;
  const canSend = message.trim().length >= 3 || stars > 0;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    setBusy(true);
    const sent = await sendFeedback({ kind, rating: stars || null, message, context: { screen: 'feedback_form', stars: stars || null, ...context } });
    setBusy(false);
    setOpen(false);
    const bonus = message.trim().length >= 20 && feedbackRewardAvailable();
    if (bonus) {
      reward(0, FEEDBACK_REWARD);
      markFeedbackRewarded();
    }
    notify(
      sent
        ? L(`🙏 Merci ! Ton avis est bien arrivé.${bonus ? ` +${FEEDBACK_REWARD} KaziCoins` : ''}`, `🙏 Thank you! We got your feedback.${bonus ? ` +${FEEDBACK_REWARD} KaziCoins` : ''}`)
        : L(`🙏 Merci ! Ton avis partira dès que tu seras connecté à internet.${bonus ? ` +${FEEDBACK_REWARD} KaziCoins` : ''}`, `🙏 Thank you! Your feedback will be sent as soon as you are online.${bonus ? ` +${FEEDBACK_REWARD} KaziCoins` : ''}`),
      'gold',
    );
  };

  return (
    <Sheet open={open} onClose={() => setOpen(false)} title={L('Donner mon avis', 'Give feedback')}>
      <p className="mb-4 text-sm text-muted">
        {L(
          'KaziBoss est fait pour toi : chaque avis est lu et aide à décider des prochaines améliorations.',
          'KaziBoss is built for you: every message is read and helps decide what to improve next.',
        )}
        {feedbackRewardAvailable() && (
          <b className="text-gold">
            {' '}
            {L(`+${FEEDBACK_REWARD} KaziCoins pour un avis détaillé.`, `+${FEEDBACK_REWARD} KaziCoins for detailed feedback.`)}
          </b>
        )}
      </p>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={L("Type d'avis", 'Feedback type')}>
          {KINDS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={kind === id}
              onClick={() => setKind(id)}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-2.5 text-xs font-bold transition ${
                kind === id ? 'border-gold bg-gold/15 text-ink' : 'border-line bg-surface text-muted hover:text-ink'
              }`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>

        <div>
          <span className="label">{L('Ta note de KaziBoss (facultatif)', 'Your rating of KaziBoss (optional)')}</span>
          <div className="flex gap-1.5" role="radiogroup" aria-label={L('Note sur 5', 'Rating out of 5')}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={stars === n}
                aria-label={`${n}/5`}
                onClick={() => setStars(stars === n ? 0 : n)}
                className="rounded-lg p-1"
              >
                <Star size={28} className={n <= stars ? 'fill-gold text-gold' : 'text-line'} />
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="label">{L('Ton message', 'Your message')}</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            rows={5}
            placeholder={current.placeholder}
            className="input resize-none"
          />
          <span className="mt-1 block text-right text-[11px] text-muted">{message.length}/1000</span>
        </label>

        <button type="submit" disabled={!canSend || busy} className="btn-primary w-full py-3.5">
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />} {L('Envoyer', 'Send')}
        </button>
        <p className="text-center text-[11px] text-muted">
          {L(
            "N'écris pas d'informations personnelles (mot de passe, numéro de carte…).",
            'Do not include personal information (password, card number…).',
          )}
        </p>
      </form>
    </Sheet>
  );
}
