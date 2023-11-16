---
id: houdini
title: Houdini
---

[Repository](https://github.com/ArtFXDev/silex_maya)

---

### Démarrage

Toutes les features et tools sont ajoutés au démarrage.

Les scripts Houdini _123.py_ et _456.py_ sont dans le dossier **startup\script\\**. _123.py_ importe et appelle plusieurs scripts localisés dans la même root. _456.py_ importe actuellement _123.py_.

- startup
  - scripts
    - 123.py
    - 456.py
    - create_shelf.py
    - custom_save.py

Si vous devez ajouter un nouveau au démarrage, ajoutez-le au dossier **startup\script\\** et **importez**-le en _123.py_ ou _456.py_. Silex utilise le gestionnaire d'environnement [REZ](../../Workflow/Rez/Rez.mdx), et exécute les scripts dans le dossier **startup** au lieu de celui localisé dans le dossier d'installation Houdini.

### Scripts de démarrage

1. Crée et remplit le shelf **Silex**.
2. Ajoute des raccourcis pour enregistrer. (Appelle des actions silex au lieu de Maya save).
