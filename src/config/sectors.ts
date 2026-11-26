import { levelInfo } from '../lib/progress';
import type { PackId, PlayerProfile, SectorId } from '../types';

/**
 * SECTEURS D'ACTIVITÉ
 * -------------------
 * Au début de chaque mois, le joueur choisit « Boutique de quartier » (toujours disponible)
 * ou un secteur débloqué. Les cartes du secteur choisi s'ajoutent au paquet de base.
 *
 * Un secteur se débloque :
 *  - automatiquement en atteignant `unlockLevel`,
 *  - ou plus tôt en payant `coinPrice` KaziCoins,
 *  - ou avec le pack premium `pack`, s'il est défini.
 */
export interface SectorDef {
  id: SectorId;
  name: string;
  emoji: string;
  tagline: string;
  unlockLevel: number;
  coinPrice: number;
  pack?: PackId;
}

export const SECTORS: SectorDef[] = [
  {
    id: 'commerce',
    name: 'Commerce & Distribution',
    emoji: '🛒',
    tagline: 'Dépôt, demi-gros, revendeuses et fournisseurs exigeants.',
    unlockLevel: 2,
    coinPrice: 150,
  },
  {
    id: 'services',
    name: 'Services & Digital',
    emoji: '📱',
    tagline: 'Atelier de réparation, cyber, livraison et vente en ligne.',
    unlockLevel: 4,
    coinPrice: 250,
  },
  {
    id: 'agri',
    name: 'Agri-Business & Transformation',
    emoji: '🌾',
    tagline: 'Récolte, transformation, conservation et circuits de vente.',
    unlockLevel: 6,
    coinPrice: 350,
    pack: 'agri_import',
  },
];

export const sectorUnlockKey = (id: SectorId) => `sector_${id}`;

export function getSector(id: SectorId | null | undefined): SectorDef | undefined {
  return id ? SECTORS.find((s) => s.id === id) : undefined;
}

export function isSectorUnlocked(p: Pick<PlayerProfile, 'xp' | 'coinUnlocks' | 'unlockedPacks'>, id: SectorId): boolean {
  const s = getSector(id);
  if (!s) return false;
  return (
    levelInfo(p.xp).level >= s.unlockLevel ||
    p.coinUnlocks.includes(sectorUnlockKey(id)) ||
    Boolean(s.pack && p.unlockedPacks.includes(s.pack))
  );
}
