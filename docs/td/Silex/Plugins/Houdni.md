---
id: silex-plugins
title: Houdini
---

# Maya 

<u>**Repository**</u> : *silex_maya*

## Startup :

Every features are added at startup. 

The Maya *userSetup.py* script, is in the **startup** folder. it import and calls multiple scripts localized in the same root.

- startup
    - create_shelf.py 
    - custom_save.py
    - load_plugins.py
    - userSetup.py

If you need to add new scripts when Maya launches, add another script to the **startup** folder, and **import** it in the *userSetup.py* 


# Startup scripts :

1. Creates and populate the **Silex** shelf.
2. Add shortcuts for saving. (Calls silex actions instead of Maya save)
3. Load necessary plungins



