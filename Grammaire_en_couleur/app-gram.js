// app-gram.js — Orchestration principale

const gramState = {
  theme:        null,
  phraseIndex:  null,
  tokensActifs: null,
  palierActuel: null,
};

document.addEventListener('DOMContentLoaded', () => {
  construireTableau();
  initialiserNavigation(); // détecte ?theme=X ou affiche le sélecteur
});

function reinitialiserZoneTravail() {
  viderTableau();
  reinitialiserEssais();
  setFeedback('');
  document.querySelectorAll('.gec-case').forEach(el => el.classList.add('inactive'));
  const zone = document.getElementById('mots-phrase');
  zone.innerHTML = '<p class="hint-vide">Sélectionne une phrase pour commencer.</p>';
}

function onPhraseComplete() {
  const { theme, phraseIndex, palierActuel } = gramState;
  if (palierActuel && theme !== null && phraseIndex !== null) {
    verifierFinDePalier(theme, phraseIndex);
  }
}
