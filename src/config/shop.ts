import type { PackId } from '../types';

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
  streakShield: { id: 'streak_shield', name: 'Bouclier de Streak', description: 'Protège ton streak si tu rates un jour.', price: 100, emoji: '🛡️' },
  energyRefill: { id: 'energy_refill', name: "Recharge d'Énergie", description: '+30 énergie pendant une partie.', price: 60, emoji: '⚡' },
  module4: { id: 'module4', name: 'Module 4 : Croissance & Équipe', description: 'Débloque les leçons avancées.', price: 400, emoji: '🚀' },
} as const;

export const ENERGY_REFILL_AMOUNT = 30;

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
}

export const PREMIUM_PACKS: PremiumPack[] = [
  {
    id: 'agri_import',
    name: 'Pack Agri-Business & Import-Export',
    tagline: 'Remonte la chaîne de valeur, de la récolte au conteneur.',
    perks: ['6 scénarios exclusifs (récolte, conteneur, douane…)', 'Module 4 « Croissance & Équipe » inclus', 'Badge Exportateur'],
    price: '4,99 $',
    emoji: '🚢',
    url: import.meta.env.VITE_CHARIOW_AGRI_URL ?? '',
  },
  {
    id: 'unlimited_lives',
    name: 'Pack Vies Illimitées',
    tagline: 'Rejoue sans limite, apprends de chaque faillite.',
    perks: ['Secondes chances illimitées et gratuites', 'Aucune attente entre les parties'],
    price: '2,99 $',
    emoji: '❤️‍🔥',
    url: import.meta.env.VITE_CHARIOW_UNLIMITED_URL ?? '',
  },
  {
    id: 'digital_growth',
    name: 'Ressources Réelles — Digital Growth',
    tagline: 'Les modèles Excel automatisés pour ta vraie boutique.',
    perks: ['Journal de caisse automatisé', 'Calculateur de marge & stock', 'Tableau de bord mensuel'],
    price: '9,99 $',
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
