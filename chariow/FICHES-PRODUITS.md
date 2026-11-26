# Fiches produits Chariow — KaziBoss

L'API Chariow ne permet pas de créer des produits ([référence API](https://chariow.dev/api-reference/openapi.json) : lecture seule sur `/products`). Il faut les créer **dans le tableau de bord Chariow**. Tout est prêt ci-dessous : copie-colle chaque bloc.

Pour chaque produit :

1. Chariow › Produits › Nouveau produit.
2. Type : **Téléchargeable** (`downloadable`). Il livre le fichier de la colonne « Fichier à joindre », un accès garanti même si Chariow exige un fichier.
3. Tarification : **Paiement unique** (`one_time`), avec le prix indiqué.
4. Image : le visuel `1280x720` (ou `1080x1080` si Chariow demande un format carré).
5. Publie, puis **copie l'identifiant du produit** (`prd_…`) dans le tableau tout en bas.

> Les PDF de bienvenue indiquent l'email de support bmug9094@gmail.com. Pour le changer : modifie `outils/generer_visuels.py` (fonction `welcome_html`), relance `python outils/generer_visuels.py <dossier_sortie> <dossier_temporaire> ../public/icons`, puis copie les PDF dans `livrables/`.

---

## 1. Pack Agri-Business & Import-Export

| Champ | Valeur |
|---|---|
| Nom | KaziBoss · Pack Agri-Business & Import-Export |
| Prix | 5 USD |
| Catégorie | Éducation / Business |
| Fichier à joindre | `livrables/pack-agri-business-bienvenue.pdf` |
| Visuel | `visuels/pack-agri-business-1280x720.png` |
| Secret Supabase | `CHARIOW_PRODUCT_AGRI` |

**Description courte**

Remonte la chaîne de valeur dans KaziBoss : récolte, transformation, conteneur, douane. 6 scénarios exclusifs, un nouveau secteur et le module Croissance & Équipe.

**Description**

Tu maîtrises ta boutique de quartier ? Passe au niveau supérieur.

Ce pack débloque dans l'application KaziBoss :
- **6 scénarios exclusifs** inspirés du terrain : acheter bord champ, stocker en sacs hermétiques, négocier un conteneur, passer la douane…
- **Le secteur « Agri-Business & Transformation »** tout de suite, sans attendre le niveau 6 : 16 dilemmes de plus sur la transformation, le warrantage, la certification, l'export.
- **Le module 4 « Croissance & Équipe »** : recruter et payer, emprunter intelligemment, ouvrir un 2e point de vente.
- **Le badge Exportateur 🚢** sur ton profil.

Activation automatique : achète depuis l'application (onglet Boutique) et ton pack est actif en quelques secondes sur ton compte.

---

## 2. Pack Vies Illimitées

| Champ | Valeur |
|---|---|
| Nom | KaziBoss · Pack Vies Illimitées |
| Prix | 3 USD |
| Catégorie | Éducation / Jeux |
| Fichier à joindre | `livrables/pack-vies-illimitees-bienvenue.pdf` |
| Visuel | `visuels/pack-vies-illimitees-1280x720.png` |
| Secret Supabase | `CHARIOW_PRODUCT_UNLIMITED` |

**Description courte**

Rejoue sans limite dans KaziBoss : chaque faillite devient une leçon, avec des secondes chances gratuites et illimitées.

**Description**

Dans KaziBoss, une jauge à zéro, c'est la faillite. Ce pack te permet de toujours rebondir :
- **Secondes chances gratuites** : plus besoin de dépenser 50 KaziCoins.
- **Illimitées**, même plusieurs fois dans le même mois.
- **L'analyse de faillite à chaque fois**, pour comprendre la décision qui t'a coûté le plus cher.

Et tu soutiens un jeu éducatif conçu pour les entrepreneurs d'Afrique francophone.

Activation automatique : achète depuis l'application (onglet Boutique) et ton pack est actif en quelques secondes sur ton compte.

---

## 3. Ressources Réelles — Digital Growth

| Champ | Valeur |
|---|---|
| Nom | KaziBoss · Digital Growth — Modèles Excel pour ta boutique |
| Prix | 10 USD |
| Catégorie | Business / Modèles |
| Fichiers à joindre | `livrables/KaziBoss-Digital-Growth.xlsx` **et** `livrables/digital-growth-bienvenue.pdf` |
| Visuel | `visuels/digital-growth-1280x720.png` |
| Secret Supabase | `CHARIOW_PRODUCT_RESOURCES` |

**Description courte**

Le fichier Excel prêt à l'emploi pour gérer ta vraie boutique : journal de caisse, marge & stock, tableau de bord mensuel. Tout se calcule automatiquement.

**Description**

Arrête de deviner si ta boutique gagne de l'argent. Un seul fichier, quatre onglets :

- **Paramètres** : ta devise ($, FC, FCFA), ton taux de change, ta caisse de départ.
- **Journal de caisse** : note chaque entrée et sortie, le solde se calcule tout seul. Catégories prêtes (achats, transport, loyer, retraits perso, frais Mobile Money…). Le solde devient rouge s'il passe sous zéro.
- **Marge & Stock** : ton vrai coût de revient (transport et pertes compris), ta marge en %, le prix conseillé pour atteindre ta marge visée, ton prix en monnaie locale, et l'alerte « ⚠ À commander » quand le stock est bas.
- **Tableau de bord** : entrées, sorties et résultat de chaque mois, tes retraits perso, tes dépenses par catégorie et un graphique.

Fonctionne avec Excel, Google Sheets (gratuit, aussi sur téléphone) et LibreOffice. 1 000 lignes de journal et 150 produits prêts à remplir.

Achat possible avec ou sans compte KaziBoss : le fichier est envoyé par Chariow.

---

## Après la création : identifiants à reporter

Produits créés le 25/11/2026 dans la boutique KaziBoss (`store_4tudc29zriva`). Chariow n'accepte que des prix entiers en USD.

| Pack | Identifiant Chariow | Prix | Secret Supabase |
|---|---|---|---|
| Agri-Business & Import-Export | `prd_eiuup4fa` | 5 USD | `CHARIOW_PRODUCT_AGRI` |
| Vies Illimitées | `prd_pvls50k2` | 3 USD | `CHARIOW_PRODUCT_UNLIMITED` |
| Digital Growth | `prd_4fav4pyr` | 10 USD | `CHARIOW_PRODUCT_RESOURCES` |

```bash
supabase secrets set CHARIOW_PRODUCT_AGRI=prd_eiuup4fa CHARIOW_PRODUCT_UNLIMITED=prd_pvls50k2 CHARIOW_PRODUCT_RESOURCES=prd_4fav4pyr
```

**Publiés le 26/11/2026.** Pages publiques (à mettre dans `.env` comme liens de secours) :

```
VITE_CHARIOW_AGRI_URL=https://gcummcji.mychariow.co/prd_eiuup4fa
VITE_CHARIOW_UNLIMITED_URL=https://gcummcji.mychariow.co/prd_pvls50k2
VITE_CHARIOW_RESOURCES_URL=https://gcummcji.mychariow.co/prd_4fav4pyr
```

Liens de secours (facultatif, dans `.env`) : la page publique de chaque produit dans `VITE_CHARIOW_AGRI_URL`, `VITE_CHARIOW_UNLIMITED_URL` et `VITE_CHARIOW_RESOURCES_URL`.
