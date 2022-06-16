---
id: workflow
title: Workflow
sidebar_position: 20
---


## publish / work

### What is a Work folder ? :

The Work folder is accessible from the interface as you can see [here](../interface/file-explorer.md). thise is a free space for you to save scenes in progress. It is a folder that is not backuped on the server, and only exists in your computer. this is where you save your scene and increment your new versions.

### What is a Publish folder ?  :

The __Publish__ is probably the most important concept to grasp in a pipeline. When a scene is published, it means the scene is "finished", or in it's "final version" and ready for the next stage in the pipeline. But a published file is a little bit more that that, and if we want to understand what it really is, we need more knoledge on how it works. This is important knowledge to have, and will be usefull for other concepts and services on Silex. Sor read carefully.

You see, working in a pipeline usually means, __working with a server__. To keep it simple, i'll go straight to the point and try to avoid unnecessary details. In Silex, we use a server __shared__ by every computer in school ( there are actually 2 servers, but for the sake of this explaination, let's say there is only one ok ? :) ). Since the server is accessible by every computers in Artfx, it means every files stored in it can be accessed from __anywhere__.

When you put a file in a __publish__ folder, this folder is synchronised on the server and can be accessed by any computer.Got it ? So this also means that the [renderfarm](../renderfarm/renderfarm.md) knows where the file is and can render it. (I encourage reading the documentation on the [renderfarm](../renderfarm/renderfarm.md) for more details.)

FURTHERMORE ! To be able to render a scene on the [renderfarm](../renderfarm/renderfarm.md), we also need every textures or references to be accessible on the server. This is the tricky part, and the [publish tool](./actions/publish.md) ensures that every files linked, in any way, to the published file, is also copied on the server.

So, to summerize :

A published (a file exported to the publish folder by Silex's [publish tool](./actions/publish.md)) is accessible __anywhere__ as well as it's references, textures, etc... the. 
And a published file is only the finale version of your work. (there will be a full, step by step, example later.)





## context + tasks


## workflow exemple step by step