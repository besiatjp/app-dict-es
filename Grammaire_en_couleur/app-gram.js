// app-gram.js — Orchestration principale

const gramState = {
  theme:        null,
  phraseIndex:  null,
  tokensActifs: null,
};

document.addEventListener('DOMContentLoaded', () => {
  construireTableau();
  construireThemes();
});

// ── Thèmes ────────────────────────────────────────────────────────────────
function construireThemes() {
  const zone = document.getElementById('themes');
  zone.innerHTML = '';
  Object.keys(CORPUS_ANNOTE).forEach(theme => {
    const btn = document.createElement('button');
    btn.className = 'btn-theme' + (gramState.theme === theme ? ' actif' : '');
    btn.textContent = theme;
    btn.dataset.theme = theme;
    btn.addEventListener('click', () => selectionnerTheme(theme));
    zone.appendChild(btn);
  });
}

function selectionnerTheme(theme) {
  gramState.theme = theme;
  gramState.phraseIndex = null;
  gramState.tokensActifs = null;
  document.querySelectorAll('.btn-theme').forEach(b =>
    b.classList.toggle('actif', b.dataset.theme === theme)
  );
  construireListePhrases(theme);
  reinitialiserZoneTravail();
}

// ── Liste des phrases ─────────────────────────────────────────────────────
function construireListePhrases(theme) {
  const zone = document.getElementById('liste-phrases');
  zone.innerHTML = '';
  const phrases = CORPUS_ANNOTE[theme];
  phrases.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'btn-phrase';
    btn.dataset.index = i;

    const badge = document.createElement('span');
    badge.className = 'badge-num';
    badge.textContent = i + 1;

    const apercu = item.tokens.slice(0, 2).map(t => t.mot).join(' ') + '…';
    const texte = document.createElement('span');
    texte.textContent = apercu;

    btn.appendChild(badge);
    btn.appendChild(texte);
    btn.addEventListener('click', () => selectionnerPhrase(theme, i));
    zone.appendChild(btn);
  });
}

// ── Sélection d'une phrase ────────────────────────────────────────────────
function selectionnerPhrase(theme, index) {
  gramState.theme       = theme;
  gramState.phraseIndex = index;

  const item = CORPUS_ANNOTE[theme][index];
  gramState.tokensActifs = item.tokens;

  document.querySelectorAll('.btn-phrase').forEach(b =>
    b.classList.toggle('actif', parseInt(b.dataset.index) === index)
  );

  viderTableau();
  reinitialiserEssais();
  setFeedback('');
  afficherMots(item.tokens);
  activerCasesPourPhrase(item.tokens);       // ← grise les cases absentes
  resetTimersHesitation(item.tokens);        // ← démarre les timers
}

// ── Reset zone travail ────────────────────────────────────────────────────
function reinitialiserZoneTravail() {
  viderTableau();
  reinitialiserEssais();
  setFeedback('');
  // Griser toutes les cases
  document.querySelectorAll('.gec-case').forEach(el => el.classList.add('inactive'));
  const zone = document.getElementById('mots-phrase');
  zone.innerHTML = '<p class="hint-vide">Sélectionne une phrase pour commencer.</p>';
}
