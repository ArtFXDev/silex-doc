---
id: plugins
title: Plugins
---

___

## Intro :

Silex uses different plugins. One for each DCC add to the pipeline.

While the core of **Silex** is coded in the [silex_client](../Client/client.md) git repostory, each DCC has its own repository.


Maya --> *silex_maya*

Houdini --> *silex_houdini*


When you open a DCC from silex, the DCC's repositroy is used. It add special features in a **Silex** shelf, and combines all features from silex_client in addition to the features specific to the DCC.

___
## In the belly of the repository :

A repository basically contains commands and actions to be triggered in the DCC.


### Structure of the repository :



- silex_maya
    - commands
    - config
    - utils
- startup


<u><b>Contents :</b></u> 


*silex_maya/commands* : Contains the commands related to the DCC. [Commands](\..\Core\command-definition.md) can use the DCC api, so some [Commands](\..\Core\command-definition.md) can have identical name in other other plugins, but the code is different.

*silex_maya/config* : This one contains **actions** (see : [action definition](\..\Core\action-definition.md)). Some actions, like the *publish*, requires multiple yaml for multiple purposes.

*silex_maya/utils* : Contains constants, fonctions, wrappers... used in commands.

*startup* : It contains startup scripts exectuted in the DCC at startup, including The silex shelf for the DCC and the icons for tools.






