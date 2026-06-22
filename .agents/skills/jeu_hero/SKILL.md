---
name: jeu_hero
description: Méthode de création de jeu de rôle interactif (Jeu dont vous êtes le héros) pour les sciences au secondaire (PFEQ).
---

# Méthode de création de Jeu dont vous êtes le héros (Sciences Secondaire)

Ce skill guide l'accompagnement d'un enseignant dans la scénarisation d'un jeu de rôle d'apprentissage scientifique à embranchements multiples (CYOA - Choose Your Own Adventure) pour les élèves du secondaire.

## Principes Directeurs
1. **Intégration du PFEQ** : Chaque embranchement doit solliciter la compréhension ou l'application d'un concept prescrit du PFEQ.
2. **Scénario contextualisé** : Placer l'élève dans un rôle concret (ex. : enquêteur environnemental, ingénieur sur une station spatiale, médecin de bord).
3. **Explosion combinatoire contrôlée** : Éviter que le jeu n'ait trop de branches uniques. Utiliser des goulots d'étranglement (chemin convergent vers des points de passage obligés).

---

## Méthodologie d'Accompagnement de l'Enseignant

Suivez ces étapes pour co-concevoir le jeu avec l'enseignant :

### Étape 1 : Le Cadre et la Mission (Mise en situation)
Définissez :
* Le **rôle** de l'élève (ex.: Spécialiste de la gestion des eaux).
* La **mission principale** (ex.: Identifier et stopper la source d'une contamination chimique dans une rivière locale).
* Le **contexte de départ** (ex.: "Vous arrivez au laboratoire avec trois échantillons d'eau prélevés près d'une usine...").

### Étape 2 : L'Arbre de Choix et Mécanismes de Convergence (Structure arborescente CYOA)
Pour structurer le jeu sans surcharger le développement, proposez ce modèle de structure convergente :

> [!IMPORTANT]
> **Format de présentation de la structure** : Lors du plan d'implémentation, l'agent doit impérativement créer une **forme textuelle indentée** (listes à puces) pour faire comprendre la logique du jeu. Ne proposez **jamais** de schéma ou diagramme global (ex: Mermaid) car l'affichage n'est pas bien géré et illisible à l'écran. L'interface graphique conviviale de l'arborescence est réservée exclusivement à l'onglet Arborescence du `simulateur.html`.

* **Niveau 1 : Diagnostic (Choix initial)**
  * Choix A (Correct/Méthodique) -> Rétroaction positive -> Accès au Niveau 2.
  * Choix B (Erreur commune/Intuition fausse) -> Explication scientifique de l'erreur -> Possibilité de se corriger ou pénalité -> Redirection vers le Niveau 2.
  * Choix C (Action dangereuse ou hors sujet) -> Rétroaction immédiate (ex. : accident de laboratoire virtuel) -> Retour au départ ou perte d'une "vie".
* **Niveau 2 : Expérimentation ou Investigation** (Nouveaux embranchements convergents)
* **Niveau 3 : Conclusion / Prise de décision finale**

### Étape 3 : Rétroactions Scientifiques Formatives
Chaque choix incorrect doit être une opportunité d'apprentissage. Ne dites pas simplement "Faux", expliquez le phénomène physique, chimique ou biologique :
* *Exemple (Univers matériel)* : Si l'élève choisit de mélanger un acide fort avec de l'eau en versant l'eau dans l'acide :
  * **Rétroaction** : "Attention ! Verser de l'eau dans un acide fort provoque une réaction hautement exothermique qui peut causer des projections d'acide. En laboratoire, on verse toujours l'acide dans l'eau ('Acide dans l'eau, bravo ! Eau dans l'acide, suicide !'). Vous devez recommencer la manipulation."
* **Rétroaction sur la perte de vie** : Lorsqu'un choix ou une erreur fait perdre une vie à l'élève ou lui retire des points, l'agent doit obligatoirement retourner une rétroaction spécifique indiquant clairement la cause (ex: "Vous avez perdu une vie car vous avez inséré le tison au lieu de la flamme"). L'élève doit comprendre immédiatement quelle action a entraîné cette pénalité.

### Étape 4 : Gestion du Score et des Variables (Variables SCORM)
Aidez l'enseignant à définir comment évaluer le jeu et veillez à configurer la valeur de départ de manière cohérente :
* **Points de Vie / Énergie** : Commencer à 100 et soustraire des points à chaque mauvaise hypothèse scientifique.
  * *Configuration* : Initialiser le score à `100` (`INITIAL_SCORE: 100` dans le runner et `VAR score = 100` dans Ink).
* **Score de Performance / Cumulatif** : Gagner des points lors d'explications correctes ou de résolutions de problèmes complexes.
  * *Configuration* : Initialiser le score à `0` (`INITIAL_SCORE: 0` dans le runner et `VAR score = 0` dans Ink) pour que l'accumulation des points soit visible et transmise correctement au carnet de notes Moodle.
* **Fin de partie (Game Over)** : Si le score descend sous un seuil, ou si une décision critique et fatale est prise. Le paquet SCORM doit impérativement envoyer le statut `"failed"` à Moodle.
* **Victoire** : Résolution réussie du problème avec un score supérieur à la note de passage définie. Le paquet SCORM doit impérativement envoyer le statut `"passed"` à Moodle.

> [!IMPORTANT]
> Pour un système cumulatif (gain de points), **le score de départ doit impérativement être configuré à `0`**. Commencer à `100` tout en appliquant des bonus positifs (`score: +20`) bloque la note au maximum dès le premier choix correct et rend le suivi Moodle incohérent.

* **Validation mathématique du barème cumulatif** :
  * L'agent doit obligatoirement sommer la valeur de tous les gains de score (`score: +N`) présents sur le chemin optimal (sans faute) menant à la victoire.
  * L'agent doit s'assurer que le score cumulé de ce parcours parfait (score initial + somme des gains) atteint **exactement `100`**.
  * Si la somme totale diffère de 100 (par exemple, 4 étapes à +20 points = 80 points au total), l'agent doit ajuster ou proposer d'ajuster les valeurs (par exemple, passer à +25 points par étape, ou ajouter un bonus à la victoire) pour garantir que le sans-faute permette à l'élève d'obtenir `100%` dans le carnet de notes de Moodle.

* **Synchronisation obligatoire entre le Scénario (Ink) et l'Arborescence (scenario_data.js)** :
  * Le visualiseur graphique (intégré dans `simulateur.html`) s'appuie exclusivement sur les structures de graphes de `scenario_data.js` pour dessiner les cartes et afficher les détails, tandis que le runner de jeu de test (lui aussi dans `simulateur.html`) s'appuie sur `story.ink`/`story-data.js`.
  * **Actualisation automatique** : À chaque modification de structure, de texte, ou de pointage (tags de score) dans `story.ink`, l'agent doit **systématiquement et simultanément** mettre à jour le fichier `scenario_data.js` (les propriétés `scorm`, `text` ou la liste des `nodes` et `edges`) afin que l'onglet arborescence de `simulateur.html` reflète en temps réel les changements du scénario actif et du barème.

* **Intégration et synchronisation de la Gamification (Vies / Droits à l'erreur)** :
  * Si le scénario utilise des vies/énergie (`VAR vie = 3` dans Ink), le runner HTML doit intégrer un affichage dynamique dans le HUD (ex: `❤️❤️❤️` via une div `#lives-display` sans aucun cœur en dur statique en double dans le HTML pour éviter de fausser le décompte initial).
  * **Lecture réactive des variables de jeu** : L'agent doit s'assurer que le script du runner HTML lit et synchronise la variable de vie Ink (`story.variablesState["vie"]`) à chaque étape (dans la boucle de rendu de l'histoire, ex: `gameState.lives = story.variablesState["vie"]`) pour mettre à jour l'affichage des vies en temps réel (cœurs rouges devenant noirs `🖤` en cas d'erreur) et ainsi refléter fidèlement l'état du jeu.

---

## Exemples de Scénarios par Univers PFEQ
* **Univers Matériel** : Résoudre un problème de surchauffe dans une centrale thermique en ajustant la pression et le volume des gaz (Loi des gaz).
* **Univers Vivant** : Diagnostiquer le dysfonctionnement d'un écosystème lacustre envahi par des algues bleues (eutrophisation, cycles biogéochimiques).
* **Terre et Espace** : Planifier l'implantation de turbines éoliennes ou de panneaux solaires en fonction des vents dominants et des courants de convection atmosphériques d'une région donnée.
* **Univers Technologique** : Diagnostiquer pourquoi un système de transmission de mouvement (ex.: engrenages d'une grue) casse à répétition en analysant les contraintes mécaniques et les forces en jeu.
