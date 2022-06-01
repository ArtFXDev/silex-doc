---
id: houdini
title: Houdini
---

# Houdini 

<u><b>Repository</b></u> : *silex_houdini*

## Startup :

Every features are added at startup. 

The Houdini *123.py* and *456.py* scripts are in the **startup\script\\** folder. *123.py* import and calls multiple scripts localized in the same root. *456.py* currently improts *123.py*.

- startup
    - scripts
        - 123.py 
        - 456.py 
        - create_shelf.py 
        - custom_save.py

If you need to add new scripts when Maya launches, add another script to the **startup\script\\** folder and **import** it in *123.py* or *456.py*.


# Startup scripts :

1. Creates and populate the **Silex** shelf.
2. Add shortcuts for saving. (Calls silex actions instead of Maya save.



