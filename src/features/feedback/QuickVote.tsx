import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { L } from '../../i18n';
import { hasVoted, markVoted, sendFeedback, type FeedbackKind } from '../../lib/feedback';

/**
 * Micro-avis « Utile ? 👍 👎 » sous une Leçon Terrain ou à la fin d'une leçon.
 * Un vote par contenu et par appareil ; sur 👎, une phrase facultative pour comprendre pourquoi.
 */
export default function QuickVote({
  id,
  kind,
  question,
  context,
}: {
  /** Identifiant du contenu (ex. « c12:a », « m1l2 ») */
  id: string;
  kind: Extract<FeedbackKind, 'card' | 'lesson'>;
  question: string;
  context: Record<string, unknown>;
}) {
  const [state, setState] = useState<'ask' | 'why' | 'done'>(() => (hasVoted(id) ? 'done' : 'ask'));
  const [why, setWhy] = useState('');

  if (state === 'done') return null;

  const vote = (useful: boolean) => {
    markVoted(id);
    void sendFeedback({ kind, rating: useful ? 1 : 0, context });
    setState(useful ? 'done' : 'why');
  };

  const sendWhy = () => {
    if (why.trim()) void sendFeedback({ kind, rating: 0, message: why, context: { ...context, followUp: true } });
    setState('done');
  };

  if (state === 'why') {
    return (
      <div className="mt-3 space-y-2">
        <p className="text-xs font-bold text-muted">{L("Qu'est-ce qui n'allait pas ? (facultatif)", 'What was wrong? (optional)')}</p>
        <div className="flex gap-2">
          <input
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            maxLength={300}
            placeholder={L('Pas clair, pas réaliste, trop long…', 'Unclear, unrealistic, too long…')}
            className="input flex-1 py-2 text-sm"
          />
          <button onClick={sendWhy} className="btn-ghost shrink-0 px-3 py-2 text-xs">
            {why.trim() ? L('Envoyer', 'Send') : L('Passer', 'Skip')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center justify-between gap-2">
      <span className="text-xs font-semibold text-muted">{question}</span>
      <span className="flex gap-1.5">
        <button onClick={() => vote(true)} className="chip text-muted hover:text-emerald" aria-label={L('Oui, utile', 'Yes, useful')}>
          <ThumbsUp size={14} />
        </button>
        <button onClick={() => vote(false)} className="chip text-muted hover:text-coral" aria-label={L('Non, pas utile', 'No, not useful')}>
          <ThumbsDown size={14} />
        </button>
      </span>
    </div>
  );
}
