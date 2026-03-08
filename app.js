// app.js — Logique principale des Dictées FLE/FLS

// ─── État ──────────────────────────────────────────────────────────────────
const state = {
  theme: null, phraseIndex: null, phraseOriginale: null,
  indiceNiveau: 0, verifie: false,
  tentativesCourantes: 0, indicesCourants: 0,
  synth: window.speechSynthesis, voix: null,
  _erreurs: null, _motsSaisie: null, _motsOriginal: null,
  _historique: [], _nbMotsExact: false,
};

// ─── Levenshtein ───────────────────────────────────────────────────────────
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

// ─── Analyse de ponctuation détaillée ────────────────────────────────────
function analyserPonctuation(attendu, saisi) {
  // Extraire la ponctuation de chaque token
  const ponctsA = (attendu.match(/[.,;:!?«»"'()\-]/g) || []);
  const ponctsS = (saisi.match(/[.,;:!?«»"'()\-]/g) || []);

  // Sans ponctuation, les mots sont identiques ?
  const sansA = attendu.replace(/[.,;:!?«»"'()\-]/g, '');
  const sansS = saisi.replace(/[.,;:!?«»"'()\-]/g, '');

  if (normaliser(sansA) !== normaliser(sansS)) return null; // pas une pure erreur de ponct.

  if (ponctsA.length === 0 && ponctsS.length > 0) return { type: 'ponctuation_en_trop', detail: `ponctuation en trop : "${ponctsS.join('')}"` };
  if (ponctsA.length > 0 && ponctsS.length === 0) return { type: 'ponctuation_manquante', detail: `ponctuation manquante : "${ponctsA.join('')}"` };
  if (ponctsA.join('') !== ponctsS.join('')) return { type: 'ponctuation_incorrecte', detail: `"${ponctsS.join('')}" au lieu de "${ponctsA.join('')}"` };
  return null;
}

function analyserApostrophe(attendu, saisi) {
  // Apostrophe manquante ou en trop (fréquent en FLE)
  const nbA = (attendu.match(/['']/g) || []).length;
  const nbS = (saisi.match(/['']/g) || []).length;
  if (nbA !== nbS) {
    return {
      type: nbA > nbS ? 'apostrophe_manquante' : 'apostrophe_en_trop',
      detail: nbA > nbS ? 'apostrophe manquante' : 'apostrophe en trop'
    };
  }
  return null;
}

// ─── Lexique verbal du corpus ──────────────────────────────────────────────
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
  // Participes → infinitif
  "couché":    {type:"part", formes:["coucher"]}, "couchée":{type:"part",formes:["coucher"]},
  "mangé":     {type:"part", formes:["manger"]},  "mangée": {type:"part",formes:["manger"]},
  "écouté":    {type:"part", formes:["écouter"]}, "écoutée":{type:"part",formes:["écouter"]},
  "laissé":    {type:"part", formes:["laisser"]}, "laissée":{type:"part",formes:["laisser"]},
  "reposé":    {type:"part", formes:["reposer"]}, "reposée":{type:"part",formes:["reposer"]},
  "soigné":    {type:"part", formes:["soigner"]}, "soignée":{type:"part",formes:["soigner"]},
  "monté":     {type:"part", formes:["monter"]},  "montée": {type:"part",formes:["monter"]},
  "habité":    {type:"part", formes:["habiter"]},
  "passé":     {type:"part", formes:["passer"]},  "passée": {type:"part",formes:["passer"]},
  "accroché":  {type:"part", formes:["accrocher"]},"accrochés":{type:"part",formes:["accrocher"]},
  "appelé":    {type:"part", formes:["appeler"]},
  "chauffée":  {type:"part", formes:["chauffer"]},
  "comptées":  {type:"part", formes:["compter"]},
  "destinés":  {type:"part", formes:["destiner"]},
  "décoré":    {type:"part", formes:["décorer"]},
  "placée":    {type:"part", formes:["placer"]},
  "plantées":  {type:"part", formes:["planter"]},
  "privées":   {type:"part", formes:["priver"]},
  "rangée":    {type:"part", formes:["ranger"]},  "rangés":  {type:"part",formes:["ranger"]},
  "séparée":   {type:"part", formes:["séparer"]},
  "préférée":  {type:"part", formes:["préférer"]},"préférés":{type:"part",formes:["préférer"]},
  "recouvert": {type:"part", formes:["recouvrir"]},
};

function detecterConfusionVerbale(a, s) {
  const ea = LEXIQUE_VERBAL[a], es = LEXIQUE_VERBAL[s];
  if (!ea || !es) return null;
  if (ea.type==='inf' && es.type==='part' && es.formes.includes(a)) {
    return { type:'inf_participe', detail:`infinitif attendu "${a}", participe passé écrit "${s}"` };
  }
  if (ea.type==='part' && es.type==='inf' && ea.formes.includes(s)) {
    return { type:'participe_inf', detail:`participe passé attendu "${a}", infinitif écrit "${s}"` };
  }
  return null;
}

// ─── Classification des erreurs ────────────────────────────────────────────
function classerErreur(attendu, saisi) {
  if (!saisi || saisi.trim() === '') return { type: 'manquant', detail: 'mot manquant' };

  const a  = normaliser(attendu);
  const s  = normaliser(saisi);
  const aS = supprimeAccents(a);
  const sS = supprimeAccents(s);

  // 1. Confusion infinitif / participe passé (lexique du corpus)
  const confVerb = detecterConfusionVerbale(a, s);
  if (confVerb) return confVerb;

  // 2. Accent uniquement
  if (aS === sS && a !== s) return { type: 'accent', detail: `accent manquant ou incorrect` };

  // 3. Majuscule uniquement
  if (a.toLowerCase() === s.toLowerCase() && a !== s) return { type: 'majuscule', detail: 'problème de majuscule' };

  // 4. Ponctuation attachée au mot
  const ponctDetail = analyserPonctuation(a, s);
  if (ponctDetail) return ponctDetail;

  // 5. Apostrophe
  const apostDetail = analyserApostrophe(attendu, saisi);
  if (apostDetail) return apostDetail;

  // 6. Syntaxe : accord genre/nombre
  // Heuristique : préfixe commun ≥ 60%, terminaison typique d'accord
  const prefLen = longueurPrefixe(aS, sS);
  const prefRatio = prefLen / Math.max(aS.length, sS.length);
  if (prefRatio >= 0.55) {
    const termA = aS.slice(prefLen);
    const termS = sS.slice(prefLen);
    const accordFin = ['s','e','es','ent','er','aux','al','elle','elles','eux'];
    if (accordFin.includes(termA) || accordFin.includes(termS)) {
      return { type: 'syntaxe', detail: `accord : "${saisi}" au lieu de "${attendu}"` };
    }
  }

  // 7. Frappe vs orthographe : Levenshtein sur formes sans accents
  const dist = levenshtein(aS, sS);
  const motRef = Math.max(aS.length, sS.length);

  // Frappe : 1 erreur sur mot ≥ 4 lettres, ou distance 1 quelle que soit la longueur
  if (dist === 1) return { type: 'frappe', detail: `"${saisi}" ressemble à "${attendu}"` };
  if (dist === 2 && motRef >= 6) return { type: 'frappe', detail: `"${saisi}" proche de "${attendu}"` };

  // Orthographe
  return { type: 'orthographe', detail: `"${saisi}" au lieu de "${attendu}"` };
}

const LABELS_ERREUR = {
  manquant:              { label: 'mot manquant',          couleur: 'rouge'  },
  accent:                { label: 'accent',                couleur: 'orange' },
  majuscule:             { label: 'majuscule',             couleur: 'orange' },
  ponctuation_manquante: { label: 'ponctuation manquante', couleur: 'orange' },
  ponctuation_en_trop:   { label: 'ponctuation en trop',   couleur: 'orange' },
  ponctuation_incorrecte:{ label: 'ponctuation incorrecte',couleur: 'orange' },
  apostrophe_manquante:  { label: 'apostrophe manquante',  couleur: 'orange' },
  apostrophe_en_trop:    { label: 'apostrophe en trop',    couleur: 'orange' },
  frappe:                { label: 'frappe',                couleur: 'bleu'   },
  syntaxe:               { label: 'syntaxe (accord)',      couleur: 'violet' },
  inf_participe:         { label: 'infinitif → participe', couleur: 'violet' },
  participe_inf:         { label: 'participe → infinitif', couleur: 'violet' },
  orthographe:           { label: 'orthographe',           couleur: 'rouge'  },
};

// ─── Statistiques ──────────────────────────────────────────────────────────
function chargerStats() {
  try { return JSON.parse(localStorage.getItem('dictees_stats') || '{}'); }
  catch { return {}; }
}
function sauvegarderStats(s) { localStorage.setItem('dictees_stats', JSON.stringify(s)); }
function getStatPhrase(theme, i) {
  const s = chargerStats();
  return s[theme]?.[i] || { reussie: false, tentatives: 0, indices: 0, erreurs: {} };
}
function enregistrerTentative(theme, index, reussie, nbInd, mots) {
  const stats = chargerStats();
  if (!stats[theme]) stats[theme] = {};
  const s = stats[theme][index] || { reussie: false, tentatives: 0, indices: 0, erreurs: {} };
  s.tentatives++; s.indices += nbInd;
  if (reussie) s.reussie = true;
  mots.forEach(m => { s.erreurs[m] = (s.erreurs[m] || 0) + 1; });
  stats[theme][index] = s;
  sauvegarderStats(stats);
}
function getStatsTheme(theme) {
  const stats = chargerStats();
  const th = stats[theme] || {};
  const total = DICTEES[theme].length;
  const reussies = Object.values(th).filter(s => s.reussie).length;
  const tentatives = Object.values(th).reduce((n, s) => n + s.tentatives, 0);
  const indices = Object.values(th).reduce((n, s) => n + s.indices, 0);
  const erreurs = {};
  Object.values(th).forEach(s => Object.entries(s.erreurs||{}).forEach(([m,c]) => { erreurs[m]=(erreurs[m]||0)+c; }));
  const erreursFrequentes = Object.entries(erreurs).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return { total, reussies, tentatives, indices, erreursFrequentes };
}

// ─── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  chargerVoix(); construireThemes(); bindEvents();
});

function chargerVoix() {
  const load = () => {
    const v = state.synth.getVoices();
    state.voix = v.find(x => x.lang==='fr-FR') || v.find(x => x.lang.startsWith('fr')) || v[0] || null;
  };
  load();
  if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = load;
}

function construireThemes() {
  const c = document.getElementById('themes');
  c.innerHTML = '';
  Object.keys(DICTEES).forEach(theme => {
    const s = getStatsTheme(theme);
    const pct = s.total > 0 ? Math.round(s.reussies/s.total*100) : 0;
    const btn = document.createElement('button');
    btn.className = 'btn-theme'; btn.dataset.theme = theme;
    btn.innerHTML = `<span class="theme-nom">${theme}</span><span class="theme-score">${s.reussies}/${s.total}</span><span class="theme-barre"><span class="theme-barre-fill" style="width:${pct}%"></span></span>`;
    btn.addEventListener('click', () => selectionnerTheme(theme));
    c.appendChild(btn);
  });
}

function bindEvents() {
  document.getElementById('btn-ecouter').addEventListener('click', ecouterPhrase);
  document.getElementById('btn-verifier').addEventListener('click', verifierPhrase);
  document.getElementById('btn-indice').addEventListener('click', donnerIndice);
  document.getElementById('btn-contexte').addEventListener('click', afficherContexte);
  document.getElementById('btn-reset').addEventListener('click', resetSaisie);
  document.getElementById('btn-stats').addEventListener('click', afficherStats);
  document.getElementById('btn-fermer-stats').addEventListener('click', () =>
    document.getElementById('panneau-stats').classList.add('cache'));
  document.getElementById('champ-saisie').addEventListener('keydown', e => {
    if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); verifierPhrase(); }
  });
  // Bouton Écouter adaptatif selon la progression de la saisie
  document.getElementById('champ-saisie').addEventListener('input', () => {
    if (!state.phraseOriginale) return;
    const nb  = compterMotsReels(document.getElementById('champ-saisie').value);
    const nbO = compterMotsReels(state.phraseOriginale);
    const btn = document.getElementById('btn-ecouter');
    if (!btn.classList.contains('lecture')) {
      btn.innerHTML = (nb >= 3 && nb < nbO)
        ? '▶ Écouter la suite'
        : '<span class="icone">▶</span> Écouter';
    }
  });
}

// ─── Thème & phrases ───────────────────────────────────────────────────────
function selectionnerTheme(theme) {
  state.theme = theme; state.phraseIndex = null; state.phraseOriginale = null;
  document.querySelectorAll('.btn-theme').forEach(b => b.classList.toggle('actif', b.dataset.theme===theme));
  rafraichirListePhrases(theme);
  document.getElementById('section-phrases').classList.remove('cache');
  document.getElementById('section-travail').classList.add('cache');
  resetZoneTravail();
}

function rafraichirListePhrases(theme) {
  const liste = document.getElementById('liste-phrases');
  liste.innerHTML = '';
  const s = getStatsTheme(theme);
  const pct = s.total > 0 ? Math.round(s.reussies/s.total*100) : 0;
  const hdr = document.createElement('div');
  hdr.className = 'progression-theme';
  hdr.innerHTML = `<div class="progression-texte"><span>${s.reussies}/${s.total} réussies</span><span>${pct}%</span></div><div class="barre-theme"><div class="barre-theme-fill" style="width:${pct}%"></div></div>`;
  liste.appendChild(hdr);
  DICTEES[theme].forEach((phrase, i) => {
    const stat = getStatPhrase(theme, i);
    const btn = document.createElement('button');
    btn.className = 'btn-phrase' + (stat.reussie ? ' reussie' : '');
    btn.dataset.index = i;
    const badge = stat.reussie ? '<span class="badge-ok">✓</span>' : `<span class="badge-num">${i+1}</span>`;
    const mots = phrase.split(' ');
    const apercu = mots.slice(0,2).join(' ') + (mots.length > 2 ? '…' : '');
    btn.innerHTML = `${badge}<span class="texte-phrase">${apercu}</span>`;
    btn.addEventListener('click', () => selectionnerPhrase(i));
    liste.appendChild(btn);
  });
}

function selectionnerPhrase(index) {
  state.phraseIndex = index; state.phraseOriginale = DICTEES[state.theme][index];
  state.indiceNiveau = 0; state.verifie = false;
  state.tentativesCourantes = 0; state.indicesCourants = 0;
  document.querySelectorAll('.btn-phrase').forEach(b => b.classList.toggle('actif', parseInt(b.dataset.index)===index));
  resetZoneTravail();
  document.getElementById('section-travail').classList.remove('cache');
  document.getElementById('indicateur-phrase').textContent = `${state.theme} — phrase ${index+1}/${DICTEES[state.theme].length}`;
  document.getElementById('indicateur-phrase').classList.remove('indicateur-vide');
  setTimeout(() => document.getElementById('champ-saisie').focus(), 100);
}

// ─── Écoute ────────────────────────────────────────────────────────────────

// ── MODULE 5 : Écoute TTS ────────────────────────────────────────────────

function ecouterPhrase() {
  if (!state.phraseOriginale) return;
  const btn = document.getElementById('btn-ecouter');
  const saisie = document.getElementById('champ-saisie').value;
  const nbMotsSaisis = compterMotsReels(saisie);

  // Écoute partielle : si ≥ 3 mots saisis, reprendre 1 mot avant la position courante
  let texteALire = state.phraseOriginale;
  if (nbMotsSaisis >= 3) {
    const mots = tokeniser(nettoyerTexte(state.phraseOriginale));
    const depart = Math.max(0, nbMotsSaisis - 1);
    texteALire = mots.slice(depart).join(' ');
  }

  btn.classList.add('lecture'); btn.textContent = '⏸ En cours…';
  const fin = () => {
    btn.classList.remove('lecture');
    btn.innerHTML = compterMotsReels(document.getElementById('champ-saisie').value) >= 3
      ? '▶ Écouter la suite'
      : '<span class="icone">▶</span> Écouter';
  };

  state.synth.cancel();
  const u = new SpeechSynthesisUtterance(texteALire);
  u.lang='fr-FR'; u.rate=0.85; if (state.voix) u.voice=state.voix;
  u.onend=fin; u.onerror=fin; state.synth.speak(u);
}

// ─── Vérification ──────────────────────────────────────────────────────────
function verifierPhrase() {
  if (!state.phraseOriginale) return;
  const saisie = document.getElementById('champ-saisie').value;
  const saisiePropre = nettoyerTexte(saisie);
  const motsSaisie   = tokeniser(saisiePropre);
  const motsOriginal = tokeniser(nettoyerTexte(state.phraseOriginale));
  const zone = document.getElementById('zone-resultat');
  zone.innerHTML = '';

  // Blocage si phrase manifestement incomplète (< 3 mots saisis et phrase > 3 mots)
  const nbO = compterMotsReels(state.phraseOriginale);
  const nbS = compterMotsReels(saisie);
  if (nbS < 3 && nbO > 3) {
    afficherMessage(zone, 'attention', '⚠️ Termine la phrase avant de vérifier.');
    return;
  }
  state.verifie = true; state.indiceNiveau = 0; state.tentativesCourantes++;
  document.getElementById('zone-indices').innerHTML = '';
  document.getElementById('btn-indice').textContent = 'Indice';

  // Succès
  if (normaliser(saisiePropre) === normaliser(nettoyerTexte(state.phraseOriginale))) {
    enregistrerTentative(state.theme, state.phraseIndex, true, state.indicesCourants, []);
    rafraichirListePhrases(state.theme); construireThemes();
    document.querySelectorAll('.btn-theme').forEach(b => b.classList.toggle('actif', b.dataset.theme===state.theme));
    afficherSucces(zone);
    state._historique = state._historique.map(f => ({...f, corrige: true}));
    rendreHistorique(); return;
  }

  // Majuscule
  if (saisie.length > 0 && saisie[0] >= 'a' && saisie[0] <= 'z') {
    const msg = 'En français, une phrase commence par une majuscule.';
    afficherMessage(zone,'attention','⚠️ '+msg);
    ajouterHistorique(msg,'attention',false); return;
  }

  // Nombre de mots
  const diff = nbS - nbO;
  state._nbMotsExact = (diff === 0);

  if (diff !== 0) {
    const msg = diff > 0 ? `Il y a ${diff} mot${diff>1?'s':''} en trop.` : `Il manque ${Math.abs(diff)} mot${Math.abs(diff)>1?'s':''}.`;
    afficherMessage(zone,'erreur','✗ '+msg);
    ajouterHistorique(msg,'erreur',false);
    enregistrerTentative(state.theme,state.phraseIndex,false,state.indicesCourants,[]);
    return;
  }

  afficherAnalyse(zone, motsSaisie, motsOriginal);
}

function afficherSucces(zone) {
  zone.innerHTML = `<div class="message succes"><span class="icone-msg">✓</span><span>Bravo ! Phrase correcte.</span></div>`;
  document.getElementById('btn-indice').classList.add('cache');
  document.getElementById('btn-contexte').classList.add('cache');
  lancerConfetti();
}

function afficherMessage(zone, type, texte) {
  zone.innerHTML = `<div class="message ${type}"><span class="icone-msg"></span><span>${texte}</span></div>`;
  document.getElementById('btn-indice').classList.remove('cache');
  document.getElementById('btn-contexte').classList.remove('cache');
}

function afficherAnalyse(zone, motsSaisie, motsOriginal) {
  const erreurs = [];
  for (let i = 0; i < motsOriginal.length; i++) {
    const mo = motsOriginal[i], ms = motsSaisie[i] || '';
    if (normaliser(mo) !== normaliser(ms)) {
      const classement = classerErreur(mo, ms);
      erreurs.push({ index: i, attendu: mo, saisi: ms, ...classement });
    }
  }

  if (erreurs.length === 0) {
    const msg = 'Les mots semblent corrects — vérifie la ponctuation et les accents.';
    afficherMessage(zone,'attention',msg); ajouterHistorique(msg,'attention',false); return;
  }

  // Grouper par type pour l'affichage
  const parType = {};
  erreurs.forEach(e => { parType[e.type] = (parType[e.type]||0) + 1; });

  const tags = Object.entries(parType).map(([type, nb]) => {
    const {label, couleur} = LABELS_ERREUR[type] || {label:type, couleur:'rouge'};
    return `<span class="tag-erreur tag-${couleur}">${nb>1?nb+'× ':''}${label}</span>`;
  });

  const msg = `${erreurs.length} erreur${erreurs.length>1?'s':''} : ${tags.join(' ')}`;
  zone.innerHTML = `<div class="message erreur"><span class="icone-msg">✗</span><span>${msg}</span></div>`;

  const msgTexte = `${erreurs.length} erreur${erreurs.length>1?'s':''} : `
    + Object.entries(parType).map(([t,n]) => (n>1?n+'× ':'')+(LABELS_ERREUR[t]?.label||t)).join(', ');
  ajouterHistorique(msgTexte, 'erreur', false);

  document.getElementById('btn-indice').classList.remove('cache');
  document.getElementById('btn-contexte').classList.remove('cache');
  enregistrerTentative(state.theme, state.phraseIndex, false, state.indicesCourants, erreurs.map(e=>e.attendu));
  state._erreurs = erreurs; state._motsSaisie = motsSaisie; state._motsOriginal = motsOriginal;
}

// ─── Historique ────────────────────────────────────────────────────────────
function ajouterHistorique(texte, type, corrige) {
  const dernier = state._historique[state._historique.length-1];
  if (dernier && dernier.texte === texte && !dernier.corrige) return;
  state._historique.push({texte, type, corrige: false});
  rendreHistorique();
}
function rendreHistorique() {
  const zone = document.getElementById('zone-historique');
  if (!zone) return;
  if (state._historique.length === 0) {
    zone.innerHTML = '<p class="histo-vide">Les feedbacks apparaîtront ici.</p>'; return;
  }
  zone.innerHTML = state._historique.map((f, i) => {
    const cls = f.corrige ? 'histo-item corrige' : `histo-item histo-${f.type}`;
    const txt = f.corrige ? `<s>${f.texte}</s>` : f.texte;
    return `<div class="${cls}"><span class="histo-num">${i+1}</span><span>${txt}</span></div>`;
  }).join('');
  zone.scrollTop = zone.scrollHeight;
}

// ─── Indices ───────────────────────────────────────────────────────────────
function donnerIndice() {
  if (!state.verifie) return;

  const saisie = document.getElementById('champ-saisie').value;
  const saisiePropre = nettoyerTexte(saisie);
  const motsSaisie   = tokeniser(saisiePropre);
  const motsOriginal = tokeniser(nettoyerTexte(state.phraseOriginale));

  // Succès entre deux indices ?
  if (normaliser(saisiePropre) === normaliser(nettoyerTexte(state.phraseOriginale))) {
    const zone = document.getElementById('zone-resultat');
    enregistrerTentative(state.theme, state.phraseIndex, true, state.indicesCourants, []);
    rafraichirListePhrases(state.theme); construireThemes();
    document.querySelectorAll('.btn-theme').forEach(b => b.classList.toggle('actif', b.dataset.theme===state.theme));
    afficherSucces(zone);
    state._historique = state._historique.map(f => ({...f, corrige: true}));
    rendreHistorique(); return;
  }

  // Recalculer les erreurs à partir de la saisie actuelle
  const nouvellesErreurs = [];
  for (let i = 0; i < motsOriginal.length; i++) {
    const mo = motsOriginal[i], ms = motsSaisie[i] || '';
    if (normaliser(mo) !== normaliser(ms)) {
      const classement = classerErreur(mo, ms);
      nouvellesErreurs.push({ index: i, attendu: mo, saisi: ms, ...classement });
    }
  }

  // Marquer dans l'historique les erreurs corrigées
  if (state._erreurs) {
    const avant   = new Set(state._erreurs.map(e => e.index));
    const present = new Set(nouvellesErreurs.map(e => e.index));
    if (avant.size !== present.size || [...avant].some(i => !present.has(i))) {
      const dernierErreur = [...state._historique].reverse().find(f => f.type === 'erreur' && !f.corrige);
      if (dernierErreur) dernierErreur.corrige = true;
      rendreHistorique();
    }
  }

  state._erreurs = nouvellesErreurs;
  state._motsSaisie = motsSaisie;
  state._motsOriginal = motsOriginal;

  state.indiceNiveau++; state.indicesCourants++;
  const zone = document.getElementById('zone-indices');

  // ── Chemin ponctuation : mots corrects mais saisie ≠ original ──
  if (nouvellesErreurs.length === 0) {
    const tokensOriginal = tokeniserBrut(state.phraseOriginale);
    const tokensSaisie   = tokeniserBrut(nettoyerTexte(saisie));
    const indicesPonct = new Set();
    tokensOriginal.forEach((tok, i) => {
      const tokS = tokensSaisie[i] || '';
      const motO = tok.replace(/[.,;:!?«»"'()'\-]/g, '');
      const motS = tokS.replace(/[.,;:!?«»"'()'\-]/g, '');
      if (normaliser(motO) === normaliser(motS) && tok !== tokS) indicesPonct.add(i);
    });
    state._indicesPonct = indicesPonct;

    switch (state.indiceNiveau) {
      case 1:
        ajouterIndice(zone, 1, 'Les mots sont corrects — vérifie la ponctuation et les accents.');
        document.getElementById('btn-indice').textContent = 'Indice visuel';
        break;
      case 2:
        indiceCerclesPonctuation(zone, indicesPonct);
        document.getElementById('btn-indice').textContent = 'Voir la correction';
        break;
      default:
        indiceCorrection(zone);
        document.getElementById('btn-indice').classList.add('cache');
    }
    return;
  }

  // ── Chemin normal : erreurs mot à mot ──
  switch (state.indiceNiveau) {
    case 1: indiceSoulignement(zone); break;
    case 2:
      indiceTypeErreur(zone);
      document.getElementById('btn-indice').textContent = 'Voir la correction';
      break;
    case 3:
      indiceCorrection(zone);
      document.getElementById('btn-indice').classList.add('cache');
      break;
  }
}

function indiceTypeErreur(zone) {
  if (!state._erreurs?.length) return;
  const lignes = state._erreurs.map(e => {
    const {label} = LABELS_ERREUR[e.type] || {label: e.type};
    return `<li><span class="tag-erreur tag-${LABELS_ERREUR[e.type]?.couleur||'rouge'}">${label}</span> — ${e.detail}</li>`;
  });
  const html = `Détail des erreurs :<ul class="liste-indices">${lignes.join('')}</ul>`;
  ajouterIndice(zone, 1, html);
  ajouterHistorique('Indice : ' + state._erreurs.map(e => e.detail).join(' / '), 'indice', false);
}

function indiceSoulignement(zone) {
  if (!state._motsSaisie || !state._motsOriginal) return;
  const html = state._motsSaisie.map((mot, i) => {
    const attendu = state._motsOriginal[i] || '';
    if (normaliser(mot) !== normaliser(attendu)) {
      const e = state._erreurs?.find(e => e.index===i);
      const couleur = LABELS_ERREUR[e?.type]?.couleur || 'rouge';
      const label   = LABELS_ERREUR[e?.type]?.label   || '';
      return `<span class="mot-erreur mot-erreur-${couleur}" title="${label} — attendu : ${attendu}">${mot||'▢'}</span>`;
    }
    return `<span class="mot-ok">${mot}</span>`;
  }).join(' ');
  ajouterIndice(zone, 2, `Erreurs soulignées :<br><div class="phrase-soulignee">${html}</div>`);
  ajouterHistorique('Indice : soulignement', 'indice', false);
}

// ── Indice visuel ponctuation : ovales CSS sur les zones fautives ──────────

function rendrePhraseCercles(tokens, texteSource, indicesPonct) {
  const segments = [];
  let cherche = texteSource, offset = 0;
  tokens.forEach(tok => {
    const idx = cherche.indexOf(tok);
    if (idx === -1) return;
    segments.push({ tok, start: offset + idx });
    offset += idx + tok.length;
    cherche = cherche.slice(idx + tok.length);
  });

  const zones = [];
  segments.forEach((seg, i) => {
    if (!indicesPonct.has(i)) return;
    const tokEnd  = seg.start + seg.tok.length;
    const nextSeg = segments[i + 1];
    if (nextSeg) {
      zones.push({ type: 'espace', pos: tokEnd, nextStart: nextSeg.start });
    } else {
      const TAIL = 3;
      const cercleDébut = seg.tok.length > TAIL ? seg.start + seg.tok.length - TAIL : seg.start;
      zones.push({ type: 'fin', pos: cercleDébut, end: tokEnd });
    }
  });

  if (zones.length === 0) return texteSource;

  zones.sort((a, b) => a.pos - b.pos);
  let html = '', cursor = 0;
  zones.forEach(z => {
    if (z.type === 'espace') {
      html += texteSource.slice(cursor, z.pos);
      html += '<span class="ponct-cercle">' + texteSource.slice(z.pos, z.nextStart) + '</span>';
      cursor = z.nextStart;
    } else {
      html += texteSource.slice(cursor, z.pos);
      html += '<span class="ponct-cercle ponct-cercle-fin">' + texteSource.slice(z.pos, z.end) + '</span>';
      cursor = z.end;
    }
  });
  html += texteSource.slice(cursor);
  return html;
}

function construirePhraseAvecCercles(indicesPonct) {
  const tokens = tokeniserBrut(state.phraseOriginale);
  return rendrePhraseCercles(tokens, state.phraseOriginale, indicesPonct);
}

function indiceCerclesPonctuation(zone, indicesPonct) {
  if (!indicesPonct || indicesPonct.size === 0) {
    ajouterIndice(zone, 2, 'Repère les zones où la ponctuation diffère.');
    return;
  }
  const saisie = nettoyerTexte(document.getElementById('champ-saisie').value);
  const tokens = tokeniserBrut(saisie);
  const html   = rendrePhraseCercles(tokens, saisie, indicesPonct);
  ajouterIndice(zone, 2, 'Zone(s) à corriger :<br><div class="phrase-soulignee">' + html + '</div>');
  ajouterHistorique('Indice : zone de ponctuation', 'indice', false);
}

function indiceCorrection(zone) {
  const typesPonctuation = new Set([
    'ponctuation_manquante', 'ponctuation_en_trop', 'ponctuation_incorrecte',
    'apostrophe_manquante', 'apostrophe_en_trop'
  ]);
  const indicesPonct = state._indicesPonct && state._indicesPonct.size > 0
    ? state._indicesPonct
    : new Set((state._erreurs || []).filter(e => typesPonctuation.has(e.type)).map(e => e.index));

  const phraseHtml = indicesPonct.size > 0
    ? construirePhraseAvecCercles(indicesPonct)
    : state.phraseOriginale;

  ajouterIndice(zone, 3, `Phrase correcte :<br><div class="phrase-correction">${phraseHtml}</div>`);
  ajouterHistorique('Correction affichée', 'indice', false);
}

function ajouterIndice(zone, niveau, html) {
  const div = document.createElement('div');
  div.className = `indice indice-${niveau}`;
  div.innerHTML = `<span class="num-indice">${niveau}</span><span>${html}</span>`;
  div.style.opacity = '0'; zone.appendChild(div);
  requestAnimationFrame(() => { div.style.transition='opacity 0.4s'; div.style.opacity='1'; });
}

// ─── Contexte ──────────────────────────────────────────────────────────────
function afficherContexte() {
  if (!state._erreurs || !state._motsOriginal) return;
  state.indicesCourants++;
  const zone = document.getElementById('zone-indices');
  const total = state._motsOriginal.length;
  const html = state._erreurs.map(e => {
    const i = e.index;
    const avant = i > 0 ? state._motsOriginal[i-1] : null;
    const apres = i < total-1 ? state._motsOriginal[i+1] : null;
    const pos = avant && apres ? `entre <strong>${avant}</strong> et <strong>${apres}</strong>`
      : avant ? `après <strong>${avant}</strong>`
      : apres ? `avant <strong>${apres}</strong>`
      : 'en début de phrase';
    return `<li>Un mot ${pos} est incorrect.</li>`;
  }).join('');
  ajouterIndice(zone, 'c', `Contexte :<ul class="liste-contexte">${html}</ul>`);
  ajouterHistorique('Indice : contexte (mots voisins)', 'indice', false);
}

// ─── Stats ─────────────────────────────────────────────────────────────────
function afficherStats() {
  const panneau = document.getElementById('panneau-stats');
  const contenu = document.getElementById('contenu-stats');
  contenu.innerHTML = '';
  Object.keys(DICTEES).forEach(theme => {
    const s = getStatsTheme(theme);
    const pct = s.total > 0 ? Math.round(s.reussies/s.total*100) : 0;
    const moy = s.tentatives > 0 ? (s.indices/s.tentatives).toFixed(1) : '—';
    let errHtml = '';
    if (s.erreursFrequentes.length > 0) {
      errHtml = `<div class="stats-erreurs"><div class="stats-erreurs-titre">Mots les plus souvent ratés :</div><ul>${s.erreursFrequentes.map(([m,n])=>`<li><em>${m}</em> <span class="count-erreur">${n}×</span></li>`).join('')}</ul></div>`;
    }
    contenu.innerHTML += `<div class="stats-theme">
      <div class="stats-theme-titre">${theme}</div>
      <div class="stats-barre-wrap"><div class="stats-barre"><div class="stats-barre-fill" style="width:${pct}%"></div></div><span class="stats-pct">${pct}%</span></div>
      <div class="stats-chiffres"><span>✓ ${s.reussies}/${s.total}</span><span>↺ ${s.tentatives} tentative${s.tentatives!==1?'s':''}</span><span>💡 ${moy}/tentative</span></div>
      ${errHtml}</div>`;
  });
  if (!contenu.innerHTML) contenu.innerHTML = '<p class="stats-vide">Aucune statistique pour le moment.</p>';
  panneau.classList.remove('cache');
}

// ─── Utilitaires ───────────────────────────────────────────────────────────

// ── MODULE 1 : Nettoyage ──────────────────────────────────────────────────

// Formes graphiques équivalentes acceptées (insensibles à la casse après normaliser)
const FORMES_EQUIVALENTES = {
  "w.c.": "wc",
  "w.c":  "wc",
};

// Fusionne les élisions sans apostrophe : "l office" → "l'office"
// pour que le comptage de mots soit insensible à l'apostrophe manquante
const ELISIONS = ["l", "d", "j", "m", "t", "s", "n", "c", "qu", "lorsqu", "jusque", "puisqu", "quoiqu"];
function fusionnerElisions(t) {
  const re = new RegExp(`\\b(${ELISIONS.join('|')})\\s+([\\wàâäéèêëîïôùûüçœæ])`, 'gi');
  return t.replace(re, (_, el, suite) => `${el}'${suite}`);
}

function nettoyerTexte(t) {
  return t
    .trim()
    .replace(/\s+([,;:!?])/g, '$1')      // espace parasite avant ponctuation
    .replace(/([,;:!?])(\w)/g, '$1 $2')  // espace manquant après ponctuation
    .replace(/\s+/g, ' ');               // doubles espaces résiduels
}

// Normalisation pour comparaison exacte (applique aussi les variantes)
function normaliser(t) {
  let r = t.trim().toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[«»""]/g, '"');
  for (const [forme, canon] of Object.entries(FORMES_EQUIVALENTES)) {
    r = r.replaceAll(forme, canon);
  }
  return r;
}

function supprimeAccents(t) { return t.normalize('NFD').replace(/[\u0300-\u036f]/g,''); }

// ── MODULE 2 : Tokenisation ───────────────────────────────────────────────

function tokeniser(t) { return t.match(/[\wàâäéèêëîïôùûüçœæÀÂÄÉÈÊËÎÏÔÙÛÜÇŒÆ''-]+/gi) || []; }
// tokeniserBrut : conserve la ponctuation attachée (ex. "maison," "j'")
function tokeniserBrut(t) { return t.match(/[\wàâäéèêëîïôùûüçœæÀÂÄÉÈÊËÎÏÔÙÛÜÇŒÆ''-]+[.,;:!?]*/gi) || []; }

// Compte de mots insensible aux élisions manquantes et aux variantes (W.C. = 1 mot)
function compterMotsReels(phrase) {
  // Normaliser les variantes avant de compter
  let p = normaliser(phrase);
  // Fusionner les élisions sans apostrophe pour éviter le double-comptage
  p = fusionnerElisions(p);
  let n = 0;
  (p.match(/[\wàâäéèêëîïôùûüçœæ]+/gi)||[]).forEach(m => {
    n += m.split(/['-]/).filter(Boolean).length;
  });
  return n;
}

function resetZoneTravail() {
  document.getElementById('champ-saisie').value = '';
  document.getElementById('zone-resultat').innerHTML = '';
  document.getElementById('zone-indices').innerHTML = '';
  document.getElementById('btn-indice').classList.add('cache');
  document.getElementById('btn-indice').textContent = 'Indice';
  document.getElementById('btn-contexte').classList.add('cache');
  document.getElementById('btn-ecouter').innerHTML = '<span class="icone">▶</span> Écouter';
  state.verifie=false; state.indiceNiveau=0; state.indicesCourants=0;
  state._erreurs=null; state._motsSaisie=null; state._motsOriginal=null;
  state._historique=[]; state._nbMotsExact=false; state._indicesPonct=null;
  const zh = document.getElementById('zone-historique');
  if (zh) zh.innerHTML = '<p class="histo-vide">Les feedbacks apparaîtront ici.</p>';
}
function resetSaisie() {
  resetZoneTravail();
  if (state.phraseOriginale) document.getElementById('champ-saisie').focus();
}

// ─── Confetti ──────────────────────────────────────────────────────────────
function lancerConfetti() {
  const c = ['#16A34A','#2563EB','#D97706','#DC2626','#7C3AED'];
  for (let i=0; i<30; i++) {
    const el = document.createElement('div'); el.className='confetti';
    el.style.cssText=`left:${Math.random()*100}vw;background:${c[~~(Math.random()*5)]};animation-delay:${Math.random()*.5}s;animation-duration:${.8+Math.random()*.8}s;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;`;
    document.body.appendChild(el);
    el.addEventListener('animationend',()=>el.remove());
  }
}
