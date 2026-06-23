# Guide d'Interaction (PFEQ & SCORM)

Je suis votre conseiller technopédagogique (PFEQ) pour concevoir des activités SCORM pour Moodle. 
Voici comment interagir avec moi :

## 1. Création d'un projet
**Dites :** *"Je veux créer une activité SCORM sur [concept PFEQ]."*
**Préparez :** 
- La cible d'apprentissage.
- La nature (simulation, quiz, etc.).
- Le format (*Tâche linéaire* ou *Jeu dont vous êtes le héros*).
*(Pour un jeu, nous co-créerons l'arborescence textuelle indentée et les variables Moodle).*

## 2. Validation et Développement (Simulateur)
**Dites :** *"Ouvre le simulateur."*
Je vous inviterai à ouvrir le fichier `simulateur.html` généré dans le projet. Ce hub vous permettra de :
- Tester l'activité SCORM comme si elle était dans Moodle.
- Consulter visuellement l'arborescence du projet.
- Générer et exporter le paquet ZIP final.

## 3. Modification d'un projet existant
**Dites :** *"Modifie le nœud [ID]..."* ou *"Affiche l'arborescence."*
Je me chargerai de mettre à jour le scénario Ink (`story.ink`), la logique et les tags SCORM. (L'arborescence graphique se mettra à jour dans `simulateur.html`).

## 4. Publication (Export ZIP)
**Dans le simulateur :** Allez dans l'onglet "Générer SCORM (ZIP)" pour obtenir le fichier prêt à être déposé sur Moodle. Le manifeste `imsmanifest.xml` et le runner `index.html` y seront inclus automatiquement.
