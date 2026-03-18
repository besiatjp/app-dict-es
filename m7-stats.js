// m7-stats.js — Module 7 : Statistiques
// Dépendances : data.js (DICTEES)

// ── Persistance ───────────────────────────────────────────────────────────

function chargerStats() {
  try { return JSON.parse(localStorage.getItem('dictees_stats') || '{}'); }
  catch { return {}; }
}

function sauvegarderStats(s) {
  localStorage.setItem('dictees_stats', JSON.stringify(s));
}

function getStatPhrase(theme, i) {
  const s = chargerStats();
  return s[theme]?.[i] || { reussie: false, tentatives: 0, indices: 0, erreurs: {} };
}

// ── Migration ancien format ────────────────────────────────────────────────
// Ancien : erreurs[mot] = count (number)
// Nouveau : erreurs[mot] = { count, types: { orthographe: 2, accent: 1 } }

function migrerErreurs(erreurs) {
  const result = {};
  for (const [mot, val] of Object.entries(erreurs || {})) {
    if (typeof val === 'number') {
      result[mot] = { count: val, types: {} };
    } else {
      result[mot] = val;
    }
  }
  return result;
}

// ── Enregistrement ────────────────────────────────────────────────────────
// erreurs : tableau d'objets { attendu, type } ou tableau de strings (compatibilité)

function enregistrerTentative(theme, index, reussie, nbInd, erreurs) {
  const stats = chargerStats();
  if (!stats[theme]) stats[theme] = {};
  const s = stats[theme][index] || { reussie: false, tentatives: 0, indices: 0, erreurs: {} };
  s.erreurs = migrerErreurs(s.erreurs);
  s.tentatives++; s.indices += nbInd;
  if (reussie) s.reussie = true;

  erreurs.forEach(e => {
    // Accepte soit un objet {attendu, type} soit une string (ancien appel)
    const mot  = typeof e === 'string' ? e : e.attendu;
    const type = typeof e === 'string' ? 'orthographe' : (e.type || 'orthographe');
    if (!mot) return; // ignorer les mots vides (erreurs en_trop)
    if (!s.erreurs[mot]) {
      // Première fois que ce mot est raté sur cette phrase → compter 1
      s.erreurs[mot] = { count: 1, types: { [type]: 1 } };
    } else {
      // Mot déjà raté sur cette phrase lors d'une tentative précédente
      // → ne pas incrémenter count, mais mettre à jour le type si nouveau
      if (!s.erreurs[mot].types[type]) {
        s.erreurs[mot].types[type] = 1;
      }
    }
  });

  stats[theme][index] = s;
  sauvegarderStats(stats);
}

// ── Agrégation par thème ──────────────────────────────────────────────────

function getStatsTheme(theme) {
  const stats = chargerStats();
  const th    = stats[theme] || {};
  const total = DICTEES[theme].length;
  const reussies   = Object.values(th).filter(s => s.reussie).length;
  const tentatives = Object.values(th).reduce((n, s) => n + s.tentatives, 0);
  const indices    = Object.values(th).reduce((n, s) => n + s.indices, 0);

  // Agréger les erreurs avec le nouveau format
  const erreurs = {};
  Object.values(th).forEach(s => {
    const errs = migrerErreurs(s.erreurs || {});
    Object.entries(errs).forEach(([mot, val]) => {
      if (!erreurs[mot]) erreurs[mot] = { count: 0, types: {} };
      erreurs[mot].count += val.count;
      Object.entries(val.types || {}).forEach(([type, n]) => {
        erreurs[mot].types[type] = (erreurs[mot].types[type] || 0) + n;
      });
    });
  });

  const erreursFrequentes = Object.entries(erreurs)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([mot, val]) => ({
      mot,
      count: val.count,
      typesPrincipal: Object.entries(val.types).sort((a,b) => b[1]-a[1])[0]?.[0] || 'orthographe'
    }));

  return { total, reussies, tentatives, indices, erreursFrequentes };
}

// ── Recherche dans le corpus ──────────────────────────────────────────────
// Retourne les phrases de tous les thèmes qui contiennent le mot (insensible casse/accents)

function chercherPhrasesAvecMot(mot) {
  const motN = supprimeAccents(normaliser(mot));
  // Cherche le mot ET ses formes en nombre (singulier/pluriel)
  // On retire le s/x final éventuel pour obtenir la racine
  const racine = motN.replace(/[sx]$/, '');
  const resultats = [];
  Object.entries(DICTEES).forEach(([theme, phrases]) => {
    phrases.forEach((phrase, index) => {
      const phraseN = supprimeAccents(normaliser(phrase));
      // Matche la racine suivie de s, x, ou fin de mot
      const re = new RegExp('\\b' + racine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[sx]?\\b', 'i');
      if (re.test(phraseN)) resultats.push({ theme, index, phrase });
    });
  });
  return resultats;
}

// ── Affichage ─────────────────────────────────────────────────────────────

function afficherStats() {
  const panneau = document.getElementById('panneau-stats');
  const contenu = document.getElementById('contenu-stats');
  contenu.innerHTML = '';

  Object.keys(DICTEES).forEach(theme => {
    const s   = getStatsTheme(theme);
    const pct = s.total > 0 ? Math.round(s.reussies/s.total*100) : 0;
    const moy = s.tentatives > 0 ? (s.indices/s.tentatives).toFixed(1) : '—';

    let errHtml = '';
    if (s.erreursFrequentes.length > 0) {
      const items = s.erreursFrequentes.map(e => {
        const label = LABELS_ERREUR[e.typesPrincipal]?.label || e.typesPrincipal;
        const couleur = LABELS_ERREUR[e.typesPrincipal]?.couleur || 'rouge';
        return `<li class="erreur-item" data-mot="${e.mot}" title="Cliquer pour voir les phrases avec ce mot">
          <em>${e.mot}</em>
          <span class="count-erreur">${e.count}×</span>
          <span class="tag-erreur tag-${couleur}" style="font-size:0.68rem;padding:0.05rem 0.35rem">${label}</span>
        </li>`;
      }).join('');
      errHtml = `<div class="stats-erreurs">
        <div class="stats-erreurs-titre">Mots les plus souvent ratés :</div>
        <ul>${items}</ul>
      </div>`;
    }

    contenu.innerHTML += `<div class="stats-theme">
      <div class="stats-theme-titre">${theme}</div>
      <div class="stats-barre-wrap"><div class="stats-barre"><div class="stats-barre-fill" style="width:${pct}%"></div></div><span class="stats-pct">${pct}%</span></div>
      <div class="stats-chiffres">
        <span>✓ ${s.reussies}/${s.total}</span>
        <span>↺ ${s.tentatives} tentative${s.tentatives!==1?'s':''}</span>
        <span>💡 ${moy}/tentative</span>
      </div>
      ${errHtml}
    </div>`;
  });

  if (!contenu.innerHTML)
    contenu.innerHTML = '<p class="stats-vide">Aucune statistique pour le moment.</p>';

  // Rendre les mots cliquables
  contenu.querySelectorAll('.erreur-item').forEach(li => {
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      const mot = li.dataset.mot;
      afficherPhrasesAvecMot(mot);
    });
  });

  panneau.classList.remove('cache');
}

// ── Panneau "phrases avec ce mot" ─────────────────────────────────────────

function afficherPhrasesAvecMot(mot) {
  const resultats = chercherPhrasesAvecMot(mot);
  const contenu   = document.getElementById('contenu-stats');

  const retour = `<button class="btn-retour-stats" onclick="afficherStats()">← Retour aux stats</button>`;

  if (resultats.length === 0) {
    contenu.innerHTML = retour + `<p class="stats-vide">Aucune phrase trouvée avec le mot "<em>${mot}</em>".</p>`;
    return;
  }

  const items = resultats.map(r => {
    const apercu = r.phrase.length > 60 ? r.phrase.slice(0, 60) + '…' : r.phrase;
    return `<div class="phrase-suggestion" data-theme="${r.theme}" data-index="${r.index}">
      <span class="suggestion-theme">${r.theme}</span>
      <span class="suggestion-phrase">${apercu}</span>
    </div>`;
  }).join('');

  contenu.innerHTML = retour
    + `<div class="stats-erreurs-titre" style="margin:0.8rem 0 0.5rem">Phrases avec "<em>${mot}</em>" :</div>`
    + `<div class="liste-suggestions">${items}</div>`;

  // Clic → naviguer vers la phrase
  contenu.querySelectorAll('.phrase-suggestion').forEach(div => {
    div.addEventListener('click', () => {
      const theme = div.dataset.theme;
      const index = parseInt(div.dataset.index);
      document.getElementById('panneau-stats').classList.add('cache');
      selectionnerTheme(theme);
      // Laisser le DOM se mettre à jour avant de sélectionner la phrase
      setTimeout(() => selectionnerPhrase(index), 50);
    });
  });
}
