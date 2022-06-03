---
id: maya
title: Maya
---

___

## Intro :

<u><b>Repository</b></u> : *silex_maya*

### Startup :

Every features are added at startup. 

The Maya *userSetup.py* script is in the **startup** folder. It import and calls multiple scripts localized in the same root.

- startup
    - create_shelf.py 
    - custom_save.py
    - load_plugins.py
    - userSetup.py

If you need to add a new script at startup, add it to the **startup** folder and **import** it in *userSetup.py*. Silex uses [REZ](../Rez/Rez.md) environnement manager, and execute the scripts in the **startup** folder instead of the one localized in the Maya installation folder.


### Startup scripts :

1. *create_shelf.py* : Creates and populate the **Silex** shelf.
2. *custom_save.py* : Add shortcuts for saving. (Calls silex actions instead of Maya save)
3. *load_plugins.py* : Load necessary plungins.



