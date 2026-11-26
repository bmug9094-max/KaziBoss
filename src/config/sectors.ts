import { levelInfo } from '../lib/progress';
import type { PackId, PlayerProfile, SectorId } from '../types';
import { L } from '../i18n';

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
    name: L('Commerce & Distribution', 'Trade & Distribution'),
    emoji: '🛒',
    tagline: L('Dépôt, demi-gros, revendeuses et fournisseurs exigeants.', 'Depot, semi-wholesale, resellers and demanding suppliers.'),
    unlockLevel: 2,
    coinPrice: 150,
  },
  {
    id: 'services',
    name: L('Services & Digital', 'Services & Digital'),
    emoji: '📱',
    tagline: L('Atelier de réparation, cyber, livraison et vente en ligne.', 'Repair shop, cyber café, delivery and online sales.'),
    unlockLevel: 4,
    coinPrice: 250,
  },
  {
    id: 'agri',
    name: L('Agri-Business & Transformation', 'Agri-Business & Processing'),
    emoji: '🌾',
    tagline: L('Récolte, transformation, conservation et circuits de vente.', 'Harvest, processing, storage and sales channels.'),
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
