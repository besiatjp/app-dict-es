// m5-ecoute.js — Module 5 : Écoute TTS
// Dépendances : m1-nettoyage.js (nettoyerTexte), m2-tokens.js (tokeniser, compterMotsReels)
// Accède à : state (synth, voix, phraseOriginale)

// Noms de voix françaises connus par genre
const VOIX_FEMME = ['amélie', 'marie', 'audrey', 'lea', 'léa', 'virginie', 'alice'];
const VOIX_HOMME = ['thomas', 'nicolas', 'pierre', 'felix', 'félix'];

function chargerVoix() {
  const load = () => {
    const v = state.synth.getVoices().filter(x => x.lang === 'fr-FR' || x.lang.startsWith('fr'));
    if (v.length === 0) return;

    // Construire le sélecteur si pas encore fait
    construireSelecteurVoix(v);

    // Voix par défaut : la première voix française trouvée
    if (!state.voix) state.voix = v[0];
  };
  load();
  if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = load;
}

function construireSelecteurVoix(voixDisponibles) {
  if (document.getElementById('select-voix')) return; // déjà construit

  const femmes = voixDisponibles.filter(v => VOIX_FEMME.some(n => v.name.toLowerCase().includes(n)));
  const hommes = voixDisponibles.filter(v => VOIX_HOMME.some(n => v.name.toLowerCase().includes(n)));

  // Si pas de distinction claire, ne pas afficher le sélecteur
  if (femmes.length === 0 && hommes.length === 0) return;

  const wrap = document.createElement('div');
  wrap.id = 'select-voix';
  wrap.className = 'voix-selector';
  wrap.innerHTML = `<span class="voix-label">Voix :</span>`;

  const ajouterBouton = (label, voix, genre) => {
    const btn = document.createElement('button');
    btn.className = 'btn-voix';
    btn.dataset.genre = genre;
    btn.textContent = label;
    btn.title = voix.name;
    btn.addEventListener('click', () => {
      state.voix = voix;
      document.querySelectorAll('.btn-voix').forEach(b => b.classList.remove('actif'));
      btn.classList.add('actif');
    });
    wrap.appendChild(btn);
    return btn;
  };

  if (femmes.length > 0) ajouterBouton('♀ Femme', femmes[0], 'f');
  if (hommes.length > 0) ajouterBouton('♂ Homme', hommes[0], 'm');

  // Activer la première voix par défaut
  const premier = wrap.querySelector('.btn-voix');
  if (premier) {
    premier.classList.add('actif');
    state.voix = femmes.length > 0 ? femmes[0] : hommes[0];
  }

  // Insérer après le groupe de boutons
  const groupe = document.querySelector('.groupe-boutons');
  if (groupe) groupe.after(wrap);
}

function ecouterPhrase() {
  if (!state.phraseOriginale) return;
  const btn = document.getElementById('btn-ecouter');
  const saisie = document.getElementById('champ-saisie').value;
  const nbMotsSaisis = compterMotsReels(saisie);

  let texteALire = state.phraseOriginale;
  if (nbMotsSaisis >= 3) {
    const mots  = tokeniser(nettoyerTexte(state.phraseOriginale));
    const depart = Math.max(0, nbMotsSaisis - 1);
    texteALire  = mots.slice(depart).join(' ');
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
