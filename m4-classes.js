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
};

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

const LABELS_ERREUR = {
  manquant:               { label: 'mot manquant',          couleur: 'rouge'  },
  accent:                 { label: 'accent',                couleur: 'orange' },
  majuscule:              { label: 'majuscule',             couleur: 'orange' },
  ponctuation_manquante:  { label: 'ponctuation manquante', couleur: 'orange' },
  ponctuation_en_trop:    { label: 'ponctuation en trop',   couleur: 'orange' },
  ponctuation_incorrecte: { label: 'ponctuation incorrecte',couleur: 'orange' },
  apostrophe_manquante:   { label: 'apostrophe manquante',  couleur: 'orange' },
  apostrophe_en_trop:     { label: 'apostrophe en trop',    couleur: 'orange' },
  frappe:                 { label: 'frappe',                couleur: 'bleu'   },
  syntaxe:                { label: 'syntaxe (accord)',      couleur: 'violet' },
  inf_participe:          { label: 'infinitif → participe', couleur: 'violet' },
  participe_inf:          { label: 'participe → infinitif', couleur: 'violet' },
  orthographe:            { label: 'orthographe',           couleur: 'rouge'  },
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

  const dist   = levenshtein(aS, sS);
  const motRef = Math.max(aS.length, sS.length);
  if (dist === 1)              return { type: 'frappe', detail: `"${saisi}" ressemble à "${attendu}"` };
  if (dist === 2 && motRef>=6) return { type: 'frappe', detail: `"${saisi}" proche de "${attendu}"` };

  return { type: 'orthographe', detail: `"${saisi}" au lieu de "${attendu}"` };
}
