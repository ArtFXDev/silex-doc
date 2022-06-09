---
id: maya
title: Maya
---

[Repository](https://github.com/ArtFXDev/silex_houdini)

## Intro

### Startup

Every features are added at startup.

The Maya _userSetup.py_ script is in the **startup** folder. It import and calls multiple scripts localized in the same root.

- startup
  - create_shelf.py
  - custom_save.py
  - load_plugins.py
  - userSetup.py

If you need to add a new script at startup, add it to the **startup** folder and **import** it in _userSetup.py_. Silex uses [REZ](../../Workflow/Rez/Rez.mdx) environnement manager, and execute the scripts in the **startup** folder instead of the one localized in the Maya installation folder.

### Startup scripts

1. _create_shelf.py_ : Creates and populate the **Silex** shelf.
2. _custom_save.py_ : Add shortcuts for saving. (Calls silex actions instead of Maya save)
3. _load_plugins.py_ : Load necessary plungins.
