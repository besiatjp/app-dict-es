// m6-indices.js — Module 6 : Indices progressifs et overlays ponctuation
// Dépendances : m1-nettoyage.js, m2-tokens.js, m4-classes.js
// Accède à : state

// ── Constantes overlay ────────────────────────────────────────────────────
const TAIL   = 3;   // nb de caractères encerclés de chaque côté
const DEBORD = 12;  // px de débordement à droite pour point final manquant
const OVERLAY_STYLE = `
  position:absolute;pointer-events:none;
  border:2px solid var(--orange);
  border-radius:999px;
  box-shadow:0 0 0 2px rgba(217,119,6,0.15);
`;

// ── Overlays ponctuation ──────────────────────────────────────────────────

// Construit le HTML de la phrase avec spans .pc-tok sur les tokens concernés
function rendrePhraseSaisie(saisie, indicesPonct) {
  const tokens = tokeniserBrut(saisie);
  let html = '', reste = saisie;
  tokens.forEach((tok, i) => {
    const idx = reste.indexOf(tok);
    if (idx === -1) return;
    html += reste.slice(0, idx);
    html += indicesPonct.has(i)
      ? `<span class="pc-tok" data-idx="${i}">${tok}</span>`
      : tok;
    reste = reste.slice(idx + tok.length);
  });
  html += reste;
  return html;
}

// Pose les overlays en absolu sur le conteneur phrase
function poserOverlays(conteneur, indicesPonct) {
  conteneur.querySelectorAll('.pc-overlay').forEach(el => el.remove());
  const spans = conteneur.querySelectorAll('.pc-tok');
  const rectC = conteneur.getBoundingClientRect();

  spans.forEach(span => {
    const i = parseInt(span.dataset.idx);
    if (!indicesPonct.has(i)) return;

    const rectA      = span.getBoundingClientRect();
    const spanSuiv   = conteneur.querySelector(`.pc-tok[data-idx="${i+1}"]`);
    const PAD_V      = 3;
    let left, top, width, height;

    if (spanSuiv) {
      // Cas jonction : ovale de la fin du token A au début du token B
      const rectB    = spanSuiv.getBoundingClientRect();
      const cwA      = rectA.width / (span.textContent.length || 1);
      const cwB      = rectB.width / (spanSuiv.textContent.length || 1);
      const leftA    = rectA.left + rectA.width - (TAIL * cwA);
      const rightB   = rectB.left + (TAIL * cwB);
      left   = leftA - rectC.left - 4;
      top    = rectA.top - rectC.top - PAD_V;
      width  = rightB - leftA + 8;
      height = rectA.height + PAD_V * 2;
    } else {
      // Cas fin de phrase : ovale sur les derniers TAIL chars + débordement
      const cw    = rectA.width / (span.textContent.length || 1);
      const leftA = rectA.left + rectA.width - (TAIL * cw);
      left   = leftA - rectC.left - 4;
      top    = rectA.top - rectC.top - PAD_V;
      width  = (TAIL * cw) + DEBORD + 8;
      height = rectA.height + PAD_V * 2;
    }

    const overlay = document.createElement('div');
    overlay.className = 'pc-overlay';
    overlay.style.cssText = OVERLAY_STYLE
      + `left:${left}px;top:${top}px;width:${width}px;height:${height}px;`;
    conteneur.appendChild(overlay);
  });
}

// ── Fonctions d'indices ───────────────────────────────────────────────────

function ajouterIndice(zone, niveau, html) {
  const div = document.createElement('div');
  div.className = `indice indice-${niveau}`;
  div.innerHTML = `<span class="num-indice">${niveau}</span><span>${html}</span>`;
  div.style.opacity = '0';
  zone.appendChild(div);
  requestAnimationFrame(() => { div.style.transition='opacity 0.4s'; div.style.opacity='1'; });
}

function indiceSoulignement(zone) {
  if (!state._motsSaisie || !state._motsOriginal) return;
  const html = state._motsSaisie.map((mot, i) => {
    const attendu = state._motsOriginal[i] || '';
    if (normaliser(mot) !== normaliser(attendu)) {
      const e      = state._erreurs?.find(e => e.index===i);
      const couleur = LABELS_ERREUR[e?.type]?.couleur || 'rouge';
      const label   = LABELS_ERREUR[e?.type]?.label   || '';
      return `<span class="mot-erreur mot-erreur-${couleur}" title="${label} — attendu : ${attendu}">${mot||'▢'}</span>`;
    }
    return `<span class="mot-ok">${mot}</span>`;
  }).join(' ');
  ajouterIndice(zone, 2, `Erreurs soulignées :<br><div class="phrase-soulignee">${html}</div>`);
  ajouterHistorique('Indice : soulignement', 'indice', false);
}

function indiceTypeErreur(zone) {
  if (!state._erreurs?.length) return;
  const lignes = state._erreurs.map(e => {
    const {label} = LABELS_ERREUR[e.type] || {label: e.type};
    return `<li><span class="tag-erreur tag-${LABELS_ERREUR[e.type]?.couleur||'rouge'}">${label}</span> — ${e.detail}</li>`;
  });
  ajouterIndice(zone, 1, `Détail des erreurs :<ul class="liste-indices">${lignes.join('')}</ul>`);
  ajouterHistorique('Indice : ' + state._erreurs.map(e => e.detail).join(' / '), 'indice', false);
}

function indiceCerclesPonctuation(zone, indicesPonct) {
  if (!indicesPonct || indicesPonct.size === 0) {
    ajouterIndice(zone, 2, 'Repère les zones où la ponctuation diffère.');
    return;
  }
  const saisie = nettoyerTexte(document.getElementById('champ-saisie').value);
  const html   = rendrePhraseSaisie(saisie, indicesPonct);

  const div = document.createElement('div');
  div.className = 'indice indice-2';
  div.innerHTML = `<span class="num-indice">2</span><span>Zone(s) à corriger :<br><div class="phrase-soulignee" style="position:relative">${html}</div></span>`;
  div.style.opacity = '0';
  zone.appendChild(div);
  requestAnimationFrame(() => {
    div.style.transition = 'opacity 0.4s'; div.style.opacity = '1';
    const conteneur = div.querySelector('.phrase-soulignee');
    setTimeout(() => poserOverlays(conteneur, indicesPonct), 50);
  });
  ajouterHistorique('Indice : zone de ponctuation', 'indice', false);
}

function indiceCorrection(zone) {
  const typesPonctuation = new Set([
    'ponctuation_manquante', 'ponctuation_en_trop', 'ponctuation_incorrecte',
    'apostrophe_manquante',  'apostrophe_en_trop'
  ]);
  const indicesPonct = state._indicesPonct && state._indicesPonct.size > 0
    ? state._indicesPonct
    : new Set((state._erreurs||[]).filter(e => typesPonctuation.has(e.type)).map(e => e.index));

  const div = document.createElement('div');
  div.className = 'indice indice-3';

  if (indicesPonct.size > 0) {
    const html = rendrePhraseSaisie(state.phraseOriginale, indicesPonct);
    div.innerHTML = `<span class="num-indice">3</span><span>Phrase correcte :<br><div class="phrase-correction" style="position:relative">${html}</div></span>`;
    div.style.opacity = '0';
    zone.appendChild(div);
    requestAnimationFrame(() => {
      div.style.transition = 'opacity 0.4s'; div.style.opacity = '1';
      const conteneur = div.querySelector('.phrase-correction');
      setTimeout(() => poserOverlays(conteneur, indicesPonct), 50);
    });
  } else {
    div.innerHTML = `<span class="num-indice">3</span><span>Phrase correcte :<br><div class="phrase-correction">${state.phraseOriginale}</div></span>`;
    div.style.opacity = '0';
    zone.appendChild(div);
    requestAnimationFrame(() => { div.style.transition='opacity 0.4s'; div.style.opacity='1'; });
  }
  ajouterHistorique('Correction affichée', 'indice', false);
}

// ── Logique principale des indices ────────────────────────────────────────

function donnerIndice() {
  if (!state.verifie) return;

  const saisie       = document.getElementById('champ-saisie').value;
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

  // Recalculer les erreurs
  const nouvellesErreurs = [];
  for (let i = 0; i < motsOriginal.length; i++) {
    const mo = motsOriginal[i], ms = motsSaisie[i] || '';
    if (normaliser(mo) !== normaliser(ms)) {
      nouvellesErreurs.push({ index: i, attendu: mo, saisi: ms, ...classerErreur(mo, ms) });
    }
  }

  // Marquer les erreurs corrigées dans l'historique
  if (state._erreurs) {
    const avant   = new Set(state._erreurs.map(e => e.index));
    const present = new Set(nouvellesErreurs.map(e => e.index));
    if (avant.size !== present.size || [...avant].some(i => !present.has(i))) {
      const dernierErreur = [...state._historique].reverse().find(f => f.type==='erreur' && !f.corrige);
      if (dernierErreur) dernierErreur.corrige = true;
      rendreHistorique();
    }
  }

  state._erreurs      = nouvellesErreurs;
  state._motsSaisie   = motsSaisie;
  state._motsOriginal = motsOriginal;
  state.indiceNiveau++; state.indicesCourants++;

  const zone = document.getElementById('zone-indices');

  // ── Chemin ponctuation : mots corrects mais phrase inexacte ──
  if (nouvellesErreurs.length === 0) {
    const tokensO    = tokeniserBrut(state.phraseOriginale);
    const tokensS    = tokeniserBrut(nettoyerTexte(saisie));
    const indicesPonct = new Set();
    tokensO.forEach((tok, i) => {
      const tokS = tokensS[i] || '';
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
