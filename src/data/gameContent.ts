import type { LearningModule, ScenarioCard } from '../types';

/**
 * CONTENU KAZIBOSS
 * ----------------
 * Repères économiques utilisés (ordres de grandeur réalistes, à ajuster) :
 *  - 1 USD ≈ 2 800 – 2 950 FC (franc congolais) ; 1 USD ≈ 560 – 610 FCFA.
 *  - 1 point de Stock ≈ 2 $ de marchandises au prix d'achat ; il se revend ≈ 3 $.
 *  - Chaque jour, la boutique écoule 2 à 6 points de stock selon ta réputation.
 */

export const SCENARIO_CARDS: ScenarioCard[] = [
  // ───────────────────────── STOCK ─────────────────────────
  {
    id: 'c01',
    category: 'stock',
    character: 'Maman Nadine',
    role: 'Grossiste au marché Gambela',
    avatar: '👩🏾‍💼',
    title: 'Le lot de sucre à prix cassé',
    text: "« Mon fils, 50 sacs de sucre de 1 kg pour 60 $ au lieu de 80 $. Mais c'est aujourd'hui seulement ! » Ta caisse contient tout juste de quoi payer.",
    a: {
      label: 'Acheter tout le lot',
      outcome: 'Stock plein à craquer… mais ta caisse est presque vide pour la semaine.',
      effects: { cash: -60, stock: 28, energy: -4 },
      xp: 10,
      lesson:
        "Acheter en gros baisse le coût unitaire mais immobilise ta trésorerie. Ne mets jamais plus de 50 à 60 % de ta caisse dans un seul achat, même très rentable.",
    },
    b: {
      label: 'Prendre seulement la moitié',
      outcome: 'Tu paies un peu plus cher le kilo, mais tu gardes de quoi réagir.',
      effects: { cash: -32, stock: 14, energy: -2 },
      xp: 15,
      lesson:
        "Acheter par tranches garde de la liquidité pour les imprévus. Une remise ne vaut rien si elle te met en rupture de cash trois jours plus tard.",
    },
  },
  {
    id: 'c02',
    category: 'stock',
    character: 'Toi',
    role: 'Inventaire du samedi',
    avatar: '📦',
    title: 'Produits périmés au fond du rayon',
    text: "En faisant l'inventaire, tu découvres pour 8 $ de biscuits et de lait concentré périmés depuis une semaine.",
    a: {
      label: 'Les jeter et revoir le rangement',
      outcome: 'Perte sèche, mais tes clients voient une boutique propre et sérieuse.',
      effects: { stock: -5, reputation: 5, energy: -2 },
      xp: 15,
      lesson:
        "Applique la règle PEPS (Premier Entré, Premier Sorti) : les anciens produits devant, les nouveaux derrière. Une perte de stock est un coût, mais vendre du périmé détruit ta réputation.",
    },
    b: {
      label: 'Les brader discrètement',
      outcome: "Une cliente tombe malade et le raconte à tout le quartier.",
      effects: { cash: 4, stock: -5, reputation: -14 },
      xp: 5,
      lesson:
        "Ta réputation est ton premier capital : elle se construit en mois et se perd en un jour. Le petit cash récupéré ne compense jamais les clients perdus.",
    },
  },
  {
    id: 'c03',
    category: 'stock',
    character: 'Mama Clarisse',
    role: 'Voisine commerçante',
    avatar: '👩🏿',
    title: 'La rentrée scolaire approche',
    text: "« Dans deux semaines, tous les parents chercheront cahiers, stylos et sacs. Tu devrais en prendre ! » Il faut 40 $ pour un assortiment correct.",
    a: {
      label: 'Investir dans les fournitures',
      outcome: 'Les parents affluent, ta boutique devient le point de référence du quartier.',
      effects: { cash: -40, stock: 24, reputation: 6, energy: -3 },
      xp: 15,
      lesson:
        "Les pics saisonniers (rentrée, fêtes, Ramadan, Noël) se préparent à l'avance. Anticiper la demande te permet d'acheter avant que les grossistes n'augmentent leurs prix.",
    },
    b: {
      label: 'Rester sur tes produits habituels',
      outcome: 'Calme plat pendant que la voisine écoule tout son stock.',
      effects: { reputation: -3, energy: 2 },
      xp: 5,
      lesson:
        "Ne pas suivre la saison, c'est laisser ton chiffre d'affaires au concurrent. Commence petit si tu doutes, mais teste toujours les pics de demande.",
    },
  },
  {
    id: 'c04',
    category: 'stock',
    character: 'Papa Mbuyi',
    role: "Vendeur d'huile de palme",
    avatar: '👨🏿‍🌾',
    title: "L'huile va flamber",
    text: "« En saison sèche, le bidon d'huile prend 20 % chaque année. Achète maintenant ! » Il propose 10 bidons pour 35 $.",
    a: {
      label: 'Stocker avant la hausse',
      outcome: "Trois semaines plus tard, tu vends au nouveau prix avec une belle marge.",
      effects: { cash: -35, stock: 20, energy: -2 },
      xp: 15,
      lesson:
        "Stocker avant une hausse prévisible protège ta marge contre l'inflation. Mais vérifie que le produit se conserve bien et que tu as un endroit sûr et sec.",
    },
    b: {
      label: 'Acheter au fil de la demande',
      outcome: 'Tu restes léger en stock mais tes prochains achats coûteront plus cher.',
      effects: { cash: -10, stock: 6 },
      xp: 10,
      lesson:
        "Acheter au fil de l'eau garde ta caisse liquide, au prix d'un coût d'achat qui suit l'inflation. C'est prudent quand tu manques de trésorerie ou d'espace de stockage.",
    },
  },
  {
    id: 'c05',
    category: 'stock',
    character: 'Toi',
    role: 'Analyse du cahier de ventes',
    avatar: '📊',
    title: 'La règle des 80/20',
    text: "En relisant ton cahier, tu remarques que 20 % de tes articles (savon, sucre, crédit téléphonique) font 80 % de tes ventes.",
    a: {
      label: 'Concentrer tes achats sur les produits phares',
      outcome: "Moins de produits qui dorment, plus de rotation, plus de cash.",
      effects: { stock: 8, cash: 10, energy: -2 },
      xp: 20,
      lesson:
        "Un produit qui dort sur l'étagère est de l'argent bloqué. Concentre ton capital sur les articles qui tournent vite et réduis les références lentes.",
    },
    b: {
      label: 'Continuer à tout acheter un peu',
      outcome: 'Tes étagères sont variées… et ta caisse reste tendue.',
      effects: { stock: -4, cash: -6 },
      xp: 5,
      lesson:
        "La variété rassure le commerçant, pas forcément le client. Mesure ce qui se vend vraiment avant de diversifier.",
    },
  },
  {
    id: 'c06',
    category: 'stock',
    character: 'Maman Nadine',
    role: 'Grossiste au marché Gambela',
    avatar: '👩🏾‍💼',
    title: 'Rupture chez la grossiste',
    text: "« Le camion de Matadi est bloqué. Je n'ai plus de savon. Il me reste du savon d'une autre marque, plus cher de 15 %. »",
    a: {
      label: 'Prendre la marque plus chère',
      outcome: "Tu évites la rupture, tes clients fidèles trouvent toujours leur savon.",
      effects: { cash: -22, stock: 10, reputation: 4 },
      xp: 15,
      lesson:
        "La rupture de stock coûte plus cher qu'un achat un peu plus cher : le client qui ne trouve rien va chez le voisin. Diversifie tes fournisseurs pour ne jamais dépendre d'un seul camion.",
    },
    b: {
      label: 'Attendre le camion',
      outcome: "Quatre jours sans savon : plusieurs clients ont changé de boutique.",
      effects: { reputation: -8, stock: -3 },
      xp: 5,
      lesson:
        "Un produit de base absent fait fuir les clients pour tous les autres produits. Garde un stock de sécurité sur tes 5 articles essentiels.",
    },
  },

  // ───────────────────────── CHANGE / DEVISES ─────────────────────────
  {
    id: 'c07',
    category: 'change',
    character: 'Papa Kalala',
    role: 'Cambiste au rond-point Victoire',
    avatar: '💱',
    title: 'Le franc glisse',
    text: "« Le dollar est passé de 2 800 à 2 950 FC en deux semaines ! » Tu achètes en dollars chez le grossiste, mais tes prix en francs n'ont pas bougé.",
    a: {
      label: 'Ajuster tes prix en FC (+5 %)',
      outcome: "Quelques clients râlent, mais ta marge est sauvée.",
      effects: { cash: 14, reputation: -4 },
      xp: 20,
      lesson:
        "Quand tu achètes en USD et vends en FC, chaque baisse du franc grignote ta marge. Indexe tes prix sur le taux du jour et affiche-les clairement pour garder la confiance.",
    },
    b: {
      label: 'Garder les prix pour fidéliser',
      outcome: 'Les clients sont ravis… et tu vends presque à prix coûtant.',
      effects: { cash: -14, reputation: 5 },
      xp: 10,
      lesson:
        "Garder tes prix fidélise, mais tu vends à perte sans le voir. Si tu choisis de ne pas augmenter, fais-le consciemment et pour une durée limitée.",
    },
  },
  {
    id: 'c08',
    category: 'change',
    character: 'M. Lukusa',
    role: 'Fournisseur de boissons',
    avatar: '🧑🏿‍💼',
    title: 'Payé en dollars, vendu en francs',
    text: "Ton fournisseur exige 50 $ en billets verts dans 10 jours. Tes clients paient en francs et le cambiste prend sa marge à chaque change.",
    a: {
      label: 'Convertir un peu chaque soir',
      outcome: 'Le jour J, tu as tes dollars, à un taux moyen correct.',
      effects: { cash: -2, energy: -3 },
      xp: 20,
      lesson:
        "Convertir progressivement lisse le risque de change : tu obtiens un taux moyen au lieu de subir le pire taux d'un seul jour. Garde la part de ta recette qui sert à racheter du stock en devise forte.",
    },
    b: {
      label: 'Tout changer le jour du paiement',
      outcome: 'Mauvaise surprise : le taux a bondi la veille.',
      effects: { cash: -12, energy: -2 },
      xp: 10,
      lesson:
        "Attendre le dernier jour pour changer, c'est parier sur le taux. Dans une économie dollarisée, protège la valeur de ta recette dès qu'elle rentre.",
    },
  },
  {
    id: 'c09',
    category: 'change',
    character: 'Un client pressé',
    role: 'Chauffeur de taxi-bus',
    avatar: '🚐',
    title: 'Le billet abîmé',
    text: "Il veut payer 20 $ de marchandises avec un billet de 20 $ légèrement déchiré. Les cambistes ne le reprennent qu'à 15 $.",
    a: {
      label: 'Refuser poliment le billet',
      outcome: "Il paie en francs, un peu vexé, mais il paie.",
      effects: { cash: 18, stock: -6, reputation: -2 },
      xp: 15,
      lesson:
        "Un billet abîmé subit une décote réelle sur le marché : l'accepter au prix plein, c'est offrir une remise. Affiche tes règles de paiement pour que le refus ne soit pas personnel.",
    },
    b: {
      label: 'Accepter le billet',
      outcome: 'Le client est content, ta caisse perd 5 $ en silence.',
      effects: { cash: 15, stock: -6, reputation: 3 },
      xp: 5,
      lesson:
        "Tout paiement doit être évalué à sa vraie valeur de revente. Une décote acceptée sans le savoir est une fuite invisible de marge.",
    },
  },
  {
    id: 'c10',
    category: 'change',
    character: 'Tante Béatrice',
    role: 'Épargnante prudente',
    avatar: '👵🏿',
    title: 'Épargner en francs ou en dollars ?',
    text: "Tu as réussi à mettre 20 $ de côté. Tante Béatrice te conseille de les garder en dollars plutôt qu'en francs.",
    a: {
      label: 'Garder ton épargne en USD',
      outcome: "Deux mois plus tard, ton épargne a gardé toute sa valeur.",
      effects: { energy: 5, cash: 2 },
      xp: 15,
      lesson:
        "Dans une économie où la monnaie locale se déprécie, l'épargne longue se garde en devise stable. La monnaie locale sert aux opérations du quotidien, pas à la réserve.",
    },
    b: {
      label: 'Laisser en francs',
      outcome: "Le franc a perdu 4 % : ton épargne a fondu sans que tu ne dépenses rien.",
      effects: { cash: -3 },
      xp: 5,
      lesson:
        "L'inflation est un impôt silencieux sur l'argent qui dort. Compare toujours la valeur de ton épargne en devise forte pour voir sa vraie évolution.",
    },
  },

  // ───────────────────────── CRÉDIT CLIENT ─────────────────────────
  {
    id: 'c11',
    category: 'credit',
    character: 'Mama Esther',
    role: 'Cliente fidèle',
    avatar: '👩🏾',
    title: 'Crédit « jusqu’à la fin du mois »',
    text: "Elle veut 15 $ de marchandises à crédit. Elle est fidèle, mais la dernière fois elle a payé avec trois semaines de retard.",
    a: {
      label: 'Accepter, avec date et signature',
      outcome: 'Elle repart contente. La dette est écrite dans ton cahier.',
      effects: { stock: -7, reputation: 7, cash: 3 },
      xp: 15,
      lesson:
        "Le crédit client est un prêt sans intérêts : il doit être écrit, daté et plafonné. Ne prête jamais plus que ce que tu peux perdre sans fermer.",
    },
    b: {
      label: 'Proposer un petit format au comptant',
      outcome: 'Elle prend moins, mais paie tout de suite.',
      effects: { stock: -3, cash: 8, reputation: -2 },
      xp: 15,
      lesson:
        "Une alternative payée comptant protège ta caisse sans vexer la cliente. Le « non » passe mieux quand il vient avec une solution.",
    },
  },
  {
    id: 'c12',
    category: 'credit',
    character: 'M. Ilunga',
    role: 'Fonctionnaire au ministère',
    avatar: '👨🏿‍💼',
    title: 'La liste des 6 collègues',
    text: "Il propose que 6 collègues prennent leurs courses chez toi et paient tous à la fin du mois. Total estimé : 40 $ de marchandises.",
    a: {
      label: 'Accepter, sans condition',
      outcome: 'Belle affluence… mais aucun paiement avant 30 jours, et deux retards.',
      effects: { stock: -16, reputation: 8, cash: -4 },
      xp: 5,
      lesson:
        "Vendre à crédit, c'est financer la trésorerie de tes clients avec la tienne. Un gros volume à crédit peut te mettre en faillite alors que tu « vends beaucoup ».",
    },
    b: {
      label: "Accepter contre 50 % d'acompte",
      outcome: "Trois collègues acceptent, tu encaisses la moitié tout de suite.",
      effects: { stock: -10, cash: 14, reputation: 3 },
      xp: 20,
      lesson:
        "L'acompte filtre les mauvais payeurs et finance ton réapprovisionnement. Un client sérieux accepte de payer une partie d'avance.",
    },
  },
  {
    id: 'c13',
    category: 'credit',
    character: 'Toi',
    role: 'Le cahier des ardoises',
    avatar: '📒',
    title: '45 $ dorment dans le cahier',
    text: "Tes ardoises clients totalisent 45 $. La moitié date de plus de 30 jours. Ta caisse, elle, est maigre.",
    a: {
      label: 'Faire une tournée de relance',
      outcome: "Tu récupères 22 $ avec des échéanciers clairs. Certains font la tête.",
      effects: { cash: 22, energy: -10, reputation: -2 },
      xp: 20,
      lesson:
        "Une créance de plus de 30 jours a de fortes chances de ne jamais être payée. Relance tôt, poliment, avec une date précise et un petit montant par semaine.",
    },
    b: {
      label: "Attendre qu'ils reviennent",
      outcome: "Personne ne revient. Certains clients évitent même ta rue.",
      effects: { reputation: -3, cash: -2 },
      xp: 5,
      lesson:
        "Un client endetté finit souvent par fuir ta boutique : tu perds l'argent ET le client. Le suivi des ardoises fait partie de la vente.",
    },
  },
  {
    id: 'c14',
    category: 'credit',
    character: 'M. Kabeya',
    role: 'Grossiste en boissons',
    avatar: '🧔🏿',
    title: '30 jours de crédit fournisseur',
    text: "Il te propose 50 $ de casiers de boissons, payables dans 30 jours, avec 5 $ d'acompte. Ou bien 45 $ comptant aujourd'hui.",
    a: {
      label: 'Prendre le crédit fournisseur',
      outcome: "Tu vends les boissons avant même de les avoir payées.",
      effects: { cash: -5, stock: 22, energy: -3 },
      xp: 20,
      lesson:
        "Le crédit fournisseur est une trésorerie gratuite si tu revends avant l'échéance. C'est l'inverse du crédit client : là, c'est l'autre qui te finance.",
    },
    b: {
      label: 'Payer comptant avec la remise',
      outcome: 'Tu économises 5 $, mais ta caisse est à sec.',
      effects: { cash: -45, stock: 22 },
      xp: 10,
      lesson:
        "Une remise pour paiement comptant n'est intéressante que si ta trésorerie le permet. 10 % d'économie ne valent rien si tu ne peux plus payer le loyer.",
    },
  },
  {
    id: 'c15',
    category: 'credit',
    character: 'Agent de crédit',
    role: 'Microfinance du quartier',
    avatar: '🏦',
    title: 'Le prêt de 200 $',
    text: "Une microfinance te propose 200 $ à 4 % par mois sur 6 mois. Tu n'as pas encore de plan précis pour cet argent.",
    a: {
      label: 'Emprunter 80 $ pour un stock précis',
      outcome: "Petit prêt, usage clair : chaque dollar emprunté produit de la marge.",
      effects: { cash: 50, stock: 15, energy: -5 },
      xp: 20,
      lesson:
        "Emprunte pour un usage qui rapporte plus que le coût du crédit (ici 4 %/mois, soit près de 48 %/an). Un prêt sans plan finit souvent dans les dépenses du ménage.",
    },
    b: {
      label: 'Refuser pour le moment',
      outcome: 'Tu continues avec tes propres moyens, plus lentement mais sereinement.',
      effects: { energy: 4 },
      xp: 15,
      lesson:
        "Ne pas emprunter est aussi une décision financière. Commence par bien maîtriser ta rotation de stock : c'est elle qui dira combien tu peux rembourser.",
    },
  },

  // ───────────────────────── ÉNERGIE / ÉLECTRICITÉ ─────────────────────────
  {
    id: 'c16',
    category: 'energie',
    character: 'Le quartier',
    role: 'Délestage',
    avatar: '🔌',
    title: 'Trois jours sans courant',
    text: "Coupure d'électricité depuis deux jours. Tes boissons tiédissent et les clients vont chez le voisin qui a un groupe électrogène.",
    a: {
      label: 'Louer un groupe 3 jours',
      outcome: 'Tu es la seule boutique avec des boissons fraîches de la rue.',
      effects: { cash: -22, reputation: 8, stock: -4, energy: -3 },
      xp: 15,
      lesson:
        "Un coût d'énergie se juge sur ce qu'il protège : stock périssable et clients. Calcule toujours ce que te coûte une panne avant de dire qu'une solution est « trop chère ».",
    },
    b: {
      label: 'Brader les boissons avant perte',
      outcome: "Tu limites la casse, mais la marge du jour est nulle.",
      effects: { cash: 8, stock: -10, reputation: -2 },
      xp: 10,
      lesson:
        "Liquider vite un stock menacé limite la perte : mieux vaut 50 % du prix que 0 %. Mais si les coupures sont fréquentes, il faut une solution durable.",
    },
  },
  {
    id: 'c17',
    category: 'energie',
    character: 'Ton corps',
    role: 'Signal d’alarme',
    avatar: '😮‍💨',
    title: 'Trois semaines sans repos',
    text: "Tu travailles 7 jours sur 7 depuis trois semaines. Tu as des maux de tête et tu fais des erreurs de monnaie.",
    a: {
      label: 'Fermer le dimanche pour te reposer',
      outcome: "Une journée de ventes en moins, mais tu reviens lucide et souriant.",
      effects: { energy: 22, cash: -8 },
      xp: 15,
      lesson:
        "Ton énergie est un actif de l'entreprise, comme le stock. Un patron épuisé fait des erreurs de caisse qui coûtent plus cher qu'un jour de repos.",
    },
    b: {
      label: 'Continuer, la caisse avant tout',
      outcome: "Les erreurs de rendu de monnaie s'accumulent.",
      effects: { energy: -12, cash: 6 },
      xp: 5,
      lesson:
        "La fatigue chronique réduit ta vigilance et ton sourire, donc tes ventes. Planifie le repos comme une dépense obligatoire.",
    },
  },
  {
    id: 'c18',
    category: 'energie',
    character: 'Vendeur Solaire',
    role: 'Kit solaire en paiement mobile',
    avatar: '☀️',
    title: 'Le kit solaire PayGo',
    text: "Un kit solaire (lampes + recharge téléphone) payable 5 $ par semaine par Mobile Money. Tu dépenses 8 $/semaine en bougies et carburant.",
    a: {
      label: 'Prendre le kit solaire',
      outcome: 'Boutique éclairée le soir, recharges de téléphone payantes en bonus.',
      effects: { cash: -5, energy: 8, reputation: 6 },
      xp: 20,
      lesson:
        "Remplacer une dépense récurrente par un équipement moins cher à l'usage est un investissement rentable. Compare toujours le coût mensuel avant/après.",
    },
    b: {
      label: 'Continuer avec bougies et groupe',
      outcome: 'Tu ne t’engages pas, mais tu paies plus chaque semaine.',
      effects: { cash: -8, energy: -4 },
      xp: 5,
      lesson:
        "Les petites dépenses répétées sont les plus dangereuses car on ne les voit pas. Additionne-les sur un mois pour mesurer leur vrai poids.",
    },
  },
  {
    id: 'c19',
    category: 'energie',
    character: 'La saison des pluies',
    role: 'Orage tropical',
    avatar: '🌧️',
    title: 'La rue est inondée',
    text: "Les pluies torrentielles ont inondé ta rue. L'eau commence à entrer et menace les sacs posés au sol.",
    a: {
      label: 'Acheter palettes et étagères',
      outcome: 'Ton stock est sauvé et ta boutique paraît mieux rangée.',
      effects: { cash: -14, reputation: 3, energy: -4 },
      xp: 15,
      lesson:
        "Protéger son stock est une assurance que tu paies une seule fois. Rien ne doit être posé à même le sol dans une zone inondable.",
    },
    b: {
      label: 'Attendre que ça passe',
      outcome: 'Sacs de farine et de riz gâtés : perte importante.',
      effects: { stock: -16, energy: -3 },
      xp: 5,
      lesson:
        "Un risque connu et répété n'est pas de la malchance : c'est une dépense à prévoir. Identifie les risques de ta zone et prépare-toi avant la saison.",
    },
  },

  // ───────────────────────── FOURNISSEURS ─────────────────────────
  {
    id: 'c20',
    category: 'fournisseur',
    character: 'M. Tshibangu',
    role: 'Fournisseur de farine',
    avatar: '👨🏿‍🍳',
    title: '10 % de remise pour 3 livraisons',
    text: "« Paie-moi d'avance trois livraisons et je te fais 10 % de remise. » Cela représente 45 $ aujourd'hui.",
    a: {
      label: "Payer d'avance",
      outcome: 'Bonne remise, mais ta trésorerie est bloquée chez lui pendant un mois.',
      effects: { cash: -45, stock: 24 },
      xp: 10,
      lesson:
        "Payer d'avance, c'est prêter ton argent au fournisseur. Ne le fais qu'avec un partenaire de confiance et si ta caisse garde au moins une semaine de dépenses.",
    },
    b: {
      label: 'Négocier 5 % au paiement à la livraison',
      outcome: 'Il accepte après discussion. Tu gardes ton cash.',
      effects: { cash: -15, stock: 10, energy: -5 },
      xp: 20,
      lesson:
        "Une négociation réussie équilibre prix ET délais de paiement. Une petite remise sans risque vaut souvent mieux qu'une grosse remise qui t'immobilise.",
    },
  },
  {
    id: 'c21',
    category: 'fournisseur',
    character: 'Abdoul',
    role: 'Intermédiaire import depuis Kampala',
    avatar: '🧕🏿',
    title: 'Produits 30 % moins chers… payés d’avance',
    text: "Il propose des produits 30 % moins chers, livrés dans 3 semaines, avec paiement 100 % d'avance. Tu ne l'as jamais testé.",
    a: {
      label: 'Tester avec une petite commande',
      outcome: "Livraison partielle mais honnête : tu sais maintenant à qui tu as affaire.",
      effects: { cash: -18, stock: 11, energy: -3 },
      xp: 20,
      lesson:
        "Avec un nouveau fournisseur, teste toujours petit avant de t'engager gros. Le vrai coût inclut le risque de ne jamais être livré.",
    },
    b: {
      label: 'Tout commander pour 60 $',
      outcome: "Seule la moitié arrive. L'intermédiaire ne répond plus.",
      effects: { cash: -60, stock: 18, energy: -6 },
      xp: 5,
      lesson:
        "Un prix trop beau avec 100 % d'avance concentre tout le risque sur toi. Ne mets jamais en jeu plus que ce que tu peux perdre sur un partenaire inconnu.",
    },
  },
  {
    id: 'c22',
    category: 'fournisseur',
    character: 'Le livreur',
    role: 'Camion de livraison',
    avatar: '🚚',
    title: '10 cartons livrés, 12 facturés',
    text: "Le livreur est pressé : « Signe vite, j'ai dix boutiques à faire ! » Tu comptes rapidement : il n'y a que 10 cartons sur les 12 facturés.",
    a: {
      label: 'Compter et corriger le bon',
      outcome: 'Il soupire, mais corrige la facture. Tu ne paies que ce que tu reçois.',
      effects: { cash: 8, energy: -3 },
      xp: 20,
      lesson:
        "On ne signe jamais un bon de livraison sans compter. Ta signature vaut acceptation : après, aucune réclamation n'est possible.",
    },
    b: {
      label: 'Signer sans compter',
      outcome: 'Tu as payé deux cartons fantômes.',
      effects: { cash: -8 },
      xp: 5,
      lesson:
        "La pression du temps est la technique favorite pour faire passer des erreurs. Contrôler la réception, c'est protéger ta marge.",
    },
  },
  {
    id: 'c23',
    category: 'fournisseur',
    character: 'Les transporteurs',
    role: 'Pénurie de carburant',
    avatar: '⛽',
    title: 'Le prix de la course double',
    text: "Pénurie de carburant : les taxis-motos doublent le prix pour ramener ta marchandise du marché. 15 $ au lieu de 7 $.",
    a: {
      label: 'Mutualiser avec 3 voisines',
      outcome: 'Une seule course pour quatre boutiques : chacune paie 4 $.',
      effects: { cash: -4, stock: 10, energy: -4, reputation: 3 },
      xp: 20,
      lesson:
        "Mutualiser les coûts logistiques entre commerçants réduit fortement ton coût de revient. La coopération entre voisins est un avantage compétitif.",
    },
    b: {
      label: 'Payer le prix fort seul',
      outcome: 'Ta marchandise arrive, mais ta marge sur ce lot est presque nulle.',
      effects: { cash: -15, stock: 10 },
      xp: 10,
      lesson:
        "Le transport fait partie du coût de revient : s'il double, ton prix de vente doit être revu. Intègre-le toujours dans ton calcul de marge.",
    },
  },
  {
    id: 'c24',
    category: 'fournisseur',
    character: 'Maman Nadine',
    role: 'Grossiste au marché Gambela',
    avatar: '👩🏾‍💼',
    title: 'Une relation de confiance',
    text: "Depuis des mois, tu paies Maman Nadine toujours à l'heure. Elle te propose d'être livrée en priorité en échange d'achats réguliers chaque lundi.",
    a: {
      label: 'Accepter un rendez-vous fixe',
      outcome: "Tu n'es plus jamais en rupture et elle te fait des prix d'amie.",
      effects: { stock: 14, cash: -20, reputation: 4, energy: 3 },
      xp: 20,
      lesson:
        "La régularité de paiement est ta meilleure monnaie de négociation. Un fournisseur qui te fait confiance devient un partenaire qui t'aide en période difficile.",
    },
    b: {
      label: 'Garder ta liberté totale',
      outcome: "Tu restes libre, mais sans priorité lors des pénuries.",
      effects: { energy: -2 },
      xp: 10,
      lesson:
        "La flexibilité a un prix : en cas de pénurie, les clients réguliers passent avant. Construis au moins une relation fournisseur solide.",
    },
  },

  // ───────────────────────── MARKETING LOCAL ─────────────────────────
  {
    id: 'c25',
    category: 'marketing',
    character: 'Ton neveu Junior',
    role: 'Étudiant, fan de réseaux sociaux',
    avatar: '🧑🏿‍💻',
    title: 'Le catalogue WhatsApp',
    text: "« Tonton/Tantine, je te fais un catalogue WhatsApp Business et des statuts chaque jour ! Ça te prendra 30 minutes par jour pour répondre. »",
    a: {
      label: 'Lancer le catalogue',
      outcome: 'Des commandes arrivent par WhatsApp, même de la rue d’à côté.',
      effects: { energy: -8, reputation: 10, cash: 9, stock: -4 },
      xp: 20,
      lesson:
        "WhatsApp Business est la vitrine gratuite la plus puissante en Afrique. La régularité (un statut par jour) compte plus que la perfection des photos.",
    },
    b: {
      label: 'Pas le temps pour ça',
      outcome: 'Tu gardes ton énergie, mais ta visibilité stagne.',
      effects: { energy: 3, reputation: -2 },
      xp: 5,
      lesson:
        "Ne pas communiquer, c'est laisser les clients découvrir tes concurrents en premier. Délègue la communication si tu manques de temps.",
    },
  },
  {
    id: 'c26',
    category: 'marketing',
    character: 'Le pasteur Matondo',
    role: 'Organisateur d’un mariage',
    avatar: '💒',
    title: 'Un mariage de 300 invités',
    text: "L'église voisine organise un grand mariage et cherche un fournisseur de boissons. Il faudra livrer samedi, beaucoup de travail.",
    a: {
      label: 'Proposer un forfait avec remise volume',
      outcome: 'Grosse vente, tout le quartier parle de ton service.',
      effects: { stock: -20, cash: 58, energy: -12, reputation: 8 },
      xp: 20,
      lesson:
        "Une remise sur volume reste rentable si le coût unitaire baisse plus que le prix. Les événements (mariages, deuils, baptêmes) sont des marchés à démarcher activement.",
    },
    b: {
      label: 'Laisser passer, trop risqué',
      outcome: 'Un concurrent décroche le contrat.',
      effects: { energy: 2 },
      xp: 5,
      lesson:
        "Refuser une grosse commande est parfois sage, mais vérifie d'abord si ton stock et tes forces le permettent. Les opportunités se préparent par des réserves.",
    },
  },
  {
    id: 'c27',
    category: 'marketing',
    character: 'Radio Kintambo FM',
    role: 'Commercial radio',
    avatar: '📻',
    title: 'Un spot radio à 20 $',
    text: "La radio locale propose un spot de 15 secondes pour 20 $ par semaine. Ou bien tu peux lancer une offre de parrainage gratuite.",
    a: {
      label: 'Acheter le spot radio',
      outcome: "Quelques nouveaux clients, difficile de savoir si ça a remboursé le spot.",
      effects: { cash: -8, stock: -6, reputation: 6 },
      xp: 10,
      lesson:
        "Une dépense marketing doit être mesurable : demande aux nouveaux clients comment ils t'ont connu. Sans mesure, tu ne sais pas si tu investis ou si tu gaspilles.",
    },
    b: {
      label: 'Lancer un parrainage',
      outcome: "« Ramène un ami, reçois un sachet d'eau » : effet bouche-à-oreille immédiat.",
      effects: { cash: 4, stock: -5, reputation: 8 },
      xp: 20,
      lesson:
        "Le bouche-à-oreille est le canal le plus crédible et le moins cher. Récompense les clients qui t'amènent des clients.",
    },
  },
  {
    id: 'c28',
    category: 'marketing',
    character: 'Gloire',
    role: 'Influenceuse TikTok de Kin',
    avatar: '🤳🏾',
    title: 'Une vidéo contre 3 produits',
    text: "Une créatrice TikTok locale (20 000 abonnés) propose une vidéo dans ta boutique contre 3 produits gratuits.",
    a: {
      label: 'Accepter le partenariat',
      outcome: 'La vidéo tourne dans le quartier, des jeunes viennent te voir.',
      effects: { stock: -4, reputation: 12, energy: -3 },
      xp: 20,
      lesson:
        "Un partenariat payé en produits coûte ton prix d'achat, pas ton prix de vente. Choisis des créateurs dont l'audience est vraiment locale.",
    },
    b: {
      label: 'Refuser poliment',
      outcome: 'Rien ne change.',
      effects: {},
      xp: 5,
      lesson:
        "Le refus est sans risque, mais aussi sans gain. Les petits tests marketing peu coûteux méritent d'être essayés.",
    },
  },
  {
    id: 'c29',
    category: 'marketing',
    character: 'Les clients',
    role: 'Fêtes de fin d’année',
    avatar: '🎁',
    title: 'Les paniers garnis',
    text: "Les fêtes approchent. Plusieurs clients demandent des paniers cadeaux tout prêts pour leur famille et leurs collègues.",
    a: {
      label: 'Créer des paniers à 10 $',
      outcome: "Les paniers partent comme des petits pains, avec une marge supérieure.",
      effects: { stock: -15, cash: 38, energy: -8, reputation: 4 },
      xp: 20,
      lesson:
        "Regrouper des produits en « offre » augmente le panier moyen et la marge. Le client paie aussi pour le gain de temps.",
    },
    b: {
      label: 'Vendre normalement',
      outcome: 'Ventes correctes, sans plus.',
      effects: { stock: -5, cash: 14 },
      xp: 10,
      lesson:
        "Vendre à l'unité est simple, mais tu laisses de la valeur sur la table. Écoute ce que les clients demandent : c'est ta meilleure étude de marché.",
    },
  },

  // ───────────────────────── CAISSE PERSO / PRO ─────────────────────────
  {
    id: 'c30',
    category: 'caisse',
    character: 'Ta fille Grâce',
    role: 'Élève de 6e',
    avatar: '👧🏿',
    title: 'Les frais scolaires de demain',
    text: "Les frais de scolarité sont dus demain : 20 $. La caisse de la boutique est juste là, pleine de la recette du jour.",
    a: {
      label: 'Prendre dans la caisse sans noter',
      outcome: "Le lendemain, il te manque de quoi réapprovisionner le sucre.",
      effects: { cash: -20, stock: -4 },
      xp: 5,
      lesson:
        "Mélanger caisse perso et pro rend tes comptes illisibles : tu crois gagner de l'argent alors que tu manges ton capital. Verse-toi un salaire fixe au lieu de puiser librement.",
    },
    b: {
      label: 'Te verser ton salaire noté et réduire le reste',
      outcome: 'Tu notes le retrait comme « salaire » et réorganises tes dépenses perso.',
      effects: { cash: -20, energy: -2 },
      xp: 20,
      lesson:
        "Un retrait noté et prévu reste sous contrôle : c'est la différence entre se payer et se servir. Fixe ton salaire selon ce que la boutique peut supporter, pas selon tes besoins du jour.",
    },
  },
  {
    id: 'c31',
    category: 'caisse',
    character: 'Toi',
    role: 'Comptage du soir',
    avatar: '🧮',
    title: '22 $ de trop dans la caisse',
    text: "Ce soir, ta caisse contient 22 $ de plus que les ventes notées. Tu ne sais pas d'où vient la différence.",
    a: {
      label: "Chercher l'erreur dans le cahier",
      outcome: "Tu trouves : un client a payé une ardoise que tu as oublié de rayer.",
      effects: { energy: -5, reputation: 3 },
      xp: 20,
      lesson:
        "Un écart de caisse, même positif, révèle un problème d'enregistrement. Une caisse juste chaque soir est la base de toute gestion.",
    },
    b: {
      label: "C'est un bonus, on ne cherche pas",
      outcome: "Le lendemain, un client revient réclamer sa monnaie… et tu ne peux rien prouver.",
      effects: { reputation: -5, cash: -6 },
      xp: 5,
      lesson:
        "Ce que tu ne comprends pas dans ta caisse finit toujours par te coûter. Note chaque mouvement, même petit.",
    },
  },
  {
    id: 'c32',
    category: 'caisse',
    character: 'Agent Coopec',
    role: "Coopérative d'épargne",
    avatar: '🐖',
    title: 'Un compte séparé pour la boutique',
    text: "La coopérative propose un compte d'épargne au nom de la boutique, accessible par Mobile Money. Tout ton cash dort actuellement sous le matelas.",
    a: {
      label: 'Ouvrir et y virer 10 % par semaine',
      outcome: "Ta réserve de sécurité grandit, à l'abri des vols et des tentations.",
      effects: { cash: -10, energy: 7, reputation: 3 },
      xp: 20,
      lesson:
        "Séparer physiquement l'argent pro de l'argent perso est la façon la plus simple de discipliner sa gestion. La réserve de sécurité doit couvrir au moins un mois de charges fixes.",
    },
    b: {
      label: 'Garder tout en liquide',
      outcome: "Tout est à portée de main… pour toi comme pour les autres.",
      effects: { energy: -4 },
      xp: 5,
      lesson:
        "Le cash à la maison est exposé au vol, aux incendies et aux demandes familiales. L'argent que l'on ne voit pas est l'argent que l'on garde.",
    },
  },
  {
    id: 'c33',
    category: 'caisse',
    character: 'Toi',
    role: 'Bilan de fin de mois',
    avatar: '📈',
    title: 'Est-ce que je gagne vraiment de l’argent ?',
    text: "La caisse se remplit et se vide sans cesse. Tu ne sais pas si ta boutique est réellement rentable.",
    a: {
      label: 'Faire ton premier compte de résultat',
      outcome: "Ventes – achats – charges : tu découvres que le crédit téléphonique ne rapporte presque rien.",
      effects: { energy: -6, cash: 8 },
      xp: 25,
      lesson:
        "Le bénéfice = ventes – coût des marchandises vendues – charges (loyer, transport, salaire). Une caisse pleine ne signifie pas une entreprise rentable.",
    },
    b: {
      label: "Si la caisse est pleine, ça marche",
      outcome: "Une fuite de marge passe inaperçue tout le mois.",
      effects: { cash: -8 },
      xp: 5,
      lesson:
        "La trésorerie n'est pas le bénéfice : une caisse pleine peut cacher des dettes ou du stock non payé. Fais tes comptes au moins une fois par mois.",
    },
  },

  // ───────────────────────── FAMILLE & SOCIAL ─────────────────────────
  {
    id: 'c34',
    category: 'famille',
    character: 'Cousin Jean-Pierre',
    role: 'Arrivé du village',
    avatar: '🧑🏿‍🦱',
    title: 'Une « urgence » à 30 $',
    text: "Ton cousin arrive du village et demande 30 $ pour une urgence. Toute la famille te regarde : « Tu as une boutique, tu as l'argent ! »",
    a: {
      label: 'Donner 30 $ de la caisse',
      outcome: "La famille te félicite, ta boutique manque de stock la semaine suivante.",
      effects: { cash: -30, reputation: 5 },
      xp: 5,
      lesson:
        "La caisse de la boutique n'est pas ton argent de poche : c'est le sang de l'entreprise. Prévois un budget « solidarité familiale » fixe dans ton salaire.",
    },
    b: {
      label: 'Donner 5 $ de ta poche et proposer du travail',
      outcome: "Il aide à la boutique deux jours et repart avec un peu d'argent gagné.",
      effects: { cash: -5, reputation: 2, energy: 5 },
      xp: 20,
      lesson:
        "Aider sans détruire ton business, c'est possible : donne depuis ton budget perso et propose une contrepartie. La solidarité durable passe par une entreprise qui survit.",
    },
  },
  {
    id: 'c35',
    category: 'famille',
    character: 'La famille',
    role: 'Deuil d’un oncle',
    avatar: '🕯️',
    title: 'La contribution au deuil',
    text: "Un oncle est décédé. La famille attend une contribution importante pour la veillée et l'enterrement : 25 $.",
    a: {
      label: 'Contribuer 25 $ de la caisse',
      outcome: "Ton geste est apprécié, mais ta caisse est fragilisée.",
      effects: { cash: -25, reputation: 6, energy: -6 },
      xp: 10,
      lesson:
        "Les événements familiaux sont prévisibles sur une année : crée une réserve dédiée. Sans elle, chaque deuil devient une crise de trésorerie pour la boutique.",
    },
    b: {
      label: 'Donner 10 $ perso et ton temps',
      outcome: "Tu aides à l'organisation et tu fournis l'eau au prix coûtant.",
      effects: { cash: -10, reputation: 5, energy: -8, stock: -3 },
      xp: 20,
      lesson:
        "Ta contribution peut prendre d'autres formes que l'argent : temps, produits à prix coûtant, organisation. Tu honores la famille sans saigner la caisse.",
    },
  },
  {
    id: 'c36',
    category: 'famille',
    character: 'Ta mère',
    role: 'Chef de famille',
    avatar: '👩🏿‍🦳',
    title: 'Employer le petit frère',
    text: "Ta mère insiste pour que tu emploies ton petit frère, qui n'aime pas trop travailler. « C'est la famille ! »",
    a: {
      label: 'Contrat clair et période d’essai',
      outcome: "Avec des règles écrites, il se révèle plutôt bon vendeur.",
      effects: { cash: -4, energy: 4, reputation: 3 },
      xp: 20,
      lesson:
        "Un membre de la famille employé doit avoir les mêmes règles qu'un employé : horaires, salaire, objectifs. L'écrit protège la relation autant que l'entreprise.",
    },
    b: {
      label: "Refuser, mais l'aider autrement",
      outcome: "Ta mère boude un peu, ta caisse reste sous contrôle.",
      effects: { reputation: -3, energy: -2 },
      xp: 15,
      lesson:
        "Dire non à la famille est difficile mais parfois nécessaire. Explique ta décision avec des chiffres : la boutique doit d'abord survivre pour aider tout le monde.",
    },
  },
  {
    id: 'c37',
    category: 'famille',
    character: 'Les mamans du marché',
    role: 'Likelemba (tontine)',
    avatar: '🤝🏿',
    title: 'Ton tour de likelemba',
    text: "Dans ta tontine du marché, tu peux prendre ton tour ce mois-ci (60 $) ou attendre le dernier tour. Tu devras continuer à cotiser 10 $ chaque semaine.",
    a: {
      label: 'Prendre ton tour et acheter du stock',
      outcome: "Ce capital frais te permet d'acheter en gros à meilleur prix.",
      effects: { cash: 30, stock: 14, energy: -3 },
      xp: 20,
      lesson:
        "Prendre tôt dans une tontine, c'est obtenir un crédit sans intérêts. C'est rentable si tu l'investis dans du stock qui tourne vite, pas dans la consommation.",
    },
    b: {
      label: 'Attendre le dernier tour',
      outcome: "Tu cotises sagement : ce sera une belle épargne forcée.",
      effects: { cash: -10, reputation: 4, energy: 3 },
      xp: 15,
      lesson:
        "Prendre en dernier, c'est épargner avec discipline. La tontine est un outil puissant d'épargne et de crédit communautaire, basé sur la confiance.",
    },
  },

  // ───────────────────────── ADMINISTRATION ─────────────────────────
  {
    id: 'c38',
    category: 'admin',
    character: 'Deux agents',
    role: 'Se disant de la commune',
    avatar: '🪪',
    title: 'La taxe sans reçu',
    text: "Deux agents réclament une « taxe de salubrité » de 15 $. Quand tu demandes un reçu, ils disent : « Pas besoin, on se connaît. »",
    a: {
      label: 'Payer pour avoir la paix',
      outcome: "Ils repartent… et reviennent le mois suivant.",
      effects: { cash: -15 },
      xp: 5,
      lesson:
        "Une taxe sans quittance officielle n'est enregistrée nulle part : tu paieras encore. Le paiement informel crée une habitude chez celui qui encaisse.",
    },
    b: {
      label: "Exiger le reçu et l'ordre de mission",
      outcome: "Ils finissent par établir une quittance de 5 $, le vrai montant.",
      effects: { cash: -5, energy: -8, reputation: 3 },
      xp: 20,
      lesson:
        "Exige toujours un reçu officiel et garde tes documents (patente, quittances) dans un classeur à la boutique. Connaître tes obligations réelles te protège des abus.",
    },
  },
  {
    id: 'c39',
    category: 'admin',
    character: 'Un agent des impôts',
    role: 'Conseil amical',
    avatar: '🏛️',
    title: 'Régulariser ta patente',
    text: "Un agent te conseille de régulariser ta patente avant la campagne de contrôle. Coût : 18 $ et une demi-journée de démarches.",
    a: {
      label: 'Régulariser maintenant',
      outcome: "Tu es en règle : lors du contrôle, tu n'as rien à craindre.",
      effects: { cash: -18, reputation: 6, energy: -4 },
      xp: 20,
      lesson:
        "La conformité coûte moins cher que l'amende ou la fermeture. Être en règle te permet aussi d'accéder au crédit et aux gros clients.",
    },
    b: {
      label: 'Attendre et voir',
      outcome: "Le contrôle arrive : amende et discussion stressante.",
      effects: { cash: -12, energy: -8, reputation: -3 },
      xp: 5,
      lesson:
        "Les obligations reportées reviennent avec des pénalités. Intègre tes taxes dans tes charges fixes mensuelles pour ne jamais être surpris.",
    },
  },
  {
    id: 'c40',
    category: 'admin',
    character: 'Le chef de quartier',
    role: 'Autorité locale',
    avatar: '⚽',
    title: 'Sponsoriser le tournoi de foot',
    text: "Le chef de quartier te demande de « parrainer » le tournoi de foot des jeunes avec 10 $.",
    a: {
      label: 'Sponsoriser contre une banderole',
      outcome: 'Ton nom est affiché tout le week-end devant 500 personnes.',
      effects: { cash: -10, reputation: 10, energy: -2 },
      xp: 20,
      lesson:
        "Transforme une contribution sociale en action marketing : demande toujours une contrepartie visible. La bonne relation avec les autorités locales protège aussi ton commerce.",
    },
    b: {
      label: 'Décliner poliment',
      outcome: "Le chef de quartier s'en souviendra.",
      effects: { reputation: -6 },
      xp: 5,
      lesson:
        "Dans un quartier, la réputation sociale compte autant que le prix. Un petit budget « communauté » planifié évite les refus qui coûtent cher.",
    },
  },

  // ───────────────────────── MOBILE MONEY ─────────────────────────
  {
    id: 'c41',
    category: 'mobile-money',
    character: 'Un jeune client',
    role: 'Étudiant',
    avatar: '📱',
    title: 'Payer par M-Pesa ?',
    text: "Un client veut payer 25 $ de marchandises par Mobile Money. Les frais de retrait sont d'environ 2 %.",
    a: {
      label: 'Accepter le paiement mobile',
      outcome: 'Vente conclue, et le client revient avec deux amis.',
      effects: { stock: -8, cash: 24, reputation: 5 },
      xp: 20,
      lesson:
        "Refuser le Mobile Money, c'est refuser des clients. Les frais (≈ 2 %) sont souvent inférieurs au coût du risque de vol ou de faux billets avec le liquide.",
    },
    b: {
      label: 'Cash uniquement',
      outcome: 'Il repart sans rien acheter.',
      effects: { reputation: -6 },
      xp: 5,
      lesson:
        "Chaque moyen de paiement refusé est un frein à la vente. Intègre les frais de transaction dans tes prix plutôt que de refuser.",
    },
  },
  {
    id: 'c42',
    category: 'mobile-money',
    character: 'Un inconnu',
    role: 'Client pressé',
    avatar: '🕵🏿',
    title: 'Le faux SMS de paiement',
    text: "Un client te montre un SMS « Vous avez reçu 50 000 FC ». Il est très pressé et veut partir avec sa marchandise.",
    a: {
      label: 'Vérifier ton solde réel',
      outcome: "Aucun argent reçu : c'était un faux SMS. L'arnaqueur s'enfuit.",
      effects: { energy: -2, reputation: 3 },
      xp: 20,
      lesson:
        "Ne te fie jamais au SMS montré par le client : vérifie ton solde dans ton application ou via le code USSD officiel. La pression du temps est la signature des arnaques.",
    },
    b: {
      label: 'Faire confiance au SMS',
      outcome: "La marchandise est partie, l'argent n'est jamais arrivé.",
      effects: { stock: -10, energy: -4 },
      xp: 5,
      lesson:
        "Les faux SMS de paiement sont l'arnaque la plus courante chez les commerçants. Le paiement n'existe que lorsqu'il apparaît sur TON solde.",
    },
  },
  {
    id: 'c43',
    category: 'mobile-money',
    character: 'Opérateur télécom',
    role: 'Recrutement d’agents',
    avatar: '🏧',
    title: 'Devenir agent Mobile Money',
    text: "Tu peux devenir agent Mobile Money dans ta boutique : commission sur chaque dépôt/retrait, mais il faut immobiliser 40 $ de « float ».",
    a: {
      label: 'Devenir agent',
      outcome: "Plus de passage dans ta boutique, et une commission chaque jour.",
      effects: { cash: -28, reputation: 9, energy: -5 },
      xp: 20,
      lesson:
        "Une activité complémentaire qui amène du trafic augmente aussi tes ventes principales. Le float est de l'argent immobilisé : il doit être compté à part de la caisse.",
    },
    b: {
      label: 'Pas maintenant',
      outcome: 'Tu restes concentré sur ton cœur de métier.',
      effects: { energy: 2 },
      xp: 10,
      lesson:
        "Se diversifier trop tôt peut disperser ton capital et ton attention. Ajoute une activité seulement quand la première est bien maîtrisée.",
    },
  },

  // ───────────────────────── ÉQUIPE ─────────────────────────
  {
    id: 'c44',
    category: 'equipe',
    character: 'Patrick',
    role: 'Ton vendeur',
    avatar: '🧑🏿',
    title: 'Des écarts de caisse',
    text: "Trois soirs de suite, il manque environ 5 $ dans la caisse quand Patrick est seul à la boutique.",
    a: {
      label: 'Instaurer un comptage à deux matin et soir',
      outcome: "Les écarts disparaissent. Patrick sait qu'il est suivi.",
      effects: { cash: 8, energy: -5 },
      xp: 20,
      lesson:
        "Les contrôles réguliers préviennent la fraude mieux que les accusations. Compte la caisse à l'ouverture et à la fermeture, avec signature.",
    },
    b: {
      label: 'Le renvoyer sur-le-champ',
      outcome: "Sans preuve, la rumeur circule et tu dois tenir seul la boutique.",
      effects: { energy: -12, reputation: -4 },
      xp: 5,
      lesson:
        "Une décision sans procédure crée des conflits et te laisse sans aide. Mets d'abord en place des règles claires, puis sanctionne sur des faits.",
    },
  },
  {
    id: 'c45',
    category: 'equipe',
    character: 'Patrick',
    role: 'Ton vendeur',
    avatar: '🧑🏿',
    title: "La demande d'augmentation",
    text: "« Je veux 10 $ de plus par mois, sinon je pars chez le concurrent d'en face. » Il est bon vendeur et connaît tous les clients.",
    a: {
      label: 'Bonus lié aux ventes',
      outcome: "Il accepte 5 $ fixe + un bonus si les ventes augmentent. Il est motivé.",
      effects: { cash: -6, energy: 6, reputation: 3 },
      xp: 20,
      lesson:
        "Un bonus lié aux résultats aligne l'intérêt de l'employé et celui de l'entreprise. Il coûte seulement si la boutique gagne plus.",
    },
    b: {
      label: 'Refuser',
      outcome: "Il part chez le concurrent… avec une partie de tes clients.",
      effects: { energy: -10, reputation: -5 },
      xp: 5,
      lesson:
        "Remplacer un bon employé coûte souvent plus cher que le garder : formation, erreurs, clients perdus. Calcule le coût du départ avant de refuser.",
    },
  },
  {
    id: 'c46',
    category: 'equipe',
    character: 'Ta nièce Divine',
    role: 'Lycéenne en vacances',
    avatar: '👩🏿‍🎓',
    title: 'Une aide pour les vacances',
    text: "Divine veut t'aider à la boutique pendant les vacances « pour apprendre ». Elle ne demande presque rien.",
    a: {
      label: "L'accueillir avec des tâches claires",
      outcome: "Elle range, note les ventes et tu respires enfin.",
      effects: { cash: -5, energy: 12, reputation: 3 },
      xp: 15,
      lesson:
        "Déléguer les tâches simples libère ton temps pour les décisions importantes (achats, négociation). Une petite rémunération rend l'engagement sérieux.",
    },
    b: {
      label: 'Tout faire toi-même',
      outcome: 'Tu gardes le contrôle total, et toute la fatigue.',
      effects: { energy: -6 },
      xp: 5,
      lesson:
        "Vouloir tout contrôler limite la croissance de ton entreprise à ta propre énergie. Apprendre à déléguer est une compétence de patron.",
    },
  },

  // ───────────────────────── CONCURRENCE ─────────────────────────
  {
    id: 'c47',
    category: 'concurrence',
    character: 'Nouveau shop',
    role: 'En face de chez toi',
    avatar: '🏪',
    title: 'Le concurrent casse les prix',
    text: "Un nouveau shop ouvre juste en face avec des prix 10 % plus bas sur les produits de base.",
    a: {
      label: 'Baisser tes prix aussi',
      outcome: "Guerre des prix : les clients restent, ta marge s'effondre.",
      effects: { cash: -12, reputation: 2 },
      xp: 5,
      lesson:
        "Une guerre des prix profite à celui qui a le plus de capital, rarement au petit commerçant. Baisser de 10 % peut effacer la moitié de ta marge.",
    },
    b: {
      label: 'Miser sur le service',
      outcome: "Livraison à domicile, accueil chaleureux, crédit téléphonique : tes fidèles restent.",
      effects: { energy: -6, reputation: 9, cash: 3 },
      xp: 20,
      lesson:
        "Différencie-toi par ce que le concurrent ne peut pas copier facilement : la relation, la proximité, le service. Les clients paient pour la confiance.",
    },
  },
  {
    id: 'c48',
    category: 'concurrence',
    character: 'Le shop d’en face',
    role: 'Concurrent agressif',
    avatar: '😤',
    title: 'Dénigrement sur Facebook',
    text: "Le concurrent publie sur un groupe Facebook du quartier que tes produits sont « de contrebande et périmés ».",
    a: {
      label: 'Répondre calmement avec preuves',
      outcome: "Photos des factures, avis de clients fidèles : la rumeur s'éteint.",
      effects: { energy: -5, reputation: 7 },
      xp: 20,
      lesson:
        "Face à une attaque, la transparence et le calme renforcent ta crédibilité. Garde toujours tes factures d'achat : elles prouvent l'origine de ta marchandise.",
    },
    b: {
      label: 'Attaquer en retour publiquement',
      outcome: "Le conflit devient le spectacle du quartier ; tout le monde perd.",
      effects: { reputation: -8, energy: -6 },
      xp: 5,
      lesson:
        "Une dispute publique abîme les deux réputations. Les clients préfèrent acheter chez celui qui reste professionnel.",
    },
  },

  // ───────────────────────── SÉCURITÉ ─────────────────────────
  {
    id: 'c49',
    category: 'securite',
    character: 'Les voisins',
    role: 'Comité de quartier',
    avatar: '🌙',
    title: 'Vols nocturnes dans le quartier',
    text: "Trois boutiques ont été cambriolées ce mois-ci. Un veilleur de nuit propose ses services pour 15 $ par mois.",
    a: {
      label: 'Engager le veilleur avec 2 voisins',
      outcome: "Partagé à trois, la sécurité te coûte 5 $ et tu dors tranquille.",
      effects: { cash: -5, energy: 8, reputation: 2 },
      xp: 20,
      lesson:
        "La sécurité est une charge fixe à prévoir, pas un luxe. Partager ce coût avec les voisins le rend accessible.",
    },
    b: {
      label: 'Dormir dans la boutique',
      outcome: "Tu économises, mais tes nuits sont courtes et inquiètes.",
      effects: { energy: -15 },
      xp: 5,
      lesson:
        "Économiser sur une charge essentielle en la remplaçant par ta propre fatigue n'est pas une économie. Ton temps et ta santé ont une valeur.",
    },
  },
  {
    id: 'c50',
    category: 'securite',
    character: 'Rumeur du marché',
    role: 'Faux billets',
    avatar: '💵',
    title: 'Des faux billets de 10 $',
    text: "Des faux billets de 10 $ circulent au marché. Un stylo détecteur coûte 3 $.",
    a: {
      label: 'Acheter le stylo détecteur',
      outcome: "Deux jours plus tard, tu bloques un faux billet.",
      effects: { cash: -3, reputation: 2, energy: 2 },
      xp: 20,
      lesson:
        "Un petit outil de contrôle se rembourse dès la première fraude évitée. Forme aussi tes vendeurs à vérifier les billets (filigrane, fil de sécurité).",
    },
    b: {
      label: "Vérifier à l'œil",
      outcome: "Un faux billet passe : 10 $ perdus.",
      effects: { cash: -10 },
      xp: 5,
      lesson:
        "Un risque connu non couvert finit par se réaliser. Le coût de la prévention est presque toujours inférieur au coût de la perte.",
    },
  },

  // ───────────────────────── PACK AGRI-BUSINESS & IMPORT-EXPORT (premium) ─────────────────────────
  {
    id: 'p01',
    pack: 'agri_import',
    category: 'agri',
    character: 'Coopérative de Kikwit',
    role: 'Producteurs de manioc',
    avatar: '🌾',
    title: 'Acheter bord champ',
    text: "Une coopérative du Kwilu vend la farine de manioc 40 % moins cher qu'à Kinshasa. Mais le transport par camion est incertain (routes en saison des pluies).",
    a: {
      label: 'Acheter avec un transporteur assuré',
      outcome: 'Le camion arrive avec 2 jours de retard, mais la marge est excellente.',
      effects: { cash: -40, stock: 28, energy: -6 },
      xp: 25,
      lesson:
        "Acheter à la source augmente fortement la marge, à condition de maîtriser la logistique. Le coût réel = prix d'achat + transport + pertes + délai.",
    },
    b: {
      label: 'Rester chez le grossiste local',
      outcome: 'Pas de surprise, pas de grosse marge.',
      effects: { cash: -20, stock: 10 },
      xp: 10,
      lesson:
        "L'intermédiaire te vend aussi de la sécurité et de la rapidité. Remonter la chaîne de valeur se fait progressivement.",
    },
  },
  {
    id: 'p02',
    pack: 'agri_import',
    category: 'agri',
    character: 'Agronome du projet',
    role: 'Programme post-récolte',
    avatar: '🌽',
    title: 'Les sacs hermétiques',
    text: "Après la récolte, le maïs vaut 30 % de moins. Des sacs hermétiques permettent de le stocker 4 mois sans charançons, pour 6 $ les 10 sacs.",
    a: {
      label: 'Stocker et vendre en soudure',
      outcome: "En période de soudure, tu revends avec une forte plus-value.",
      effects: { cash: -6, stock: 12, energy: -3, reputation: 3 },
      xp: 25,
      lesson:
        "Le prix agricole suit la saison : bas à la récolte, haut en période de soudure. Le stockage de qualité transforme cette saisonnalité en marge.",
    },
    b: {
      label: 'Vendre tout de suite',
      outcome: 'Cash immédiat, mais au plus bas prix de l’année.',
      effects: { cash: 14, stock: -6 },
      xp: 10,
      lesson:
        "Vendre à la récolte est parfois nécessaire pour la trésorerie, mais c'est le moment le moins rentable. Planifie ta trésorerie pour ne pas être obligé de brader.",
    },
  },
  {
    id: 'p03',
    pack: 'agri_import',
    category: 'import',
    character: 'Mme Diallo',
    role: 'Groupeuse de conteneur Dubaï – Matadi',
    avatar: '🚢',
    title: 'Une part de conteneur groupé',
    text: "Tu peux réserver un petit volume dans un conteneur groupé depuis Dubaï : 50 $ pour des produits qui se revendent le double. Arrivée dans 6 semaines.",
    a: {
      label: 'Réserver une petite part',
      outcome: 'Marchandise bien arrivée, marge confortable malgré les frais.',
      effects: { cash: -50, stock: 30, energy: -5 },
      xp: 25,
      lesson:
        "L'import groupé réduit le coût unitaire de transport, mais immobilise ton argent pendant des semaines. Calcule le coût total « rendu boutique » (fret, douane, transport local).",
    },
    b: {
      label: 'Attendre de mieux connaître le circuit',
      outcome: "Tu observes d'abord une commande d'une collègue.",
      effects: { energy: 2, reputation: 2 },
      xp: 15,
      lesson:
        "Observer avant d'importer est une stratégie légitime. Renseigne-toi sur les tarifs douaniers et le sérieux du groupeur.",
    },
  },
  {
    id: 'p04',
    pack: 'agri_import',
    category: 'import',
    character: 'Le transitaire',
    role: 'Frontière de Kasumbalesa',
    avatar: '🛃',
    title: 'Les frais « supplémentaires »',
    text: "Ta marchandise est bloquée à la frontière. Le transitaire réclame 20 $ de « frais supplémentaires » non prévus dans son devis.",
    a: {
      label: 'Exiger le détail écrit des frais',
      outcome: "Sur facture détaillée, seuls 8 $ sont justifiés.",
      effects: { cash: -8, energy: -6, stock: 6 },
      xp: 25,
      lesson:
        "Exige toujours un devis écrit et détaillé avant l'expédition. Les frais non documentés sont négociables, ceux sur facture officielle ne le sont pas.",
    },
    b: {
      label: 'Payer pour débloquer vite',
      outcome: "La marchandise arrive, mais ta marge a fondu.",
      effects: { cash: -20, stock: 6 },
      xp: 10,
      lesson:
        "Dans l'import, les frais imprévus peuvent manger toute la marge. Garde toujours 15 à 20 % de réserve sur le budget total d'une opération.",
    },
  },
  {
    id: 'p05',
    pack: 'agri_import',
    category: 'import',
    character: 'Intermédiaire de paiement',
    role: 'Transfert vers la Chine',
    avatar: '💸',
    title: 'Payer un fournisseur à l’étranger',
    text: "Pour payer ton fournisseur en Chine, un intermédiaire informel propose un taux avantageux, mais sans aucun justificatif. La banque coûte 4 % de plus.",
    a: {
      label: 'Passer par un canal traçable',
      outcome: "Plus cher, mais tu as une preuve de paiement en cas de litige.",
      effects: { cash: -8, energy: -2, reputation: 4 },
      xp: 25,
      lesson:
        "Un paiement international sans trace est un paiement sans recours. Le surcoût d'un canal officiel est le prix de ta sécurité juridique.",
    },
    b: {
      label: "Prendre l'intermédiaire informel",
      outcome: "Le fournisseur dit n'avoir reçu que la moitié. Impossible de prouver le contraire.",
      effects: { cash: -25, energy: -6 },
      xp: 5,
      lesson:
        "Le meilleur taux de change ne vaut rien si l'argent n'arrive pas. Pour les gros montants, privilégie toujours la traçabilité.",
    },
  },
  {
    id: 'p06',
    pack: 'agri_import',
    category: 'agri',
    character: 'Maman Odette',
    role: 'Productrice de légumes à Kinkole',
    avatar: '🥬',
    title: 'Le contrat de légumes frais',
    text: "Un restaurant d'hôtel veut 30 kg de légumes chaque semaine, payés à 30 jours. Maman Odette peut te fournir, mais veut être payée cash.",
    a: {
      label: 'Signer avec un acompte du restaurant',
      outcome: "Le restaurant accepte 30 % d'acompte : ton décalage de trésorerie est couvert.",
      effects: { cash: 18, stock: -8, energy: -6, reputation: 6 },
      xp: 25,
      lesson:
        "Quand tu paies ton fournisseur cash et que ton client paie à 30 jours, c'est toi qui finances l'écart. Négocie un acompte pour couvrir ce besoin en fonds de roulement.",
    },
    b: {
      label: 'Signer sans acompte',
      outcome: "Belles ventes… mais ta caisse est vide en attendant le paiement.",
      effects: { cash: -22, stock: -8, reputation: 6 },
      xp: 10,
      lesson:
        "Un gros client qui paie tard peut asphyxier une petite entreprise rentable. Le besoin en fonds de roulement se calcule avant de signer.",
    },
  },
];

// ───────────────────────── PARCOURS D'APPRENTISSAGE ─────────────────────────

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'm1',
    index: 1,
    title: 'Survie & Caisse',
    subtitle: 'Protéger ton cash, la base de tout',
    color: 'gold',
    lessons: [
      {
        id: 'm1l1',
        title: 'Caisse perso ≠ caisse pro',
        description: 'Arrêter de mélanger ton argent et celui de la boutique.',
        xp: 30,
        theory: [
          { emoji: '👛', title: 'Deux poches, deux rôles', body: "La caisse pro sert à racheter du stock et payer les charges. Ta poche perso sert à ta vie. Les mélanger, c'est ne plus savoir si tu gagnes." },
          { emoji: '💼', title: 'Verse-toi un salaire', body: "Fixe un montant chaque semaine ou chaque mois et note-le comme « salaire ». Tout le reste appartient à la boutique." },
          { emoji: '📝', title: 'Chaque retrait est noté', body: "Même 1 000 FC pris pour le transport doit être écrit. Ce qui n'est pas noté disparaît de tes calculs." },
        ],
        quiz: [
          { id: 'q01', kind: 'situation', question: "Ton fils a besoin de 10 $ pour un médicament. Que fais-tu en priorité ?", options: ['Je prends dans la caisse sans rien noter', 'Je prends sur mon salaire, ou je note un retrait exceptionnel', "J'emprunte au fournisseur"], answer: 1, explanation: "Un retrait noté reste sous contrôle. Le problème n'est pas d'utiliser l'argent, c'est de ne pas le tracer." },
          { id: 'q02', kind: 'vrai-faux', question: "« Si ma caisse est pleine le soir, c'est que je gagne de l'argent. »", options: ['Vrai', 'Faux'], answer: 1, explanation: "Faux : la caisse peut contenir l'argent du fournisseur à payer, des acomptes clients ou ton capital. Seul le calcul du bénéfice dit la vérité." },
          { id: 'q03', kind: 'qcm', question: 'Quelle est la meilleure façon de te payer ?', options: ['Prendre selon mes besoins du jour', 'Un salaire fixe que la boutique peut supporter', 'Tout ce qui reste en fin de semaine'], answer: 1, explanation: "Un salaire fixe et réaliste rend tes dépenses prévisibles et protège le capital de la boutique." },
        ],
      },
      {
        id: 'm1l2',
        title: 'Le cahier de caisse',
        description: 'Noter entrées et sorties en 5 minutes par jour.',
        xp: 30,
        theory: [
          { emoji: '📒', title: 'Entrées et sorties', body: "Chaque jour : date, motif, montant entré ou sorti. Un simple cahier ou l'outil « Journal » de KaziBoss suffit." },
          { emoji: '🧮', title: 'La caisse doit être juste', body: "Le soir : solde du matin + entrées – sorties = argent réel dans la caisse. S'il y a un écart, cherche-le tout de suite." },
          { emoji: '🔍', title: 'Les fuites se voient', body: "Après une semaine, tu vois où part l'argent : transport, crédit téléphonique, petites dépenses. On ne réduit que ce qu'on mesure." },
        ],
        quiz: [
          { id: 'q04', kind: 'calcul', question: "Matin : 40 $ en caisse. Ventes : 35 $. Achats : 20 $. Combien dois-tu avoir le soir ?", options: ['55 $', '75 $', '60 $', '45 $'], answer: 0, explanation: "40 + 35 – 20 = 55 $. Si tu comptes un autre montant, il y a un oubli d'enregistrement ou une erreur de rendu." },
          { id: 'q05', kind: 'qcm', question: 'Le soir, il manque 3 $ dans ta caisse. Que fais-tu ?', options: ["J'ignore, c'est peu", "Je cherche l'erreur et je note l'écart", 'Je rajoute 3 $ de ma poche sans rien dire'], answer: 1, explanation: "Les petits écarts répétés deviennent de grosses pertes. Les noter permet de voir s'ils se répètent (erreur, vol, oubli)." },
          { id: 'q06', kind: 'vrai-faux', question: '« Le cahier de caisse est utile seulement pour les grandes entreprises. »', options: ['Vrai', 'Faux'], answer: 1, explanation: "Faux : plus ton business est petit, plus chaque dollar compte. Le cahier est le premier outil du patron." },
        ],
      },
      {
        id: 'm1l3',
        title: 'Le coussin de sécurité',
        description: 'Fonds de roulement et réserve pour les coups durs.',
        xp: 35,
        theory: [
          { emoji: '🔄', title: 'Le fonds de roulement', body: "C'est l'argent nécessaire pour racheter ton stock et payer tes charges en attendant les ventes. Sans lui, la boutique s'arrête." },
          { emoji: '🛟', title: 'La réserve de sécurité', body: "Vise au moins un mois de charges fixes (loyer, électricité, salaire) mis de côté, idéalement sur un compte séparé." },
          { emoji: '💵', title: 'En devise stable', body: "Si ta monnaie locale perd de la valeur, garde ta réserve en dollars ou sur un support qui protège sa valeur." },
        ],
        quiz: [
          { id: 'q07', kind: 'calcul', question: 'Loyer 30 $, électricité 10 $, ton salaire 60 $ par mois. Quelle réserve minimum viser ?', options: ['40 $', '100 $', '60 $', '200 $'], answer: 1, explanation: "30 + 10 + 60 = 100 $ : un mois de charges fixes pour tenir face à un coup dur." },
          { id: 'q08', kind: 'situation', question: 'Une grosse remise fournisseur demande 90 % de ta caisse. Que fais-tu ?', options: ["Je saute sur l'occasion", "J'achète une partie et je garde ma réserve", 'Je refuse toujours les remises'], answer: 1, explanation: "Une remise ne doit jamais vider ta réserve. Achète la quantité que ta trésorerie supporte." },
          { id: 'q09', kind: 'qcm', question: 'Où ranger de préférence ta réserve de sécurité ?', options: ['Sous le matelas', 'Dans la caisse de la boutique', "Sur un compte séparé (coopec, banque, Mobile Money épargne)"], answer: 2, explanation: "Séparée de la caisse, la réserve est protégée du vol, des tentations et des demandes du quotidien." },
        ],
      },
    ],
  },
  {
    id: 'm2',
    index: 2,
    title: 'Prix & Marges',
    subtitle: 'Vendre au bon prix, sans perdre',
    color: 'emerald',
    lessons: [
      {
        id: 'm2l1',
        title: 'Le vrai coût de revient',
        description: "Ce que te coûte vraiment un produit avant de le vendre.",
        xp: 30,
        theory: [
          { emoji: '🧾', title: "Le prix d'achat ne suffit pas", body: "Coût de revient = prix d'achat + transport + manutention + pertes + part des frais fixes." },
          { emoji: '🛺', title: 'Le transport compte', body: "Une course de 5 $ pour ramener 50 articles ajoute 0,10 $ par article. Sur un petit produit, c'est énorme." },
          { emoji: '🥀', title: 'Les pertes aussi', body: "Casse, périmés, vols : si tu perds 5 % du stock, ton coût réel augmente de 5 %." },
        ],
        quiz: [
          { id: 'q10', kind: 'calcul', question: "Tu achètes 100 savons pour 40 $ et paies 10 $ de transport. Coût de revient d'un savon ?", options: ['0,40 $', '0,50 $', '0,10 $', '0,45 $'], answer: 1, explanation: "(40 + 10) ÷ 100 = 0,50 $ par savon. Ton prix de vente doit partir de ce chiffre, pas de 0,40 $." },
          { id: 'q11', kind: 'vrai-faux', question: '« Le loyer ne fait pas partie du coût de mes produits. »', options: ['Vrai', 'Faux'], answer: 1, explanation: "Faux : les frais fixes (loyer, électricité) doivent être couverts par la marge de tous tes produits." },
          { id: 'q12', kind: 'qcm', question: 'Quel élément oublie-t-on le plus souvent dans le coût de revient ?', options: ["Le prix d'achat", 'Le transport et les pertes', 'Le prix du concurrent'], answer: 1, explanation: "Le transport et les pertes sont invisibles au quotidien, mais ils mangent la marge." },
        ],
      },
      {
        id: 'm2l2',
        title: 'Marge ou majoration ?',
        description: 'Le piège du « je rajoute 20 % ».',
        xp: 35,
        theory: [
          { emoji: '➕', title: 'La majoration (markup)', body: "C'est le % ajouté au coût. Coût 10 $ + 25 % = prix 12,50 $." },
          { emoji: '📐', title: 'La marge', body: "C'est le % du prix de vente qui reste. Sur 12,50 $, tu gardes 2,50 $ : soit 20 % de marge, pas 25 %." },
          { emoji: '🎯', title: 'Calculer depuis la marge', body: "Pour une marge de 20 % : prix = coût ÷ (1 – 0,20). Le calculateur KaziBoss le fait pour toi." },
        ],
        quiz: [
          { id: 'q13', kind: 'calcul', question: 'Coût 8 $. Tu veux 20 % de marge sur le prix de vente. Quel prix ?', options: ['9,60 $', '10 $', '8,20 $', '12 $'], answer: 1, explanation: "8 ÷ (1 – 0,20) = 10 $. Tu gardes 2 $, soit 20 % de 10 $." },
          { id: 'q14', kind: 'qcm', question: 'Coût 10 $, vendu 15 $. Quelle est ta marge en % du prix de vente ?', options: ['50 %', '33 %', '15 %', '5 %'], answer: 1, explanation: "Bénéfice 5 $ ÷ prix 15 $ = 33 %. La majoration, elle, est de 50 %." },
          { id: 'q15', kind: 'situation', question: "Tu baisses ton prix de 10 % alors que ta marge est de 20 %. Que se passe-t-il ?", options: ['Tu perds 10 % de bénéfice', 'Tu perds la moitié de ton bénéfice', 'Rien, tu vendras plus'], answer: 1, explanation: "Sur 100 $ de ventes, tu gagnais 20 $. À –10 %, tu ne gagnes plus que 10 $ : il faut vendre 2 fois plus pour gagner autant." },
        ],
      },
      {
        id: 'm2l3',
        title: 'Prix et taux de change',
        description: "Protéger ta marge quand la monnaie bouge.",
        xp: 35,
        theory: [
          { emoji: '💱', title: 'Acheter en USD, vendre en local', body: "Si tu achètes en dollars et vends en francs, ton coût change chaque fois que le taux change." },
          { emoji: '📉', title: 'La dépréciation', body: "Si le franc passe de 2 800 à 2 950 FC pour 1 $, il faut augmenter tes prix d'environ 5 % pour garder la même marge." },
          { emoji: '🏷️', title: 'Affiche un prix de référence', body: "Beaucoup de commerçants fixent un prix en $ et l'affichent en FC au taux du jour. C'est transparent et ça protège ta marge." },
        ],
        quiz: [
          { id: 'q16', kind: 'calcul', question: "Un article coûte 2 $. Au taux de 2 900 FC/$, quel est son coût en FC ?", options: ['5 800 FC', '2 900 FC', '4 500 FC', '6 000 FC'], answer: 0, explanation: "2 × 2 900 = 5 800 FC. Avec ta marge, ton prix de vente doit être au-dessus." },
          { id: 'q17', kind: 'qcm', question: 'Le franc perd 10 % face au dollar. Tu achètes en $. Que fais-tu ?', options: ['Je garde mes prix en FC', "J'augmente mes prix en FC d'environ 10 %", 'Je baisse mes prix pour vendre plus'], answer: 1, explanation: "Sinon, tu vends en dessous de ton nouveau coût de remplacement et ton capital fond." },
          { id: 'q18', kind: 'vrai-faux', question: "« Garder sa recette en francs pendant un mois est sans risque. »", options: ['Vrai', 'Faux'], answer: 1, explanation: "Faux : en période de dépréciation, l'argent gardé en monnaie locale perd de sa valeur. Convertis la part destinée au réachat de stock." },
        ],
      },
    ],
  },
  {
    id: 'm3',
    index: 3,
    title: 'Clients & Crédit',
    subtitle: 'Fidéliser sans te faire mettre à sec',
    color: 'coral',
    lessons: [
      {
        id: 'm3l1',
        title: 'Le crédit client sans danger',
        description: 'Les 4 règles de l’ardoise maîtrisée.',
        xp: 35,
        theory: [
          { emoji: '✍️', title: 'Écrit et signé', body: "Nom, montant, date, date de remboursement, signature. Sans écrit, pas de dette." },
          { emoji: '🧱', title: 'Un plafond par client', body: "Fixe un maximum (ex. 10 $) et un total maximum pour tous les clients (ex. 20 % de ton stock)." },
          { emoji: '⏰', title: 'Relancer tôt', body: "Une dette de plus de 30 jours devient difficile à récupérer. Relance poliment dès le premier retard." },
        ],
        quiz: [
          { id: 'q19', kind: 'qcm', question: 'Quelle information est indispensable sur une ardoise client ?', options: ['La couleur de sa maison', 'Montant, date et date de remboursement', 'Le nom de son employeur uniquement'], answer: 1, explanation: "Montant, date et échéance (plus signature) permettent de suivre et de réclamer la dette." },
          { id: 'q20', kind: 'situation', question: 'Un client te doit déjà 12 $ (ton plafond est 10 $). Il demande encore 5 $.', options: ["J'accepte, il est sympa", "Je refuse le nouveau crédit et propose un échéancier", "J'accepte si c'est la fin du mois"], answer: 1, explanation: "Le plafond n'a de valeur que s'il est respecté. Propose de rembourser d'abord une partie." },
          { id: 'q21', kind: 'vrai-faux', question: "« Vendre beaucoup à crédit, c'est forcément bon pour mon business. »", options: ['Vrai', 'Faux'], answer: 1, explanation: "Faux : tu peux vendre beaucoup et faire faillite faute de cash pour racheter du stock." },
        ],
      },
      {
        id: 'm3l2',
        title: 'Fidéliser sans brader',
        description: 'Garder ses clients sans casser ses prix.',
        xp: 30,
        theory: [
          { emoji: '😊', title: 'Le service avant le prix', body: "Accueil, propreté, disponibilité, conseils : ce sont des raisons de revenir que le concurrent ne copie pas facilement." },
          { emoji: '🎟️', title: 'La carte de fidélité', body: "« 10 achats = 1 produit offert » : le cadeau coûte ton prix d'achat, pas ton prix de vente." },
          { emoji: '🗣️', title: 'Le bouche-à-oreille', body: "Un client satisfait en ramène d'autres. Récompense le parrainage plutôt que de baisser les prix pour tous." },
        ],
        quiz: [
          { id: 'q22', kind: 'qcm', question: 'Un concurrent baisse ses prix de 10 %. Quelle réponse est la plus durable ?', options: ['Baisser de 15 %', 'Améliorer le service et fidéliser', 'Fermer la boutique'], answer: 1, explanation: "Une guerre des prix use ta marge. Le service et la relation sont tes meilleures défenses." },
          { id: 'q23', kind: 'calcul', question: "Un savon coûte 0,50 $ et se vend 0,80 $. Que te coûte réellement un savon offert ?", options: ['0,80 $', '0,50 $', '0,30 $', '1,30 $'], answer: 1, explanation: "Un produit offert te coûte son coût de revient (0,50 $), pas son prix de vente." },
          { id: 'q24', kind: 'vrai-faux', question: '« Le client fidèle est celui qui achète le moins cher. »', options: ['Vrai', 'Faux'], answer: 1, explanation: "Faux : le client fidèle revient pour la confiance, la proximité et le service, pas seulement le prix." },
        ],
      },
      {
        id: 'm3l3',
        title: 'Mobile Money & paiements',
        description: 'Encaisser plus, sans arnaques.',
        xp: 35,
        theory: [
          { emoji: '📲', title: 'Accepter le mobile', body: "M-Pesa, Orange Money, Airtel Money, Wave : accepter le paiement mobile, c'est ne plus perdre de ventes faute de liquide." },
          { emoji: '🚨', title: 'Le faux SMS', body: "Ne te fie jamais au SMS montré par le client : vérifie toujours ton solde réel avant de livrer." },
          { emoji: '🧾', title: 'Un compte pro', body: "Utilise un numéro réservé à la boutique. Tes encaissements sont tracés et séparés de ton argent perso." },
        ],
        quiz: [
          { id: 'q25', kind: 'situation', question: "Un client pressé te montre un SMS de paiement. Que fais-tu ?", options: ['Je lui donne sa marchandise', 'Je vérifie mon solde réel avant de livrer', 'Je lui demande de revenir demain'], answer: 1, explanation: "Seul ton solde fait foi. Le faux SMS est l'arnaque la plus répandue chez les commerçants." },
          { id: 'q26', kind: 'calcul', question: "Frais de retrait : 2 %. Tu encaisses 50 $ par mobile. Combien te coûtent les frais ?", options: ['2 $', '1 $', '0,50 $', '5 $'], answer: 1, explanation: "50 × 2 % = 1 $. Intègre ces frais dans ta marge plutôt que de refuser le client." },
          { id: 'q27', kind: 'qcm', question: 'Pourquoi utiliser un numéro Mobile Money dédié à la boutique ?', options: ['Pour payer moins de frais', 'Pour séparer et tracer les flux pro', "Parce que c'est obligatoire partout"], answer: 1, explanation: "Un numéro dédié = un relevé automatique de tes ventes, sans mélange avec tes dépenses perso." },
        ],
      },
    ],
  },
  {
    id: 'm4',
    index: 4,
    title: 'Croissance & Équipe',
    subtitle: 'Passer de commerçant à patron',
    color: 'sky',
    premium: true,
    lessons: [
      {
        id: 'm4l1',
        title: 'Recruter et payer',
        description: 'Ton premier employé sans conflit.',
        xp: 40,
        theory: [
          { emoji: '📄', title: 'Des règles écrites', body: "Horaires, tâches, salaire, jour de paie : même pour un membre de la famille, l'écrit évite les malentendus." },
          { emoji: '🏆', title: 'Fixe + bonus', body: "Un salaire fixe modeste et un bonus lié aux ventes motivent sans mettre ta trésorerie en danger." },
          { emoji: '🔐', title: 'Contrôle bienveillant', body: "Comptage de caisse à deux, inventaire hebdomadaire : les contrôles protègent aussi l'employé honnête." },
        ],
        quiz: [
          { id: 'q28', kind: 'qcm', question: 'Quel système de rémunération motive le plus un vendeur ?', options: ['Un salaire fixe très élevé', 'Un fixe modeste + bonus sur les ventes', 'Pas de salaire, seulement des repas'], answer: 1, explanation: "Le bonus aligne l'intérêt du vendeur sur celui de la boutique et ne coûte que si les ventes progressent." },
          { id: 'q29', kind: 'vrai-faux', question: "« Avec un membre de la famille, pas besoin de règles écrites. »", options: ['Vrai', 'Faux'], answer: 1, explanation: "Faux : c'est justement avec la famille que les non-dits créent les plus gros conflits." },
          { id: 'q30', kind: 'situation', question: "Des écarts de caisse apparaissent quand ton vendeur est seul.", options: ['Je le renvoie immédiatement', 'Je mets en place un comptage à deux et je suis les faits', 'Je ne dis rien'], answer: 1, explanation: "D'abord la procédure, ensuite la décision sur des faits. Cela protège la boutique et la relation." },
        ],
      },
      {
        id: 'm4l2',
        title: 'Emprunter intelligemment',
        description: 'Microcrédit, tontine, crédit fournisseur.',
        xp: 40,
        theory: [
          { emoji: '📊', title: 'Le coût réel du crédit', body: "4 % par mois, c'est près de 48 % par an. Ton investissement doit rapporter plus que ça." },
          { emoji: '🎯', title: 'Un usage précis', body: "Emprunte pour du stock qui tourne vite ou un équipement qui réduit tes coûts, jamais pour la consommation." },
          { emoji: '🤝', title: 'Les alternatives', body: "Crédit fournisseur (souvent gratuit) et tontine (likelemba, tontine, susu) sont des financements sans intérêts à utiliser en premier." },
        ],
        quiz: [
          { id: 'q31', kind: 'calcul', question: "Tu empruntes 100 $ à 4 % par mois pendant 3 mois (intérêts simples). Combien d'intérêts ?", options: ['4 $', '12 $', '48 $', '3 $'], answer: 1, explanation: "100 × 4 % × 3 = 12 $. Ton stock doit générer plus de 12 $ de bénéfice sur la période." },
          { id: 'q32', kind: 'qcm', question: 'Quel financement est souvent le moins cher pour un petit commerçant ?', options: ['Le crédit fournisseur', 'Le prêteur du quartier', 'Le découvert'], answer: 0, explanation: "Le crédit fournisseur est souvent gratuit si tu revends avant l'échéance." },
          { id: 'q33', kind: 'situation', question: 'Une microfinance te propose 300 $ mais tu n’as pas de plan précis.', options: ["J'accepte, on verra", "Je n'emprunte que pour un besoin chiffré", "J'accepte et je rembourse avec la caisse"], answer: 1, explanation: "Un prêt sans plan finit souvent en consommation, et les intérêts courent quand même." },
        ],
      },
      {
        id: 'm4l3',
        title: 'Ouvrir un 2e point de vente',
        description: 'Grandir sans perdre le contrôle.',
        xp: 45,
        theory: [
          { emoji: '✅', title: 'Le 1er doit tourner seul', body: "Avant d'ouvrir un 2e point, ta 1re boutique doit être rentable et fonctionner sans toi plusieurs jours." },
          { emoji: '📍', title: 'Le bon emplacement', body: "Compte le passage, observe la concurrence, teste avec une table ou un kiosque avant d'engager un loyer." },
          { emoji: '📲', title: 'Piloter à distance', body: "Journal de caisse quotidien, inventaire hebdo, paiements mobiles : ce sont tes yeux quand tu n'es pas là." },
        ],
        quiz: [
          { id: 'q34', kind: 'qcm', question: 'Quand ouvrir un deuxième point de vente ?', options: ['Dès que j’ai un peu d’argent', 'Quand le premier est rentable et tourne sans moi', 'Quand un ami me le conseille'], answer: 1, explanation: "Un premier point fragile + un deuxième = deux problèmes. La croissance s'appuie sur une base solide." },
          { id: 'q35', kind: 'situation', question: 'Tu hésites sur un emplacement. Que fais-tu d’abord ?', options: ['Je signe un bail d’un an', 'Je teste avec un petit stand pendant 2 semaines', 'Je choisis le loyer le moins cher'], answer: 1, explanation: "Tester coûte peu et te donne des chiffres réels avant de t'engager." },
          { id: 'q36', kind: 'vrai-faux', question: '« Avec deux boutiques, je peux me passer du journal de caisse. »', options: ['Vrai', 'Faux'], answer: 1, explanation: "Faux : plus tu grandis, plus les outils de suivi deviennent indispensables pour garder le contrôle." },
        ],
      },
    ],
  },
];

export const ALL_LESSONS = LEARNING_MODULES.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })));
export const TOTAL_QUIZ_COUNT = ALL_LESSONS.reduce((n, l) => n + l.quiz.length, 0);
