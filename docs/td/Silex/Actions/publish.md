---
id: publish
title: Publish
---

___

## Intro:

The publish is one of the most improtant action in Silex. 

Every scene sent to the renderfarm must be in a publish folder (wich is synchronised with the server :  see [Silex itrodution](../Silex.md)) as well as its references. This way, the *blades* (computers in the renderfarm) can access all the files needed for rendering.

The **Publish** action is the way to save your scenes and references in the **publish folder**. it exports multiple formats, checks that all references are in a publish folder and rename the exported file accordingly with the naming convention.

The purpose of the **publish** is to ensure that every job submited to the *farm* is renderable, and all references and textures can be reached by any *blade* in the *farm*. For doing so, the action calls for the **Conform** action. If the references found in the scene are not conform to the pipeline, and cannot be access from the server, the **Publish** action will propose you to conform the these references.

(see for more info on submiting jobs : [Renderfarm](../../Renderfarm/renderfarm.md))

(see for more info on submiting jobs : [Conform](./conform.md))
___

### Supported format

The publish allows you to export in a wide range of formats. you can find the list in the code in the folder:

- command
    - config
        - publish 

(see for more info on repository architacture : [Plugins](../Plugins/Plugins.md))

