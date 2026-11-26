import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { levelInfo } from '../../lib/progress';
import { supabase, type LeaderboardRow } from '../../lib/supabase';
import { usePlayer } from '../../state/PlayerContext';
import { L, LOCALE } from '../../i18n';

/** Classement fictif affiché en mode Démo locale */
const DEMO: Omit<LeaderboardRow, 'level'>[] = [
  { user_id: 'd1', username: 'MamaBizness', city: 'Kinshasa', xp: 2450, streak: 21 },
  { user_id: 'd2', username: 'Koffi_Trade', city: 'Abidjan', xp: 1980, streak: 14 },
  { user_id: 'd3', username: 'Aminata.S', city: 'Dakar', xp: 1630, streak: 9 },
  { user_id: 'd4', username: 'Lubumbashi_Boss', city: 'Lubumbashi', xp: 1210, streak: 6 },
  { user_id: 'd5', username: 'Ngozi_Shop', city: 'Douala', xp: 860, streak: 4 },
  { user_id: 'd6', username: 'Patou243', city: 'Goma', xp: 420, streak: 2 },
];

export default function Leaderboard({ onSignup }: { onSignup: () => void }) {
  const { profile, user } = usePlayer();
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!supabase || !user) return;
    let cancelled = false;
    supabase
      .from('leaderboard')
      .select('user_id, username, city, xp, streak, level')
      .order('xp', { ascending: false })
      .limit(50)
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) setError(true);
        else setRows((data ?? []) as LeaderboardRow[]);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const demo = !user;
  const list: LeaderboardRow[] = demo
    ? [...DEMO, { user_id: 'me', username: `${profile.username} ${L('(toi)', '(you)')}`, city: profile.city, xp: profile.xp, streak: profile.streak }]
        .sort((a, b) => b.xp - a.xp)
        .map((r) => ({ ...r, level: levelInfo(r.xp).level }))
    : (rows ?? []);

  return (
    <section className="card p-4">
      <h2 className="flex items-center gap-2 font-extrabold">
        <Trophy size={18} className="text-gold" /> {L('Classement', 'Leaderboard')} {demo && <span className="chip text-muted">{L('démo', 'demo')}</span>}
      </h2>
      {error && <p className="mt-2 text-sm text-coral">{L('Classement indisponible pour le moment.', 'Leaderboard unavailable right now.')}</p>}
      {!demo && !rows && !error && <p className="mt-2 text-sm text-muted">{L('Chargement…', 'Loading…')}</p>}
      <ol className="mt-3 space-y-1.5">
        {list.slice(0, 10).map((r, i) => {
          const me = r.user_id === 'me' || r.user_id === user?.id;
          return (
            <li key={r.user_id} className={`flex items-center gap-3 rounded-2xl px-3 py-2 ${me ? 'bg-gold/15 ring-1 ring-gold/50' : 'bg-surface-2/50'}`}>
              <span className={`w-6 text-center font-extrabold ${i < 3 ? 'text-gold' : 'text-muted'}`}>{i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">{r.username}</span>
                <span className="block truncate text-[11px] text-muted">
                  {r.city || '—'} · {L('Niv.', 'Lvl')} {r.level} · 🔥 {r.streak}
                </span>
              </span>
              <span className="text-sm font-extrabold text-gold">{r.xp.toLocaleString(LOCALE)} XP</span>
            </li>
          );
        })}
      </ol>
      {demo && (
        <button onClick={onSignup} className="btn-ghost mt-3 w-full text-xs">
          {L('Crée un compte pour apparaître dans le vrai classement', 'Create an account to appear on the real leaderboard')}
        </button>
      )}
    </section>
  );
}
