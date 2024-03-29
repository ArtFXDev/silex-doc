---
id: bundle
title: Bundle
---

---

## Intro :

The **Bundle** action is implemented for _Maya_ and _Houdini_. It is based on a concept similar to the **Conform** action, so I recommand reading [conform action](./conform.md) too.

**The Bundle can be found in** the **config\bundle\\** folder of a DCC repository.

![](/img/bundle_location.png)

---

## Use :

The **Bundle** action is similar to the _archive_ function in Maya, but instead of exporting the scene and its references, it also **recursively** finds all references in the referenced files, then copies every references in a single folder with the scene, and repath everything with an environnement variable : **BUNDLE_ROOT** to this folder.

You just need to set the variable in your Windows and you can use the bundle folder to render from external render farm or at home.

---

## Steps :

### step 1

The bundle finds all references in the selected scene.

### step 2

References are copied, one by one, into the export folder (By default, this folder will be created aside the scene), if a referenced file has references of its own, they will go through the same process.

If a reference is not part of the pipeline file structure, or doesn't follow the same naming convention, the copied file will be renamed with a **Hashed** version.

### step 3

References are repathed in the original scene with an environnement variable, **BUNDLE_ROOT** to the new location.

### step 4

The scene is copied in the export folder.

:::caution

Currently, there is no way to select a folder from the UI, so the the actions doesn't need to be specified an export directory, and will create its own folder in the same directory as the selected scene. if the scene is in a **publish** folder (Meaning, a folder that is being synchronised on the server), the newly created folder will be synchronised and fill memory.

It is advised to copy the scene in a local drive before bundling it, so the new "BUNDLE folder" will be placed in the local drive as well.
:::

---

<u><b>User documentation</b></u> :

[Bundle user documentation](@site/docs/user/basic-concepts/actions/actions.md)
