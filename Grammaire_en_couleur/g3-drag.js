// g3-drag.js — Module 3 : Logique de drop, vérification, encouragements, reprise

// ── Constantes ────────────────────────────────────────────────────────────
const SEUIL_PULSE        = 3;   // essais infructueux avant pulse de la case
const SEUIL_REPRISE      = 5;   // erreurs totales avant proposition de refaire
const DELAI_HESITATION_1 = 12000; // 12s sans action → encouragement léger
const DELAI_HESITATION_2 = 25000; // 25s → indice semi-linguistique

// ── État ──────────────────────────────────────────────────────────────────
let essais        = {};   // index token → nb essais infructueux
let erreursTotal  = 0;    // erreurs cumulées sur la phrase courante
let reprises      = 0;    // nombre de fois qu'on a refait cette phrase
let timerHesit1   = null;
let timerHesit2   = null;

// ── Gestion du drop ───────────────────────────────────────────────────────
function gererDrop(motIndexStr, catCible) {
  const index = parseInt(motIndexStr);
  const tokens = gramState.tokensActifs;
  if (!tokens || index < 0 || index >= tokens.length) return;

  const token        = tokens[index];
  const catAttendue  = token.cat;
  const catCibleNorm = normaliserCat(catCible);
  const catAttNorm   = normaliserCat(catAttendue);

  // Toute action repart les timers d'hésitation
  resetTimersHesitation(tokens);

  if (catCibleNorm === catAttNorm) {
    // ✅ Bonne case
    essais[index] = 0;
    marquerMotPlace(index);
    placerMotDansCase(token.mot, catAttendue);
    masquerBulle();

    if (tousLesMotsPlaces(tokens)) {
      clearTimersHesitation();
      // Évaluer la fluidité → reprise si nécessaire
      const doitReprendre = erreursTotal >= SEUIL_REPRISE && reprises < 2;
      setTimeout(() => {
        remettreMotsEnOrdre(tokens, () => {
          onPhraseComplete();
          if (doitReprendre) {
            proposerReprise();
          } else {
            setFeedback('✓', true);
          }
        });
      }, 400);
    }

  } else {
    // ❌ Mauvaise case
    if (!essais[index]) essais[index] = 0;
    essais[index]++;
    erreursTotal++;
    remettreMotEnPlace(index);

    if (essais[index] >= SEUIL_PULSE) {
      pulserCase(catAttendue);
    }
  }
}

// ── Proposition de reprise ────────────────────────────────────────────────
function proposerReprise() {
  afficherBulle(
    'Tu peux encore mieux faire — essaie à nouveau cette phrase.',
    'reprise',
    () => {
      reprises++;
      erreursTotal = 0;
      reinitialiserEssais();
      masquerBulle();
      viderTableau();
      // Réafficher les mots dans le désordre
      const tokens = gramState.tokensActifs;
      const melanges = [...tokens].sort(() => Math.random() - 0.5);
      // Remettre les mots dans l'ordre d'origine mais visuellement mélangés
      // On réaffiche simplement tous les tokens
      document.querySelectorAll('.mot-token').forEach(el => {
        el.classList.remove('place');
        el.style.opacity = '';
        el.style.visibility = '';
        el.style.borderColor = '';
      });
      activerCasesPourPhrase(tokens);
      resetTimersHesitation(tokens);
    }
  );
}

// ── Timers d'hésitation ───────────────────────────────────────────────────
function resetTimersHesitation(tokens) {
  clearTimersHesitation();

  timerHesit1 = setTimeout(() => {
    // Encouragement léger
    afficherBulle('Allez, tu ne risques rien — essaie !', 'encouragement');
  }, DELAI_HESITATION_1);

  timerHesit2 = setTimeout(() => {
    // Indice semi-linguistique : chercher un mot déjà placé de la même catégorie
    const motEnAttente = tokens.find((t, i) => {
      const el = document.querySelector(`.mot-token[data-index="${i}"]`);
      return el && !el.classList.contains('place');
    });
    if (motEnAttente) {
      // Y a-t-il déjà un mot de cette catégorie dans le tableau ?
      const dejaPlace = tokens.find((t, i) => {
        const el = document.querySelector(`.mot-token[data-index="${i}"]`);
        return el && el.classList.contains('place') && t.cat === motEnAttente.cat;
      });
      const msg = dejaPlace
        ? `Il y a déjà un mot du même type dans le tableau — regarde où il est allé.`
        : `Observe bien le tableau — quelle case correspond à ce mot ?`;
      afficherBulle(msg, 'indice');
    }
  }, DELAI_HESITATION_2);
}

function clearTimersHesitation() {
  if (timerHesit1) { clearTimeout(timerHesit1); timerHesit1 = null; }
  if (timerHesit2) { clearTimeout(timerHesit2); timerHesit2 = null; }
}

// ── Bulle de feedback ─────────────────────────────────────────────────────
function afficherBulle(message, type, actionCallback) {
  let bulle = document.getElementById('bulle-feedback');
  if (!bulle) {
    bulle = document.createElement('div');
    bulle.id = 'bulle-feedback';
    document.getElementById('zone-feedback').appendChild(bulle);
  }

  bulle.className = 'bulle bulle-' + type;
  bulle.innerHTML = '';

  const texte = document.createElement('span');
  texte.textContent = message;
  bulle.appendChild(texte);

  if (actionCallback) {
    const btn = document.createElement('button');
    btn.className = 'bulle-btn';
    btn.textContent = 'Recommencer';
    btn.addEventListener('click', actionCallback);
    bulle.appendChild(btn);
  }

  // Apparition douce
  bulle.style.opacity = '0';
  bulle.style.display = 'flex';
  requestAnimationFrame(() => { bulle.style.opacity = '1'; });
}

function masquerBulle() {
  const bulle = document.getElementById('bulle-feedback');
  if (bulle) {
    bulle.style.opacity = '0';
    setTimeout(() => { bulle.style.display = 'none'; }, 300);
  }
}

// ── Utilitaires ───────────────────────────────────────────────────────────
function normaliserCat(cat) {
  const map = {
    'déterminant': 'determinant',
    'préposition': 'preposition',
    'conjonction': 'conjonction',
    'interjection': 'interjection',
    'adjectif': 'adjectif',
    'adverbe': 'adverbe',
    'pronom': 'pronom',
    'verbe': 'verbe',
    'nom': 'nom',
    'pivot': 'pivot',
    'pivot-dp': 'pivot-dp',
  };
  return map[cat] || cat;
}

function setFeedback(msg, succes = false) {
  const zone = document.getElementById('zone-feedback');
  // Vider la bulle si présente
  const bulle = document.getElementById('bulle-feedback');
  if (bulle) bulle.remove();

  if (msg) {
    let span = zone.querySelector('.feedback-texte');
    if (!span) {
      span = document.createElement('span');
      span.className = 'feedback-texte';
      zone.appendChild(span);
    }
    span.textContent = msg;
    zone.className = 'zone-feedback' + (succes ? ' succes' : '');
  } else {
    zone.innerHTML = '';
    zone.className = 'zone-feedback';
  }
}

function reinitialiserEssais() {
  essais = {};
  erreursTotal = 0;
  reprises = 0;
  clearTimersHesitation();
  masquerBulle();
}
