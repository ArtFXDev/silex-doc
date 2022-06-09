---
id: houdini
title: Houdini
---

[Repository](https://github.com/ArtFXDev/silex_maya)

---

## Intro

### Startup

Every features and tools are added at startup.

The Houdini _123.py_ and _456.py_ scripts are in the **startup\script\\** folder. _123.py_ imports and calls multiple scripts localized in the same root. _456.py_ currently imports _123.py_.

- startup
  - scripts
    - 123.py
    - 456.py
    - create_shelf.py
    - custom_save.py

If you need to add a new script at startup, add it to the **startup\script\\** folder and **import** it in _123.py_ or _456.py_. Silex uses [REZ](../../Workflow/Rez/Rez.mdx) environnement manager, and execute the scripts in the **startup** folder instead of the one localized in the Houdini installation folder.

### Startup scripts

1. Creates and populate the **Silex** shelf.
2. Add shortcuts for saving. (Calls silex actions instead of Maya save).
