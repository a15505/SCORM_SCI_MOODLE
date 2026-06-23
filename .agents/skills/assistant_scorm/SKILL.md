---
name: assistant_scorm
description: Assistant de configuration technique et pédagogique pour la création de packages SCORM compatibles Moodle.
---

# Assistant de Configuration SCORM pour Moodle (Étape 3 du Pipeline)

Ce skill est utilisé **à l'Étape 3** (après le prototypage web) pour configurer les paramètres techniques du paquet SCORM et l'empaqueter. Son rôle est d'assurer la compatibilité avec Moodle tout en préservant **strictement** le script de redimensionnement de l'Iframe, et de générer l'archive ZIP autonome sans dépendances externes (incluant localement Bootstrap, FontAwesome et les polices).

---

## Modèle de Questionnement & Aide à la Décision

Proposez à l'enseignant les choix suivants pour configurer son activité :

### 1. Objectif Pédagogique et Suivi de l'Achèvement (Completion)
Définissez quand Moodle considérera que l'activité est « Terminée ».
* **Option A : Navigation / Diapositives vues** (Idéal pour les présentations théoriques ou démonstrations).
  * *Comportement SCORM* : Moodle marque l'activité comme complétée lorsque l'élève a vu un certain pourcentage ou nombre de pages/diapositives.
* **Option B : Réussite du test / Score minimal** (Idéal pour l'évaluation sommative ou formative).
  * *Comportement SCORM* : L'achèvement est lié au succès d'un quiz intégré. L'activité passe au statut « Complétée » ou « Réussie » uniquement si le score atteint le seuil requis.
* **Option C : Fin de scénario / Atteinte d'une diapositive clé** (Idéal pour le Jeu dont vous êtes le héros).
  * *Comportement SCORM* : Dès que l'élève atteint la fin du scénario, le script JavaScript envoie la commande de complétion. Il est impératif d'envoyer le statut `"passed"` (succès) en cas de victoire, et `"failed"` (échec) en cas de défaite finale ou de game over. Ne vous contentez pas de retourner une valeur générique `"completed"`.

---

### 2. Évaluation et Transmission de la Note
Comment le score de l'activité doit-il impacter le carnet de notes de Moodle ?
* **Activité Formative (sans note)** :
  * Le paquet transmet uniquement le statut d'achèvement (`cmi.core.lesson_status = "completed"`). Aucune note n'est enregistrée, ou celle-ci est purement indicative.
* **Activité Sommative (évaluée)** :
  * Le paquet transmet un score brut (`cmi.core.score.raw`) et un score maximal (`cmi.core.score.max`).
  * Moodle enregistre cette note dans le carnet de notes. Il faut définir la note de passage dans Moodle (ex. : 60%).

---

### 3. Gestion des Tentatives et Reprise (Resume)
* **Sauvegarde de l'état (Suspension) - Obligatoire** :
  * L'agent doit **systématiquement** activer `cmi.core.exit = "suspend"` lors de la fermeture de l'activité, et enregistrer l'état dans `cmi.suspend_data`. Cela garantit par défaut que l'élève puisse reprendre exactement là où il s'est arrêté (`cmi.core.entry = "resume"`). Il s'agit d'une exigence incontournable pour toute activité.
* **Gestion des tentatives dans Moodle** :
  * *Tentative unique* : Idéal pour une évaluation officielle.
  * *Tentatives multiples* : Idéal pour l'apprentissage par l'erreur. Spécifier la méthode d'évaluation de Moodle (meilleure note, note moyenne, première tentative, dernière tentative).

---

## Répertoire des Variables SCORM Clés (Pour l'aide au codage)

Si l'enseignant ou le développeur construit le SCORM manuellement (ex. avec du JS personnalisé), proposez ce tableau de référence rapide pour les variables SCORM 1.2 :

| Variable SCORM 1.2 | Description / Valeurs types | Usage typique dans Moodle |
| :--- | :--- | :--- |
| `cmi.core.lesson_status` | `"passed"`, `"failed"`, `"completed"`, `"incomplete"` | Gère la complétion de l'activité Moodle et le suivi de progression. |
| `cmi.core.score.raw` | Valeur numérique (ex: `85`) | Le score obtenu par l'élève, envoyé au carnet de notes de Moodle. |
| `cmi.core.score.max` | Valeur numérique (ex: `100`) | Le score maximum possible. |
| `cmi.core.score.min` | Valeur numérique (ex: `0`) | Le score minimum possible. |
| `cmi.core.exit` | `"suspend"`, `"logout"`, `""` | Permet d'indiquer à Moodle si la session doit être sauvegardée ou réinitialisée. |
| `cmi.suspend_data` | Chaîne de caractères (ex: JSON sérialisé) | Stocke les variables internes du jeu (niveaux passés, choix faits, PV restants). |

---

## Conseils de Compatibilité Moodle
1. **SCORM 1.2 vs SCORM 2004** : Moodle supporte pleinement le standard **SCORM 1.2**. Bien qu'il supporte en partie SCORM 2004, il est fortement recommandé d'utiliser SCORM 1.2 pour éviter les bogues de communication et de sauvegarde des notes.
2. **Sortie Propre** : Rappelez toujours que le paquet SCORM doit appeler `LMSCommit("")` après avoir mis à jour les notes, puis `LMSFinish("")` à la fermeture, sans quoi Moodle risque de ne pas enregistrer la note finale ou le statut de l'élève.
3. **Pas de console de débogage interne** : Ne générez **jamais** de console de log ou d'éléments HTML de débogage dans l'activité SCORM finale. L'activité de l'élève doit rester propre, libre de toute interférence de style ou de redimensionnement liée à l'affichage des logs. Le débogage doit se faire via la console F12 ou à l'aide du simulateur externe de Moodle.

---

## Ressources autonomes à générer systématiquement

Dans chaque projet d'activité SCORM, vous devez systématiquement générer ces deux ressources (sans modifier leur logique interne) :

### 1. Le script SCORM et Redimensionnement (`scorm_api.js`)
Ce fichier gère la détection de l'API Moodle, le pont vers le simulateur hors-ligne, et la logique d'ajustement dynamique de l'iframe.

### 2. Le simulateur Moodle Tout-en-un (`simulateur.html`)
Ce fichier unique remplace les multiples fichiers HTML de développement et s'exécute directement dans le navigateur. Il comprend 3 onglets intégrés :
* **Onglet Test SCORM** : Simule la transmission des notes et le redimensionnement Moodle. **Règle d'interface** : La console de log SCORM doit toujours être placée sur le côté droit (layout Flexbox) et non en dessous de l'activité, pour permettre un suivi optimal.
* **Onglet Arborescence** : Affiche graphiquement les `nodes` et `edges` de `scenario_data.js` (via vis-network) pour une interface conviviale. **Design épuré** : L'agent ne doit **jamais** placer de texte (label) sur les liens (edges) entre les noeuds pour ne pas surcharger visuellement l'arborescence. **L'arborescence doit être interactive** : lors du clic sur un nœud, un modal (fenêtre superposée) doit s'afficher contenant les données relatives à ce nœud (texte, choix, score, vies). Le modal se ferme via une croix ou un clic externe. *Note* : `scenario_data.js` doit inclure une `storyKey` sur chaque nœud.

> [!IMPORTANT]
> **Règle de préservation de l'interface** : Vous ne devez **jamais recréer le simulateur de zéro**. Pour tout nouveau projet, copiez le gabarit standard situé dans `.agents/skills/assistant_scorm/resources/simulateur_template.html`. Vous devez uniquement remplacer le texte de la balise `<title>` et de la balise `<h1>` avec le titre de la nouvelle activité. Toute la logique du jeu et le contenu doivent être ajoutés dans les fichiers externes (`scenario_data.js`, `game_logic.js`, `styles.css`) qui sont appelés par ce gabarit.

---

## Script d'Ajustement d'Iframe Moodle (Anti-Double Scrollbar)

> [!WARNING]
> **Règle d'or sur le CSS (Anti-boucle infinie)**
> Ne définissez jamais de `min-height: 100vh` ou `height: 100vh` sur le `body` ou un conteneur principal de l'activité SCORM. Puisque le script ajuste l'iframe à la hauteur du contenu, l'unité `vh` (viewport height) fera grandir le contenu à chaque fois que l'iframe grandira, créant une boucle infinie de redimensionnement qui fera gonfler l'iframe indéfiniment dans Moodle et fera crasher le navigateur. Utilisez toujours `min-height: 100%`.

Pour éliminer de manière absolue les doubles barres de défilement, ce script universel et réactif est inclus de manière standard dans le fichier `scorm_api.js` autonome :

```javascript
// ── Resize iframe Moodle (hauteur dynamique bidirectionnelle) ───────────
function resizeLMSIframe() {
  // Mesurer la hauteur réelle du contenu (getBoundingClientRect évite les accumulations de scrollHeight)
  var content = document.getElementById('activity-content') || document.body;
  var height = Math.ceil(content.getBoundingClientRect().height) + 32; // marge de sécurité

  try {
    // 1. Modifier l'iframe directement
    if (window.frameElement) {
      window.frameElement.style.setProperty('height', height + 'px', 'important');
      window.frameElement.style.setProperty('min-height', height + 'px', 'important');
      window.frameElement.setAttribute('scrolling', 'no');
      window.frameElement.style.setProperty('overflow', 'hidden', 'important');
    }
    
    // 2. Ajuster les conteneurs du lecteur SCORM de Moodle parent (Boost & Classic)
    if (window.parent && window.parent.document) {
      var pd = window.parent.document;
      ['scorm_content', 'scorm_layout', 'scorm_toc', 'scormpage'].forEach(function(id) {
        var el = pd.getElementById(id);
        if (el) { 
          el.style.setProperty('height', 'auto', 'important'); 
          el.style.setProperty('overflow', 'visible', 'important'); 
        }
      });
      var so = pd.getElementById('scorm_object');
      if (so) {
        so.style.setProperty('height', height + 'px', 'important');
        so.style.setProperty('min-height', height + 'px', 'important');
        so.style.setProperty('overflow', 'hidden', 'important');
      }
    }
    
    // 3. Envoyer postMessage pour Moodle 4+ (compatibilité native)
    window.parent.postMessage({ type: 'setHeight', height: height }, '*');
    window.parent.postMessage({ type: 'resize', height: height }, '*');
  } catch(e) {
    console.warn("[SCORM] Erreur d'ajustement de hauteur :", e);
  }
}

// Debounce pour éviter la surcharge de layout
var _resizeTimer;
function debouncedResize() {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(resizeLMSIframe, 50);
}

// Observateur de redimensionnement de contenu (ResizeObserver)
if (typeof ResizeObserver !== 'undefined') {
  var _ro = new ResizeObserver(debouncedResize);
  _ro.observe(document.getElementById('activity-content') || document.body);
}

// Observateur de modification du DOM (MutationObserver pour les apparitions dynamiques)
if (typeof MutationObserver !== 'undefined') {
  var _mo = new MutationObserver(debouncedResize);
  _mo.observe(document.body, { childList: true, subtree: true });
}

// Écouter les messages venant d'autres composants si nécessaire
window.addEventListener('message', function(e) {
  var h = 0;
  if (e.data && e.data.type === 'setHeight' && e.data.height) {
    h = Math.ceil(e.data.height) + 32;
  } else if (e.data && e.data.type === 'resize' && e.data.height) {
    h = Math.ceil(e.data.height) + 32;
  }
  if (h > 0) {
    try {
      if (window.frameElement) {
        window.frameElement.style.setProperty('height', h + 'px', 'important');
        window.frameElement.style.setProperty('min-height', h + 'px', 'important');
        window.frameElement.setAttribute('scrolling', 'no');
      }
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'setHeight', height: h }, '*');
      }
    } catch(err) {}
  }
});

// Appels initiaux
window.addEventListener('load', resizeLMSIframe);
document.addEventListener('DOMContentLoaded', resizeLMSIframe);

// Exposer les alias de fonctions courants pour l'IA ou les scripts générés
window.requestResize = debouncedResize;
window.resizeIframe = debouncedResize;
```

---

## Publication et Export ZIP (Géré par l'Agent)

Lorsque l'utilisateur colle la consigne générant le paquet ZIP final pour Moodle, l'agent doit prendre le relais et effectuer le travail en utilisant ses outils (et non le navigateur) :
1. **Création du Runner et du Manifeste** : L'agent doit générer les fichiers `index.html` (le runner SCORM propre) et `imsmanifest.xml` via `write_to_file`.
2. **Nommage dynamique basé sur le titre** : L'archive ZIP finale doit obligatoirement être nommée en reprenant le titre de l'activité.
   * **Règle de formatage** : Les espaces doivent être remplacés par des traits de soulignement (`_`) ou des tirets (`-`). L'agent doit conserver et **autoriser les accents ainsi que les apostrophes (`'`)** dans le nom du fichier.
   * *Exemple* : `l_énigme_de_la_poudre_blanche.zip`.
3. **Création de l'Archive (Autonomie totale)** : L'agent doit utiliser `run_command` (ex: `Compress-Archive` sous Windows PowerShell) pour zipper **tous** les fichiers requis pour la version finale :
   * Les fichiers de code : `index.html`, `imsmanifest.xml`, `scenario_data.js`, `scorm_api.js`, `game_logic.js`, `styles.css`.
   * Le dossier `assets/` entier (contenant Bootstrap 5 local, FontAwesome 6 local, et les polices locales Ubuntu/Viga) afin de garantir une exécution 100% autonome sans connexion internet externe.
   * *Exclusion* : Exclure `simulateur.html` et les fichiers sources de développement (ex: `.md`, `.ink`, `.agents`).
4. **Validation du SCORM via le Simulateur** : Après la création du ZIP, l'agent doit impérativement mettre à jour le fichier `simulateur.html` pour y intégrer la fausse API SCORM (`var API = { ... }`) et inclure le script `scorm_api.js`. Il doit ensuite demander à l'utilisateur de retourner sur le simulateur local (`http://localhost:8000/simulateur.html`) pour jouer jusqu'à la fin de l'activité et vérifier visuellement dans le panneau latéral (Console SCORM) que le score et le statut (passed/failed) sont bien transmis. Enfin, juste en dessous de cette instruction de validation, l'agent **doit fournir un lien cliquable vers le dossier du projet** (ex: `[Dossier de l'activité](file:///C:/chemin/du/dossier)`) et indiquer explicitement à l'utilisateur d'ouvrir ce dossier pour y récupérer le fichier `.zip`. Ne faites **jamais** de lien direct vers le fichier `.zip` lui-même, car cela déclenche l'interface de révision de code de l'IDE au lieu du téléchargement.
