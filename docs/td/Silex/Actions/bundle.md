---
id: bundle
title: Bundle
---


# Bundle

The **Bundle** action is implemented for *Maya* and *Houdini*. It is based on a concept similar to the **Conform** action, so i recommand reading [conform action](.\conform.md) too.


<u><b>Can be found in</b></u> : the **config\bundle\\** folder of a DCC repository.


## Use :

The **Bundle** action is similar to the *archive* function in maya, but instead of exporting the scene and it's references, it also **recursivly** finds all references in the referenced files. Tt then copies every references in a single folder with the scene, and repath everything with an environnement varaible : **BUNDLE_ROOT** to the this folder.

You just need to set the variable in your Windows and you can use the bundle folder to render from external render farm or at home.


## Steps :

<u>Step 1</u> :
The bundle finds all references in the selected scene

<u>Step 2</u> :
References are copied, one by one, into the export folder (By default, this folder will be created aside the scene), if a referenced file has references of its own, they will go through the same process.

If a reference is not part of the pipeline file structure, or doesn't follow the same naming convention, the copied file will be renamed with a **Hashed** version.

<u>Step 3</u> :
References are repathed in the original scene with an environnement variable, **BUNDLE_ROOT** to the new location.
 
<u>Step 4</u> :
The scene is copied in the export folder.

## WARNING

Currently, there is no way to select a folder from the ui, so the the actions doesn't need to be specified an export directory, and will create its own folder in the same directory as the selected scene. if the scene is in a **publish** folder (Meaninbg, a folder that is being synchronised on the server), the newly created folder will be synchronised and fill memory.
It is advized to copy the scene in a local drive before bundling it, so the new "BUNDLE folder" will be placed in the local drive as well.

___

<u><b>User documentation</b></u> : [Bundle user documentation](../../../user/action.md)