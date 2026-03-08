// g4-niveaux.js — Niveaux, thèmes, progression, entrée depuis dictées

// ── État de progression ───────────────────────────────────────────────────
const STORAGE_KEY = 'gec_progression';

function chargerProgression() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { palierMax: 3, palierActuel: 3, phrasesFaites: {} };
  } catch { return { palierMax: 3, palierActuel: 3, phrasesFaites: {} }; }
}
function sauvegarderProgression(prog) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prog)); } catch {}
}
function marquerPhraseFaite(theme, phraseIndex) {
  const prog = chargerProgression();
  prog.phrasesFaites[theme + '_' + phraseIndex] = true;
  sauvegarderProgression(prog);
}
function estPhraseFaite(theme, phraseIndex) {
  return !!chargerProgression().phrasesFaites[theme + '_' + phraseIndex];
}

// ── Entrée depuis les dictées (paramètre URL ?theme=Maison) ───────────────
function detecterEntreeDepuisDictees() {
  const params = new URLSearchParams(window.location.search);
  const theme = params.get('theme');
  if (!theme || !CORPUS_ANNOTE[theme]) return null;
  return theme;
}

// Trouver le palier le plus facile contenant des phrases du thème
function palierMinPourTheme(theme) {
  for (const palier of PALIERS) {
    if (palier.phrases.some(p => p.theme === theme)) return palier;
  }
  return PALIERS[0];
}

// ── Point d'entrée principal ──────────────────────────────────────────────
function initialiserNavigation() {
  const themeDictees = detecterEntreeDepuisDictees();
  if (themeDictees) {
    // Entrée depuis les dictées : niveau minimal du thème, filtre thème actif
    const palier = palierMinPourTheme(themeDictees);
    const prog = chargerProgression();
    prog.palierActuel = palier.num;
    sauvegarderProgression(prog);
    construireSelecteurNiveaux();
    selectionnerPalier(palier.num, themeDictees); // filtre thème pré-sélectionné
  } else {
    // Entrée directe : sélecteur de niveaux
    construireSelecteurNiveaux();
  }
}

// ── Sélecteur de niveaux ──────────────────────────────────────────────────
function construireSelecteurNiveaux() {
  const prog = chargerProgression();
  const zone = document.getElementById('selecteur-niveaux');
  if (!zone) return;
  zone.innerHTML = '';

  PALIERS.forEach(palier => {
    const debloque = palier.num <= prog.palierMax;
    const actuel   = palier.num === prog.palierActuel;
    const phrasesFaites = palier.phrases.filter(p => estPhraseFaite(p.theme, p.phraseIndex)).length;
    const total = palier.phrases.length;
    const complet = phrasesFaites === total;

    const btn = document.createElement('button');
    btn.className = 'btn-niveau' +
      (actuel ? ' actuel' : '') +
      (complet ? ' complet' : '') +
      (!debloque ? ' verrouille' : '');
    btn.disabled = !debloque;
    btn.dataset.palier = palier.num;

    const badge = document.createElement('span');
    badge.className = 'niveau-badge';
    badge.textContent = debloque ? palier.num : '🔒';

    const label = document.createElement('span');
    label.className = 'niveau-label';
    label.textContent = palier.label;

    btn.appendChild(badge);
    btn.appendChild(label);

    if (debloque && palier.catNouvelle) {
      const tag = document.createElement('span');
      tag.className = 'niveau-cat';
      tag.textContent = palier.catNouvelle;
      tag.style.borderColor = couleurCat(palier.catNouvelle);
      tag.style.color = couleurCat(palier.catNouvelle);
      btn.appendChild(tag);
    }

    const barre = document.createElement('div');
    barre.className = 'niveau-barre';
    const fill = document.createElement('div');
    fill.className = 'niveau-barre-fill';
    fill.style.width = (total > 0 ? phrasesFaites / total * 100 : 0) + '%';
    fill.style.background = couleurCat(palier.catNouvelle);
    barre.appendChild(fill);
    btn.appendChild(barre);

    btn.addEventListener('click', () => selectionnerPalier(palier.num, null));
    zone.appendChild(btn);
  });
}

// ── Sélection d'un palier ─────────────────────────────────────────────────
function selectionnerPalier(numPalier, themeForce) {
  const prog = chargerProgression();
  prog.palierActuel = numPalier;
  sauvegarderProgression(prog);

  const palier = PALIERS.find(p => p.num === numPalier);
  if (!palier) return;

  document.querySelectorAll('.btn-niveau').forEach(b =>
    b.classList.toggle('actuel', parseInt(b.dataset.palier) === numPalier)
  );
  document.getElementById('section-themes').classList.add('cache');

  gramState.palierActuel = palier;
  construireListePalier(palier, themeForce);
  reinitialiserZoneTravail();
}

// ── Liste des phrases d'un palier avec filtre thème ───────────────────────
function construireListePalier(palier, themeActif) {
  const zone = document.getElementById('liste-phrases');
  zone.innerHTML = '';

  // En-tête : retour + titre
  const entete = document.createElement('div');
  entete.className = 'palier-entete';

  const btnRetour = document.createElement('button');
  btnRetour.className = 'btn-retour-niveaux';
  btnRetour.textContent = '← niveaux';
  btnRetour.addEventListener('click', () => {
    document.getElementById('section-themes').classList.remove('cache');
    construireSelecteurNiveaux();
    reinitialiserZoneTravail();
  });

  const titre = document.createElement('span');
  titre.className = 'palier-titre';
  titre.textContent = palier.label;

  entete.appendChild(btnRetour);
  entete.appendChild(titre);
  zone.appendChild(entete);

  // Filtre par thème — uniquement les thèmes présents dans ce palier
  const themesDuPalier = [...new Set(palier.phrases.map(p => p.theme))];
  if (themesDuPalier.length > 1) {
    const filtres = document.createElement('div');
    filtres.className = 'filtres-themes';

    // Bouton "Tous"
    const btnTous = document.createElement('button');
    btnTous.className = 'btn-filtre' + (!themeActif ? ' actif' : '');
    btnTous.textContent = 'Tous';
    btnTous.addEventListener('click', () => {
      themeActif = null;
      filtres.querySelectorAll('.btn-filtre').forEach(b => b.classList.remove('actif'));
      btnTous.classList.add('actif');
      afficherPhrasesPalier(palier, null, listePhrases);
    });
    filtres.appendChild(btnTous);

    themesDuPalier.forEach(th => {
      const btn = document.createElement('button');
      btn.className = 'btn-filtre' + (themeActif === th ? ' actif' : '');
      btn.textContent = th;
      btn.addEventListener('click', () => {
        themeActif = th;
        filtres.querySelectorAll('.btn-filtre').forEach(b => b.classList.remove('actif'));
        btn.classList.add('actif');
        afficherPhrasesPalier(palier, th, listePhrases);
      });
      filtres.appendChild(btn);
    });

    zone.appendChild(filtres);
  }

  // Conteneur phrases
  const listePhrases = document.createElement('div');
  listePhrases.id = 'liste-phrases-palier';
  zone.appendChild(listePhrases);
  afficherPhrasesPalier(palier, themeActif, listePhrases);
}

function afficherPhrasesPalier(palier, themeFiltre, conteneur) {
  conteneur.innerHTML = '';
  const phrases = themeFiltre
    ? palier.phrases.filter(p => p.theme === themeFiltre)
    : palier.phrases;

  phrases.forEach((p, i) => {
    const item = CORPUS_ANNOTE[p.theme]?.[p.phraseIndex];
    if (!item) return;

    const btn = document.createElement('button');
    btn.className = 'btn-phrase' + (estPhraseFaite(p.theme, p.phraseIndex) ? ' reussie' : '');
    btn.dataset.theme = p.theme;
    btn.dataset.index = p.phraseIndex;

    const badge = estPhraseFaite(p.theme, p.phraseIndex)
      ? Object.assign(document.createElement('span'), { className: 'badge-ok', textContent: '✓' })
      : Object.assign(document.createElement('span'), { className: 'badge-num', textContent: i + 1 });

    const apercu = item.tokens.slice(0, 2).map(t => t.mot).join(' ') + '…';
    const texte = document.createElement('span');
    texte.textContent = apercu;

    // Thème en petit si vue "Tous"
    if (!themeFiltre) {
      const tag = document.createElement('span');
      tag.className = 'phrase-theme-tag';
      tag.textContent = p.theme;
      btn.appendChild(badge);
      btn.appendChild(texte);
      btn.appendChild(tag);
    } else {
      const diff = document.createElement('span');
      diff.className = 'phrase-diff';
      diff.textContent = '·'.repeat(p.nbCats - 2);
      btn.appendChild(badge);
      btn.appendChild(texte);
      btn.appendChild(diff);
    }

    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-phrase').forEach(b => b.classList.remove('actif'));
      btn.classList.add('actif');
      selectionnerPhrasePalier(p.theme, p.phraseIndex, palier);
    });
    conteneur.appendChild(btn);
  });
}

// ── Sélection d'une phrase ────────────────────────────────────────────────
function selectionnerPhrasePalier(theme, phraseIndex, palier) {
  const item = CORPUS_ANNOTE[theme]?.[phraseIndex];
  if (!item) return;

  gramState.theme        = theme;
  gramState.phraseIndex  = phraseIndex;
  gramState.tokensActifs = item.tokens;
  gramState.palierActuel = palier;

  viderTableau();
  reinitialiserEssais();
  setFeedback('');
  afficherMots(item.tokens);
  activerCasesPourPalier(palier);
  resetTimersHesitation(item.tokens);
}

// ── Activer les cases selon le palier ─────────────────────────────────────
function activerCasesPourPalier(palier) {
  const catsActives = new Set(palier.catsActives);
  CASES_GEC.forEach(c => {
    const el = document.getElementById('case-' + c.id);
    if (!el) return;
    let active = (c.id === 'pivot') ? catsActives.has('pivot')
               : (c.id === 'pivot-dp') ? false
               : catsActives.has(c.cat);
    el.classList.toggle('inactive', !active);
    el.style.transition = 'opacity 0.5s, filter 0.5s';
  });
}

// ── Fin de palier ─────────────────────────────────────────────────────────
function verifierFinDePalier(theme, phraseIndex) {
  marquerPhraseFaite(theme, phraseIndex);

  const btn = document.querySelector(`.btn-phrase[data-theme="${theme}"][data-index="${phraseIndex}"]`);
  if (btn) {
    btn.classList.add('reussie');
    const badge = btn.querySelector('.badge-num');
    if (badge) { badge.className = 'badge-ok'; badge.textContent = '✓'; }
  }

  const prog = chargerProgression();
  const palier = PALIERS.find(p => p.num === prog.palierActuel);
  if (!palier) return;

  const phrasesFaites = palier.phrases.filter(p => estPhraseFaite(p.theme, p.phraseIndex)).length;
  if (phrasesFaites === palier.phrases.length) {
    const palierSuivant = PALIERS.find(p => p.num === palier.num + 1);
    if (palierSuivant) {
      prog.palierMax = Math.max(prog.palierMax, palierSuivant.num);
      sauvegarderProgression(prog);
      setTimeout(() => proposerPalierSuivant(palierSuivant), 1200);
    }
  }
}

function proposerPalierSuivant(palierSuivant) {
  afficherBulle(
    `Palier complété ! Le suivant introduit : ${palierSuivant.catNouvelle}`,
    'reprise',
    () => {
      masquerBulle();
      selectionnerPalier(palierSuivant.num, null);
      construireSelecteurNiveaux();
    }
  );
}
