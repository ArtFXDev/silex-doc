---
id: maya
title: Maya
---

[Repository](https://github.com/ArtFXDev/silex_houdini)

---

### Démarrage

Toutes les features sont ajoutées au démarrage.

Le script Maya _userSetup.py_ se trouve dans le dossier **startup**. Il importe et appelle plusieurs scripts localisés dans la même root.

- startup
  - create_shelf.py
  - custom_save.py
  - load_plugins.py
  - userSetup.py

Si vous devez ajouter un nouveau script au démarrage, ajoutez-le au dossier **startup** et **importez**-le dans _userSetup.py_. Silex utilise le gestionnaire d'environnement [REZ](../../Workflow/Rez/Rez.mdx), et exécute les scripts dans le dossier **startup** au lieu de celui localisé dans le dossier d'installation Maya.

### Scripts de démarrage

1. _create_shelf.py_ : Crée et remplit le shelf **Silex**.
2. _custom_save.py_ : Ajout de raccourcis pour l'enregistrement. (Appelle des actions silex au lieu de Maya save)
3. _load_plugins.py_ : Charge les plugins nécessaires.
