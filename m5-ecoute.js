// m5-ecoute.js — Module 5 : Écoute TTS
// Dépendances : m1-nettoyage.js (nettoyerTexte), m2-tokens.js (tokeniser, compterMotsReels)
// Accède à : state (synth, voix, phraseOriginale)

function chargerVoix() {
  const load = () => {
    const v = state.synth.getVoices();
    state.voix = v.find(x => x.lang==='fr-FR') || v.find(x => x.lang.startsWith('fr')) || v[0] || null;
  };
  load();
  if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = load;
}

function ecouterPhrase() {
  if (!state.phraseOriginale) return;
  const btn = document.getElementById('btn-ecouter');
  const saisie = document.getElementById('champ-saisie').value;
  const nbMotsSaisis = compterMotsReels(saisie);

  // Écoute partielle : si ≥ 3 mots saisis, reprendre 1 mot avant la position courante.
  // Plafonner depart à mots.length - 1 pour éviter un slice vide
  // (cas : mot en trop, ou phrase complète tapée avant vérification).
  let texteALire = state.phraseOriginale;
  if (nbMotsSaisis >= 3) {
    const mots    = tokeniser(nettoyerTexte(state.phraseOriginale));
    const depart  = Math.min(Math.max(0, nbMotsSaisis - 1), mots.length - 1);
    const extrait = mots.slice(depart).join(' ');
    texteALire    = extrait || state.phraseOriginale;
  }

  btn.classList.add('lecture'); btn.textContent = '⏸ En cours…';
  const fin = () => {
    btn.classList.remove('lecture');
    const nb  = compterMotsReels(document.getElementById('champ-saisie').value);
    const nbO = compterMotsReels(state.phraseOriginale);
    btn.innerHTML = (nb >= 3 && nb < nbO)
      ? '▶ Écouter la suite'
      : '<span class="icone">▶</span> Écouter';
  };

  state.synth.cancel();
  const u = new SpeechSynthesisUtterance(texteALire);
  u.lang='fr-FR'; u.rate=0.85; if (state.voix) u.voice=state.voix;
  u.onend=fin; u.onerror=fin; state.synth.speak(u);
}
