---
id: renderfarm
title: Renderfarm
sidebar_position: 60
---

# Render farm

The render farm is a key piece of the pipeline. It allows artists to render their images using various render engines like V-Ray, Redshift or Arnold.

After an artist has [conformed](../Silex/commonactions/conform)/[published](../Silex/commonactions/publish) all the necessary files linked to a scene and the scene itself, he can **submit** a job to the render farm.

## Concepts

### Job

A **Job** is the top level workload on a render farm, it is described with a _name_, a _priority_ and most of the time the specification of computers to run on.

### Task

Usually a **job** is composed of **tasks** which are smaller units of work to be done. For example one computer might render the frames from `1-10` and another one from `11-20`.

### Command

A **task** then has **commands** which are sent to the computer through a [Shell](<https://en.wikipedia.org/wiki/Shell_(computing)>) (for example `bash` in case of Linux or `cmd.exe` for Windows) or directly interpreted by the computer.

For example:

```shell
rez env vray test_pipe -- vray
  -skipExistingFrames=1
  -display=0
  -progressUseColor=0
  -progressUseCR=0
  -progressIncrement=5
  -verboseLevel=3
  -rtEngine=0
  -sceneFile=scene.vrscene
  -imgFile=out_frame.exr
  -frames=1;2;3;4;5;6;7;8;9;10
```

:::tip
The above command uses [Rez](https://github.com/nerdvegas/rez/) which is used to resolve **environments** dynamically by defining **packages** and environment variables. It's very useful in a render farm setup since we have various software packages and different **versions**.
:::

### Blade

A **blade** is a computer working on the render farm. It receives a **task** from the master engine and executes commands.

The blade store and sends logs and status update to the engine.

### Engine

The **engine** is the program running on the main server on the network. Its job is to receive jobs orders dispatch tasks to the connected blades. It handles priority, logs and a database where it stores information about what is happenning.

## What to read next

- At ArtFX we are using [Tractor](./tractor) which is Pixar's render farm system.
- See the [Submit](../Silex/commonactions/submit) action to find how we submit jobs.
- [Harvest](./harvest) is a statistics interface and API for Tractor.
