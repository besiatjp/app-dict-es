// m4-classes.js — Module 4 : Classification des erreurs
// Dépendances : m1-nettoyage.js (normaliser, supprimeAccents)

// ── Algorithmes ──────────────────────────────────────────────────────────────

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m+1}, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function longueurPrefixe(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

// ── Analyseurs de ponctuation ─────────────────────────────────────────────

function analyserPonctuation(attendu, saisi) {
  const ponctsA = (attendu.match(/[.,;:!?«»"'()\-]/g) || []);
  const ponctsS = (saisi.match(/[.,;:!?«»"'()\-]/g) || []);
  const sansA = attendu.replace(/[.,;:!?«»"'()\-]/g, '');
  const sansS = saisi.replace(/[.,;:!?«»"'()\-]/g, '');
  if (normaliser(sansA) !== normaliser(sansS)) return null;
  if (ponctsA.length === 0 && ponctsS.length > 0) return { type: 'ponctuation_en_trop',   detail: `ponctuation en trop : "${ponctsS.join('')}"` };
  if (ponctsA.length > 0 && ponctsS.length === 0) return { type: 'ponctuation_manquante', detail: `ponctuation manquante : "${ponctsA.join('')}"` };
  if (ponctsA.join('') !== ponctsS.join(''))       return { type: 'ponctuation_incorrecte',detail: `"${ponctsS.join('')}" au lieu de "${ponctsA.join('')}"` };
  return null;
}

function analyserApostrophe(attendu, saisi) {
  const nbA = (attendu.match(/['']/g) || []).length;
  const nbS = (saisi.match(/['']/g) || []).length;
  if (nbA !== nbS) {
    return {
      type:   nbA > nbS ? 'apostrophe_manquante' : 'apostrophe_en_trop',
      detail: nbA > nbS ? 'apostrophe manquante' : 'apostrophe en trop'
    };
  }
  return null;
}

// ── Lexique verbal ────────────────────────────────────────────────────────

const LEXIQUE_VERBAL = {
  "coucher":   {type:"inf", formes:["couché","couchée","couchés","couchées"]},
  "manger":    {type:"inf", formes:["mangé","mangée","mangés","mangées"]},
  "écouter":   {type:"inf", formes:["écouté","écoutée","écoutés","écoutées"]},
  "laisser":   {type:"inf", formes:["laissé","laissée","laissés","laissées"]},
  "aérer":     {type:"inf", formes:["aéré","aérée","aérés","aérées"]},
  "reposer":   {type:"inf", formes:["reposé","reposée","reposés","reposées"]},
  "discuter":  {type:"inf", formes:["discuté","discutée","discutés","discutées"]},
  "protéger":  {type:"inf", formes:["protégé","protégée","protégés","protégées"]},
  "comporter": {type:"inf", formes:["comporté","comportée","comportés","comportées"]},
  "passer":    {type:"inf", formes:["passé","passée","passés","passées"]},
  "soigner":   {type:"inf", formes:["soigné","soignée","soignés","soignées"]},
  "monter":    {type:"inf", formes:["monté","montée","montés","montées"]},
  "habiter":   {type:"inf", formes:["habité","habitée","habités","habitées"]},
  "entrer":    {type:"inf", formes:["entré","entrée","entrés","entrées"]},
  "lire":      {type:"inf", formes:["lu","lue","lus","lues"]},
  "recevoir":  {type:"inf", formes:["reçu","reçue","reçus","reçues"]},
  "couché":    {type:"part", formes:["coucher"]}, "couchée":  {type:"part", formes:["coucher"]},
  "mangé":     {type:"part", formes:["manger"]},  "mangée":   {type:"part", formes:["manger"]},
  "écouté":    {type:"part", formes:["écouter"]}, "écoutée":  {type:"part", formes:["écouter"]},
  "laissé":    {type:"part", formes:["laisser"]}, "laissée":  {type:"part", formes:["laisser"]},
  "reposé":    {type:"part", formes:["reposer"]}, "reposée":  {type:"part", formes:["reposer"]},
  "soigné":    {type:"part", formes:["soigner"]}, "soignée":  {type:"part", formes:["soigner"]},
  "monté":     {type:"part", formes:["monter"]},  "montée":   {type:"part", formes:["monter"]},
  "habité":    {type:"part", formes:["habiter"]},
  "passé":     {type:"part", formes:["passer"]},  "passée":   {type:"part", formes:["passer"]},
  "accroché":  {type:"part", formes:["accrocher"]},"accrochés":{type:"part", formes:["accrocher"]},
  "appelé":    {type:"part", formes:["appeler"]},
  "chauffée":  {type:"part", formes:["chauffer"]},
  "comptées":  {type:"part", formes:["compter"]},
  "destinés":  {type:"part", formes:["destiner"]},
  "décoré":    {type:"part", formes:["décorer"]},
  "placée":    {type:"part", formes:["placer"]},
  "plantées":  {type:"part", formes:["planter"]},
  "privées":   {type:"part", formes:["priver"]},
  "rangée":    {type:"part", formes:["ranger"]},  "rangés":   {type:"part", formes:["ranger"]},
  "séparée":   {type:"part", formes:["séparer"]},
  "préférée":  {type:"part", formes:["préférer"]},"préférés": {type:"part", formes:["préférer"]},
  "recouvert": {type:"part", formes:["recouvrir"]},
  // Thème Quartier
  "vider":      {type:"inf", formes:["vidé","vidée","vidés","vidées"]},
  "desservir":  {type:"inf", formes:["desservi","desservie","desservis","desservies"]},
  "côtoyer":    {type:"inf", formes:["côtoyé","côtoyée","côtoyés","côtoyées"]},
  "jouer":      {type:"inf", formes:["joué","jouée","joués","jouées"]},
  "trouver":    {type:"inf", formes:["trouvé","trouvée","trouvés","trouvées"]},
  "connaître":  {type:"inf", formes:["connu","connue","connus","connues"]},
  "saluer":     {type:"inf", formes:["salué","saluée","salués","saluées"]},
  "entretenir": {type:"inf", formes:["entretenu","entretenue","entretenus","entretenues"]},
  "relier":     {type:"inf", formes:["relié","reliée","reliés","reliées"]},
  "vidé":       {type:"part", formes:["vider"]},   "vidée":      {type:"part", formes:["vider"]},
  "desservi":   {type:"part", formes:["desservir"]},"desservie":  {type:"part", formes:["desservir"]},
  "côtoyé":     {type:"part", formes:["côtoyer"]},
  "joué":       {type:"part", formes:["jouer"]},   "jouée":      {type:"part", formes:["jouer"]},
  "trouvé":     {type:"part", formes:["trouver"]}, "trouvée":    {type:"part", formes:["trouver"]},
  "connu":      {type:"part", formes:["connaître"]},"connue":    {type:"part", formes:["connaître"]},
  "salué":      {type:"part", formes:["saluer"]},  "saluée":     {type:"part", formes:["saluer"]},
  "entretenu":  {type:"part", formes:["entretenir"]},"entretenue":{type:"part", formes:["entretenir"]},
  "relié":      {type:"part", formes:["relier"]},  "reliée":     {type:"part", formes:["relier"]},
  // Thème Grande surface
  "occuper":    {type:"inf", formes:["occupé","occupée","occupés","occupées"]},
  "changer":    {type:"inf", formes:["changé","changée","changés","changées"]},
  "proposer":   {type:"inf", formes:["proposé","proposée","proposés","proposées"]},
  "comparer":   {type:"inf", formes:["comparé","comparée","comparés","comparées"]},
  "attendre":   {type:"inf", formes:["attendu","attendue","attendus","attendues"]},
  "obtenir":    {type:"inf", formes:["obtenu","obtenue","obtenus","obtenues"]},
  "disposer":   {type:"inf", formes:["disposé","disposée","disposés","disposées"]},
  "attirer":    {type:"inf", formes:["attiré","attirée","attirés","attirées"]},
  "construire": {type:"inf", formes:["construit","construite","construits","construites"]},
  "relier":     {type:"inf", formes:["relié","reliée","reliés","reliées"]},
  "vendre":     {type:"inf", formes:["vendu","vendue","vendus","vendues"]},
  "préparer":   {type:"inf", formes:["préparé","préparée","préparés","préparées"]},
  "indiquer":   {type:"inf", formes:["indiqué","indiquée","indiqués","indiquées"]},
  "ranger":     {type:"inf", formes:["rangé","rangée","rangés","rangées"]},
  "fixer":      {type:"inf", formes:["fixé","fixée","fixés","fixées"]},
  "réserver":   {type:"inf", formes:["réservé","réservée","réservés","réservées"]},
  "desservir":  {type:"inf", formes:["desservi","desservie","desservis","desservies"]},
  "ouvert":     {type:"part", formes:["ouvrir"]},  "ouverts":    {type:"part", formes:["ouvrir"]},
  "vendu":      {type:"part", formes:["vendre"]},  "vendus":     {type:"part", formes:["vendre"]},
  "préparé":    {type:"part", formes:["préparer"]},"préparés":   {type:"part", formes:["préparer"]},
  "indiqué":    {type:"part", formes:["indiquer"]},"indiqués":   {type:"part", formes:["indiquer"]},
  "proposé":    {type:"part", formes:["proposer"]},"proposés":   {type:"part", formes:["proposer"]},
  "rangé":      {type:"part", formes:["ranger"]},  "rangés":     {type:"part", formes:["ranger"]},
  "fixé":       {type:"part", formes:["fixer"]},   "fixées":     {type:"part", formes:["fixer"]},
  "réservé":    {type:"part", formes:["réserver"]},"réservées":  {type:"part", formes:["réserver"]},
  "construit":  {type:"part", formes:["construire"]},"construites":{type:"part", formes:["construire"]},
  "venu":       {type:"part", formes:["venir"]},   "venus":      {type:"part", formes:["venir"]},
};

// ── Paires d'accord connues ───────────────────────────────────────────────
// Détectées avant Levenshtein pour ne pas les classer en "frappe"

const PAIRES_ACCORD = new Set([
  // Articles définis
  'le|la', 'le|les', 'la|les',
  // Articles indéfinis
  'un|une', 'un|des', 'une|des',
  // Articles contractés
  'au|aux', 'au|à', 'aux|à',
  'du|des', 'du|de', 'des|de',
  // Démonstratifs
  'ce|cet', 'ce|ces', 'cet|ces', 'cette|ces',
  // Possessifs
  'mon|ma', 'mon|mes', 'ma|mes',
  'ton|ta', 'ton|tes', 'ta|tes',
  'son|sa', 'son|ses', 'sa|ses',
  'notre|nos', 'votre|vos', 'leur|leurs',
  // Interrogatifs
  'quel|quelle', 'quel|quels', 'quel|quelles', 'quelle|quelles', 'quels|quelles',
  // Adjectifs double forme
  'beau|bel', 'beau|belle', 'beau|beaux', 'bel|beaux', 'belle|belles', 'beaux|belles',
  'nouveau|nouvel', 'nouveau|nouvelle', 'nouveau|nouveaux', 'nouvelle|nouvelles',
  'vieux|vieil', 'vieux|vieille', 'vieux|vieilles', 'vieil|vieilles',
  'tout|toute', 'tout|tous', 'tout|toutes', 'toute|toutes', 'tous|toutes',
  'autre|autres',
  // Pronoms
  'il|elle', 'il|ils', 'il|elles', 'elle|elles', 'ils|elles',
  'celui|celle', 'celui|ceux', 'celle|celles', 'ceux|celles',
  'lequel|laquelle', 'lequel|lesquels', 'laquelle|lesquelles',
  // Adjectifs thème Quartier
  'animé|animée', 'animé|animés', 'animé|animées', 'animée|animées',
  'piéton|piétonne', 'piéton|piétons', 'piétonne|piétonnes', 'piéton|piétonnes',
  'ancien|ancienne', 'ancien|anciens', 'ancien|anciennes', 'ancienne|anciennes', 'anciens|anciennes',
  'moderne|modernes',
  'large|larges',
  'calme|calmes',
  'principal|principale', 'principal|principaux', 'principale|principales', 'principaux|principales',
  'desservi|desservie', 'desservi|desservis', 'desservie|desservies',
  'interdit|interdite', 'interdit|interdits', 'interdite|interdites',
  // Adjectifs thème Grande surface
  'urbain|urbaine', 'urbain|urbains', 'urbaine|urbaines',
  'frais|fraîche', 'frais|fraîches',
  'laitier|laitière', 'laitier|laitiers', 'laitière|laitières',
  'surgelé|surgelée', 'surgelé|surgelés', 'surgelée|surgelées',
  'spécialisé|spécialisée', 'spécialisé|spécialisés', 'spécialisée|spécialisées',
  'central|centrale', 'central|centraux', 'centrale|centrales', 'centraux|centrales',
  'nombreux|nombreuse', 'nombreux|nombreuses',
  'vaste|vastes',
  'gratuit|gratuite', 'gratuit|gratuits', 'gratuite|gratuites',
  'handicapé|handicapée', 'handicapé|handicapés', 'handicapée|handicapées',
  'voisin|voisine', 'voisin|voisins', 'voisine|voisines',
]);

function estPaireAccord(a, s) {
  return PAIRES_ACCORD.has(a + '|' + s) || PAIRES_ACCORD.has(s + '|' + a);
}

function detecterConfusionVerbale(a, s) {
  const ea = LEXIQUE_VERBAL[a], es = LEXIQUE_VERBAL[s];
  if (!ea || !es) return null;
  if (ea.type==='inf'  && es.type==='part' && es.formes.includes(a))
    return { type:'inf_participe',  detail:`infinitif attendu "${a}", participe passé écrit "${s}"` };
  if (ea.type==='part' && es.type==='inf'  && ea.formes.includes(s))
    return { type:'participe_inf',  detail:`participe passé attendu "${a}", infinitif écrit "${s}"` };
  return null;
}

// ── Labels d'affichage ────────────────────────────────────────────────────

// ── Confusions lexicales / homophones ────────────────────────────────────
// Paires saisi → attendu : mots existants mais incorrects dans le contexte.
// Type : 'lexique' (erreur de choix de forme, pas de graphie).

const CONFUSIONS_LEXICALES = new Map([
  ['peut-etre', 'peut'],  // peut-être (adverbe) vs peut être (pouvoir + inf.)
  ['peu',  'peut'],       // peu (quantité) vs peut (pouvoir)
  ['peut', 'peu'],
  ['et',   'est'],        // et (conjonction) vs est (verbe être)
  ['est',  'et'],
]);

function detecterConfusionLexicale(attendu, saisi) {
  const a  = normaliser(attendu);
  const s  = normaliser(saisi);
  // ou / où : supprimeAccents les rend identiques → tester avant suppression
  if ((a === 'où' && s === 'ou') || (a === 'ou' && s === 'où'))
    return { type: 'lexique', detail: `"${saisi}" est un mot existant mais incorrect ici — attendu : "${attendu}"` };
  const aS = supprimeAccents(a);
  const sS = supprimeAccents(s);
  const cible = CONFUSIONS_LEXICALES.get(sS);
  if (cible && supprimeAccents(normaliser(cible)) === aS)
    return { type: 'lexique', detail: `"${saisi}" est un mot existant mais incorrect ici — attendu : "${attendu}"` };
  return null;
}

const LABELS_ERREUR = {
  manquant:               { label: 'mot manquant',          couleur: 'rouge'  },
  accent:                 { label: 'accent',                couleur: 'orange' },
  majuscule:              { label: 'majuscule',             couleur: 'orange' },
  ponctuation_manquante:  { label: 'ponctuation manquante', couleur: 'orange' },
  ponctuation_en_trop:    { label: 'ponctuation en trop',   couleur: 'orange' },
  ponctuation_incorrecte: { label: 'ponctuation incorrecte',couleur: 'orange' },
  apostrophe_manquante:   { label: 'apostrophe manquante',  couleur: 'orange' },
  apostrophe_en_trop:     { label: 'apostrophe en trop',    couleur: 'orange' },
  lexique:                { label: 'erreur lexicale',       couleur: 'violet' },
  frappe:                 { label: 'à vérifier',            couleur: 'bleu'   },
  syntaxe:                { label: 'syntaxe (accord)',      couleur: 'violet' },
  inf_participe:          { label: 'infinitif → participe', couleur: 'violet' },
  participe_inf:          { label: 'participe → infinitif', couleur: 'violet' },
  orthographe:            { label: 'à vérifier',            couleur: 'bleu'   },
  en_trop:                { label: 'mot en trop',           couleur: 'rouge'  },
};

// ── Classifieur principal ─────────────────────────────────────────────────

function classerErreur(attendu, saisi) {
  if (!saisi || saisi.trim() === '') return { type: 'manquant', detail: 'mot manquant' };

  const a  = normaliser(attendu);
  const s  = normaliser(saisi);
  const aS = supprimeAccents(a);
  const sS = supprimeAccents(s);

  const confVerb = detecterConfusionVerbale(a, s);
  if (confVerb) return confVerb;

  const confLex = detecterConfusionLexicale(attendu, saisi);
  if (confLex) return confLex;

  if (aS === sS && a !== s) return { type: 'accent',    detail: 'accent manquant ou incorrect' };
  if (a.toLowerCase() === s.toLowerCase() && a !== s)
                            return { type: 'majuscule', detail: 'problème de majuscule' };

  const ponctDetail = analyserPonctuation(a, s);
  if (ponctDetail) return ponctDetail;

  const apostDetail = analyserApostrophe(attendu, saisi);
  if (apostDetail) return apostDetail;

  const prefLen   = longueurPrefixe(aS, sS);
  const prefRatio = prefLen / Math.max(aS.length, sS.length);
  if (prefRatio >= 0.55) {
    const termA = aS.slice(prefLen);
    const termS = sS.slice(prefLen);
    const accordFin = ['s','e','es','ent','er','aux','al','elle','elles','eux'];
    if (accordFin.includes(termA) || accordFin.includes(termS))
      return { type: 'syntaxe', detail: `accord : "${saisi}" au lieu de "${attendu}"` };
  }

  // Paires d'accord connues — priorité sur Levenshtein
  if (estPaireAccord(a, s))
    return { type: 'syntaxe', detail: 'accord : "' + saisi + '" au lieu de "' + attendu + '"' };

  // frappe et orthographe fusionnés — label 'à vérifier'
  const dist   = levenshtein(aS, sS);
  const motRef = Math.max(aS.length, sS.length);
  if (dist === 1)              return { type: 'orthographe', detail: `"${saisi}" ressemble à "${attendu}"` };
  if (dist === 2 && motRef>=6) return { type: 'orthographe', detail: `"${saisi}" proche de "${attendu}"` };

  return { type: 'orthographe', detail: `"${saisi}" au lieu de "${attendu}"` };
}
