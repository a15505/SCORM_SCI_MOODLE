---
name: concepteur_web
description: Skill pour la création d'interfaces utilisateur (UI) et maquettes web à partir d'un scénario pédagogique validé (Étape 2 du pipeline).
---

# Concepteur Web (Étape 2 du Pipeline SCORM)

Ce skill est utilisé **exclusivement après** la validation du contenu pédagogique textuel (Étape 1). Son rôle est de transformer le document texte en une maquette web fonctionnelle et esthétique, **sans** encore intégrer le code de communication SCORM Moodle (qui est réservé à l'étape 3).

## Directives Techniques Esthétiques Obligatoires

Pour garantir une autonomie totale du futur paquet SCORM (zéro dépendance web externe lors de la lecture), vous devez concevoir l'interface en respectant **strictement** ces contraintes :

1. **Framework CSS/JS** : Utilisez **Bootstrap 5**. Les fichiers devront être locaux (ex: `assets/css/bootstrap.min.css` et `assets/js/bootstrap.bundle.min.js`).
2. **Icônes** : Utilisez **FontAwesome 6**. Les fichiers devront être locaux (ex: `assets/css/all.min.css` et le dossier `assets/webfonts/`).
3. **Polices de caractères (Fonts)** : 
   - **Textes réguliers** : Police `Ubuntu`.
   - **Titres** : Police `Viga`.
   - *Règle absolue* : Ne faites **jamais** de liens vers Google Fonts (`fonts.googleapis.com`) dans le fichier HTML. L'agent devra créer un fichier CSS déclarant ces polices via `@font-face` pointant vers des fichiers locaux (ex: `assets/fonts/Ubuntu-Regular.woff2`).
4. **Zéro dépendance Web** : Tous les scripts, styles, polices, et images doivent être structurés dans un dossier (ex: `assets/`) prêt à être inclus dans l'archive ZIP à l'étape 3.

## Processus de Création

1. **Génération de la Maquette** :
   - Vous devez **obligatoirement** utiliser le gabarit `.agents/skills/assistant_scorm/resources/simulateur_template.html` pour créer ou mettre à jour `simulateur.html`. N'écrasez jamais ce fichier avec une page HTML vierge. L'interface Bootstrap du jeu doit être injectée **exclusivement à l'intérieur** de la balise `<div id="activity-content">`.
   - Générez `styles.css` (incluant les `@font-face` et vos styles Bootstrap personnalisés).
   - Générez `scenario_data.js` pour la structure. **Attention** : Pour assurer la compatibilité avec le visualiseur `vis-network` du gabarit, `scenario_data.js` doit obligatoirement exporter : un tableau `nodes` (ex: `[{id:"n1", label:"Titre", storyKey:"n1"}]`), un tableau `edges` (ex: `[{from:"n1", to:"n2"}]`), et un objet `story` contenant les textes et choix réels du jeu indexés par `storyKey`.
   - Générez `game_logic.js` (pour gérer les clics et l'affichage du contenu depuis l'objet `scenarioData.story`).
   - Assurez-vous d'utiliser l'outil `run_command` pour télécharger (via `curl` ou script PowerShell) les dépendances Bootstrap, FontAwesome et les polices si elles ne sont pas déjà présentes dans le projet.

2. **Vérification Ergonomique** : 
   - Lancez **automatiquement** le serveur web local via l'outil `run_command` (ex: `npx http-server -p 8000 -c-1`). N'attendez pas que l'utilisateur le fasse.
   - Fournissez un **hyperlien cliquable** (ex: `[http://localhost:8000/simulateur.html](http://localhost:8000/simulateur.html)`) dans votre réponse pour que l'utilisateur puisse valider l'interface directement.

3. **Validation Exigée** :
   - Ne générez **aucun** paquet SCORM ZIP à cette étape.
   - Demandez explicitement à l'utilisateur si le design, les polices et l'ergonomie lui conviennent avant de passer à l'Étape 3.
