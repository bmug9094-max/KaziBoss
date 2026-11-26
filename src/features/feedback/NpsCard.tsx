import { motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { useState } from 'react';
import { L } from '../../i18n';
import { markNpsAsked, sendFeedback } from '../../lib/feedback';

/**
 * « De 0 à 10, recommanderais-tu KaziBoss à un ami ? » puis « Pourquoi ? ».
 * Affiché en fin de mois, au plus une fois tous les 45 jours (voir npsDue).
 */
export default function NpsCard({ context }: { context: Record<string, unknown> }) {
  const [score, setScore] = useState<number | null>(null);
  const [why, setWhy] = useState('');
  const [done, setDone] = useState(false);

  if (done) {
    return <p className="text-center text-sm font-bold text-emerald">{L('🙏 Merci, ça nous aide beaucoup !', '🙏 Thank you, that helps a lot!')}</p>;
  }

  const dismiss = () => {
    markNpsAsked();
    setDone(true);
  };

  // La note part dès le choix (une seule fois) ; le « pourquoi » est un message à part, facultatif.
  const pick = (n: number) => {
    if (score !== null) return;
    setScore(n);
    markNpsAsked();
    void sendFeedback({ kind: 'nps', rating: n, context });
  };

  const submit = () => {
    if (score !== null && why.trim()) void sendFeedback({ kind: 'other', message: why, context: { ...context, source: 'nps', score } });
    setDone(true);
  };

  const followUp =
    score === null
      ? ''
      : score >= 9
        ? L("Super ! Qu'est-ce que tu aimes le plus ?", 'Great! What do you like most?')
        : score >= 7
          ? L('Merci ! Que faudrait-il pour que tu mettes 10 ?', 'Thanks! What would make it a 10?')
          : L("Merci d'être honnête. Qu'est-ce qui ne va pas ?", 'Thanks for being honest. What is not working?');

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card relative p-4">
      <button onClick={dismiss} className="absolute right-3 top-3 text-muted hover:text-ink" aria-label={L('Plus tard', 'Later')}>
        <X size={16} />
      </button>
      <p className="pr-6 text-sm font-extrabold">
        {L('De 0 à 10, recommanderais-tu KaziBoss à un ami ?', 'From 0 to 10, would you recommend KaziBoss to a friend?')}
      </p>
      <div className="mt-3 grid grid-cols-11 gap-1">
        {Array.from({ length: 11 }, (_, n) => (
          <button
            key={n}
            onClick={() => pick(n)}
            disabled={score !== null && score !== n}
            aria-pressed={score === n}
            className={`rounded-lg py-2 text-xs font-extrabold transition ${
              score === n ? (n >= 9 ? 'bg-emerald text-slate-900' : n >= 7 ? 'bg-gold text-slate-900' : 'bg-coral text-white') : 'bg-surface-2 text-muted hover:text-ink'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted">
        <span>{L('Pas du tout', 'Not at all')}</span>
        <span>{L('Oui, à coup sûr', 'Definitely')}</span>
      </div>
      {score !== null && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-bold text-muted">{followUp}</p>
          <textarea value={why} onChange={(e) => setWhy(e.target.value)} maxLength={1000} rows={3} className="input resize-none text-sm" />
          <button onClick={submit} className="btn-primary w-full py-2.5 text-sm">
            <Send size={15} /> {why.trim() ? L('Envoyer', 'Send') : L('Terminer', 'Done')}
          </button>
        </div>
      )}
    </motion.div>
  );
}
