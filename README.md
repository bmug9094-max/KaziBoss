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
- `unlocked_packs` n'est **jamais** modifiable par le client. Seul le serveur l'écrit (webhook Chariow, fonctions `security definer`).
- `purchases` : journal des achats, lisible uniquement par son propriétaire, écrit uniquement par le webhook.
- `leaderboard` : table publique en lecture seule, alimentée par trigger. Elle n'expose ni l'email, ni la progression, ni les achats.
- Garde-fou anti-triche : l'XP ne peut pas baisser, et ni l'XP ni les KaziCoins ne peuvent faire de bond anormal en une écriture.

Dans Supabase › Authentication › URL Configuration, mets l'URL du site en ligne dans **Site URL** et dans **Redirect URLs** : sinon les liens de confirmation d'email et de mot de passe oublié renvoient vers `localhost`.

## Paiements Chariow

Doc officielle : <https://chariow.dev> (Checkout API, Pulses = webhooks).

```
Joueur ─▶ Edge Function create-checkout ─▶ API Chariow POST /v1/checkout
          (JWT du joueur, custom_metadata = id joueur)        │
                                                              ▼
Joueur paie sur Chariow ─▶ retour sur /?tab=profile&purchase=<pack>
Chariow ─▶ Pulse « successful.sale » ─▶ Edge Function chariow-webhook
          (signature HMAC vérifiée)  ─▶ table purchases + déblocage du pack
```

1. Crée les 3 produits dans Chariow et note leurs identifiants (`prd_…`).
2. Déploie les fonctions et règle les secrets :
   ```bash
   supabase functions deploy create-checkout
   supabase functions deploy chariow-webhook --no-verify-jwt
   supabase secrets set \
     CHARIOW_API_KEY=sk_... \
     CHARIOW_PULSE_SECRET=whsec_... \
     CHARIOW_PRODUCT_AGRI=prd_... CHARIOW_PRODUCT_UNLIMITED=prd_... CHARIOW_PRODUCT_RESOURCES=prd_... \
     APP_URL=https://ton-domaine.com
   ```
3. Dans Chariow › Automations › Pulses, crée un Pulse `successful.sale` vers `https://<projet>.supabase.co/functions/v1/chariow-webhook`, puis copie son « Signing secret » dans `CHARIOW_PULSE_SECRET`.
4. Teste avec « Send test » puis un vrai petit achat. Vérifie la ligne dans la table `purchases`.

Robustesse :
- Chaque livraison est enregistrée une seule fois (`x-pulse-delivery-id` unique), donc les relances de Chariow sont sans risque.
- Si l'acheteur n'a pas encore de compte (ou paie avec un lien direct), l'achat reste `pending`. Il est rattaché automatiquement à la connexion d'un compte au même email **confirmé**, ou via le bouton « Restaurer mes achats ».
- Les liens `VITE_CHARIOW_*_URL` ne servent que de secours (fonction indisponible) et pour acheter les ressources sans compte.

## Mise en ligne

- `vercel.json` (Vercel) et `public/_redirects` + `public/_headers` (Netlify, Cloudflare Pages) sont prêts : réécriture SPA et pas de cache sur `sw.js`.
- Pages légales : `public/legal/cgu-cgv.html` et `public/legal/confidentialite.html`. Ce sont des **modèles** : remplace tous les `[À COMPLÉTER]` avant la mise en ligne.
- Icônes PNG (192, 512, maskable, Apple) dans `public/icons/`, générées à partir des SVG.

## Secteurs et sons

- `src/config/sectors.ts` : 3 secteurs (Commerce & Distribution, Services & Digital, Agri-Business & Transformation). Chacun se débloque à un niveau donné, plus tôt avec des KaziCoins, ou avec le Pack Agri pour le dernier. Le joueur choisit son secteur au début du mois ; les cartes de ce secteur s'ajoutent au paquet de base et sortent plus souvent.
- `src/lib/sound.ts` : sons synthétisés avec la Web Audio API (swipe, tintement, alerte quand une jauge passe sous 20, game over, réussite). Bouton ON/OFF dans la barre du haut, préférence enregistrée dans `localStorage`.

## Inscription, conversion et expérience

- **Écran d'ouverture** : animé en CSS pur dans `index.html`, visible avant même le chargement du JavaScript ; retiré par `src/lib/splash.ts` (animation complète à la 1re ouverture de la session, quasi instantané ensuite ; respecte « réduire les animations »).
- **Inscription** : 100 KaziCoins offerts à la création du compte (`SIGNUP_BONUS`, une seule fois par compte). La feuille d'inscription est globale (`openAuth(raison)` dans `src/lib/ui.ts`) avec une accroche adaptée au contexte (sauvegarde, achat, classement, parrainage). Invitation douce à créer un compte en fin de mois et après une leçon (`maybePromptSave` : 1 fois par jour, 5 fois au maximum).
- **Conversion** : offres contextuelles (Vies Illimitées sur l'écran de faillite, Pack Agri après un mois réussi, sur le secteur verrouillé et le module 4) qui mènent directement à la carte du pack (`goTo('profile', 'pack-…')`). Boutique : pack mis en avant, mention « paiement unique ».
- **Petits écrans** : variante Tailwind `short:` (hauteur ≤ 760 px) qui compacte l'écran de jeu pour garder les boutons de choix visibles sans défiler, testée de 320 à 768 px de large.
- ⚠️ Le service d'email intégré de Supabase est très limité (quelques emails par heure). Pour beaucoup d'inscriptions, configurer un SMTP (Resend, Brevo…) dans Supabase › Authentication › Emails › SMTP Settings.

## Structure

```
src/
  data/gameContent.ts      106 cartes scénario (50 de base + 50 de secteurs + 6 premium), 4 modules, 12 leçons, 56 quiz
  lib/game.ts              moteur de simulation (jauges, ventes du soir, tirage pondéré, analyse de faillite)
  lib/progress.ts          niveaux, streak + bouclier, badges
  lib/sound.ts             effets sonores (Web Audio API, aucun fichier audio)
  state/PlayerContext.tsx  état joueur, persistance locale, synchro Supabase, achats, compte, toasts
  config/shop.ts           prix KaziCoins, packs premium, URLs Chariow de secours
  config/sectors.ts        secteurs déblocables
  config/legal.ts          liens vers les pages légales
  features/play            onglet Jouer (swipe, prévisualisation, Leçon Terrain, game over)
  features/learn           onglet Apprendre (arbre de progression, lecteur de leçon)
  features/tools           calculateur de prix, simulateur de change, journal de caisse
  features/profile         profil, boutique, classement, compte
supabase/schema.sql        tables, triggers, RLS, achats, suppression de compte
supabase/functions/        create-checkout (paiement) et chariow-webhook (déblocage)
public/legal/              CGU/CGV et politique de confidentialité (modèles à compléter)
```

## Règles du jeu

- Départ : 100 $, Stock 50, Réputation 50, Énergie 80, pour 30 jours.
- Chaque soir, le stock se vend selon la réputation (de 1 à 4 points, 3,50 $ le point).
- Une jauge à 0 (ou une trésorerie ≤ 0) mène à un game over pédagogique. Une seconde chance coûte 50 KaziCoins, et elle est illimitée avec le pack Vies Illimitées.
- Équilibrage vérifié par simulation (2 000 parties par cas, novembre 2026) :

  | Stratégie | Boutique | Commerce | Services | Agri |
  |---|---|---|---|---|
  | Attentive (protège ses jauges) | 94 % | 93 % | 87 % | 95 % |
  | Au hasard | 38 % | 45 % | 39 % | 35 % |
  | « Avide de cash » | 2 % | 4 % | 8 % | 6 % |
