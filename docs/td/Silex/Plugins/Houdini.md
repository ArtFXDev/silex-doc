---
id: houdini
title: Houdini
---

___

## Intro :

<u><b>Repository</b></u> : *silex_houdini*


### Startup :

Every features and tools are added at startup. 

The Houdini *123.py* and *456.py* scripts are in the **startup\script\\** folder. *123.py* imports and calls multiple scripts localized in the same root. *456.py* currently improts *123.py*.

- startup
    - scripts
        - 123.py 
        - 456.py 
        - create_shelf.py 
        - custom_save.py

If you need to add a new script at startup, add it to the **startup\script\\** folder and **import** it in *123.py* or *456.py*. Silex uses [REZ](../Rez/Rez.md) environnement manager, and execute the scripts in the **startup** folder instead of the one localized in the Houdini installation folder.


### Startup scripts :

1. Creates and populate the **Silex** shelf.
2. Add shortcuts for saving. (Calls silex actions instead of Maya save).



