---
id: workflow
title: Workflow
sidebar_position: 10
---

## publish / work

### What is a Work folder ? :

The Work folder is accessible from the interface as you can see [here](../interface/file-explorer.md). thise is a free space for you to save scenes in progress. It is a folder that is not backuped on the server, and only exists in your computer. This is where you save your scene and incremented versions.

### A pick in the Publish folder :

The **Publish** is probably the most important concept to grasp in a pipeline. When a scene is published, it means the scene is "finished", or in it's "final version" and ready for the next stage in the pipeline. This goes for every departement, but a published file is a little bit more than that and if we want to understand what it really is, we need more knoledge on how it works.

This is important knowledge to have, and will be usefull for other concepts and services on Silex or in other pipelines. So read carefully 👀.

You see, working in a pipeline usually means, **working with a server**. To keep it simple, i'll go straight to the point and try to avoid unnecessary details. In Silex, we use a server "connected"" to every computer in school ( there are actually 2 servers, but for the sake of this explaination, let's say there is only one ok ? :) ). Since the server is accessible by every computers in Artfx, every files stored in it can be accessed from **anywhere** 🌍 .

When you put a file in a **publish** folder, this folder is synchronised on the server and can be accessed by any computer.Got it ? So this also means that the [renderfarm](../renderfarm/renderfarm.md) knows where the file is and can render it in the case of Maya scene, Houdini scene, vrscene ...

( I encourage reading the documentation on the [renderfarm](../renderfarm/renderfarm.md) 🚜 for more details. )

FURTHERMORE ! To be able to render a scene on the [renderfarm](../renderfarm/renderfarm.md), we also need every textures or references to be accessible on the server. This is the tricky part, and the [publish tool](./actions/publish.md) ensures that every files linked, in any way, to the published file is also copied on the server. That's a second important aspect of the **Publish**.

:::note
<u>So, to summerize :</u>

- A published file (a file exported to the publish folder by Silex's [publish tool](./actions/publish.md)) is accessible **anywhere** as well as it's references, textures, etc... .

- A published file is only the finale version of your work.

(there will be a full, step by step, example later.)
:::

## context + tasks

Another important concept in Silex, is the concept of **task** and **context**.

![](/img/user_guide/workflow/workflow_tasks.png)

Here in this picture, we just clicked on the shot 330 (ass you can see in the red). Inside you can see all the different **tasks** assigned to this shot. (**Tasks** are the equivalent of departements in a vfx/3D studio 🦉)

For exemple : Layout, lookdev...

You can add a new custom task to the list by clicking on the "+" button near the shot name. Then fill in the pop up window :

![](/img/user_guide/workflow/workflow_custom_task.png)

:::caution
The list of tasks is defined by the supervisors before the project begins.
:::

Now, let's say you are a layut artist. afetr selecting your Shot or Asset in the explorer, you can selecte the task **Layout**, and [open a new scene](../interface/file-explorer.md) from the launch window. the new scene is now open in a **Context** specific to this task. this means that the [tools in the Silex shelf](./actions/actions.md) will take into acount that your are in a layout scene in for the shot you selected. In other terms, Silex KNOWS where youo are, and will use i for publishing files.

As mentioned before, the [publish tool](./actions/publish.md) exports the scene or the selection into a publish folder. Since you work in a **Layout** scene, if you use the [publish tool](./actions/publish.md), the exported files will be accessible in the publish folder. You will be able to access it ONLY in this particular task, in this particular shot.

( To see published files, se the related section in [Browsing through files](../interface/file-explorer.md) )

## workflow exemple step by step :

Before geting into it, you need to read the documentation on the [interface](../interface/interface.md) and the [file explorer](../interface/file-explorer.md)

**Let's create a scenario :**

You are making on a car asset in Maya and you work with lookDev artist and a render/lighting specialist.

First you need to create the task and asset. Go to asset in the [file explorer](../interface/file-explorer.md), and add a task **Props** category if it does'nt exists.

1 :

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_click_asset.png)

2 :

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_new_asset.png)

3 :

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_select_asset_type.png)

Give it a name et click **create**. The access the new asset and create a new **prop**. Call it Car

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_new_props.png)

Click on the new **Prop**.

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_click_car.png)

Click on Modeling (or create the task if it doesn't exist by clicking on the plus buto)

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_click_modeling.png)

Open a new scene

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_open_scene.png)

Then work on your modeling and save using the [save](./actions/save.md) action in the silex shelf, and the [save increment](./actions/save.md).

Every time you save, your scene will be saved in the **Work** folder.

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_work.png)

Now, you need to tranfer this work to the lookDev artist. That's where the [Publish action](./actions/publish.md) enters in the ring 🥊🥊.

in the Silex shelf, click on publish. eand fallow the instruction in the documentation here : [Publish](./actions/publish.md)

When it's done, you can switch to the publish section in Silex.

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_publish.png)

You can see all the publish files here, the artists in your project can see them too 🤩. awsome right ?
The files is in the **Publish** folder, so it is synchronized on the server and other students have access to it.

Now, the lokkDev artist can pull the published scene in his own work folder, on his own computer. he just needs to click on the pull button of the published file :

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_pull.png)

and now, he can open it from the work folder to work on it.

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_open_pulled_scene.png)

⚠️ IF YOU WORK WITH REFERENCES (wich is probably the case in this example) YOU CAN REFERENCE THE PUBLISHED FILE WITHOUT PULLING IT TO THE WORK FOLDER. THIS WAY, IF A NEW VERSION IS PPUBLISHED, IT WILL OVERRIDE THE REFERENCE AND THE LOKKDEV ARTIST ONLY NEED TO RELOAD THE REFERENCE IN HIS SCENE.⚠️

:::tip

- If the files don't show on the interface, before calling a TD try to use CTRL + R to reload the display. you can also click on the reload button here

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_reload.png)

- If you whant to open the work folder in the windows explorer, you can access it by truning the "More details..." button ON, and clicking here :

![](/img/user_guide/workflow/tutorial/workflow_tutrorial_open_work.png)

:::

If you need to change your model and give a new version, you can publish the new scene and it will override the one in the publish
