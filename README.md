# KaziBoss 👑

PWA gamifiée d'entrepreneuriat et de gestion financière terrain pour l'Afrique francophone (RDC, Afrique de l'Ouest et Centrale). Le principe : une simulation de décisions façon Reigns, un parcours de leçons façon Duolingo, et de vrais outils de gestion.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # vérification TypeScript (tsc -b) + build de production + service worker
npm run preview    # tester la version installable / hors-ligne
```

L'application fonctionne **immédiatement en mode Invité / Démo locale** : tout est stocké dans `localStorage`, sans aucune configuration.

## Connecter Supabase (optionnel)

1. Crée un projet Supabase, puis exécute `supabase/schema.sql` dans le SQL Editor.
2. Copie `.env.example` en `.env` et renseigne `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.
3. Relance `npm run dev`. Le bouton « Créer un compte » apparaît, la progression est synchronisée et le vrai classement s'affiche.

Sécurité (RLS) :
- `profiles` : chaque joueur lit et modifie uniquement sa propre ligne, et seulement certaines colonnes (droits par colonne).
- `unlocked_packs` n'est **jamais** modifiable par le client. Seul le serveur l'écrit, via `public.grant_pack(email, pack)` appelée avec la clé `service_role`.
- `leaderboard` : table publique en lecture seule, alimentée par trigger. Elle n'expose ni l'email, ni la progression, ni les achats.
- Garde-fou anti-triche : l'XP ne peut pas baisser, et ni l'XP ni les KaziCoins ne peuvent faire de bond anormal en une écriture.

## Paiements Chariow

Renseigne `VITE_CHARIOW_AGRI_URL`, `VITE_CHARIOW_UNLIMITED_URL` et `VITE_CHARIOW_RESOURCES_URL`. L'email du joueur est ajouté en `?email=…`. Tu peux aussi placer `{userEmail}` dans l'URL pour choisir l'endroit exact. Pour activer un pack après paiement, branche un webhook Chariow sur une Edge Function Supabase. Celle-ci vérifie la signature, puis appelle `grant_pack`. Au retour sur l'onglet, l'app relit automatiquement les packs.

## Structure

```
src/
  data/gameContent.ts      56 cartes scénario (50 + 6 premium), 4 modules, 12 leçons, 36 quiz
  lib/game.ts              moteur de simulation (jauges, ventes du soir, tirage pondéré, analyse de faillite)
  lib/progress.ts          niveaux, streak + bouclier, badges
  state/PlayerContext.tsx  état joueur, persistance locale, synchro Supabase, toasts
  config/shop.ts           prix KaziCoins, packs premium, URLs Chariow
  features/play            onglet Jouer (swipe, prévisualisation, Leçon Terrain, game over)
  features/learn           onglet Apprendre (arbre de progression, lecteur de leçon)
  features/tools           calculateur de prix, simulateur de change, journal de caisse
  features/profile         profil, boutique, classement, compte
supabase/schema.sql        tables, triggers, RLS
```

## Règles du jeu

- Départ : 100 $, Stock 50, Réputation 50, Énergie 80, pour 30 jours.
- Chaque soir, le stock se vend selon la réputation (de 1 à 4 points, 3,50 $ le point).
- Une jauge à 0 (ou une trésorerie ≤ 0) mène à un game over pédagogique. Une seconde chance coûte 50 KaziCoins, et elle est illimitée avec le pack Vies Illimitées.
- Équilibrage vérifié par simulation sur 2 000 parties : un joueur attentif réussit environ 83 % des mois, un joueur au hasard environ 40 %, un joueur « avide de cash » environ 3 %.
