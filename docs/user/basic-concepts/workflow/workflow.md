---
id: workflow
title: Workflow
sidebar_position: 30
---

## publish / work

### What is a Work folder ? :

The Work folder is accessible from the interface as you can see [here](../../interface/file-explorer.md)
This is a free space for you to save scenes in progress. It's a folder that is not backuped on the server, and only exists in your computer. This is where you save your scene and incremented versions.

### A pick in the Publish folder :

The **Publish** is probably the most important concept to grasp in a pipeline. When a scene is published, it means the scene is "finished", or in it's "final version" and ready for the next stage in the pipeline. This goes for every departement, but a published file is a little bit more than that and if we want to understand what it really is, we need more knowledge on how it works.

This is important knowledge to have, and will be useful for other concepts and services on Silex or in other pipelines. So read carefully 👀.

You see, working in a pipeline usually means, **working with a server**. To keep it simple, I'll go straight to the point and try to avoid unnecessary details. In Silex, we use a server "connected"" to every computer in school ( there are actually 2 servers + one data center, but for the sake of this explaination, let's say there is only one ok ? :) ). Since the server is accessible by every computers in Artfx (drive letters I and O.), every files stored in it can be accessed from **anywhere** 🌍

When you put a file in a **publish** folder, this folder is synchronised on the server and can be accessed by any computer. Got it ? So this also means that the [renderfarm](../../renderfarm/renderfarm.md) knows where the file is and can render it in the case of Maya scene, Houdini scene, vrscene ...

( I encourage reading the documentation on the [renderfarm](../../renderfarm/renderfarm.md) for more details. )

FURTHERMORE ! To be able to render a scene on the [renderfarm](../../renderfarm/renderfarm.md), we also need every textures or references to be accessible on the server. This is the tricky part, and the [publish tool](../actions/publish.md) ensures that every files linked, in any way, to the published file is also copied on the server. That's a second important aspect of the **Publish**.

:::note
<u>So, to summerize :</u>

- A published file (a file exported to the publish folder by Silex's [publish tool](../actions/publish.md)) is accessible **anywhere** as well as it's references, textures, etc... .

- A published file is only the finale version of your work.

(there will be a full, step by step, example later.)
:::

## Context and Tasks

Another important concept in Silex is the concept of **task** and **context**.

![](/img/user_guide/workflow/workflow_tasks.png)

Here in this picture, we just clicked on the shot 030 (as you can see in the red). Inside you can see all the different **tasks** assigned to this shot. (**Tasks** are the equivalent of departements in a vfx/3D studio 🦉)

For exemple : Layout, lookdev...

You can add a new custom task to the list by clicking on the "+" button near the shot name. Then fill in the pop up window :

![](/img/user_guide/workflow/workflow_custom_task.png)

:::caution
The list of tasks is defined by the supervisors before the project begins. If you add a task through silex, it will not appear in shotgrid. Ask to the TD Gang if you can add a task beofre.
:::

Now, let's say you are a layout artist. After selecting your Shot or Asset in the explorer, you can select the task **Layout**, and [open a new scene](../../interface/file-explorer.md) from the launch window. the new scene is now open in a **Context** specific to this task. this means that the [tools in the Silex shelf](../actions/actions.md) will take into acount that your are in a layout scene in for the shot you selected. In other terms, Silex KNOWS where you are, and will use it for publishing files.

As mentioned before, the [publish tool](../actions/publish.md) exports the scene or the selection into a publish folder. Since you work in a **Layout** scene, if you use the [publish tool](../actions/publish.md), the exported files will be accessible in the publish folder. You will be able to access it ONLY in this particular task, in this particular shot.

(To see published files, se the related section in [Browsing through files](../../interface/interface.md))

## workflow exemple step by step :

Before getting into it, you need to read the documentation on the [interface](../../interface/interface.md) and the [file explorer](../../interface/file-explorer.md)
