// app.js — Orchestration principale des Dictées FLE/FLS
// Dépendances : data.js, m1-nettoyage.js, m2-tokens.js, m4-classes.js,
//               m5-ecoute.js, m6-indices.js, m7-stats.js

// ─── État global ───────────────────────────────────────────────────────────
const state = {
  theme: null, phraseIndex: null, phraseOriginale: null,
  indiceNiveau: 0, verifie: false,
  tentativesCourantes: 0, indicesCourants: 0,
  synth: window.speechSynthesis, voix: null,
  _erreurs: null, _motsSaisie: null, _motsOriginal: null,
  _historique: [], _nbMotsExact: false, _indicesPonct: null,
};

// ─── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  chargerVoix(); construireThemes(); bindEvents();
});

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

// ─── Thèmes & phrases ──────────────────────────────────────────────────────
function construireThemes() {
  const c = document.getElementById('themes');
  c.innerHTML = '';
  Object.keys(DICTEES).forEach(theme => {
    const s   = getStatsTheme(theme);
    const pct = s.total > 0 ? Math.round(s.reussies/s.total*100) : 0;
    const btn = document.createElement('button');
    btn.className = 'btn-theme'; btn.dataset.theme = theme;
    btn.innerHTML = `<span class="theme-nom">${theme}</span><span class="theme-score">${s.reussies}/${s.total}</span><span class="theme-barre"><span class="theme-barre-fill" style="width:${pct}%"></span></span>`;
    btn.addEventListener('click', () => selectionnerTheme(theme));
    c.appendChild(btn);
  });
}

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
  const s   = getStatsTheme(theme);
  const pct = s.total > 0 ? Math.round(s.reussies/s.total*100) : 0;
  const hdr = document.createElement('div');
  hdr.className = 'progression-theme';
  hdr.innerHTML = `<div class="progression-texte"><span>${s.reussies}/${s.total} réussies</span><span>${pct}%</span></div><div class="barre-theme"><div class="barre-theme-fill" style="width:${pct}%"></div></div>`;
  liste.appendChild(hdr);
  DICTEES[theme].forEach((phrase, i) => {
    const stat = getStatPhrase(theme, i);
    const btn  = document.createElement('button');
    btn.className = 'btn-phrase' + (stat.reussie ? ' reussie' : '');
    btn.dataset.index = i;
    const badge  = stat.reussie ? '<span class="badge-ok">✓</span>' : `<span class="badge-num">${i+1}</span>`;
    const mots   = phrase.split(' ');
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

// ─── Vérification ──────────────────────────────────────────────────────────
function verifierPhrase() {
  if (!state.phraseOriginale) return;
  const saisie       = document.getElementById('champ-saisie').value;
  const saisiePropre = nettoyerTexte(saisie);
  const motsSaisie   = tokeniser(saisiePropre);
  const motsOriginal = tokeniser(nettoyerOriginal(state.phraseOriginale));
  const zone         = document.getElementById('zone-resultat');
  zone.innerHTML     = '';

  const nbO = compterMotsReels(state.phraseOriginale);
  const nbS = compterMotsReels(saisie);

  if (nbS < 3 && nbO > 3) {
    afficherMessage(zone, 'attention', '⚠️ Termine la phrase avant de vérifier.');
    return;
  }

  state.verifie = true; state.indiceNiveau = 0; state.tentativesCourantes++;
  document.getElementById('zone-indices').innerHTML = '';
  document.getElementById('btn-indice').textContent = 'Indice';

  if (normaliser(saisiePropre) === normaliser(nettoyerOriginal(state.phraseOriginale))) {
    enregistrerTentative(state.theme, state.phraseIndex, true, state.indicesCourants, []);
    rafraichirListePhrases(state.theme); construireThemes();
    document.querySelectorAll('.btn-theme').forEach(b => b.classList.toggle('actif', b.dataset.theme===state.theme));
    afficherSucces(zone);
    state._historique = state._historique.map(f => ({...f, corrige: true}));
    rendreHistorique(); return;
  }

  if (saisie.length > 0 && saisie[0] >= 'a' && saisie[0] <= 'z') {
    const msg = 'En français, une phrase commence par une majuscule.';
    afficherMessage(zone, 'attention', '⚠️ '+msg);
    ajouterHistorique(msg, 'attention', false); return;
  }

  const diff = nbS - nbO;
  state._nbMotsExact = (diff === 0);
  if (diff !== 0) {
    const msg = diff > 0
      ? 'Il y a un mot en trop — réécoute la phrase.'
      : 'Il manque un mot — réécoute la phrase.';
    zone.innerHTML = `<div class="message erreur"><span class="icone-msg">✗</span><span>${msg}</span></div>`;
    document.getElementById('btn-indice').classList.add('cache');
    document.getElementById('btn-contexte').classList.add('cache');
    ajouterHistorique(msg, 'erreur', false);
    enregistrerTentative(state.theme, state.phraseIndex, false, state.indicesCourants, []);
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
  const erreurs = extraireErreursAlignes(motsSaisie, motsOriginal);
  if (erreurs.length === 0) {
    const msg = 'Les mots semblent corrects — vérifie la ponctuation et les accents.';
    afficherMessage(zone, 'attention', msg); ajouterHistorique(msg, 'attention', false); return;
  }
  const parType = {};
  erreurs.forEach(e => { parType[e.type] = (parType[e.type]||0) + 1; });
  const tags = Object.entries(parType).map(([type, nb]) => {
    const {label, couleur} = LABELS_ERREUR[type] || {label:type, couleur:'rouge'};
    return `<span class="tag-erreur tag-${couleur}">${nb>1?nb+'× ':''}${label}</span>`;
  });
  zone.innerHTML = `<div class="message erreur"><span class="icone-msg">✗</span><span>${erreurs.length} erreur${erreurs.length>1?'s':''} : ${tags.join(' ')}</span></div>`;
  const msgTexte = `${erreurs.length} erreur${erreurs.length>1?'s':''} : `
    + Object.entries(parType).map(([t,n]) => (n>1?n+'× ':'')+(LABELS_ERREUR[t]?.label||t)).join(', ');
  ajouterHistorique(msgTexte, 'erreur', false);
  document.getElementById('btn-indice').classList.remove('cache');
  document.getElementById('btn-contexte').classList.remove('cache');
  enregistrerTentative(state.theme, state.phraseIndex, false, state.indicesCourants, erreurs.map(e=>({attendu:e.attendu, type:e.type})));
  state._erreurs = erreurs; state._motsSaisie = motsSaisie; state._motsOriginal = motsOriginal;
  // Suggestion de renforcement si un mot dépasse 3 erreurs
  afficherSuggestionRenforcement(zone, erreurs.map(e => e.attendu));
}

// ─── Suggestion de renforcement ────────────────────────────────────────────
function afficherSuggestionRenforcement(zone, mots) {
  const stats = chargerStats();
  const motsARevoir = [];
  mots.forEach(mot => {
    let total = 0;
    Object.values(stats).forEach(theme => {
      Object.values(theme).forEach(phrase => {
        const e = phrase.erreurs?.[mot];
        if (e) total += typeof e === 'number' ? e : (e.count || 0);
      });
    });
    if (total >= 3) motsARevoir.push({ mot, total });
  });
  if (motsARevoir.length === 0) return;

  // Prendre le mot le plus souvent raté
  motsARevoir.sort((a, b) => b.total - a.total);
  const { mot, total } = motsARevoir[0];
  const phrases = chercherPhrasesAvecMot(mot);
  if (phrases.length === 0) return;

  const suggestion = document.createElement('div');
  suggestion.className = 'suggestion-renforcement';
  suggestion.innerHTML = `<span class="suggestion-icone">💡</span>
    <span>Tu as souvent du mal avec <em>${mot}</em> (${total}×) —
    <button class="btn-suggestion" data-mot="${mot}">voir les phrases avec ce mot</button>
    </span>`;
  zone.appendChild(suggestion);

  suggestion.querySelector('.btn-suggestion').addEventListener('click', () => {
    document.getElementById('panneau-stats').classList.remove('cache');
    afficherPhrasesAvecMot(mot);
  });
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

// ─── Contexte ──────────────────────────────────────────────────────────────
function afficherContexte() {
  if (!state._erreurs || !state._motsOriginal) return;
  state.indicesCourants++;
  const zone  = document.getElementById('zone-indices');
  const total = state._motsOriginal.length;
  const html  = state._erreurs.map(e => {
    const i     = e.index;
    const avant = i > 0       ? state._motsOriginal[i-1] : null;
    const apres = i < total-1 ? state._motsOriginal[i+1] : null;
    const pos   = avant && apres ? `entre <strong>${avant}</strong> et <strong>${apres}</strong>`
      : avant ? `après <strong>${avant}</strong>`
      : apres ? `avant <strong>${apres}</strong>`
      : 'en début de phrase';
    return `<li>Un mot ${pos} est incorrect.</li>`;
  }).join('');
  ajouterIndice(zone, 'c', `Contexte :<ul class="liste-contexte">${html}</ul>`);
  ajouterHistorique('Indice : contexte (mots voisins)', 'indice', false);
}

// ─── Reset ─────────────────────────────────────────────────────────────────
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
    el.addEventListener('animationend', ()=>el.remove());
  }
}
