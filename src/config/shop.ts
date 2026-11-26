import type { PackId } from '../types';
import { L, usd } from '../i18n';

/**
 * CONFIGURATION BOUTIQUE
 * ----------------------
 * Les URLs Chariow se règlent dans .env (VITE_CHARIOW_*) ou directement ici.
 * L'email du joueur est ajouté automatiquement en `?email=...`
 * (ou remplace le marqueur `{userEmail}` s'il est présent dans l'URL).
 *
 * ⚠️ Le déblocage d'un pack est écrit côté serveur (webhook Chariow → Supabase,
 * colonne profiles.unlocked_packs). Le client ne peut pas se l'attribuer lui-même.
 */

export const COIN_ITEMS = {
  streakShield: { id: 'streak_shield', name: L('Bouclier de Streak', 'Streak Shield'), description: L('Protège ton streak si tu rates un jour.', 'Protects your streak if you miss a day.'), price: 100, emoji: '🛡️' },
  energyRefill: { id: 'energy_refill', name: L("Recharge d'Énergie", 'Energy Refill'), description: L('+30 énergie pendant une partie.', '+30 energy during a game.'), price: 60, emoji: '⚡' },
  module4: { id: 'module4', name: L('Module 4 : Croissance & Équipe', 'Module 4: Growth & Team'), description: L('Débloque les leçons avancées.', 'Unlocks the advanced lessons.'), price: 400, emoji: '🚀' },
};

export const ENERGY_REFILL_AMOUNT = 30;

/** Cadeau de bienvenue à la création du compte (versé une seule fois, voir PlayerContext) */
export const SIGNUP_BONUS = 100;

/** BONUS DE PARTAGE ET DE PARRAINAGE */
export const SHARE_DAILY_BONUS = 10; // KaziCoins, une fois par jour quand on partage le jeu
export const REFERRAL_BONUS = 100; // pour le parrain (attribué par le serveur, voir schema.sql § 7)
export const REFEREE_BONUS = 50; // pour l'ami invité
export const REFERRAL_XP_THRESHOLD = 150; // XP que l'ami doit atteindre pour débloquer les bonus

export interface PremiumPack {
  id: PackId;
  name: string;
  tagline: string;
  perks: string[];
  price: string;
  emoji: string;
  url: string;
  /** Lien de ressource (pas de déblocage dans l'app) */
  external?: boolean;
  /** Bandeau de mise en avant dans la Boutique (choix éditorial, pas une statistique) */
  badge?: string;
}

export const PREMIUM_PACKS: PremiumPack[] = [
  {
    id: 'agri_import',
    badge: L('⭐ Recommandé · le plus complet', '⭐ Recommended · most complete'),
    name: L('Pack Agri-Business & Import-Export', 'Agri-Business & Import-Export Pack'),
    tagline: L('Remonte la chaîne de valeur, de la récolte au conteneur.', 'Move up the value chain, from harvest to shipping container.'),
    perks: L(
      [
        '6 scénarios exclusifs (récolte, conteneur, douane…)',
        'Secteur « Agri-Business & Transformation » débloqué tout de suite',
        'Module 4 « Croissance & Équipe » inclus',
        'Badge Exportateur',
      ],
      [
        '6 exclusive scenarios (harvest, container, customs…)',
        '“Agri-Business & Processing” sector unlocked right away',
        'Module 4 “Growth & Team” included',
        'Exporter badge',
      ],
    ),
    price: usd(5),
    emoji: '🚢',
    url: import.meta.env.VITE_CHARIOW_AGRI_URL ?? '',
  },
  {
    id: 'unlimited_lives',
    name: L('Pack Vies Illimitées', 'Unlimited Lives Pack'),
    tagline: L('Rejoue sans limite, apprends de chaque faillite.', 'Replay without limits, learn from every bankruptcy.'),
    perks: L(
      ['Secondes chances illimitées et gratuites', 'Plusieurs secondes chances dans le même mois'],
      ['Free, unlimited second chances', 'Several second chances in the same month'],
    ),
    price: usd(3),
    emoji: '❤️‍🔥',
    url: import.meta.env.VITE_CHARIOW_UNLIMITED_URL ?? '',
  },
  {
    id: 'digital_growth',
    name: L('Ressources Réelles — Digital Growth', 'Real-World Resources — Digital Growth'),
    tagline: L('Les modèles Excel automatisés pour ta vraie boutique.', 'Automated Excel templates for your real shop.'),
    perks: L(
      ['Journal de caisse automatisé', 'Calculateur de marge & stock', 'Tableau de bord mensuel'],
      ['Automated cash book', 'Margin & stock calculator', 'Monthly dashboard'],
    ),
    price: usd(10),
    emoji: '📊',
    url: import.meta.env.VITE_CHARIOW_RESOURCES_URL ?? '',
    external: true,
  },
];

export function buildCheckoutUrl(baseUrl: string, email: string): string {
  const e = encodeURIComponent(email);
  if (baseUrl.includes('{userEmail}')) return baseUrl.split('{userEmail}').join(e);
  return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}email=${e}`;
}
