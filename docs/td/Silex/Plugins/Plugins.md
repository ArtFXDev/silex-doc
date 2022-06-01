---
id: plugins
title: Plugins
---

___

## Intro :

Silex uses different plugins. One for each DCC add to the pipeline.

While the core of **Silex** is coded in the *silex_client* git repostory, each DCC has its own repository.


Maya --> *silex_maya*

Houdini --> *silex_houdini*


When you open a DCC from silex, the DCC's repositroy is used. It add special features in a **Silex** shelf, and combines all features from silex in addition to the features specific to the DCC.

___
## In the belly of the repository :

A repository basically countains commands and actions to be triggered in the DCC.

___
## Structure of the repository :



- silex_maya
    - cli
    - commands
    - config
    - utils
- startup


<u><b>Contents :</b></u> 

*commands* : Contains the commands related to the DCC. Commands can call the DCC api (see : [command-definition](\..\Core\command-definition.md)), so some commands might have identical name in other other repositories, but the code is different.

*config* : This one contains **actions** (see : [action-definition](\..\Core\action-definition.md)). Some actions, like the *publish*, requires multiple yaml for multiple purposes.

*startup* : (see : [action-definition](.\Maya.md))



