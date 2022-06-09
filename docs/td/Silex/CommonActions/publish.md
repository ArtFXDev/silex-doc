---
id: publish
title: Publish
---

---

## Intro:

The publish is one of the most improtant action in Silex.

Every scene sent to the renderfarm must be in a publish folder (wich is synchronised with the server : see [Silex itrodution](../Silex.md)) as well as its references. This way, the _blades_ (computers in the renderfarm) can access all the files needed for rendering.

## Purpose :

The **Publish** action is the way to save your scenes and references in the **publish folder**. it exports multiple formats, checks that all references are in a publish folder and rename the exported file accordingly with the naming convention.

The purpose of the **publish** is to ensure that every job submited to the [Renderfarm](../../Renderfarm/renderfarm.md) is renderable, and all references and textures can be reached by any _blade_ on the network. For doing so, the action calls for the [Conform](./conform.md) action. If the references found in the scene need to be [Conform](./conform.md) to the pipeline, and cannot be access from the server, the **Publish** action will propose you to conform these references.

---

## Architecture :

The publish allows you to export in a wide range of formats. you can find the list in the code in the folder:

- command
  - config
    - publish

(see for more info on repository architacture : [Plugins](../Plugins/Plugins.md))

### Step by step use of the publish :

1- Select a publish type.
2- Select or tipe a filename
3- Process parameters specific to the command calld for the chosen publish type.
4- The comand export the scene or the eselection in a temporary folder.
5- A **move** command from silex_client is called to move the exported file to the right location.

---

## Write your own publish :
