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

function onPhraseComplete(themeFini, indexFini, palierFini) {
  const theme = themeFini ?? gramState.theme;
  const phraseIndex = indexFini ?? gramState.phraseIndex;
  const palierActuel = palierFini ?? gramState.palierActuel;
  if (palierActuel && theme !== null && phraseIndex !== null) {
    verifierFinDePalier(theme, phraseIndex);
  }
}

// Verrouille/déverrouille les clics sur la liste de phrases pendant l'animation
function bloquerListePhrases(bloquer) {
  const liste = document.getElementById('liste-phrases');
  if (!liste) return;
  liste.style.pointerEvents = bloquer ? 'none' : '';
  liste.style.opacity       = bloquer ? '0.5' : '';
  liste.style.transition    = 'opacity 0.2s';
}
