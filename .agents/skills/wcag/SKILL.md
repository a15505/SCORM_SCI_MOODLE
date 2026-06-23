---
name: wcag
description: Skill de conformité d'accessibilité numérique (WCAG 2.1 AA/AAA) pour la conception d'interfaces utilisateur (contraste, sémantique, navigation au clavier).
---

# Guide de Conformité WCAG (Web Content Accessibility Guidelines)

Ce skill régit la création d'interfaces utilisateur accessibles et conformes aux critères de réussite WCAG 2.1 aux niveaux AA et AAA. Il doit être activé lors de l'édition de feuilles de style, de scripts d'interface et de fichiers HTML.

## 1. Contraste de Texte (Critère de réussite 1.4.3 - Niveau AA)

Le texte et les images de texte doivent présenter un contraste suffisant avec leur arrière-plan pour être lisibles par les personnes ayant une déficience visuelle.

### Règles d'Or des Ratios de Contraste :
*   **Texte standard (inférieur à 18pt / 24px, ou inférieur à 14pt / 18.66px en gras) :**
    *   **Niveau AA (Requis) :** Ratio de contraste minimal de **4,5:1**.
    *   **Niveau AAA (Cible) :** Ratio de contraste minimal de **7:1**.
*   **Grand texte (au moins 18pt / 24px, ou au moins 14pt / 18.66px en gras) :**
    *   **Niveau AA (Requis) :** Ratio de contraste minimal de **3:1**.
    *   **Niveau AAA (Cible) :** Ratio de contraste minimal de **4,5:1**.

### Palettes de Couleurs Accessibles Recommandées (Thème Sombre & Thème Clair) :

*   **Sur fond sombre (`#0f172a` ou `#1e293b`) :**
    *   Texte blanc/clair : `#ffffff` (21:1) ou `#f8fafc` (19:1).
    *   Texte d'accentuation (Bleu) : Préférer `#93c5fd` (11:1) ou `#60a5fa` (8,5:1) au lieu de `#2563eb` (3,1:1).
    *   Texte d'accentuation (Vert / Succès) : Préférer `#a7f3d0` ou `#34d399` au lieu de `#10b981`.
    *   Texte d'accentuation (Rouge / Danger) : Préférer `#fca5a5` ou `#f87171` au lieu de `#ef4444`.
    *   Texte secondaire / muet : Utiliser au minimum `#cbd5e1` (13:1) ou `#94a3b8` (5,4:1). Éviter `#64748b` (3,5:1).

*   **Sur fond de carte vert de succès (`rgba(16, 185, 129, 0.15)` combiné avec du sombre) :**
    *   Le texte de succès doit être d'un vert très clair (ex. `#a7f3d0` ou `#34d399`) pour garder un contraste > 4,5:1 sur ce fond sombre.

---

## 2. Contraste des Éléments Non-Textuels (Critère de réussite 1.4.11 - Niveau AA)

Les éléments d'interface actifs (boutons, bordures de champs de saisie) et les composants graphiques significatifs (icônes) doivent présenter un ratio de contraste d'au moins **3:1** avec les couleurs adjacentes.

*   **Bordures de boutons inactifs :** Doivent rester distinctes du fond.
*   **Indicateurs d'état (sélectionné, activé) :** La différence visuelle doit respecter le ratio 3:1.

---

## 3. Utilisation de la Couleur (Critère de réussite 1.4.1 - Niveau A)

La couleur ne doit pas être le seul moyen visuel utilisé pour transmettre de l'information, indiquer une action, solliciter une réponse ou distinguer un élément visuel.

### Applications concrètes :
*   **Questionnaires & Choix :** Lorsqu'un élève valide une réponse, n'utilisez pas seulement le vert/rouge pour marquer le bouton. Ajoutez une icône explicite de coche (`fa-circle-check`) ou de croix (`fa-circle-xmark`) et un texte explicite (ex. : "Réponse correcte", "Réponse incorrecte").
*   **Liens hypertexte :** Soulignez-les ou ajoutez des icônes s'ils sont insérés au milieu d'un texte ordinaire, pour qu'ils ne se distinguent pas uniquement par leur couleur.

---

## 4. Visibilité du Focus (Critère de réussite 2.4.7 - Niveau AA)

Tout élément d'interface utilisateur qui peut recevoir le focus de manière clavier doit disposer d'un indicateur de focus hautement visible.

### Code CSS Recommandé :
```css
/* Indicateur de focus personnalisé et accessible */
.choice-btn:focus-visible, 
.next-btn:focus-visible,
a:focus-visible {
  outline: 3px solid #60a5fa;
  outline-offset: 2px;
  box-shadow: 0 0 0 5px rgba(96, 165, 250, 0.3);
}
```

---

## 5. Structuration Sémantique (Critère de réussite 1.3.1 - Niveau A)

*   Utilisez des éléments HTML sémantiques appropriés : `<button>` pour les actions interactives, `<a>` pour la navigation, `<h1>` à `<h6>` pour la hiérarchie des titres.
*   Ne transformez pas des `<div>` ou `<span>` en boutons cliquables sans leur ajouter les attributs `role="button"` et `tabindex="0"`, ainsi qu'un écouteur d'événement clavier pour la touche Entrée/Espace. Préférer toujours la balise native `<button>`.
