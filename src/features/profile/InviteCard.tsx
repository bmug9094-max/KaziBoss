import { Copy, Gift, Share2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { REFEREE_BONUS, REFERRAL_BONUS, REFERRAL_XP_THRESHOLD, SHARE_DAILY_BONUS } from '../../config/shop';
import { copyLink, shareUrl } from '../../lib/share';
import { isSupabaseConfigured } from '../../lib/supabase';
import { todayISO } from '../../lib/storage';
import { usePlayer } from '../../state/PlayerContext';

/** Carte « Invite tes amis » : bonus de partage quotidien + parrainage. */
export default function InviteCard({ onSignup }: { onSignup: () => void }) {
  const { profile, user, refCode, shareInvite, referralStats, notify } = usePlayer();
  const [stats, setStats] = useState<{ invited: number; rewarded: number } | null>(null);
  const bonusAvailable = profile.lastShareDate !== todayISO();
  const link = shareUrl(refCode);

  useEffect(() => {
    let alive = true;
    void referralStats().then((s) => alive && setStats(s));
    return () => {
      alive = false;
    };
  }, [referralStats]);

  const copy = async () => {
    notify((await copyLink(link)) ? '🔗 Lien copié !' : 'Copie impossible : partage plutôt le lien.', 'info');
  };

  return (
    <section className="card overflow-hidden">
      <div className="bg-gradient-to-br from-emerald/20 via-transparent to-gold/15 p-4">
        <h2 className="flex items-center gap-2 text-lg font-extrabold">
          <Gift size={20} className="text-emerald" /> Invite tes amis
        </h2>
        <ul className="mt-2 space-y-1 text-xs text-ink/85">
          <li>
            📣 Partage KaziBoss : <b className="text-gold">+{SHARE_DAILY_BONUS} KaziCoins</b> une fois par jour
            {bonusAvailable ? '' : ' (déjà reçu aujourd’hui)'}.
          </li>
          {isSupabaseConfigured && (
            <li>
              🤝 Un ami s'inscrit avec ton lien et atteint {REFERRAL_XP_THRESHOLD} XP : <b className="text-gold">+{REFERRAL_BONUS}</b> pour toi,{' '}
              <b className="text-gold">+{REFEREE_BONUS}</b> pour lui.
            </li>
          )}
        </ul>
      </div>
      <div className="space-y-2 p-4 pt-3">
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <button onClick={() => void shareInvite()} className="btn-emerald py-2.5 text-sm">
            <Share2 size={16} /> Partager le jeu
          </button>
          <button onClick={() => void copy()} className="btn-ghost px-3 py-2.5" aria-label="Copier le lien">
            <Copy size={16} />
          </button>
        </div>
        {user && stats && (
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <Users size={13} /> {stats.invited} ami(s) inscrit(s) avec ton lien · {stats.rewarded} bonus gagné(s)
          </p>
        )}
        {isSupabaseConfigured && !user && (
          <button onClick={onSignup} className="text-xs font-bold text-gold">
            Crée un compte pour obtenir ton lien de parrainage →
          </button>
        )}
      </div>
    </section>
  );
}
