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

  // ═════════════════════════ SECTEURS DÉBLOCABLES ═════════════════════════
  // Ces cartes n'apparaissent que si le joueur a choisi le secteur correspondant
  // au début du mois (voir src/config/sectors.ts).

  // ───────────────────────── SECTEUR : COMMERCE & DISTRIBUTION ─────────────────────────
  {
    id: 'sc01',
    sector: 'commerce',
    category: 'fournisseur',
    character: 'Papa Mbuyi',
    role: 'Grossiste en riz',
    avatar: '👨🏿‍💼',
    title: 'Remise contre cash',
    text: "« 8 % de remise si tu me paies 25 sacs de riz cash aujourd'hui. Sinon, prix normal mais je peux te faire 15 jours de crédit. »",
    a: {
      label: 'Payer cash pour la remise',
      outcome: 'Belle remise, mais ta caisse est à sec pour la semaine.',
      effects: { cash: -55, stock: 26, energy: -3 },
      xp: 10,
      lesson:
        "Une remise de 8 % ne vaut rien si elle t'empêche de racheter tes produits phares demain. Compare toujours le gain de la remise au risque de manquer de liquidités.",
    },
    b: {
      label: 'Négocier 15 jours de crédit',
      outcome: 'Tu revends le riz avant l’échéance : le fournisseur a financé ton stock.',
      effects: { cash: -18, stock: 22, reputation: 2, energy: -4 },
      xp: 20,
      lesson:
        "Le crédit fournisseur est souvent le financement le moins cher : zéro intérêt si tu revends avant l'échéance. Note bien la date de paiement et respecte-la pour garder sa confiance.",
    },
  },
  {
    id: 'sc02',
    sector: 'commerce',
    category: 'change',
    character: 'Le dépôt de boissons',
    role: 'Distributeur de la brasserie',
    avatar: '🍺',
    title: 'Le casier augmente en francs',
    text: "Le dollar a pris 6 % en deux semaines. Le distributeur augmente le casier de boissons en francs. Tes clients, eux, ont l'habitude de ton ancien prix.",
    a: {
      label: 'Répercuter la hausse et l’expliquer',
      outcome: 'Quelques grognements, mais ta marge est protégée.',
      effects: { cash: 8, reputation: -4 },
      xp: 20,
      lesson:
        "Quand tu achètes en dollars et vends en francs, ton prix de vente doit suivre le taux. Une petite affiche « prix ajustés au taux du jour » aide les clients à comprendre.",
    },
    b: {
      label: 'Garder l’ancien prix',
      outcome: 'Les clients sont contents… et tu vends chaque casier presque sans marge.',
      effects: { cash: -12, reputation: 4 },
      xp: 8,
      lesson:
        "Absorber une hausse de coût, c'est payer de ta poche une partie des achats de tes clients. Tu peux le faire quelques jours, pas pendant des mois.",
    },
  },
  {
    id: 'sc03',
    sector: 'commerce',
    category: 'credit',
    character: 'Mama Josée',
    role: 'Revendeuse de quartier',
    avatar: '👩🏾',
    title: 'Le crédit demi-gros',
    text: "Mama Josée revend tes produits dans son kiosque. Elle veut prendre pour 30 $ de marchandise et te payer dans deux semaines.",
    a: {
      label: 'Moitié comptant, moitié à crédit',
      outcome: 'Elle accepte. Tu gardes du cash et tu gagnes une revendeuse fidèle.',
      effects: { cash: 12, stock: -8, reputation: 3 },
      xp: 20,
      lesson:
        "Avec les revendeurs, un crédit partiel et plafonné partage le risque. Écris le montant, la date et fais signer : c'est un accord commercial, pas une faveur.",
    },
    b: {
      label: 'Tout lui donner à crédit',
      outcome: 'Ton stock part, mais l’argent tarde à revenir.',
      effects: { cash: -4, stock: -10, reputation: 6 },
      xp: 8,
      lesson:
        "Vendre à crédit, c'est prêter ton stock. Tant que l'argent n'est pas rentré, ce n'est pas une vente mais une créance qui peut ne jamais revenir.",
    },
  },
  {
    id: 'sc04',
    sector: 'commerce',
    category: 'energie',
    character: 'La SNEL',
    role: 'Délestage annoncé',
    avatar: '🔌',
    title: 'Trois jours sans courant',
    text: "Coupure annoncée pour trois jours. Ton congélateur est plein de yaourts et de poisson surgelé.",
    a: {
      label: 'Partager un groupe avec les voisins',
      outcome: 'À quatre commerçants, le carburant coûte peu et rien ne se perd.',
      effects: { cash: -12, energy: -3, reputation: 3 },
      xp: 20,
      lesson:
        "Mutualiser un équipement avec d'autres commerçants divise les coûts. La solidarité entre voisins est aussi une stratégie de gestion.",
    },
    b: {
      label: 'Brader le frais avant qu’il tourne',
      outcome: 'Tu récupères un peu de cash, mais ton rayon frais est vide.',
      effects: { cash: 6, stock: -10, energy: -2 },
      xp: 12,
      lesson:
        "Brader vite limite la perte sur un produit périssable. Mais si les coupures sont fréquentes, il faut revoir la part de produits frais dans ton stock.",
    },
  },
  {
    id: 'sc05',
    sector: 'commerce',
    category: 'equipe',
    character: 'Patrick',
    role: 'Ton magasinier',
    avatar: '👷🏿',
    title: 'Encore en retard',
    text: "Patrick arrive en retard tous les jours depuis une semaine. Les camions de livraison attendent devant le dépôt.",
    a: {
      label: 'Discussion franche et règle écrite',
      outcome: 'Il avait un problème de transport. Vous trouvez une solution.',
      effects: { energy: -3, reputation: 2 },
      xp: 20,
      lesson:
        "Avant de sanctionner, cherche la cause. Une règle écrite (horaires, retenue après trois retards) rend la suite claire et juste pour tout le monde.",
    },
    b: {
      label: 'Le renvoyer sur-le-champ',
      outcome: 'Tu décharges les camions toi-même toute la semaine.',
      effects: { energy: -12, stock: -3 },
      xp: 8,
      lesson:
        "Remplacer un employé coûte cher : recrutement, formation, erreurs. Un licenciement sans procédure fait aussi peur au reste de l'équipe.",
    },
  },
  {
    id: 'sc06',
    sector: 'commerce',
    category: 'marketing',
    character: 'Radio Kintambo FM',
    role: 'Radio communautaire',
    avatar: '📻',
    title: 'Le spot radio',
    text: "La radio du quartier propose un spot pour ton dépôt pendant une semaine : 15 $. Un ami te conseille plutôt des prospectus distribués par les motos-taxis.",
    a: {
      label: 'Payer le spot radio',
      outcome: 'Ton nom circule dans tout le quartier.',
      effects: { cash: -15, reputation: 8, energy: -1 },
      xp: 15,
      lesson:
        "La radio touche beaucoup de monde, mais il est difficile de mesurer ce qu'elle rapporte. Demande à chaque nouveau client comment il t'a connu.",
    },
    b: {
      label: 'Tester 4 $ de prospectus',
      outcome: 'Avec un code « MOTO10 », tu comptes 9 nouveaux clients.',
      effects: { cash: -4, reputation: 4, energy: -3 },
      xp: 20,
      lesson:
        "Teste petit, mesure, puis augmente ce qui marche. Un code promo ou une question au client te dit d'où vient chaque vente.",
    },
  },
  {
    id: 'sc07',
    sector: 'commerce',
    category: 'concurrence',
    character: 'Le nouveau dépôt',
    role: 'Concurrent à 200 m',
    avatar: '🏬',
    title: 'Un gros dépôt ouvre',
    text: "Un grand dépôt ouvre à 200 mètres avec des prix 10 % plus bas que les tiens. Tes boutiquières hésitent.",
    a: {
      label: 'Casser tes prix pour suivre',
      outcome: 'Tu gardes tes clients, mais tu travailles presque pour rien.',
      effects: { cash: -10, stock: -4, reputation: 3 },
      xp: 8,
      lesson:
        "Une guerre des prix contre plus gros que toi se perd presque toujours : il achète moins cher et tient plus longtemps.",
    },
    b: {
      label: 'Livrer gratuitement les boutiques',
      outcome: 'Les boutiquières n’ont plus à se déplacer : elles restent chez toi.',
      effects: { cash: -3, reputation: 7, energy: -6 },
      xp: 20,
      lesson:
        "Face à un concurrent moins cher, différencie-toi par le service : livraison, crédit maîtrisé, conseil. Le client paie aussi pour la commodité.",
    },
  },
  {
    id: 'sc08',
    sector: 'commerce',
    category: 'fournisseur',
    character: 'Le livreur',
    role: 'Camion du fournisseur',
    avatar: '🚚',
    title: 'Signe vite, je suis pressé',
    text: "Le livreur insiste pour que tu signes le bon de livraison sans compter : « Tout y est, j'ai encore trois arrêts ! »",
    a: {
      label: 'Compter carton par carton',
      outcome: 'Il manquait 3 cartons. Ils sont livrés le lendemain.',
      effects: { stock: 6, energy: -4, reputation: 1 },
      xp: 20,
      lesson:
        "Ta signature dit « j'ai tout reçu ». Compte toujours avant de signer, et note les manquants sur le bon : après, aucun recours.",
    },
    b: {
      label: 'Signer pour lui rendre service',
      outcome: 'Le soir, tu découvres 3 cartons manquants… déjà payés.',
      effects: { cash: -6, stock: 2 },
      xp: 5,
      lesson:
        "Les erreurs de livraison sont fréquentes, volontaires ou non. Cinq minutes de comptage protègent des dizaines de dollars.",
    },
  },
  {
    id: 'sc09',
    sector: 'commerce',
    category: 'securite',
    character: 'Papa Désiré',
    role: 'Gardien de nuit',
    avatar: '🔦',
    title: 'Tentative de vol',
    text: "Des voleurs ont tenté de forcer le dépôt cette nuit. Papa Désiré propose un cadenas renforcé et une lampe solaire pour 14 $.",
    a: {
      label: 'Sécuriser le dépôt',
      outcome: 'Le dépôt est mieux protégé et tu dors tranquille.',
      effects: { cash: -14, energy: 2, reputation: 2 },
      xp: 20,
      lesson:
        "La sécurité est une charge fixe, pas une dépense inutile. Compare son coût à la valeur du stock qu'elle protège.",
    },
    b: {
      label: 'Dormir toi-même au dépôt',
      outcome: 'Tu économises, mais tu tiens à peine debout le lendemain.',
      effects: { energy: -14 },
      xp: 5,
      lesson:
        "Ta fatigue a un coût caché : erreurs de caisse, mauvaise humeur, mauvaises décisions. Le patron n'est pas une ressource gratuite.",
    },
  },
  {
    id: 'sc10',
    sector: 'commerce',
    category: 'mobile-money',
    character: 'Ton grossiste',
    role: 'Paiement de la commande',
    avatar: '📲',
    title: 'Cash ou Mobile Money ?',
    text: "Tu dois payer 90 $ au grossiste à l'autre bout de la ville. Mobile Money coûte 1,5 % de frais. Sinon, tu traverses la ville avec le cash en moto-taxi.",
    a: {
      label: 'Payer par Mobile Money',
      outcome: 'Paiement fait en 30 secondes, avec une preuve écrite.',
      effects: { cash: -2, energy: 2 },
      xp: 20,
      lesson:
        "1,5 % de frais, c'est le prix de la sécurité et du temps gagné. Et le reçu électronique te sert de preuve en cas de litige.",
    },
    b: {
      label: 'Transporter le cash',
      outcome: 'Deux heures d’embouteillages, la peur au ventre.',
      effects: { energy: -7 },
      xp: 8,
      lesson:
        "Transporter du cash expose au vol et te fait perdre des heures de vente. Les frais économisés coûtent souvent plus cher que prévu.",
    },
  },
  {
    id: 'sc11',
    sector: 'commerce',
    category: 'stock',
    character: 'Toi',
    role: 'Revue du stock',
    avatar: '📊',
    title: 'Le savon qui dort',
    text: "Les pâtes et l'huile partent en deux jours. Le savon parfumé haut de gamme dort sur l'étagère depuis deux mois.",
    a: {
      label: 'Faire un lot savon + pâtes',
      outcome: 'Le lot plaît : le savon dormant se transforme en cash.',
      effects: { cash: 8, stock: -6, reputation: 2 },
      xp: 20,
      lesson:
        "Un stock qui ne tourne pas, c'est de l'argent immobilisé. Associe-le à un produit qui part vite pour le libérer.",
    },
    b: {
      label: 'En recommander pour l’assortiment',
      outcome: 'L’étagère est belle, mais la caisse se vide.',
      effects: { cash: -12, stock: 6 },
      xp: 5,
      lesson:
        "Suis la rotation de chaque produit : rachète ce qui se vend, pas ce qui est joli. Le cahier de ventes te dit quoi commander.",
    },
  },
  {
    id: 'sc12',
    sector: 'commerce',
    category: 'admin',
    character: 'Un agent municipal',
    role: 'Contrôle de la patente',
    avatar: '🧾',
    title: 'Un petit arrangement ?',
    text: "Ta patente n'est pas à jour. L'agent te propose de « régler ça » pour 10 $ sans reçu. Au guichet officiel, c'est 25 $ avec reçu.",
    a: {
      label: 'Payer au guichet avec reçu',
      outcome: 'C’est plus cher, mais tu es en règle pour l’année.',
      effects: { cash: -25, reputation: 4, energy: -3 },
      xp: 20,
      lesson:
        "Un reçu officiel te protège des contrôles suivants. Un arrangement sans papier se répète, car rien ne prouve que tu as payé.",
    },
    b: {
      label: 'Donner 10 $ sans reçu',
      outcome: 'Un autre agent passe la semaine suivante…',
      effects: { cash: -10, energy: -6 },
      xp: 5,
      lesson:
        "Sans preuve de paiement, tu restes en infraction. Range tous tes documents officiels dans une chemise dédiée.",
    },
  },
  {
    id: 'sc13',
    sector: 'commerce',
    category: 'credit',
    character: 'Agent de la microfinance',
    role: 'Crédit de fin d’année',
    avatar: '🏦',
    title: 'Le crédit pour les fêtes',
    text: "La microfinance te propose jusqu'à 200 $ à 3 % par mois pour remplir ton dépôt avant les fêtes.",
    a: {
      label: 'Emprunter 100 $ pour les produits phares',
      outcome: 'Les produits de fête partent vite et tu rembourses sans stress.',
      effects: { cash: -8, stock: 24, energy: -3 },
      xp: 20,
      lesson:
        "Emprunte pour du stock qui tourne vite et dont tu connais la demande. Le montant doit être calculé à partir des ventes prévues, pas de ce que la banque accepte.",
    },
    b: {
      label: 'Prendre les 200 $',
      outcome: 'Le dépôt déborde, mais les remboursements pèsent chaque semaine.',
      effects: { cash: -20, stock: 30, energy: -8 },
      xp: 8,
      lesson:
        "Ce n'est pas parce qu'on te prête qu'il faut tout prendre. Chaque dollar emprunté coûte des intérêts, même s'il dort dans ton stock.",
    },
  },
  {
    id: 'sc14',
    sector: 'commerce',
    category: 'famille',
    character: 'Tonton Albert',
    role: 'Chef de famille',
    avatar: '👴🏿',
    title: 'Le cousin à embaucher',
    text: "« Ton cousin Junior ne fait rien de ses journées. Prends-le au dépôt, c'est la famille ! » Junior n'a jamais travaillé dans le commerce.",
    a: {
      label: 'Un mois d’essai avec des règles claires',
      outcome: 'Junior apprend vite quand les tâches sont claires.',
      effects: { cash: -6, energy: 6, reputation: 1 },
      xp: 20,
      lesson:
        "Embaucher un proche peut marcher, à condition de le traiter comme un employé : tâches, horaires, salaire et période d'essai écrits.",
    },
    b: {
      label: 'Refuser sèchement',
      outcome: 'La famille t’en veut et le raconte à tout le monde.',
      effects: { reputation: -5, energy: -2 },
      xp: 10,
      lesson:
        "Dire non est parfois nécessaire, mais la manière compte. Propose une alternative (essai, stage) plutôt qu'un refus brutal.",
    },
  },
  {
    id: 'sc15',
    sector: 'commerce',
    category: 'marketing',
    character: 'Grâce',
    role: 'Ta nièce, étudiante',
    avatar: '👩🏾‍🎓',
    title: 'Le catalogue WhatsApp',
    text: "Grâce propose de créer un catalogue WhatsApp Business avec tes prix de gros, et un groupe pour tes boutiquières.",
    a: {
      label: 'Lancer le catalogue',
      outcome: 'Les commandes arrivent par message : tu prépares avant qu’elles passent.',
      effects: { cash: 6, reputation: 6, energy: -5 },
      xp: 20,
      lesson:
        "WhatsApp Business est un outil de vente gratuit : catalogue, réponses rapides, liste de diffusion. Il te fait gagner du temps au comptoir.",
    },
    b: {
      label: 'Rester au bouche-à-oreille',
      outcome: 'Rien ne change. Tes concurrents, eux, s’y mettent.',
      effects: { energy: 2, reputation: -2 },
      xp: 5,
      lesson:
        "Tes clients sont déjà sur leur téléphone. Ne pas y être, c'est laisser la place à ceux qui y sont.",
    },
  },
  {
    id: 'sc16',
    sector: 'commerce',
    category: 'change',
    character: 'Ton grossiste',
    role: 'Paiement en devises',
    avatar: '💱',
    title: 'Le taux du grossiste',
    text: "Tu as ta recette en francs. Le grossiste accepte les francs, mais à 3 000 FC le dollar. Chez le cambiste agréé, c'est 2 900.",
    a: {
      label: 'Changer chez le cambiste',
      outcome: 'Un petit détour, et 3 % économisés.',
      effects: { cash: 3, energy: -3 },
      xp: 20,
      lesson:
        "Payer dans la monnaie du fournisseur à son propre taux, c'est souvent payer une commission cachée. Compare toujours avec le taux du marché.",
    },
    b: {
      label: 'Payer en francs à son taux',
      outcome: 'C’est simple… et ça te coûte 3 % de plus.',
      effects: { cash: -4 },
      xp: 8,
      lesson:
        "Sur 1 000 $ d'achats par mois, 3 % de mauvais taux font 30 $ perdus. Les petits écarts de change s'additionnent vite.",
    },
  },
  {
    id: 'sc17',
    sector: 'commerce',
    category: 'caisse',
    character: 'Toi',
    role: 'Fin de mois',
    avatar: '🏍️',
    title: 'La moto de tes rêves',
    text: "Grosse fin de mois : 180 $ en caisse. Une moto d'occasion est à vendre à 150 $. Elle te ferait gagner du temps pour les livraisons.",
    a: {
      label: 'Te verser un salaire, épargner pour la moto',
      outcome: 'Dans deux mois, tu l’achèteras sans toucher au fonds de roulement.',
      effects: { cash: -10, energy: 3 },
      xp: 20,
      lesson:
        "Un gros achat se finance par l'épargne ou un crédit prévu, jamais en vidant le fonds de roulement. La caisse d'un bon mois n'est pas un bénéfice à dépenser.",
    },
    b: {
      label: 'Acheter la moto avec la caisse',
      outcome: 'Tu roules fièrement… mais tu ne peux plus racheter de stock.',
      effects: { cash: -60, energy: 10 },
      xp: 5,
      lesson:
        "La caisse contient l'argent de tes prochains achats. Si tu le dépenses, ton business s'arrête, même s'il était rentable.",
    },
  },

  // ───────────────────────── SECTEUR : SERVICES & DIGITAL ─────────────────────────
  {
    id: 'ss01',
    sector: 'services',
    category: 'fournisseur',
    character: 'Kevin',
    role: 'Fournisseur de pièces',
    avatar: '📱',
    title: 'Écran original ou copie ?',
    text: "Pour les réparations, Kevin vend des écrans d'origine à 12 $ et des copies à 5 $. Les copies se cassent souvent en deux semaines.",
    a: {
      label: 'Prendre les écrans d’origine',
      outcome: 'Tes réparations tiennent. Les clients te recommandent.',
      effects: { cash: -12, stock: 6, reputation: 6 },
      xp: 20,
      lesson:
        "Dans les services, la qualité est ta publicité. Un client satisfait en ramène trois ; un client déçu en fait fuir dix.",
    },
    b: {
      label: 'Prendre les copies',
      outcome: 'Les clients reviennent… pour se plaindre.',
      effects: { cash: -5, stock: 8, reputation: -8 },
      xp: 5,
      lesson:
        "Une pièce bon marché qui casse te coûte deux fois : la réparation gratuite et la réputation perdue. Propose les deux qualités, avec des prix et des garanties clairs.",
    },
  },
  {
    id: 'ss02',
    sector: 'services',
    category: 'energie',
    character: 'Technicien solaire',
    role: 'Vendeur de kits',
    avatar: '☀️',
    title: 'Sans courant, pas de clients',
    text: "Ton atelier et tes ordinateurs dépendent du courant. Un kit solaire avec batterie se paie en 3 fois. Sinon, carburant pour le groupe au jour le jour.",
    a: {
      label: 'Kit solaire en 3 paiements',
      outcome: 'Ton atelier tourne même pendant les coupures.',
      effects: { cash: -20, energy: 6, reputation: 3 },
      xp: 20,
      lesson:
        "Un investissement qui réduit une charge quotidienne se rembourse tout seul. Calcule combien de semaines de carburant il remplace.",
    },
    b: {
      label: 'Carburant au jour le jour',
      outcome: 'Tu paies chaque jour, et tu cours après l’essence.',
      effects: { cash: -8, energy: -4 },
      xp: 8,
      lesson:
        "Les petites dépenses répétées pèsent lourd en fin de mois. Additionne-les sur 30 jours avant de juger un investissement « trop cher ».",
    },
  },
  {
    id: 'ss03',
    sector: 'services',
    category: 'digital',
    character: 'DJ Fally',
    role: 'Influenceur local',
    avatar: '🤳🏿',
    title: 'La story sponsorisée',
    text: "Un influenceur du quartier (15 000 abonnés) propose de parler de ton atelier dans ses stories pour 25 $.",
    a: {
      label: 'Payer au résultat avec un code promo',
      outcome: 'Il accepte 8 $ plus 1 $ par client avec son code.',
      effects: { cash: -8, reputation: 6 },
      xp: 20,
      lesson:
        "Avec un influenceur, négocie une partie au résultat. Un code promo dédié permet de mesurer exactement combien de clients il t'apporte.",
    },
    b: {
      label: 'Payer 25 $ sans suivi',
      outcome: 'Beaucoup de likes, peu de clients réels.',
      effects: { cash: -25, reputation: 5 },
      xp: 8,
      lesson:
        "Des vues ne sont pas des ventes. Sans suivi, tu ne sauras jamais si ta publicité a rapporté plus qu'elle n'a coûté.",
    },
  },
  {
    id: 'ss04',
    sector: 'services',
    category: 'credit',
    character: 'Une ONG locale',
    role: 'Grosse commande',
    avatar: '🖨️',
    title: '200 rapports à imprimer',
    text: "Une ONG commande 200 rapports imprimés et reliés pour un atelier. Elle paiera « à 45 jours, après validation du financement ».",
    a: {
      label: 'Accepter avec 50 % d’acompte',
      outcome: 'L’acompte couvre papier et encre. Tu ne finances rien.',
      effects: { cash: 10, stock: -8, reputation: 4, energy: -6 },
      xp: 20,
      lesson:
        "L'acompte couvre tes coûts directs. Sur une grosse commande à paiement différé, ne finance jamais seul le travail de ton client.",
    },
    b: {
      label: 'Accepter sans acompte',
      outcome: 'Tu avances papier et encre… et le paiement tarde.',
      effects: { cash: -10, stock: -10, reputation: 5, energy: -6 },
      xp: 8,
      lesson:
        "Un gros client qui paie tard peut étrangler un petit atelier rentable. Ton besoin de trésorerie se calcule avant d'accepter.",
    },
  },
  {
    id: 'ss05',
    sector: 'services',
    category: 'equipe',
    character: 'Héritier',
    role: 'Ton meilleur technicien',
    avatar: '🧑🏿‍🔧',
    title: 'Le concurrent le débauche',
    text: "Un atelier concurrent propose 20 % de plus à Héritier, ton meilleur technicien. Il hésite et vient t'en parler.",
    a: {
      label: 'Proposer un bonus par réparation réussie',
      outcome: 'Il reste, plus motivé que jamais.',
      effects: { cash: -6, energy: 4, reputation: 2 },
      xp: 20,
      lesson:
        "Un bonus lié aux résultats ne coûte que si l'activité progresse. Garder un bon employé coûte presque toujours moins cher que d'en former un nouveau.",
    },
    b: {
      label: 'Le laisser partir',
      outcome: 'Tu reprends toutes les réparations seul. Les délais explosent.',
      effects: { energy: -12, reputation: -3 },
      xp: 8,
      lesson:
        "Dans un métier de service, les compétences sont ton vrai capital. Quand elles partent, tes clients suivent souvent.",
    },
  },
  {
    id: 'ss06',
    sector: 'services',
    category: 'mobile-money',
    character: 'Un client pressé',
    role: 'Récupère son téléphone',
    avatar: '⏱️',
    title: 'La capture d’écran',
    text: "Un client montre une capture d'écran de paiement Mobile Money de 15 $ et veut récupérer son téléphone réparé tout de suite.",
    a: {
      label: 'Vérifier ton solde avant de rendre',
      outcome: 'Le paiement est bien arrivé. Tout est en ordre.',
      effects: { energy: -1, reputation: 1 },
      xp: 20,
      lesson:
        "Une capture d'écran ou un SMS se falsifie facilement. Seul ton solde réel fait foi : vérifie toujours avant de remettre le service.",
    },
    b: {
      label: 'Rendre le téléphone sur la capture',
      outcome: 'La capture était fausse. Ni l’argent ni le client ne reviendront.',
      effects: { cash: -15, stock: -2 },
      xp: 5,
      lesson:
        "Les arnaques au faux paiement visent les commerçants pressés. Une règle simple et affichée (« livraison après réception ») évite les discussions.",
    },
  },
  {
    id: 'ss07',
    sector: 'services',
    category: 'digital',
    character: 'Grâce',
    role: 'Ta nièce, étudiante',
    avatar: '🗺️',
    title: 'Être sur la carte',
    text: "Grâce te montre que ton atelier n'apparaît pas sur Google Maps. Une fiche gratuite prend une heure. Un « web designer » propose un site complet pour 15 $.",
    a: {
      label: 'Créer la fiche gratuite avec photos',
      outcome: 'Des clients te trouvent en cherchant « réparation téléphone ».',
      effects: { reputation: 7, energy: -4 },
      xp: 20,
      lesson:
        "Commence par les outils gratuits qui amènent des clients : fiche Google, WhatsApp Business, page Facebook. Un site web vient plus tard.",
    },
    b: {
      label: 'Payer le site à 15 $',
      outcome: 'Le site existe, mais personne ne le trouve.',
      effects: { cash: -15, reputation: 3 },
      xp: 8,
      lesson:
        "Un site sans visiteurs est une vitrine dans une rue vide. Investis d'abord là où tes clients cherchent déjà.",
    },
  },
  {
    id: 'ss08',
    sector: 'services',
    category: 'admin',
    character: 'Le bailleur',
    role: 'Propriétaire du local',
    avatar: '🏠',
    title: 'Six mois d’avance',
    text: "Le propriétaire de ton local exige six mois de loyer d'avance (50 $) pour renouveler le bail.",
    a: {
      label: 'Négocier trois mois et un contrat écrit',
      outcome: 'Il accepte trois mois contre un contrat d’un an.',
      effects: { cash: -25, energy: -3 },
      xp: 20,
      lesson:
        "Tout se négocie, surtout avec un locataire fiable. Un bail écrit te protège contre les hausses et les expulsions surprises.",
    },
    b: {
      label: 'Payer les six mois',
      outcome: 'Tranquille pour six mois… mais ta caisse a fondu.',
      effects: { cash: -50, energy: 2 },
      xp: 8,
      lesson:
        "Payer d'avance immobilise ta trésorerie. Garde toujours de quoi faire tourner l'activité après une grosse dépense.",
    },
  },
  {
    id: 'ss09',
    sector: 'services',
    category: 'securite',
    character: 'Toi',
    role: 'Étagère des réparations',
    avatar: '📦',
    title: 'Le téléphone oublié',
    text: "Un téléphone réparé attend son propriétaire depuis deux mois. Un client te propose 12 $ pour l'acheter.",
    a: {
      label: 'Appeler le client et fixer une règle',
      outcome: 'Il revient payer. Désormais, ta fiche indique 30 jours maximum.',
      effects: { stock: 2, reputation: 3, energy: -3 },
      xp: 20,
      lesson:
        "Une fiche de dépôt signée (nom, numéro, délai, conditions) règle les litiges avant qu'ils n'arrivent.",
    },
    b: {
      label: 'Le revendre discrètement',
      outcome: 'Le propriétaire revient la semaine suivante. Scandale dans le quartier.',
      effects: { cash: 12, reputation: -12 },
      xp: 5,
      lesson:
        "Vendre un bien qui ne t'appartient pas détruit la confiance, la base d'un métier de service. Un petit gain, une grosse perte.",
    },
  },
  {
    id: 'ss10',
    sector: 'services',
    category: 'marketing',
    character: 'Toi',
    role: 'Nouvelle offre',
    avatar: '⚡',
    title: 'La réparation express',
    text: "Beaucoup de clients demandent si tu peux réparer « tout de suite ». Tu pourrais facturer l'express en 1 heure 30 % plus cher.",
    a: {
      label: 'Express sur un créneau limité',
      outcome: 'Matin seulement : bonne marge sans t’épuiser.',
      effects: { cash: 10, reputation: 4, energy: -8 },
      xp: 20,
      lesson:
        "Une offre premium augmente ta marge, mais ta capacité est limitée. Fixe un nombre maximum par jour pour tenir tes promesses.",
    },
    b: {
      label: 'Express pour tout le monde',
      outcome: 'Tu cours toute la journée et rates des délais.',
      effects: { cash: 14, reputation: -2, energy: -16 },
      xp: 8,
      lesson:
        "Promettre plus que ta capacité, c'est décevoir. Dans un service, ton temps est ton stock : il ne se multiplie pas.",
    },
  },
  {
    id: 'ss11',
    sector: 'services',
    category: 'concurrence',
    character: 'Le cyber d’en face',
    role: 'Concurrent',
    avatar: '🖨️',
    title: 'Impression à prix cassé',
    text: "Le cyber d'en face imprime à 50 FC la page, moins que ton coût de revient (papier, encre, courant).",
    a: {
      label: 'Garder ton prix et ajouter du service',
      outcome: 'Reliure, mise en page, conseil : les étudiants restent.',
      effects: { cash: -2, reputation: 4 },
      xp: 20,
      lesson:
        "Ne vends jamais sous ton coût de revient : chaque vente te ferait perdre de l'argent. Ajoute de la valeur au lieu de baisser le prix.",
    },
    b: {
      label: 'T’aligner sur son prix',
      outcome: 'Plus de clients, et plus de pertes à chaque page.',
      effects: { cash: -10, reputation: 2, energy: -4 },
      xp: 5,
      lesson:
        "Vendre plus à perte, c'est perdre plus vite. Ton concurrent ne tiendra peut-être pas, ne coule pas avec lui.",
    },
  },
  {
    id: 'ss12',
    sector: 'services',
    category: 'stock',
    character: 'La papeterie',
    role: 'Fournisseur de consommables',
    avatar: '📄',
    title: 'Le papier va augmenter',
    text: "La papeterie annonce une hausse de 15 % le mois prochain. Tu peux prendre 5 rames maintenant (15 $) ou un carton de 10 (30 $).",
    a: {
      label: 'Prendre 5 rames d’avance',
      outcome: 'Tu profites de l’ancien prix sans bloquer ta caisse.',
      effects: { cash: -15, stock: 12 },
      xp: 20,
      lesson:
        "Anticiper une hausse est malin, dans la limite de ce que tu consommes vraiment et de ce que ta trésorerie supporte.",
    },
    b: {
      label: 'Prendre le carton de 10',
      outcome: 'Belle économie… si tu écoules tout avant l’humidité.',
      effects: { cash: -30, stock: 22, energy: -2 },
      xp: 12,
      lesson:
        "Un stock d'avance doit être bien conservé (humidité, chaleur) et consommé avant de se dégrader. Sinon, l'économie se transforme en perte.",
    },
  },
  {
    id: 'ss13',
    sector: 'services',
    category: 'digital',
    character: 'Un « informaticien »',
    role: 'Installateur',
    avatar: '💿',
    title: 'Les logiciels piratés',
    text: "Pour équiper tes ordinateurs, un installateur propose des logiciels piratés « tout compris » pour 3 $. Des alternatives gratuites et légales existent.",
    a: {
      label: 'Logiciels libres et antivirus sérieux',
      outcome: 'Un peu de formation, puis des machines stables.',
      effects: { reputation: 3, energy: -4 },
      xp: 20,
      lesson:
        "LibreOffice, navigateurs à jour et antivirus gratuit couvrent la plupart des besoins d'un cyber. Pas de risque juridique, pas de virus caché.",
    },
    b: {
      label: 'Installer les logiciels piratés',
      outcome: 'Un virus efface des fichiers clients. Gros malaise.',
      effects: { cash: 3, stock: -6, reputation: -6 },
      xp: 5,
      lesson:
        "Les logiciels piratés contiennent souvent des virus. Perdre les documents d'un client coûte bien plus que la licence économisée.",
    },
  },
  {
    id: 'ss14',
    sector: 'services',
    category: 'famille',
    character: 'Tantine Bijou',
    role: 'Ta tante',
    avatar: '👵🏾',
    title: 'Réparations gratuites pour la famille',
    text: "« Tu es réparateur maintenant ! » Ta tante t'apporte cinq téléphones de la famille à réparer… gratuitement, bien sûr.",
    a: {
      label: 'Un tarif famille réduit mais payant',
      outcome: 'Elle râle un peu, puis paie les pièces.',
      effects: { cash: 2, reputation: 2, energy: -3 },
      xp: 20,
      lesson:
        "Un tarif famille montre ta générosité sans te ruiner. Les pièces et ton temps ont toujours un coût, même pour les proches.",
    },
    b: {
      label: 'Tout réparer gratuitement',
      outcome: 'La famille est ravie. Tes pièces et ta journée ont disparu.',
      effects: { stock: -8, reputation: 3, energy: -6 },
      xp: 8,
      lesson:
        "Les services gratuits répétés tuent les petits ateliers. Fixe une règle claire et applique-la à tout le monde.",
    },
  },
  {
    id: 'ss15',
    sector: 'services',
    category: 'caisse',
    character: 'Toi',
    role: 'Dépenses du quotidien',
    avatar: '📶',
    title: 'Le crédit téléphone',
    text: "Chaque jour, tu prends dans la caisse pour ton crédit téléphone et tes données internet. Tu ne sais plus ce qui est pro ou perso.",
    a: {
      label: 'Un forfait pro mensuel séparé',
      outcome: 'Une dépense fixe, connue, notée dans le journal.',
      effects: { cash: -5, energy: 2 },
      xp: 20,
      lesson:
        "Un forfait mensuel rend ta charge prévisible et souvent moins chère. Sépare le numéro pro du numéro perso pour y voir clair.",
    },
    b: {
      label: 'Continuer au jour le jour',
      outcome: 'En fin de mois, il manque 12 $ que tu n’expliques pas.',
      effects: { cash: -12 },
      xp: 5,
      lesson:
        "Les petites sommes prises sans les noter sont la première fuite de trésorerie. Ce qui n'est pas mesuré n'est pas maîtrisé.",
    },
  },
  {
    id: 'ss16',
    sector: 'services',
    category: 'equipe',
    character: 'Cédric',
    role: 'Livreur à moto',
    avatar: '🛵',
    title: 'Payer le livreur',
    text: "Tu lances la livraison à domicile. Cédric demande un salaire fixe de 60 $ par mois. Tu pourrais aussi le payer à la course.",
    a: {
      label: 'À la course, plus un bonus ponctualité',
      outcome: 'Ton coût suit les commandes, et Cédric est à l’heure.',
      effects: { cash: -6, reputation: 4, energy: 3 },
      xp: 20,
      lesson:
        "Au lancement d'un service, transforme tes charges fixes en charges variables : tu ne paies que quand tu gagnes.",
    },
    b: {
      label: 'Salaire fixe de 60 $',
      outcome: 'Cédric est content, mais les jours creux te coûtent cher.',
      effects: { cash: -20, reputation: 2, energy: 6 },
      xp: 10,
      lesson:
        "Une charge fixe se paie même sans activité. Passe au fixe quand le volume est stable et prouvé.",
    },
  },
  {
    id: 'ss17',
    sector: 'services',
    category: 'change',
    character: 'Kevin',
    role: 'Fournisseur de pièces',
    avatar: '💱',
    title: 'Pièces en dollars, clients en francs',
    text: "Tes pièces s'achètent en dollars, mais tes tarifs affichés en francs n'ont pas bougé depuis trois mois. Le franc a perdu 8 %.",
    a: {
      label: 'Indexer tes tarifs sur le taux du jour',
      outcome: 'Ta marge retrouve son niveau. Les clients comprennent.',
      effects: { cash: 6, reputation: -1, energy: -2 },
      xp: 20,
      lesson:
        "Indexer tes prix sur le dollar protège ta marge quand tes coûts sont en devises. Mets à jour ton affichage chaque semaine.",
    },
    b: {
      label: 'Garder les anciens tarifs',
      outcome: 'Chaque réparation te rapporte un peu moins.',
      effects: { cash: -14, reputation: 3 },
      xp: 8,
      lesson:
        "La dévaluation grignote ta marge en silence. Recalcule ton prix de vente à partir du coût actuel, pas de l'ancien.",
    },
  },

  // ───────────────────────── SECTEUR : AGRI-BUSINESS & TRANSFORMATION ─────────────────────────
  {
    id: 'sa01',
    sector: 'agri',
    category: 'transformation',
    character: 'Papa Kalala',
    role: 'Vendeur de matériel',
    avatar: '⚙️',
    title: 'Le moulin d’occasion',
    text: "Tu transformes du maïs en farine. Un moulin d'occasion est à vendre 120 $ (60 $ tout de suite). Sinon, tu continues à payer le meunier à la tâche.",
    a: {
      label: 'Rester au meunier pour l’instant',
      outcome: 'Tu paies à chaque sac, mais ta caisse reste souple.',
      effects: { cash: -8, stock: 10, energy: -3 },
      xp: 20,
      lesson:
        "Achète un équipement quand ton volume est stable et prouvé. Avant, payer à la tâche transforme une charge fixe en charge variable.",
    },
    b: {
      label: 'Acheter le moulin',
      outcome: 'Belle machine… qui tombe en panne au bout d’une semaine.',
      effects: { cash: -60, stock: 16, energy: -6 },
      xp: 8,
      lesson:
        "Une machine d'occasion cache souvent des frais : pièces, entretien, carburant. Fais-la tester et chiffre ces coûts avant de payer.",
    },
  },
  {
    id: 'sa02',
    sector: 'agri',
    category: 'agri',
    character: 'Le chauffeur',
    role: 'Transport de la récolte',
    avatar: '🌧️',
    title: 'Route coupée par la pluie',
    text: "La pluie a coupé la route. Ton camion de manioc est bloqué à 30 km. Des porteurs et une pirogue peuvent le ramener pour 14 $.",
    a: {
      label: 'Payer porteurs et pirogue',
      outcome: 'La récolte arrive à temps, avant de pourrir.',
      effects: { cash: -14, stock: 12, energy: -6 },
      xp: 20,
      lesson:
        "Dans l'agri-business, la logistique fait la marge. Prévois toujours un budget « imprévus transport » en saison des pluies.",
    },
    b: {
      label: 'Attendre que la route sèche',
      outcome: 'Une partie du manioc a pourri dans le camion.',
      effects: { stock: -12, reputation: -3 },
      xp: 8,
      lesson:
        "Un produit périssable perd de la valeur chaque jour. Le coût de l'attente est souvent plus élevé que celui de la solution.",
    },
  },
  {
    id: 'sa03',
    sector: 'agri',
    category: 'transformation',
    character: 'Maman Rose',
    role: 'Ton associée',
    avatar: '🫚',
    title: 'Les bouteilles de jus',
    text: "Pour votre jus de gingembre, Maman Rose propose des bouteilles récupérées lavées à la main. Des bouteilles neuves avec étiquette coûtent 12 $ de plus par lot.",
    a: {
      label: 'Bouteilles neuves et étiquette datée',
      outcome: 'Le jus inspire confiance. Une épicerie veut te référencer.',
      effects: { cash: -12, reputation: 8 },
      xp: 20,
      lesson:
        "Pour un produit alimentaire, l'hygiène et l'étiquette (date, ingrédients, contact) sont ta garantie. C'est aussi ce qui ouvre les portes des magasins.",
    },
    b: {
      label: 'Bouteilles récupérées',
      outcome: 'Un lot fermente : des clients se plaignent.',
      effects: { cash: 2, stock: -3, reputation: -7 },
      xp: 5,
      lesson:
        "Économiser sur l'emballage d'un aliment, c'est risquer la santé de tes clients et ta réputation. Certaines économies coûtent très cher.",
    },
  },
  {
    id: 'sa04',
    sector: 'agri',
    category: 'admin',
    character: 'Le supermarché',
    role: 'Responsable des achats',
    avatar: '🏷️',
    title: 'La certification qualité',
    text: "Un supermarché veut ta farine, mais exige un certificat de l'organisme de contrôle qualité. Démarches et analyses : environ 20 $.",
    a: {
      label: 'Lancer la certification',
      outcome: 'Des démarches pénibles, puis un nouveau débouché.',
      effects: { cash: -20, reputation: 9, energy: -5 },
      xp: 25,
      lesson:
        "Les normes et certificats coûtent, mais ils ouvrent des marchés plus stables et mieux payés. C'est un investissement, pas une taxe.",
    },
    b: {
      label: 'Rester au marché',
      outcome: 'Pas de paperasse, pas de croissance non plus.',
      effects: { energy: 2 },
      xp: 10,
      lesson:
        "Rester petit est un choix légitime. Mais sans formalisation, certains clients (supermarchés, ONG, export) resteront fermés.",
    },
  },
  {
    id: 'sa05',
    sector: 'agri',
    category: 'fournisseur',
    character: 'Les planteurs de Mbankana',
    role: 'Producteurs partenaires',
    avatar: '👨🏿‍🌾',
    title: 'Préfinancer la récolte',
    text: "Les planteurs proposent de te réserver leur récolte si tu avances 30 % maintenant. Sinon, tu achèteras au marché au prix du jour.",
    a: {
      label: 'Préfinancer avec un contrat écrit',
      outcome: 'Ta matière première est sécurisée à bon prix.',
      effects: { cash: -25, stock: 18, reputation: 3 },
      xp: 20,
      lesson:
        "Un contrat d'achat anticipé sécurise ton approvisionnement et ton prix. Écris quantités, qualité, prix et date : c'est ce qui le rend fiable.",
    },
    b: {
      label: 'Acheter au marché au jour le jour',
      outcome: 'Tu cours les marchés et les prix montent en fin de saison.',
      effects: { cash: -15, stock: 8, energy: -4 },
      xp: 10,
      lesson:
        "Sans contrat, tu subis la variation des prix agricoles. La relation avec tes producteurs est un avantage que tes concurrents n'ont pas.",
    },
  },
  {
    id: 'sa06',
    sector: 'agri',
    category: 'stock',
    character: 'Maman Rose',
    role: 'Ton associée',
    avatar: '🍅',
    title: 'Les tomates s’abîment',
    text: "Grosse récolte de tomates : le marché est saturé et elles commencent à s'abîmer. Vous pourriez les transformer en purée séchée.",
    a: {
      label: 'Transformer en purée',
      outcome: 'Un jour de travail intense, et un produit qui se garde des mois.',
      effects: { cash: -4, stock: 8, energy: -6 },
      xp: 20,
      lesson:
        "La transformation allonge la durée de vie d'un produit et ajoute de la valeur. C'est la meilleure réponse aux pertes après récolte.",
    },
    b: {
      label: 'Brader au marché',
      outcome: 'Tu récupères un peu d’argent, très en dessous du prix normal.',
      effects: { cash: 8, stock: -10 },
      xp: 10,
      lesson:
        "Brader limite la perte, mais quand tout le monde récolte en même temps, les prix s'effondrent. Prévois une solution de conservation avant la récolte.",
    },
  },
  {
    id: 'sa07',
    sector: 'agri',
    category: 'marketing',
    character: 'Le supermarché',
    role: 'Responsable des achats',
    avatar: '🛒',
    title: 'Le référencement',
    text: "Le supermarché propose de référencer ta farine : il prend 25 % de marge et paie à 60 jours. Il veut 200 paquets dès la première livraison.",
    a: {
      label: 'Négocier un test de 50 paquets',
      outcome: 'Petit volume, peu de risque : tu observes les ventes.',
      effects: { cash: -4, stock: -6, reputation: 6 },
      xp: 20,
      lesson:
        "Avec un gros client qui paie tard, commence petit. Tu mesures la demande sans bloquer toute ta trésorerie dans ses rayons.",
    },
    b: {
      label: 'Livrer les 200 paquets',
      outcome: 'Ta farine est en rayon… et ta caisse attend 60 jours.',
      effects: { cash: -8, stock: -18, reputation: 8, energy: -4 },
      xp: 8,
      lesson:
        "Le délai de paiement d'un client se finance avec ta propre trésorerie. Calcule combien de semaines tu peux tenir avant de dire oui.",
    },
  },
  {
    id: 'sa08',
    sector: 'agri',
    category: 'equipe',
    character: 'Les transformatrices',
    role: 'Équipe de production',
    avatar: '👩🏿‍🍳',
    title: 'Payer à la journée ou au rendement ?',
    text: "Tes six transformatrices sont payées à la journée. La production varie beaucoup d'un jour à l'autre.",
    a: {
      label: 'Paie à la quantité de qualité, plus un repas',
      outcome: 'La production augmente et la qualité suit.',
      effects: { cash: -8, stock: 8, energy: 3 },
      xp: 20,
      lesson:
        "Payer au rendement aligne l'effort sur le résultat, à condition de contrôler la qualité. Le repas offert est un petit coût qui fidélise.",
    },
    b: {
      label: 'Garder la paie journalière',
      outcome: 'Rien ne change : production irrégulière.',
      effects: { cash: -10, stock: 4 },
      xp: 8,
      lesson:
        "Une paie fixe sans objectif ne récompense pas l'effort. Fixe au moins un objectif journalier clair.",
    },
  },
  {
    id: 'sa09',
    sector: 'agri',
    category: 'energie',
    character: 'Un formateur de l’ONG',
    role: 'Programme agricole',
    avatar: '🔆',
    title: 'Le séchoir solaire',
    text: "Tu sèches le manioc au feu de bois : cher, fatigant, et la fumée donne un goût. Un séchoir solaire simple coûte 15 $ de matériel.",
    a: {
      label: 'Construire le séchoir solaire',
      outcome: 'Séchage plus propre, moins de bois, moins de fatigue.',
      effects: { cash: -15, stock: 4, reputation: 3, energy: 5 },
      xp: 20,
      lesson:
        "Un petit investissement qui réduit une charge et améliore la qualité est souvent le plus rentable de tous.",
    },
    b: {
      label: 'Continuer au feu de bois',
      outcome: 'Tu achètes du bois chaque semaine et l’équipe s’épuise.',
      effects: { cash: -4, reputation: -2, energy: -8 },
      xp: 8,
      lesson:
        "Les habitudes coûtent cher quand elles ne sont jamais remises en question. Compare chaque mois tes coûts d'énergie.",
    },
  },
  {
    id: 'sa10',
    sector: 'agri',
    category: 'credit',
    character: 'La coopérative',
    role: 'Entrepôt et crédit',
    avatar: '🏚️',
    title: 'Le warrantage',
    text: "Juste après la récolte, le maïs est au plus bas. La coopérative propose de stocker tes sacs dans son entrepôt et de te prêter du cash dessus.",
    a: {
      label: 'Warrantage : stocker et emprunter',
      outcome: 'Tu as du cash maintenant et tu vendras plus cher en soudure.',
      effects: { cash: 25, stock: -10, energy: -2 },
      xp: 25,
      lesson:
        "Le warrantage utilise ton stock comme garantie : tu obtiens du cash sans brader. Tu vends ensuite quand les prix remontent.",
    },
    b: {
      label: 'Tout vendre maintenant',
      outcome: 'Du cash tout de suite, au plus mauvais prix de l’année.',
      effects: { cash: 20, stock: -18 },
      xp: 8,
      lesson:
        "Vendre quand tout le monde vend, c'est accepter le prix le plus bas. Le stockage et le crédit sur stock créent de la valeur.",
    },
  },
  {
    id: 'sa11',
    sector: 'agri',
    category: 'import',
    character: 'Un agent commercial',
    role: 'Emballages importés',
    avatar: '📦',
    title: 'Les sachets imprimés',
    text: "Un agent propose des sachets imprimés à ton logo, importés d'Asie : minimum 5 000 pièces pour 45 $. Un imprimeur local fait des étiquettes à la demande.",
    a: {
      label: 'Étiquettes locales à la demande',
      outcome: 'Moins joli, mais tu paies selon ta production.',
      effects: { cash: -10, stock: 2, reputation: 4 },
      xp: 20,
      lesson:
        "Une quantité minimum de commande élevée immobilise ta trésorerie pour des mois. Au début, la flexibilité vaut plus que le prix unitaire.",
    },
    b: {
      label: 'Commander 5 000 sachets',
      outcome: 'Superbes sachets… de quoi tenir deux ans.',
      effects: { cash: -45, reputation: 6, energy: -4 },
      xp: 8,
      lesson:
        "Un prix unitaire bas sur une énorme quantité peut coûter plus cher qu'un prix élevé sur ce dont tu as besoin. Compte en mois de consommation.",
    },
  },
  {
    id: 'sa12',
    sector: 'agri',
    category: 'concurrence',
    character: 'Les importateurs',
    role: 'Farine importée',
    avatar: '🚢',
    title: 'La farine importée moins chère',
    text: "Une farine importée arrive moins chère que la tienne. Un intermédiaire te suggère d'en mélanger dans tes sacs « 100 % local ».",
    a: {
      label: 'Miser sur le frais et le local',
      outcome: 'Tes clients fidèles paient pour le goût et l’origine.',
      effects: { cash: -3, reputation: 6, energy: -4 },
      xp: 20,
      lesson:
        "Le « local et frais » est un vrai argument de vente, si tu le prouves : origine, date de production, goût. C'est ta différence.",
    },
    b: {
      label: 'Mélanger en douce',
      outcome: 'Un client remarque la différence et le dit partout.',
      effects: { cash: 6, reputation: -10 },
      xp: 5,
      lesson:
        "Tromper sur la composition détruit la confiance et peut être puni par la loi. Une étiquette doit dire la vérité.",
    },
  },
  {
    id: 'sa13',
    sector: 'agri',
    category: 'famille',
    character: 'Tes frères',
    role: 'Champ familial',
    avatar: '🌱',
    title: 'La récolte du champ familial',
    text: "Tu transformes aussi le manioc du champ familial. Tes frères pensent que tu peux le prendre gratuitement, « puisque c'est la famille ».",
    a: {
      label: 'Acheter leur part à un prix juste',
      outcome: 'Tout le monde gagne, et la paix familiale est préservée.',
      effects: { cash: -12, stock: 12, reputation: 2 },
      xp: 20,
      lesson:
        "Même en famille, chaque matière première a un prix. Un accord écrit évite que la réussite de ton business crée des jalousies.",
    },
    b: {
      label: 'Prendre sans payer',
      outcome: 'Tes frères t’en veulent et ralentissent la récolte suivante.',
      effects: { stock: 14, reputation: -6, energy: -6 },
      xp: 5,
      lesson:
        "Ne pas payer la matière première fausse ton coût de revient : tu crois gagner plus que la réalité. Et les tensions finissent par coûter cher.",
    },
  },
  {
    id: 'sa14',
    sector: 'agri',
    category: 'mobile-money',
    character: 'Les planteurs',
    role: 'Paiement des producteurs',
    avatar: '📲',
    title: 'Payer en brousse',
    text: "Tu dois payer 15 planteurs dans trois villages. Tu peux transporter le cash en moto, ou payer chacun par Mobile Money.",
    a: {
      label: 'Payer par Mobile Money',
      outcome: 'Payés en une heure, avec un reçu pour chacun.',
      effects: { cash: -2, reputation: 3, energy: 4 },
      xp: 20,
      lesson:
        "Le paiement mobile réduit le risque de vol, fait gagner du temps et laisse une trace pour ta comptabilité et tes producteurs.",
    },
    b: {
      label: 'Transporter le cash',
      outcome: 'Une journée entière de route avec une grosse somme sur toi.',
      effects: { energy: -8 },
      xp: 8,
      lesson:
        "Transporter du cash sur des routes isolées est risqué. Les frais de transfert sont une assurance bon marché.",
    },
  },
  {
    id: 'sa15',
    sector: 'agri',
    category: 'securite',
    character: 'Ton magasinier',
    role: 'Entrepôt',
    avatar: '🐛',
    title: 'Les charançons',
    text: "Des charançons attaquent les sacs de maïs de l'entrepôt. Un vendeur propose un insecticide non homologué très bon marché.",
    a: {
      label: 'Traitement homologué et sacs hermétiques',
      outcome: 'Plus cher, mais ton maïs reste sain et vendable.',
      effects: { cash: -10, stock: -2, reputation: 2 },
      xp: 20,
      lesson:
        "Pour un produit alimentaire, n'utilise que des traitements autorisés. Les sacs hermétiques protègent sans aucun produit chimique.",
    },
    b: {
      label: 'L’insecticide pas cher',
      outcome: 'Une odeur suspecte : des clients refusent ta farine.',
      effects: { cash: -3, reputation: -10 },
      xp: 5,
      lesson:
        "Un produit chimique non contrôlé met la santé de tes clients en danger. Le prix bas d'aujourd'hui peut fermer ton entreprise demain.",
    },
  },
  {
    id: 'sa16',
    sector: 'agri',
    category: 'change',
    character: 'Un acheteur de Brazzaville',
    role: 'Client à l’export',
    avatar: '🛶',
    title: 'Vendre de l’autre côté du fleuve',
    text: "Un acheteur de Brazzaville veut 20 bidons d'huile de palme. Il propose de payer en FCFA, à son propre taux de conversion.",
    a: {
      label: 'Exiger un acompte en dollars',
      outcome: 'Il accepte : tu es protégé contre le change et l’impayé.',
      effects: { cash: 12, stock: -10, energy: -3 },
      xp: 20,
      lesson:
        "À l'export, fixe la devise, le taux et l'acompte avant de livrer. Le risque de change et le risque d'impayé se négocient au départ.",
    },
    b: {
      label: 'Accepter les FCFA à son taux',
      outcome: 'La vente se fait, mais le taux t’a coûté une partie de ta marge.',
      effects: { cash: 6, stock: -10, energy: -3 },
      xp: 8,
      lesson:
        "Accepter le taux de ton client, c'est lui laisser fixer ta marge. Vérifie toujours le taux officiel du jour.",
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
          { id: 'q37', kind: 'situation', question: "Un client vient de te payer 20 $. Ce soir, tu dois payer 15 $ pour une dépense de la maison. Que fais-tu ?", options: ['Je prends les 15 $ dans la recette sans rien noter', 'Je paie avec mon salaire, ou je note un retrait sur mon salaire', 'Je reporte la dépense de la maison'], answer: 1, explanation: "La recette appartient à la boutique. Si tu dois puiser dedans, note-le comme une avance sur ton salaire : ta caisse reste juste." },
          { id: 'q38', kind: 'calcul', question: 'Ton salaire est de 50 $ par mois. Tu as déjà retiré 3 fois 15 $ ce mois-ci. Combien peux-tu encore te verser ?', options: ['5 $', '15 $', '35 $', '0 $'], answer: 0, explanation: "3 × 15 = 45 $ déjà pris, donc 50 – 45 = 5 $. Au-delà, tu ne te paies plus : tu prends dans le capital de la boutique." },
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
          { id: 'q39', kind: 'calcul', question: 'Semaine : ventes 120 $, achats de stock 70 $, petites dépenses 15 $. Quel est le solde de la semaine ?', options: ['50 $', '35 $', '85 $', '205 $'], answer: 1, explanation: "120 – 70 – 15 = 35 $. Les petites dépenses (transport, crédit téléphone) comptent autant que les achats." },
          { id: 'q40', kind: 'qcm', question: 'Quand faut-il noter une vente dans le cahier de caisse ?', options: ['En fin de mois', 'Tout de suite, ou au plus tard le soir même', 'Seulement pour les grosses ventes'], answer: 1, explanation: "La mémoire oublie vite. Noter le jour même garde un cahier fiable, et les petites ventes font le gros du chiffre." },
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
          { id: 'q41', kind: 'vrai-faux', question: '« Ma réserve de sécurité peut servir à acheter du stock en promotion. »', options: ['Vrai', 'Faux'], answer: 1, explanation: "Faux : la réserve sert aux coups durs (maladie, vol, coupure, saisie). Une promotion se finance avec le fonds de roulement, pas avec le coussin de sécurité." },
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
          { id: 'q42', kind: 'calcul', question: 'Un carton de 24 bouteilles coûte 12 $, plus 1,20 $ de transport. Coût de revient d’une bouteille ?', options: ['0,50 $', '0,55 $', '0,60 $', '0,05 $'], answer: 1, explanation: "(12 + 1,20) ÷ 24 = 0,55 $. Si tu calcules ton prix à partir de 0,50 $, tu perds 0,05 $ de marge sur chaque bouteille." },
          { id: 'q43', kind: 'situation', question: 'Sur chaque plateau de 30 œufs, 2 arrivent cassés. Que fais-tu de cette perte ?', options: ["Je l'ignore, c'est peu", 'Je l’inclus dans mon coût de revient', 'Je retiens le prix sur le salaire du livreur'], answer: 1, explanation: "Si tu paies 30 œufs et n'en vends que 28, ton coût réel par œuf est le prix du plateau divisé par 28, pas par 30." },
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
          { id: 'q44', kind: 'calcul', question: 'Coût 6 $. Tu veux 25 % de marge sur le prix de vente. Quel prix ?', options: ['7,50 $', '8 $', '6,25 $', '9 $'], answer: 1, explanation: "Prix = coût ÷ (1 – marge) = 6 ÷ 0,75 = 8 $. Vérification : 2 $ de bénéfice sur 8 $, c'est bien 25 %." },
          { id: 'q45', kind: 'vrai-faux', question: '« Si je suis plus cher que mon voisin, je perds forcément tous mes clients. »', options: ['Vrai', 'Faux'], answer: 1, explanation: "Faux : les clients paient aussi pour l'accueil, la proximité, la disponibilité et la confiance. Le prix n'est qu'un critère parmi d'autres." },
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
          { id: 'q46', kind: 'calcul', question: 'Tu achètes un sac à 20 $. Le taux passe de 2 800 à 2 950 FC/$. Nouveau coût du sac en FC ?', options: ['56 000 FC', '59 000 FC', '57 500 FC', '62 000 FC'], answer: 1, explanation: "20 × 2 950 = 59 000 FC, contre 56 000 FC avant. Ton prix de vente en FC doit suivre, sinon ta marge disparaît." },
          { id: 'q47', kind: 'situation', question: 'Le taux de change bouge chaque semaine. Comment gérer tes prix affichés ?', options: ['Je les écris une fois pour toutes', 'Une grille de prix mise à jour chaque semaine selon le taux', 'Je ne mets aucun prix et je négocie tout'], answer: 1, explanation: "Une grille mise à jour régulièrement protège ta marge et reste claire pour les clients. Les prix changent peu à peu, pas brutalement." },
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
          { id: 'q48', kind: 'calcul', question: 'Tes ardoises clients totalisent 45 $. Ta caisse contient 30 $. Quelle part de ton argent est chez les clients ?', options: ['60 %', '45 %', '30 %', '150 %'], answer: 0, explanation: "45 ÷ (45 + 30) = 60 %. Plus de la moitié de ton argent est entre les mains des clients : c'est le signal pour freiner le crédit." },
          { id: 'q49', kind: 'qcm', question: 'Un client ne rembourse pas à la date prévue. Que fais-tu en premier ?', options: ['Je le dénonce devant tout le quartier', 'Je le relance poliment et je fixe une nouvelle date écrite', "J'efface la dette pour garder l'ami"], answer: 1, explanation: "Une relance polie et une nouvelle date écrite préservent la relation. Et pas de nouveau crédit tant que l'ancien n'est pas soldé." },
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
          { id: 'q50', kind: 'situation', question: 'Ta meilleure cliente achète chaque jour. Comment la remercier sans casser ta marge ?', options: ['Baisser tous mes prix de 20 %', 'Une carte de fidélité : un petit produit offert après 10 achats', 'Rien, elle viendra de toute façon'], answer: 1, explanation: "La carte de fidélité récompense la régularité et ne coûte qu'un petit produit (au prix d'achat) après 10 ventes." },
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
          { id: 'q51', kind: 'calcul', question: 'Tu reçois 200 $ par mois en Mobile Money. Retirer coûte 1,5 %. Combien économises-tu en payant ton fournisseur directement par mobile ?', options: ['3 $', '1,50 $', '15 $', '30 $'], answer: 0, explanation: "200 × 1,5 % = 3 $ par mois, soit 36 $ par an. Garder l'argent sur le mobile pour payer tes fournisseurs évite les frais de retrait." },
          { id: 'q52', kind: 'qcm', question: 'Ton code PIN Mobile Money doit être…', options: ['Connu de ton vendeur pour aller plus vite', "Secret, et changé si quelqu'un l'a vu", 'Écrit au dos du téléphone'], answer: 1, explanation: "Le PIN est la clé de ta caisse mobile. Donne à ton vendeur un compte ou un numéro à part si besoin, jamais ton code." },
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
          { id: 'q53', kind: 'calcul', question: 'Ton vendeur a un fixe de 40 $ + 5 % des ventes. Il vend pour 600 $ ce mois-ci. Combien le paies-tu ?', options: ['70 $', '45 $', '30 $', '100 $'], answer: 0, explanation: "40 + (600 × 5 %) = 40 + 30 = 70 $. Le bonus n'est versé que parce que les ventes sont là." },
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
          { id: 'q54', kind: 'calcul', question: 'Un prêteur du quartier demande 10 % par semaine. Intérêts sur 50 $ pendant 4 semaines (intérêts simples) ?', options: ['5 $', '20 $', '10 $', '40 $'], answer: 1, explanation: "50 × 10 % × 4 = 20 $, soit 40 % en un mois ! Très peu d'activités rapportent autant : c'est un piège à éviter." },
          { id: 'q55', kind: 'situation', question: 'Tu es dans une tontine de 10 personnes à 20 $ par mois. Quand demander à toucher la cagnotte ?', options: ['Au hasard', "Quand j'ai un achat de stock précis et rentable à faire", 'Le plus tôt possible, pour une fête'], answer: 1, explanation: "La cagnotte est un financement sans intérêts : utilise-la pour un investissement chiffré, pas pour de la consommation." },
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
          { id: 'q56', kind: 'calcul', question: 'Ton 2e kiosque fait 90 $ de marge par mois. Loyer 30 $, vendeur 45 $. Quel bénéfice ?', options: ['15 $', '90 $', '45 $', '60 $'], answer: 0, explanation: "90 – 30 – 45 = 15 $. C'est positif mais fragile : une mauvaise semaine et le kiosque coûte plus qu'il ne rapporte." },
        ],
      },
    ],
  },
];

export const ALL_LESSONS = LEARNING_MODULES.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })));
export const TOTAL_QUIZ_COUNT = ALL_LESSONS.reduce((n, l) => n + l.quiz.length, 0);
