// ══════════════════════════════════════════════════════════════
//  DATA — Mission Lumio Health BC2
//  PAC · Parcours Activation Compétences · Éminéo · MSMC RNCP 38504
// ══════════════════════════════════════════════════════════════

window.LUMIO_DATA = {

  // ─── Identité de l'étudiant·e (placeholder, remplacé à la connexion) ────
  student: {
    name: "Lou Bertrand",
    role: "Consultant·e externe — Stratégie marcom",
    email: "lou.bertrand@consult.fr",
    company: "Indépendant·e"
  },

  // ─── Contexte Lumio (fiche autonome — dossier Finder dès le démarrage) ──
  contexte: {
    title: "Fiche contexte — Lumio Health",
    subtitle: "À lire en premier si vous découvrez l'univers",
    body: `QUI EST LUMIO HEALTH ?

Lumio Health est une medtech parisienne fondée en 2018 par Théo Marczak, 
spécialisée dans la mesure du stress chronique en milieu professionnel.

Son produit phare : le Lumio Patch — un capteur physiologique porté au poignet 
qui mesure variabilité cardiaque, conductance cutanée et température, traités 
par un algorithme propriétaire pour produire un « score de stress » continu.

Pendant 8 ans, Lumio a vendu exclusivement en B2B — DRH de grandes entreprises 
et ETI, médecins du travail, mutuelles. 180 références actives. Données 
propriétaires accumulées sur 8 ans, actif rare dans le secteur.

LA RUPTURE — 2025

En 2025, Northgate Capital (fonds américain) entre au capital via une Série B 
de 22 M$. Condition implicite : Lumio doit atteindre 20 M€ de CA en 36 mois 
en passant du B2B au grand public (B2C).

Théo Marczak (CEO fondateur) résiste. Sonia Ferracci (Directrice Marketing, 
arrivée janvier 2026) pousse le pivot. Jakob Rein (partner Northgate) arbitre.

LE PROBLÈME RÉGLEMENTAIRE

Le règlement européen MDR impose une certification de classe IIa pour tout 
dispositif revendiquant une fonction médicale. Biostream l'a obtenue en 
janvier 2026. Neuroflow en mars 2026. Lumio est en procédure — délai estimé : 
fin Q2 2027 dans le meilleur scénario.

Sans MDR, Lumio ne peut pas légalement revendiquer une fonction médicale. 
En B2B, les DRH commencent à poser la question. En B2C, c'est rédhibitoire.

LES PERSONNAGES CLÉS

— Théo Marczak · CEO fondateur
  Pro-B2B, anti-pivot précipité, bloque sur la MDR. 8 ans de construction
  minutieuse. Méfiant vis-à-vis du fonds.

— Sonia Ferracci · Directrice Marketing
  Arrivée de l'extérieur avec un mandat de pivot. Pro-B2C, veut lancer
  maintenant. Budget demandé : 380 000 €.

— Jakob Rein · Partner, Northgate Capital
  Investisseur américain. Objectif unique : retour sur investissement. 
  Impatient. A une clause de sortie si le pivot n'est pas engagé.

— Camille Ott · Responsable partenariats B2B
  8 ans de terrain. Connaît les vrais chiffres. Sait que la fenêtre B2B 
  se ferme mais voit aussi sa valeur persistante.

— Yassine Morel · Content Manager
  Produit la veille concurrentielle. Travail sérieux mais incomplet — 
  Théo a refusé de communiquer certaines informations.

OÙ EN EST-ON EN OCTOBRE 2026 ?

Sonia a présenté une plateforme de marque au CODIR de septembre. Théo l'a 
validée avec réserves. Le board Northgate se tient vendredi. Jakob Rein attend 
une recommandation stratégique pour les 36 prochains mois — une position 
claire sur le B2B/B2C, chiffrée et défendable.

Personne n'a encore produit ce document.`
  },

  // ─── Email de mission — Théo → étudiant·e ───────────────────────────────
  briefEmail: {
    from: "Théo Marczak <theo@lumio-health.com>",
    to: "lou.bertrand@consult.fr",
    subject: "Mission urgente — Board Northgate vendredi",
    date: "Lundi 12 octobre 2026, 07h19",
    body: `Lou,

Je vais être direct parce qu'on n'a pas le temps.

Le board Northgate Capital se tient vendredi matin. Jakob Rein arrive de 
New York mercredi soir. Il m'a fait savoir — par mail, pas en réunion — 
qu'il attend une recommandation stratégique écrite pour les 36 prochains mois.

Pas un audit. Pas une liste d'options. Une recommandation. Un scénario retenu, 
argumenté, avec des objectifs et une projection budgétaire.

Sonia est convaincue qu'il faut annoncer le pivot B2C maintenant. Je ne suis 
pas d'accord, et je ne peux pas défendre cette position sans avoir résolu le 
problème MDR. Mais je ne veux pas non plus arriver devant Jakob avec un 
"attendons" — il ne l'acceptera pas.

Ce que je vous demande : produire la recommandation que Lumio va défendre 
vendredi. Pas ma position, pas celle de Sonia — la bonne position, celle qui 
tient face à un investisseur qui connaît ses chiffres et qui a une clause de 
sortie dans sa poche.

Vous avez accès à tout ce dont vous avez besoin sur votre espace. Deck board 
Q3, note interne, veille concurrentielle, verbatims terrain. Lisez tout avant 
de commencer.

Une chose à savoir : j'ai demandé à Sonia de vous mettre en copie des échanges 
avec Jakob. Utilisez-les comme vous le jugez utile. 

Une chose à ne pas savoir, officiellement : j'ai signé en septembre un accord 
de principe avec un distributeur B2C. Je ne l'ai pas annoncé au board. C'est 
dans votre dossier. Faites-en ce que vous voulez.

Théo Marczak
CEO — Lumio Health
+33 6 ▒▒ ▒▒ ▒▒ ▒▒`
  },

  // ─── Email confidentiel — Jakob → Théo ──────────────────────────────────
  jakobEmail: {
    from: "Jakob Rein <j.rein@northgate-capital.com>",
    to: "Théo Marczak <theo@lumio-health.com>",
    subject: "Board Friday — what I expect",
    date: "Vendredi 9 octobre 2026, 16h44",
    tag: "CONFIDENTIEL — transmis par Sonia",
    body: `Théo,

Short version : I need one scenario. Not three. One.

The scenario must include :
— Clear B2B / B2C allocation for the next 36 months
— Revenue objectives (monthly, quarterly, end of period)
— A communication strategy aligned with the positioning
— A realistic budget with a ceiling
— Two identified risks and how you plan to address them

If the recommendation is "wait for MDR", that's acceptable — but only with a 
binding MDR timeline from the notified body, in writing, attached to the 
document. Not an estimate. A commitment.

If the recommendation is "go B2C now", I need to understand how you sell 
a non-certified medical device to consumers in a post-MDR European market.

I've read Sonia's brand platform. It's a good document. It's not a strategy.

I'll be at the office Wednesday evening. I'd like to see a draft before dinner.

J.

—
Jakob Rein · Partner, Northgate Capital
+1 917 ▒▒▒ ▒▒▒▒`
  },

  // ─── Deck board Q3 (résumé — affiché dans PDF Viewer) ───────────────────
  deckBoard: {
    title: "Lumio Health — Board Q3 2026",
    subtitle: "Revue trimestrielle · Confidentiel Northgate Capital",
    date: "Préparé par Sonia Ferracci — 8 octobre 2026",
    slides: [
      {
        titre: "Chiffres clés Q3",
        contenu: `Chiffre d'affaires YTD : 4,2 M€ (+8 % vs N-1)
ARR B2B : 5,1 M€
Churn annualisé : 4,1 %
Nouveaux clients B2B Q3 : 7
Pipeline qualifié Q4 : 890 K€
NPS clients B2B : 67`
      },
      {
        titre: "Portefeuille clients",
        contenu: `Clients actifs facturés : 230 entreprises
Répartition sectorielle : Services 38% · Industrie 29% · Santé 18% · Public 15%
Top 10 clients : 41 % du CA
Durée moyenne contrat : 2,8 ans
Taux de renouvellement (12 mois glissants) : 89 %`
      },
      {
        titre: "Marché & concurrence",
        contenu: `Biostream (Flow Patch Pro) : certifié MDR IIa jan. 2026 — hausse prix +22 %
Neuroflow (Calm Band) : certifié MDR IIa mars 2026 — partenariat Fnac
Apple Watch S10 : pas dans le scope MDR — marché grand public
Withings ScanWatch 2 : statut MDR non communiqué

Lumio MDR : procédure en cours — "avancement selon calendrier prévu"`
      },
      {
        titre: "Projection B2C — scénario Northgate",
        contenu: `Marché adressable B2C France : 12 M de personnes (actifs 30-50, urbains, CSP+)
Objectif part de marché an 3 : 0,8 % soit ~96 000 utilisateurs
CA B2C cible an 3 : 14,4 M€ (abonnement 150 €/an)
Investissement marketing estimé : 8,2 M€ sur 36 mois
Break-even B2C : mois 28

Hypothèse clé : lancement Q2 2027 post-MDR`
      },
      {
        titre: "Budget marketing demandé",
        contenu: `Phase 1 (oct. 2026 – sept. 2027) : 380 000 €
  — Création & production : 85 000 €
  — Événementiel B2B : 60 000 €
  — Digital & content : 95 000 €
  — Relations presse & influence : 70 000 €
  — Études & data : 40 000 €
  — Réserve : 30 000 €

Plafond validé direction à ce stade : 200 000 €
Écart non résolu : 180 000 €`
      }
    ]
  },

  // ─── Note interne Théo (confidentielle — dossier Mission) ───────────────
  theoNote: {
    title: "Note interne — usage strictement personnel",
    author: "Théo Marczak",
    date: "5 octobre 2026",
    tag: "NE PAS DIFFUSER",
    body: `Réflexions avant board — pour moi seul.

Le problème avec la position de Jakob, c'est qu'elle suppose que le marché 
B2C nous attend. Il nous attend pas. Apple est là. Samsung est là. Dans 18 mois 
Biostream va sortir une version grand public de son Flow Patch certifié MDR à 
moins de 200€. On va arriver avec quoi ?

Notre vraie valeur, c'est la data. 8 ans de données longitudinales sur le 
stress au travail. Aucun concurrent ne l'a. Apple ne l'aura jamais — ils ont 
les volumes, pas la profondeur. C'est ça notre moat.

Mais pour valoriser la data, il faut la MDR. Sans MDR, on peut pas revendiquer 
une fonction médicale. On peut pas vendre à des professionnels de santé. On peut 
pas signer avec des mutuelles. On est coincé dans le "bien-être" — un marché 
qu'on va pas gagner contre Apple.

Ce que je n'ai pas dit à Sonia : l'organisme notifié (TÜV Rheinland) a émis 
un troisième avis de non-conformité en septembre. Pas sur le dispositif — sur 
la documentation clinique. On a 90 jours pour répondre. Si on répond bien, 
Q2 2027. Si on répond mal, reporte à Q4 2027 ou abandon de procédure.

Ce que je n'ai pas dit au board : j'ai signé en septembre un accord de principe 
avec Darty Santé pour une distribution B2C de 50 000 unités. Condition 
suspensive : obtention MDR avant fin juin 2027. Je voulais avoir un plan B 
concret avant d'annoncer. Si ça se sait maintenant, Sonia va l'utiliser comme 
argument pour accélérer. Et moi je perds ma crédibilité sur la prudence MDR.

Ce que je veux défendre vendredi : un scénario hybride. B2B consolidé + 
préparation sérieuse du B2C conditionné à la MDR. Objectifs réalistes. 
Budget maîtrisé. Pas de promesse sur un calendrier MDR que je ne contrôle pas.

Le problème : si je dis "hybride" et que jakob entend "attendre", 
je ne sais pas ce qu'il va faire de sa clause de sortie.`
  },

  // ─── Veille concurrentielle Yassine (périmée — mars 2026) ───────────────
  yassineVeille: {
    title: "Veille concurrentielle — Healthtech & Wearables stress",
    author: "Yassine Morel, Content Manager",
    date: "IMPORTANT : ce document date de mars 2026 — informations potentiellement dépassées",
    warning: true,
    body: `NOTE PRÉLIMINAIRE

Ce document a été produit en mars 2026 dans le cadre de la préparation du 
comité de direction de juin. Certaines informations ont pu évoluer depuis lors. 
Je n'ai pas pu le mettre à jour faute de temps et d'accès aux sources premium.

I. ÉTAT DU MARCHÉ (mars 2026)

Taille marché wearables santé Europe : 4,8 Md€ en 2025, croissance estimée 
+18 % /an. Segment stress/bien-être B2B : ~340 M€ France, dominé par 3-4 acteurs.

Fait marquant : Biostream vient de lever 15 M€ en série C pour attaquer le B2C 
grand public. Annonce de presse : "Nous allons démocratiser la mesure du stress".
→ Si ce plan se concrétise, ils arrivent sur notre marché B2C potentiel avec une 
certification MDR et 15 M€ de budget marketing. À surveiller.

II. CONCURRENTS DIRECTS

Biostream — Flow Patch Pro
Certification MDR IIa obtenue janvier 2026. Hausse tarifaire B2B immédiate 
(+22 %). Trois contrats hospitaliers signés en février-mars. 
Levée 15 M€ série C annoncée (usage : expansion B2C, Allemagne et Espagne).

Neuroflow — Calm Band
Certification MDR IIa mars 2026. Partenariat de distribution avec la Fnac 
annoncé — lancement grand public prévu T4 2026. Prix public : 299 €.
→ Ce sera leur premier produit B2C. À surveiller pour la comparaison d'image.

Withings — ScanWatch 2
Statut MDR : non communiqué officiellement. Site institutionnel flou.
Positionnement : wellness premium, pas médical. Prix : 299 €/unité.

Apple Watch Series 10
Hors scope MDR (positionné "bien-être", pas "médical"). 
Part de marché grand public : ~60 % des wearables en France.
Rumeur (non confirmée) : partenariat avec Malakoff Humanis pour offre RH.

III. TENDANCES IDENTIFIÉES (mars 2026)

— La certification MDR devient critère d'achat n°1 en B2B institutionnel
— Le marché B2C "sérieux" (médical-grade) est encore peu occupé
— Les mutuelles cherchent des partenaires wearables pour offres prévention
— L'IA générative commence à entrer dans les algorithmes de stress (signal faible)

IV. CE QUE JE N'AI PAS PU COUVRIR

— Statut exact MDR Lumio (Théo n'a pas répondu à mes sollicitations)
— Suite de la levée Biostream et de leur plan B2C (info mars 2026 seulement)
— Confirmation ou infirmation du partenariat Apple / Malakoff Humanis
— Positionnement prix Neuroflow post-lancement Fnac (prix non encore communiqué)

Ces lacunes sont importantes. Les décisions stratégiques ne devraient pas 
s'appuyer uniquement sur ce document.`,
    competitors: [
      { name: "Biostream", product: "Flow Patch Pro", mdr: "Classe IIa — janv. 2026", priceB2B: "5 100 €/an/10 ut.", funding: "Série C — 15 M€ (mars 2026)" },
      { name: "Neuroflow", product: "Calm Band", mdr: "Classe IIa — mars 2026", priceB2B: "890 €/an/10 ut.", priceBtoC: "299 € (lancement T4 2026)", funding: "Série B — 35 M€" },
      { name: "Withings", product: "ScanWatch 2", mdr: "Non communiqué", priceB2B: "299 €/unité", funding: "Privé" },
      { name: "Apple Health", product: "Apple Watch S10", mdr: "Hors scope MDR", priceB2B: "499 €/unité", funding: "Apple Inc." },
      { name: "Lumio Health", product: "Lumio Patch", mdr: "En cours — Q2 2027 scénario optimiste", priceB2B: "3 800 €/an/10 ut.", funding: "Série B — 22 M$ (2025)" }
    ]
  },

  // ─── Verbatims Camille Ott ───────────────────────────────────────────────
  camilleVerbatims: [
    {
      duration: "01:28",
      title: "Le chiffre qu'on ne dit pas",
      transcript: `Je vais vous dire un truc que vous ne trouverez pas dans le deck board. Le churn annualisé qu'on présente à 4 % — c'est pas le bon chiffre. C'est le churn sur les contrats signés depuis janvier 2025, c'est-à-dire nos meilleurs clients, les plus récents, les plus engagés. Si vous calculez sur la base totale des 180 clients actifs, y compris les comptes qui ralentissent, vous êtes plus près de 9 %. C'est le chiffre que j'utilise dans mes prévisions terrain. Sonia ne veut pas l'entendre parce que ça change l'histoire qu'elle veut raconter au board. Moi je préfère l'anticiper.`
    },
    {
      duration: "01:15",
      title: "Le client qui doublerait",
      transcript: `J'ai un client — je peux pas vous dire son nom mais c'est un grand compte, services financiers, 1 200 salariés — qui m'a dit mot pour mot : "Le jour où Lumio a sa MDR, on double le périmètre et on passe sur l'offre premium." Il attend. Il y en a d'autres comme ça. On a peut-être 8 à 10 comptes B2B qui sont en stand-by sur la MDR pour monter en gamme. Ça représente facilement 600K€ de CA additionnel sur 12 mois, sans aller chercher un seul client nouveau. Est-ce que Sonia a mis ça dans sa projection B2C ? Non. Est-ce que Théo l'a mis dans son argumentaire pour ralentir ? Non plus. C'est dans ma tête.`
    },
    {
      duration: "00:52",
      title: "Ce que je pense du pivot",
      transcript: `Mon opinion sur le pivot B2C ? Trop tôt, mauvaises raisons. On veut faire le B2C parce que le fonds l'a demandé, pas parce qu'on a une proposition de valeur prête. La vraie question c'est : qu'est-ce qu'on dit à un particulier qu'on peut pas dire mieux qu'Apple, avec une marque que personne ne connaît et sans certification médicale ? Je n'ai pas entendu la réponse à cette question dans cette maison.`
    }
  ],

  // ─── Fausse Une — Les Échos (déclenchée acte 2) ─────────────────────────
  fausseUne: {
    source: "Les Échos",
    date: "Lundi 12 octobre 2026",
    headline: "Wearables santé : les mutuelles entrent dans la danse — le B2B explose",
    chapeau: "Malakoff Humanis, April et la MGEN ont annoncé conjointement un appel d'offres pour des solutions wearables de prévention du stress, avec une exigence MDR obligatoire. Le marché B2B institutionnel pourrait tripler d'ici 2028.",
    corps: `Coup de tonnerre dans le secteur de la santé au travail. Trois des plus grandes mutuelles françaises ont lancé lundi un appel d'offres commun pour l'intégration de solutions wearables de mesure du stress dans leurs offres entreprise. Budget estimé de l'appel d'offres : 45 M€ sur trois ans.

Condition sine qua non : certification MDR de classe IIa minimum.

« Nous ne pouvons pas proposer à nos adhérents des solutions dont la rigueur médicale n'est pas certifiée », a déclaré le directeur innovation de Malakoff Humanis. « La certification n'est pas une préférence — c'est une condition contractuelle. »

Pour les acteurs du secteur, la nouvelle fait l'effet d'un séisme. Biostream et Neuroflow, seuls certifiés MDR IIa sur ce segment en France, sont mécaniquement en position de force.

Les acteurs non encore certifiés — dont Lumio Health, qui selon nos informations est en procédure depuis plus d'un an — se retrouvent dans une situation délicate : le marché B2B institutionnel qu'ils avaient construit est soudainement soumis à une exigence qu'ils ne remplissent pas encore.

Ironiquement, cette nouvelle rend le scénario de pivot B2C immédiat encore plus risqué : c'est précisément au moment où le B2B institutionnel ouvre des perspectives exceptionnelles que certains acteurs envisagent de le délaisser.`
  },

  // ─── Articles de presse (Browser) ───────────────────────────────────────
  pressArticles: [
    {
      url: "lesechos.fr/sante/wearables-mutuelles-mdr-explosion",
      source: "Les Échos",
      date: "12 octobre 2026",
      author: "par Émilie Vasseur",
      headline: "Wearables santé : les mutuelles entrent dans la danse — le B2B explose",
      lede: "Malakoff Humanis, April et la MGEN lancent un appel d'offres commun de 45 M€ avec certification MDR obligatoire.",
      body: `Coup de tonnerre dans le secteur de la santé au travail. Trois des plus grandes mutuelles françaises ont lancé lundi un appel d'offres commun pour l'intégration de solutions wearables de mesure du stress dans leurs offres entreprise.

Condition sine qua non : certification MDR de classe IIa minimum. « Nous ne pouvons pas proposer à nos adhérents des solutions dont la rigueur médicale n'est pas certifiée », a déclaré le directeur innovation de Malakoff Humanis.

Pour les acteurs non certifiés, la fenêtre se referme en même temps qu'elle s'ouvre. Lumio Health, contactée, n'a pas répondu à nos sollicitations.`
    },
    {
      url: "hbrfrance.fr/strategie/b2b-b2c-les-pieges-du-pivot",
      source: "Harvard Business Review France",
      date: "septembre 2026",
      author: "par Jean-Pierre Mas",
      headline: "B2B vers B2C : les cinq pièges du pivot que les fondateurs ne voient pas",
      lede: "Changer de modèle commercial, c'est changer de métier. La plupart des fondateurs B2B sous-estiment ce que cela signifie vraiment.",
      body: `Le premier piège : confondre notoriété et désirabilité. Une marque B2B peut avoir une excellente réputation auprès de 200 DRH et être totalement inconnue de 200 000 particuliers. Ce sont deux marchés qui ne se parlent pas.

Le deuxième piège : le budget. Le coût d'acquisition client B2C est structurellement différent du B2B. Là où un commercial peut signer un contrat à 40 000 € en trois réunions, le B2C demande des millions en médias pour acquérir des clients à 150 € d'abonnement annuel.

Le troisième : le tempo réglementaire. Dans la healthtech, un dispositif non certifié ne peut pas faire les mêmes promesses qu'un certifié. Ce n'est pas une question de marketing — c'est une contrainte légale.

Les entreprises qui réussissent le pivot ne l'ont généralement pas fait sous pression d'un investisseur. Elles l'ont fait parce qu'elles avaient une proposition B2C claire, testée, qui n'existait pas encore sur le marché.`
    },
    {
      url: "maddyness.fr/yassine-morel-lumio-content",
      source: "Maddyness",
      date: "avril 2026",
      author: "par Clara Dufresne",
      headline: "Yassine Morel (Lumio Health) : « Notre ennemi, c'est l'indifférence, pas la concurrence »",
      lede: "Rencontre avec le content manager d'une medtech qui refuse de jouer la carte peur.",
      body: `« On est dans un secteur où tout le monde parle de burn-out, d'épidémie silencieuse, de bombe à retardement. C'est fatiguant. Et ça ne convertit pas. »

Yassine Morel, 29 ans, gère depuis deux ans le contenu de Lumio Health. Son obsession : transformer des données de stress en récits qui intéressent des gens qui ne pensent pas à leur stress.

« Notre vrai public B2C, si on y va un jour, c'est pas quelqu'un qui souffre. C'est quelqu'un qui performe et qui veut comprendre ce qui le freine. Ce n'est pas le même registre. »

Sur la concurrence : « Biostream fait peur. Samsung fait de la techno. Nous, si on est cohérents, on devrait faire de la compréhension. C'est un territoire que personne n'occupe vraiment. Encore faut-il qu'on ait la MDR pour l'assumer. »`
    }
  ],

  // ─── Messages Slack initiaux ─────────────────────────────────────────────
  slackMessages: {
    initial: [
      { from: "Théo Marczak", time: "07:20", text: "Lou — bien reçu mon mail ? Le board c'est vendredi. Tu as jusqu'à jeudi soir.", read: true },
      { from: "Théo Marczak", time: "07:21", text: "J'ai demandé à Jakob de vous être accessible sur Slack si vous avez des questions sur ce qu'il attend.", read: true }
    ],
    delayed: [
      { from: "Sonia Ferracci", time: "+6min", text: "Lou, je sais que Théo t'a briefé. Si tu veux mon angle sur la strat avant de plonger dans les docs, je suis dispo. Il y a des choses qu'il ne t'a pas dites.", channel: "DM" },
      { from: "Jakob Rein", time: "+22min", text: "Lou. Théo me dit que vous préparez la recommandation. One thing : I need a decision, not a diagnosis. If the document you produce doesn't end with a clear recommendation, it's not useful to me.", channel: "DM" }
    ]
  }
};

// ══════════════════════════════════════════════════════════════
//  PAC_CONFIG — Configuration BC2
//  PAC · Parcours Activation Compétences
// ══════════════════════════════════════════════════════════════
window.PASS_CONFIG = {
  bloc: 'BC2',
  titre: 'Stratégie marketing communication',
  epreuve: 'E4 — Proposition de stratégie marketing communication',
  deadline: 'Jeudi 15 octobre 2026 · 20h00 (avant board vendredi)',
  commanditaire: 'Jakob Rein',
  dispositif: 'PAC',

  // Les 3 temps de la séance (en minutes)
  temps: [
    {
      n: 1, label: 'Exploration', debut: 0, fin: 75, couleur: '#1b4f8a',
      objectif: 'Comprendre le contexte Lumio, identifier les enjeux du board, cartographier les positions en présence',
      todoSuggere: [
        'Lire la fiche contexte Lumio si vous découvrez l\'univers (Finder)',
        'Lire l\'email de mission de Théo (Mail)',
        'Lire l\'email confidentiel de Jakob (Mail)',
        'Parcourir le deck board Q3 (PDF Viewer)',
        'Lire les articles de presse (Navigateur)'
      ]
    },
    {
      n: 2, label: 'Structuration', debut: 75, fin: 150, couleur: '#1a6641',
      objectif: 'Construire l\'analyse, identifier les scénarios, prendre position — remplir C.7 à C.10',
      todoSuggere: [
        'Lire la note interne de Théo (Finder — dossier Mission)',
        'Écouter les verbatims de Camille Ott (Mémos vocaux)',
        'Consulter la veille concurrentielle Yassine (PDF Viewer — attention : mars 2026)',
        'Envoyer une première hypothèse à Jakob (Slack) pour débloquer le Livrable',
        'Remplir C.7 (objectifs) et C.8 (cibles) dans le Livrable'
      ]
    },
    {
      n: 3, label: 'Production', debut: 150, fin: 210, couleur: '#c4420f',
      objectif: 'Finaliser la recommandation stratégique complète — C.9 à C.12, budget, soumettre',
      todoSuggere: [
        'Finaliser C.9 (axes de communication) et C.10 (canaux)',
        'Traiter C.11 : évaluer les scénarios et argumenter votre choix (tableau disponible)',
        'Produire C.12 : projection budgétaire et position face à la tension 200K/380K',
        'Vérifier les minimums de mots sur chaque compétence',
        'Envoyer la recommandation à Jakob'
      ]
    }
  ],

  // Compétences RNCP C.7 à C.12
  competences: [
    {
      code: 'C.7',
      label: 'Fixer les objectifs SMART',
      libelle: 'Objectifs',
      rncp: 'Fixer les objectifs assignés à la stratégie marketing communication sur les plans qualitatifs et quantitatifs (notoriété, génération de leads ou de vente…), en précisant leur nature et en prenant en considération les projets de développement de l\'entreprise et les opportunités portées par son marché, afin de disposer de repères spécifiques, mesurables, réalistes, pertinents et limités dans le temps pour cadrer son pilotage et son évaluation.',
      placeholder: 'Quels objectifs marketing communication assignez-vous à Lumio pour les 36 prochains mois ? Formulez-les de façon SMART — spécifiques, mesurables, réalistes, pertinents, datés. Distinguez objectifs qualitatifs (notoriété, positionnement) et quantitatifs (leads, CA, part de marché).',
      min: 100,
      motsCles: ['SMART', 'objectif', 'mesurable', 'notoriété', 'leads', 'CA', 'quantitatif', 'qualitatif', '36 mois', 'délai'],
      conseil: 'Un objectif sans date ni métrique n\'est pas SMART. "Développer la notoriété" ne suffit pas — chiffrez et datez chaque objectif.'
    },
    {
      code: 'C.8',
      label: 'Déterminer cibles et segmentation',
      libelle: 'Cibles',
      rncp: 'Déterminer le cœur de cible et les cibles secondaires de la marque, en les caractérisant selon des critères descriptifs, socio-comportementaux, intentionnistes et affinitaires, et en établissant la segmentation de son marché, afin de définir une approche adaptée – voire personnalisée – pour chacune d\'elles.',
      placeholder: 'Qui est le cœur de cible de Lumio dans le scénario que vous recommandez ? Caractérisez-le selon des critères descriptifs, comportementaux et affinitaires. Identifiez les cibles secondaires et justifiez la hiérarchisation. Appuyez-vous sur la segmentation du marché Lumio.',
      min: 80,
      motsCles: ['cœur de cible', 'segmentation', 'DRH', 'B2C', 'socio-comportemental', 'cible secondaire', 'caractérisation', 'intentionniste'],
      conseil: 'Hiérarchisez : une cible principale claire, deux secondaires maximum. Le jury attend une justification de la priorité, pas une liste exhaustive.'
    },
    {
      code: 'C.9',
      label: 'Définir les axes de communication',
      libelle: 'Axes',
      rncp: 'Définir le ou les axe(s) de communication à privilégier exprimant la proposition de valeur de la marque et déclinant ses engagements sur le plan de la RSE, en s\'assurant de leur adaptation à son public et à ses attentes et aspirations, afin de favoriser son adhésion et son engagement.',
      placeholder: 'Quel(s) axe(s) de communication proposez-vous pour Lumio ? En quoi cet axe exprime-t-il la proposition de valeur et les engagements RSE de la marque ? Montrez son adéquation avec les cibles identifiées en C.8.',
      min: 80,
      motsCles: ['axe', 'proposition de valeur', 'RSE', 'engagement', 'adhésion', 'territoire', 'message'],
      conseil: 'L\'axe doit découler des documents disponibles — proposition de valeur Lumio, attentes terrain (verbatims Camille), signaux de marché. Intégrez la dimension RSE (données, éthique, santé au travail).'
    },
    {
      code: 'C.10',
      label: 'Choisir les canaux — logique omnicanal',
      libelle: 'Canaux',
      rncp: 'Choisir les canaux, modalités de communication et outils associés selon une approche omnicanal et favorisant l\'exploitation des nouvelles technologies, en s\'appuyant sur l\'analyse et la prise en compte des usages du public cible et de ses points de contact avec la marque, afin de toucher de façon efficiente son public cible.',
      placeholder: 'Quels canaux recommandez-vous pour atteindre vos cibles ? Justifiez votre mix en lien avec les usages des cibles identifiées. Précisez la logique omnicanal et les points de contact prioritaires. Mentionnez les nouvelles technologies pertinentes.',
      min: 80,
      motsCles: ['omnicanal', 'canal', 'points de contact', 'LinkedIn', 'digital', 'événementiel', 'usage', 'B2B', 'B2C', 'technologie'],
      conseil: 'Chaque canal doit être justifié par un usage cible concret. Un mix B2B et B2C ne sera pas le même — si votre recommandation est hybride, distinguez les deux logiques.'
    },
    {
      code: 'C.11',
      label: 'Évaluer les actions — ROI et arbitrage',
      libelle: 'ROI / Arbitrage',
      rncp: 'Évaluer l\'opportunité et l\'intérêt des actions déclinant la stratégie marketing communication, en produisant l\'estimation de leur ROI et en tenant compte des objectifs poursuivis, afin de déterminer lesquelles choisir.',
      placeholder: 'Évaluez les scénarios stratégiques envisageables pour Lumio (au moins 2, idéalement 3). Pour chaque scénario, estimez les bénéfices attendus, les coûts engagés et les risques associés. Justifiez le scénario que vous recommandez.',
      min: 100,
      motsCles: ['ROI', 'scénario', 'coût', 'bénéfice', 'risque', 'arbitrage', 'pertinence', 'B2B', 'B2C', 'hybride', 'MDR'],
      conseil: 'Le jury attend une évaluation comparative, pas une liste d\'actions. Utilisez le gabarit de comparaison des scénarios disponible ci-dessous si besoin.'
    },
    {
      code: 'C.12',
      label: 'Établir la projection financière',
      libelle: 'Budget',
      rncp: 'Établir la projection financière de la stratégie marketing communication à conduire, en estimant le coût global des différentes actions associées, afin de négocier avec sa direction l\'allocation de moyens suffisants pour sa mise en œuvre.',
      placeholder: 'Quelle est votre projection budgétaire pour la stratégie recommandée ? Détaillez les postes de coûts principaux. Positionnez-vous face à la tension entre le plafond de Théo (200 000 €) et le budget demandé par Sonia (380 000 €). Argumentez votre position.',
      min: 80,
      motsCles: ['budget', 'projection', 'coûts', '200 000', '380 000', 'allocation', 'négociation', 'faisabilité', 'financement'],
      conseil: 'La tension budgétaire 200K/380K est au cœur de ce cas. Vous devez la traiter explicitement — ne la contournez pas. Proposez un chiffre défendable et expliquez comment vous le justifiez à Théo d\'un côté, Jakob de l\'autre.'
    }
  ],

  // Gabarit C.11 — tableau comparaison scénarios
  gabarits: {
    SCENARIOS: {
      label: 'Comparaison de scénarios',
      structure: [
        { cle: 'scenario_1', label: 'Scénario 1 — B2B consolidé', placeholder: 'Consolider le B2B, attendre MDR, lancer B2C post-certification. Objectif : sécuriser l\'ARR actuel, gagner les appels d\'offres mutuelles, préparer la MDR sérieusement.' },
        { cle: 'scenario_2', label: 'Scénario 2 — Pivot B2C immédiat', placeholder: 'Lancer le B2C maintenant sur territoire "bien-être premium", sans attendre MDR. Objectif : occuper le terrain avant Biostream, répondre aux attentes de Northgate.' },
        { cle: 'scenario_3', label: 'Scénario 3 — Hybride séquencé', placeholder: 'Consolider le B2B à court terme + préparer le B2C conditionné à la MDR. Séquençage clair : B2B 2026-2027, B2C post-MDR Q2-Q3 2027.' },
        { cle: 'recommandation', label: 'Scénario recommandé et justification', placeholder: 'Lequel recommandez-vous à Lumio ? Pourquoi ce scénario plutôt que les autres ? Quels sont les 2 risques principaux et comment les adresser ?' }
      ]
    }
  },

  // Questions de positionnement (affichées dans l'interface si besoin)
  questionsPositionnement: [
    { id: 'q1', texte: 'Quelle orientation stratégique recommandez-vous pour le board ?', options: ['B2B consolidé — attendre la MDR', 'Pivot B2C immédiat', 'Hybride séquencé — B2B court terme + B2C conditionné MDR'] },
    { id: 'q2', texte: 'Comment traitez-vous la tension budgétaire ?', options: ['Défendre le budget Sonia (380K€) en le justifiant', 'Accepter le plafond Théo (200K€) et réallouer', 'Proposer une version intermédiaire avec priorisation'] }
  ],

  personnages: {
    commanditaire: { nom: 'Jakob Rein', role: 'Partner, Northgate Capital', avatar: 'JR', couleur: '#1b3a6b' },
    terrain: { nom: 'Camille Ott', role: 'Responsable partenariats B2B', avatar: 'CO', couleur: '#0a7a6e' },
    direction: { nom: 'Théo Marczak', role: 'CEO fondateur', avatar: 'TM', couleur: '#5c2d8f' },
    marketing: { nom: 'Sonia Ferracci', role: 'Directrice Marketing', avatar: 'SF', couleur: '#c4420f' }
  }
};
