---
id: bundle
title: Bundle
---


# Bundle

The **Bundle** action is implemented for *Maya* and *Houdini*. It is based on a concept similar to the **Conform** action, so i recommand reading [conform action](.\conform.md) too.


<u>**Can be found in**</u> : the **config\bundle\\** folder of every repository.


## Use :

The **Bundle** action is similar to the *archive* function in maya, but instead of exporting the scene and it's references, it also **recursivly** finds all references in the referenced files. it copies every references in a single folder with the scene, and repath everything with an environnement varaible : **BUNDLE_ROOT**.

You just need to set a variable and you can use the bundle folder to render in external render farm or at home.


## Steps :

<u>Step 1</u> :
The bundle find all the references in the scene

<u>Step 2</u> :
References are copied, one by one, into the export folder (By default, this folder will be created aside the scene) if a referenced file has references of its own, they will go through the same process.

if a reference is not part of the pipeline file structure, or doesn't follow the same naming convention, the copied file will be renamed with a **Hashed** version.

<u>Step 3</u> :
References are repath in the original scene with an environnement variable, **BUNDLE_ROOT**.
 
<u>Step 4</u> :
The scene is copied in the export folder.

## WARNING

Currently, there is no way to select a folder from the ui, so the the actions doesn't need to be specified an export directory and will create its own folder in the same directory as the selected scene. if the scene is in a publish folder (meaninbg a folder synchronised on the server) the newly created folder will be synchronised and take memory.
it is adviced to copy the scene in a local drive before bundling it, so the new "BUNDLE folder" will be placed in the local drive as well.

___

<u>**User documentation**</u> : [Bundle user documentation](../../../user/action.md)